#!/usr/bin/env node

// Usage: validate.mjs <skill-directory>
//
// Frontmatter is read textually, top-level keys only, so the validator runs on
// Node.js without dependencies.

import { existsSync, readFileSync } from "node:fs";
import { basename, join, resolve } from "node:path";

const knownFields = new Set([
  "name",
  "description",
  "license",
  "compatibility",
  "metadata",
  "allowed-tools",
  "when_to_use",
  "argument-hint",
  "arguments",
  "disable-model-invocation",
  "user-invocable",
  "disallowed-tools",
  "model",
  "effort",
  "context",
  "agent",
  "background",
  "hooks",
  "paths",
  "shell",
]);

const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/;
const KEY_LINE = /^([A-Za-z_][\w-]*):[ \t]*(.*)$/;
const BLOCK_SCALAR = /^[>|][+-]?$/;
const IMPLICIT_INVOCATION_OFF =
  /^policy:[ \t]*\r?\n(?:[ \t]+.*\r?\n)*?[ \t]+allow_implicit_invocation:[ \t]*false[ \t]*$/m;

function main() {
  const input = process.argv[2];
  if (!input) {
    console.error("usage: validate.mjs <skill-directory>");
    process.exit(2);
  }

  const errors = [];
  const skillDir = resolve(input);
  const skillFile = join(skillDir, "SKILL.md");
  let name = "";

  if (!existsSync(skillFile)) {
    errors.push(`${input}/SKILL.md does not exist`);
  } else {
    const properties = validateFrontmatter(
      readFileSync(skillFile, "utf8"),
      basename(skillDir),
      errors,
    );
    if (properties["disable-model-invocation"] === "true") {
      validateOpenaiPolicy(input, skillDir, errors);
    }
    name = properties.name ?? "";
  }

  if (errors.length > 0) {
    console.error(errors.map((error) => `- ${error}`).join("\n"));
    process.exit(1);
  }

  console.log(`validated ${name}`);
}

function parseTopLevel(frontmatter) {
  const properties = {};
  let key;
  let block;
  for (const line of frontmatter.split(/\r?\n/)) {
    const match = line.match(KEY_LINE);
    if (match) {
      key = match[1];
      const value = match[2].trim();
      block = BLOCK_SCALAR.test(value) ? [] : undefined;
      properties[key] = block ? "" : unquote(value);
    } else if (block && line.trim()) {
      block.push(line.trim());
      properties[key] = block.join(" ");
    }
  }
  return properties;
}

function unquote(value) {
  const quoted = value.match(/^(["'])(.*)\1$/);
  return quoted ? quoted[2] : value;
}

function validateFrontmatter(text, directory, errors) {
  const frontmatter = text.match(FRONTMATTER)?.[1];
  if (!frontmatter) {
    errors.push("SKILL.md must start with YAML frontmatter");
    return {};
  }
  const properties = parseTopLevel(frontmatter);

  const unknown = Object.keys(properties).filter((key) =>
    !knownFields.has(key)
  );
  if (unknown.length > 0) {
    errors.push(`unknown frontmatter fields: ${unknown.join(", ")}`);
  }

  const name = properties.name ?? "";
  const description = properties.description ?? "";

  if (!name) {
    errors.push("frontmatter name is required");
  } else {
    if ([...name].length > 64 || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name)) {
      errors.push(
        "name must contain 1 to 64 lowercase letters, numbers, or single hyphens",
      );
    }
    if (name !== directory) {
      errors.push("frontmatter name must match its parent directory");
    }
  }

  const modelInvoked = properties["disable-model-invocation"] !== "true";

  if ([...description].length < 1 || [...description].length > 500) {
    errors.push("description must contain 1 to 500 characters");
  } else if (modelInvoked && !description.includes("Use when")) {
    errors.push("description must include Use when as the trigger phrase");
  }

  return properties;
}

function validateOpenaiPolicy(input, skillDir, errors) {
  const file = join(skillDir, "agents", "openai.yaml");
  if (
    !existsSync(file) ||
    !IMPLICIT_INVOCATION_OFF.test(readFileSync(file, "utf8"))
  ) {
    errors.push(
      `disable-model-invocation requires ${input}/agents/openai.yaml with policy.allow_implicit_invocation: false`,
    );
  }
}

main();
