#!/usr/bin/env -S deno run --allow-read --allow-run=git

import { parse } from "jsr:@std/yaml@1.1.2";
import { basename, isAbsolute, join, relative, resolve, sep } from "node:path";

type SkillTarget = {
  root: string;
  publishedSkillsDir: string;
  skillDir: string;
  relativeDir: string;
  name: string;
};

// Validates one skill's location and frontmatter, then checks published .tagpr coverage.
function main() {
  const errors: string[] = [];
  const target = resolveTarget(Deno.cwd(), Deno.args[0], errors);
  const name = validateSkillFile(target, errors);
  validateTagpr(target.root, target.publishedSkillsDir, errors);

  if (errors.length > 0) {
    console.error(errors.map((error) => `- ${error}`).join("\n"));
    Deno.exit(1);
  }

  console.log(`validated ${name}`);
}

function resolveTarget(
  root: string,
  input: string | undefined,
  errors: string[],
): SkillTarget {
  const skillDir = resolve(root, input ?? "");
  const relativeDir = relative(root, skillDir).split(sep).join("/");
  const name = basename(skillDir);
  const publishedSkillsDir = join(root, "skills");
  const skillRoot = relativeDir === `skills/${name}`
    ? publishedSkillsDir
    : relativeDir === `.agents/skills/${name}`
    ? join(root, ".agents", "skills")
    : undefined;

  if (!input) {
    errors.push("usage: validate.ts <skill-directory>");
  }
  if (!skillRoot) {
    errors.push(
      "skill must be located at skills/<skill-name> or .agents/skills/<skill-name>",
    );
  }
  if (
    skillRoot && exists(skillRoot) &&
    !isWithin(Deno.realPathSync(root), Deno.realPathSync(skillRoot))
  ) {
    errors.push("skills directory must stay within the repository root");
  }
  if (
    skillRoot &&
    exists(skillRoot) &&
    exists(skillDir) &&
    !isWithin(Deno.realPathSync(skillRoot), Deno.realPathSync(skillDir))
  ) {
    errors.push("skill directory must stay within its skills root");
  }

  return { root, publishedSkillsDir, skillDir, relativeDir, name };
}

function validateSkillFile(target: SkillTarget, errors: string[]) {
  const skillFile = join(target.skillDir, "SKILL.md");

  if (!exists(skillFile)) {
    errors.push(`${target.relativeDir}/SKILL.md does not exist`);
    return "";
  }
  if (
    !isWithin(Deno.realPathSync(target.root), Deno.realPathSync(skillFile)) ||
    !isWithin(Deno.realPathSync(target.skillDir), Deno.realPathSync(skillFile))
  ) {
    errors.push("SKILL.md must stay within its skill directory");
    return "";
  }

  return validateFrontmatter(
    Deno.readTextFileSync(skillFile),
    target.name,
    errors,
  );
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

  if ([...description].length < 1 || [...description].length > 1024) {
    errors.push("description must contain 1 to 1024 characters");
  } else if (!description.includes("Use when")) {
    errors.push(
      "description must include Use when as the repository trigger phrase",
    );
  }

  return name;
}

function validateTagpr(root: string, skillsDir: string, errors: string[]) {
  const tagprFile = join(root, ".tagpr");
  if (!exists(tagprFile)) {
    errors.push(".tagpr does not exist");
    return;
  }

  const result = new Deno.Command("git", {
    args: ["config", "--file", tagprFile, "--get", "tagpr.versionFile"],
    stdout: "piped",
    stderr: "piped",
  }).outputSync();
  const configured = new TextDecoder().decode(result.stdout)
    .trim()
    .split(",")
    .map((path) => path.trim())
    .filter(Boolean)
    .sort();
  const publishedSkills = exists(skillsDir)
    ? [...Deno.readDirSync(skillsDir)]
      .filter(
        (entry) =>
          (entry.isDirectory || entry.isSymlink) &&
          exists(join(skillsDir, entry.name, "SKILL.md")),
      )
      .map((entry) => `skills/${entry.name}/SKILL.md`)
      .sort()
    : [];

  if (!result.success) {
    errors.push(".tagpr must define tagpr.versionFile");
  }

  if (JSON.stringify(configured) !== JSON.stringify(publishedSkills)) {
    errors.push(
      ".tagpr versionFile must match every published skills/*/SKILL.md",
    );
  }
}

function isWithin(parent: string, candidate: string) {
  const path = relative(parent, candidate);
  return path === "" ||
    (path !== ".." && !path.startsWith(`..${sep}`) && !isAbsolute(path));
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
