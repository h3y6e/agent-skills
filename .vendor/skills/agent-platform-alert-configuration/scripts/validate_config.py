#!/usr/bin/env python3
# Copyright 2026 Google LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     https://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

"""HCL configuration and PromQL validation script for agent platform metrics.

Parses Terraform HCL alert policy resource blocks, detects duplicate targets
for agents, and lints Prometheus queries for correct syntax, time
windows, and essential label filters.
"""

import argparse
import glob
import json
import os
import re
import sys


def check_balanced_chars(
    query: str, open_char: str, close_char: str
) -> str | None:
  """Checks if parenthesis or braces are balanced.

  Args:
      query: The PromQL or SQL query string to check.
      open_char: The opening character (e.g., '(' or '{').
      close_char: The closing character (e.g., ')' or '}').

  Returns:
      An error message string if unbalanced, otherwise None.
  """
  count = 0
  for i, char in enumerate(query):
    if char == open_char:
      count += 1
    elif char == close_char:
      count -= 1
      if count < 0:
        return f"Unbalanced '{close_char}' at position {i}"
  if count != 0:
    return f"Unbalanced '{open_char}' (net count: {count})"
  return None


def parse_promql_duration(duration_str: str) -> float | None:
  """Converts PromQL duration string to hours.

  Args:
      duration_str: The PromQL duration string (e.g., '1h', '5m', '1d').

  Returns:
      The duration in hours as a float, or None if the format is invalid.
  """
  match = re.match(r"^(\d+)([smhdw])$", duration_str)
  if not match:
    return None
  val, unit = match.groups()
  val = int(val)
  if unit == "s":
    return val / 3600
  if unit == "m":
    return val / 60
  if unit == "h":
    return val
  if unit == "d":
    return val * 24
  if unit == "w":
    return val * 24 * 7
  return None


def get_max_lookback_hours(query: str) -> float:
  """Calculates the maximum lookback in hours from windows and offsets.

  Args:
      query: The PromQL query string.

  Returns:
      The maximum lookback window or offset found in the query, in hours.
  """
  max_hours = 0

  # Check windows and subqueries
  window_matches = re.finditer(r"\[([^\]]+)\]", query)
  for match in window_matches:
    window_str = match.group(1)
    range_str = window_str.split(":")[0]
    hours = parse_promql_duration(range_str)
    if hours and hours > max_hours:
      max_hours = hours

  # Check offsets
  offset_matches = re.finditer(r"\boffset\s+(\S+)", query)
  for match in offset_matches:
    offset_str = match.group(1)
    hours = parse_promql_duration(offset_str)
    if hours and hours > max_hours:
      max_hours = hours

  return max_hours


def validate_policy_duration(policy: dict) -> list[str]:
  """Validates duration based on lookback window.

  Args:
      policy: A dictionary representing the parsed alert policy, including
        'queries', 'duration', and 'signal_type'.

  Returns:
      A list of error messages, if any validation errors are found.
  """
  errors = []
  max_lookback = 0
  for query in policy["queries"]:
    lookback = get_max_lookback_hours(query)
    if lookback > max_lookback:
      max_lookback = lookback

  quality_metrics = [
      "final_response_quality_v1",
      "tool_use_quality_v1",
      "hallucination_v1",
  ]

  if policy["signal_type"] in quality_metrics:
    if policy["duration"] != "300s":
      errors.append(
          "Duration Error: Quality alerts MUST set duration='300s'."
          f" Found duration='{policy['duration']}'."
      )
  elif max_lookback > 25:
    if policy["duration"] is not None:
      errors.append(
          "Duration Error: Long-lookback alerts (>25h) must NOT set a"
          f" duration. Found duration='{policy['duration']}' for lookback of"
          f" {max_lookback}h."
      )
  elif max_lookback > 0:  # It's a short-lookback PromQL alert
    if policy["duration"] != "300s":
      errors.append(
          "Duration Error: Short-lookback alerts (<=25h) MUST set"
          f" duration='300s'. Found duration='{policy['duration']}'."
      )
  return errors


