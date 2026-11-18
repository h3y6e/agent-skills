#!/usr/bin/env -S deno run --allow-read

import { parse } from "jsr:@std/yaml@1.1.2";
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

function main() {
  const input = Deno.args[0];
  if (!input) {
    console.error("usage: validate.ts <skill-directory>");
    Deno.exit(2);
  }

  const errors: string[] = [];
  const skillDir = resolve(input);
  const skillFile = join(skillDir, "SKILL.md");
  let name = "";

  if (!exists(skillFile)) {
    errors.push(`${input}/SKILL.md does not exist`);
  } else {
    const properties = validateFrontmatter(
      Deno.readTextFileSync(skillFile),
      basename(skillDir),
      errors,
    );
    if (properties["disable-model-invocation"] === true) {
      validateOpenaiPolicy(input, skillDir, errors);
    }
    name = typeof properties.name === "string" ? properties.name : "";
  }

  if (errors.length > 0) {
    console.error(errors.map((error) => `- ${error}`).join("\n"));
    Deno.exit(1);
  }

  console.log(`validated ${name}`);
}

function validateFrontmatter(
  text: string,
  directory: string,
  errors: string[],
) {
  const frontmatter = text.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/)?.[1];
  let properties: Record<string, unknown> = {};

  if (!frontmatter) {
    errors.push("SKILL.md must start with YAML frontmatter");
  } else {
    try {
      const parsed = parse(frontmatter);
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        properties = parsed as Record<string, unknown>;
      } else {
        errors.push("frontmatter must be a YAML mapping");
      }
    } catch (error) {
      errors.push(
        `frontmatter must be valid YAML: ${
          error instanceof Error ? error.message : error
        }`,
      );
    }
  }

  const unknown = Object.keys(properties).filter((key) =>
    !knownFields.has(key)
  );
  if (unknown.length > 0) {
    errors.push(`unknown frontmatter fields: ${unknown.join(", ")}`);
  }

  const name = typeof properties.name === "string" ? properties.name : "";
  const description = typeof properties.description === "string"
    ? properties.description
    : "";

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

  const modelInvoked = properties["disable-model-invocation"] !== true;

  if ([...description].length < 1 || [...description].length > 500) {
    errors.push("description must contain 1 to 500 characters");
  } else if (modelInvoked && !description.includes("Use when")) {
    errors.push(
      "description must include Use when as the trigger phrase",
    );
  }

  return properties;
}

function validateOpenaiPolicy(
  input: string,
  skillDir: string,
  errors: string[],
) {
  const file = join(skillDir, "agents", "openai.yaml");
  const policy = exists(file)
    ? (parse(Deno.readTextFileSync(file)) as {
      policy?: { allow_implicit_invocation?: unknown };
    })?.policy
    : undefined;
  if (policy?.allow_implicit_invocation !== false) {
    errors.push(
      `disable-model-invocation requires ${input}/agents/openai.yaml with policy.allow_implicit_invocation: false`,
    );
  }
}

function exists(path: string) {
  try {
    Deno.statSync(path);
    return true;
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) return false;
    throw error;
  }
}

main();