def lint_query(query: str) -> list[str]:
  """Runs a suite of sanity lint checks on a PromQL query.

  Args:
      query: The PromQL query string to lint.

  Returns:
      A list of string lint error messages. Empty if valid.
  """
  errors = []

  # 1. Balanced parentheses
  paren_err = check_balanced_chars(query, "(", ")")
  if paren_err:
    errors.append(f"Parentheses error: {paren_err}")

  # 2. Balanced curly braces
  brace_err = check_balanced_chars(query, "{", "}")
  if brace_err:
    errors.append(f"Curly braces error: {brace_err}")

  # 3. Time window validations (e.g., [5m], [1w:5m], [3d], [1h])
  window_matches = re.finditer(r"\[([^\]]+)\]", query)
  for match in window_matches:
    window_str = match.group(1)
    if not re.match(r"^\d+[smhdw](:(\d+[smhdw])?)?$", window_str):
      errors.append(
          "Invalid Prometheus time window/subquery interval:"
          f" '[{window_str}]' at position {match.start()}"
      )

  # 4. Lookback offset range validation (e.g. offset 1w, offset 1d)
  offset_matches = re.finditer(r"\boffset\s+(\S+)", query)
  for match in offset_matches:
    offset_str = match.group(1)
    if not re.match(r"^\d+[smhdw]$", offset_str):
      errors.append(
          f"Invalid lookback offset format: 'offset {offset_str}' at position"
          f" {match.start()}"
      )

  # 5. Ensure the query references a supported group in a label filter
  # or grouping aggregation.
  supported_groups = ["namespace", "gen_ai_agent_name"]
  search_regex = (
      r"\b(by|without)\s*\([^)]*\b("
      + "|".join(supported_groups)
      + r")\b[^)]*\)"
  )
  has_group = bool(re.search(search_regex, query))

  has_filter = False
  brace_matches = re.finditer(r"\{([^}]+)\}", query)
  for match in brace_matches:
    for group in supported_groups:
      if group in match.group(1):
        has_filter = True
        break
    if has_filter:
      break

  if not (has_group or has_filter):
    errors.append(
        "Query is missing agent identifier reference. It must either group"
        " by it using aggregations (e.g., 'by (gen_ai_agent_name)') or filter"
        " on it (e.g., '{gen_ai_agent_name=\"...\"}')."
    )

  return errors


def extract_alert_policies(hcl_content: str) -> list[dict]:
  """Extracts resource 'google_monitoring_alert_policy' blocks and metadata.

  Args:
      hcl_content: The string content of a Terraform HCL file.

  Returns:
      A list of dictionaries, each representing a parsed alert policy with
      keys like 'resource_name', 'queries', 'duration', etc.
  """
  policies = []
  pattern = re.compile(
      r'resource\s+"google_monitoring_alert_policy"\s+"([^"]+)"\s*\{'
  )

  for match in pattern.finditer(hcl_content):
    resource_name = match.group(1)
    start_pos = match.start()

    brace_count = 0
    end_pos = -1
    in_string = False
    escape = False

    for i in range(match.end() - 1, len(hcl_content)):
      char = hcl_content[i]
      if escape:
        escape = False
        continue
      if char == "\\":
        escape = True
        continue
      if char == '"':
        in_string = not in_string
        continue
      if not in_string:
        if char == "{":
          brace_count += 1
        elif char == "}":
          brace_count -= 1
          if brace_count == 0:
            end_pos = i + 1
            break

    if end_pos == -1:
      continue

    block_content = hcl_content[start_pos:end_pos]

    # Extract display_name
    display_name_match = re.search(
        r'display_name\s*=\s*"([^"]+)"', block_content
    )
    display_name = display_name_match.group(1) if display_name_match else ""

    # Extract duration
    duration_match = re.search(r'duration\s*=\s*"([^"]+)"', block_content)
    duration = duration_match.group(1) if duration_match else None

    # Extract PromQL queries
    queries = [
        q.group(1)
        for q in re.finditer(
            r"query\s*=\s*<<-?EOT\n(.*?)\n\s*EOT",
            block_content,
            re.DOTALL,
        )
    ]
    if not queries:
      for match in re.finditer(
          r"query\s*=\s*\"((?:[^\"\\]|\\[\s\S])*)\"", block_content
      ):
        raw_query = match.group(1)
        clean_query = re.sub(r"\\+\"", '"', raw_query).replace("\\\\", "\\")
        queries.append(clean_query)

    # Extract threshold filters
    filters = []
    filter_matches = re.finditer(
        r'filter\s*=\s*"((?:[^"\\]|\\.)*)"', block_content
    )
    for f_match in filter_matches:
      filters.append(f_match.group(1))

    # Infer signal type
    signal_type = "unknown"
    res_lower, disp_lower = resource_name.lower(), display_name.lower()
    rules = [
        ("latency", "latency", "latency"),
        ("slo_burn_rate_fast", "fast", "slo_fast"),
        ("slo_burn_rate_slow", "slow", "slo_slow"),
    ]
    for res_pat, disp_pat, sig in rules:
      if res_pat in res_lower or disp_pat in disp_lower:
        signal_type = sig
        break
    else:
      # Check threshold filters for quality metric name
      for flt in filters:
        metric_match = re.search(
            r"metric\.labels\.evaluation_metric_name"
            r"\s*=\s*\\*\"([^\"\\]+)\\*\"",
            flt,
        )
        if metric_match:
          signal_type = metric_match.group(1)
          break

    engine_ids = []
    for query in queries:
      for engine_id in re.findall(
          r'(?:reasoning_engine_id|gen_ai_agent_name|namespace)'
          r'\s*=\s*"([^"]+)"',
          query,
      ):
        if engine_id not in engine_ids:
          engine_ids.append(engine_id)
    for flt in filters:
      id_matches = re.findall(
          r'(?:reasoning_engine_id|gen_ai_agent_name|namespace)'
          r'\s*=\s*\\*"([^"\\]+)\\*"',
          flt,
      )
      for engine_id in id_matches:
        if engine_id not in engine_ids:
          engine_ids.append(engine_id)
      resource_matches = re.findall(r"reasoningEngines/([0-9]+)", flt)
      for engine_id in resource_matches:
        if engine_id not in engine_ids:
          engine_ids.append(engine_id)

    policies.append({
        "resource_name": resource_name,
        "display_name": display_name,
        "signal_type": signal_type,
        "engine_ids": engine_ids,
        "queries": queries,
        "filters": filters,
        "duration": duration,
        "is_sql": "condition_sql" in block_content,
        "start_pos": start_pos,
        "end_pos": end_pos,
        "block_content": block_content,
    })

  return policies


def validate_directory_tf_files(
    directory: str, expected_engine_var: str | None = None
) -> dict:
  """Scans and validates all *.tf files in a given directory.

  Args:
      directory: The path to the directory containing Terraform files.
      expected_engine_var: The expected variable reference for the agent
        identifier (e.g., '${var.gen_ai_agent_name}').

  Returns:
      A dictionary summarizing validation results, including 'valid' (bool),
      'errors' (list of str), and other metadata.
  """
  tf_files = glob.glob(os.path.join(directory, "*.tf"))
  all_errors = []
  all_policies = []
  duplicates = []

  target_map = {}

  for filepath in tf_files:
    filename = os.path.basename(filepath)
    try:
      with open(filepath, "r") as f:
        content = f.read()
    except Exception as e:
      all_errors.append(f"File error in '{filename}': {e}")
      continue

    policies = extract_alert_policies(content)
    for policy in policies:
      policy["filename"] = filename
      all_policies.append(policy)

      if not policy.get("is_sql"):
        for query in policy["queries"]:
          lint_errs = lint_query(query)
          for err in lint_errs:
            all_errors.append(
                f"Lint error in '{filename}' -> resource"
                f" '{policy['resource_name']}': {err}"
            )

        duration_errs = validate_policy_duration(policy)
        for err in duration_errs:
          all_errors.append(
              f"Duration error in '{filename}' -> resource"
              f" '{policy['resource_name']}': {err}"
          )

      engine_key = (
          policy["engine_ids"][0]
          if policy["engine_ids"]
          else expected_engine_var or "default"
      )
      key = (engine_key, policy["signal_type"])

      if key not in target_map:
        target_map[key] = []
      target_map[key].append(policy)

  for (engine, signal_type), matches in target_map.items():
    if len(matches) > 1 and signal_type != "unknown":
      duplicates.append({
          "engine_id": engine,
          "signal_type": signal_type,
          "policies": [
              {
                  "filename": p["filename"],
                  "resource_name": p["resource_name"],
                  "display_name": p["display_name"],
              }
              for p in matches
          ],
      })

  for dup in duplicates:
    policy_list = ", ".join(
        f"'{p['resource_name']}' in '{p['filename']}'" for p in dup["policies"]
    )
    all_errors.append(
        "Duplicate Target Error: Multiple alert policies are targeting the"
        f" same engine '{dup['engine_id']}' and signal '{dup['signal_type']}':"
        f" [{policy_list}]. Please apply the in-place upgrade protocol instead"
        " of appending new blocks!"
    )

  return {
      "valid": len(all_errors) == 0,
      "errors": all_errors,
      "policies_scanned_count": len(all_policies),
      "duplicates_found": duplicates,
  }


def main():
  parser = argparse.ArgumentParser(
      description=(
          "Lints HCL alerts and PromQL query targets in standard tf templates."
      )
  )
  parser.add_argument(
      "--directory",
      type=str,
      default=".",
      help="Directory containing *.tf files to scan.",
  )
  parser.add_argument(
      "--engine-var",
      type=str,
      default="${var.gen_ai_agent_name}",
      help="The expected variable or literal for the agent identifier.",
  )
  parser.add_argument(
      "--file",
      type=str,
      help="Validate a single specific HCL file instead of scanning directory.",
  )
  args = parser.parse_args()

  if args.file:
    try:
      with open(args.file, "r") as f:
        content = f.read()
      policies = extract_alert_policies(content)
      errors = []
      for p in policies:
        if not p.get("is_sql"):
          for q in p["queries"]:
            errors.extend(lint_query(q))
          errors.extend(validate_policy_duration(p))
      if errors:
        print(f"Validation failed for '{args.file}':", file=sys.stderr)
        for err in errors:
          print(f"  - {err}", file=sys.stderr)
        sys.exit(1)
      else:
        print(f"Validation passed for '{args.file}'!")
        sys.exit(0)
    except Exception as e:
      print(f"Error reading file '{args.file}': {e}", file=sys.stderr)
      sys.exit(1)

  results = validate_directory_tf_files(args.directory, args.engine_var)
  print(json.dumps(results, indent=2))
  if not results["valid"]:
    sys.exit(1)


if __name__ == "__main__":
  main()
