#!/usr/bin/env node

/**
 * Linter/formatter for a knowledge bundle, no deps or config: permitted `type`
 * values, each type's fields, and frontmatter key order are inferred from the
 * pages that already exist, so nothing can drift from a separate spec file.
 * Contradictions between pages and fidelity to sources stay with the agent.
 *
 *   .agents/skills/building-wiki/scripts/lint.mjs <bundle-dir> [--fix]
 *
 * Frontmatter is parsed textually, not via a YAML lib, so a date-only `at:`
 * can't be silently defaulted to midnight.
 */

import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

/** Share of a type's pages a key must appear on to count as that type's convention. */
const CONVENTION = 0.8;
/** Share of a type's pages a key may appear on and still count as a typo/outlier. */
const OUTLIER = 0.2;
/** Fewer pages than this and no majority means anything. */
const MIN_PAGES = 3;

const ISO_UTC = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/;
const LOG_HEADING = /^## \d{4}-\d{2}-\d{2}$/;
const KEY_LINE = /^([A-Za-z_][\w-]*):/;
const RESERVATION = /status:\s*planned\b/;
const STAMP = /(?:^|[\s{,])(at|stale_after):\s*([^,}\n]+)/g;
const FOOTNOTE_DEF = /^\[\^([^\]]+)\]:/gm;
const FOOTNOTE_REF = /\[\^([^\]]+)\](?!:)/g;
const MD_LINK = /\[[^\]]*\]\(([^)\s]+)\)/g;
const SOURCE_ID = /\bid:\s*(\S+)/g;

const issues = [];
const report = (level, file, msg) => issues.push({ level, file, msg });
const read = (path) => readFileSync(path, "utf8");

function splitFrontmatter(text) {
  if (!text.startsWith("---\n")) return null;
  const end = text.indexOf("\n---\n", 4);
  if (end === -1) return null;
  return { frontmatter: text.slice(4, end + 1), body: text.slice(end + 5) };
}

/** Top-level blocks: each key line plus the indented lines and comments belonging to it. */
function blocks(frontmatter) {
  const out = [];
  let pending = "";
  for (const line of frontmatter.split("\n").slice(0, -1)) {
    const key = KEY_LINE.exec(line)?.[1];
    if (key) {
      out.push({ key, text: pending + line + "\n" });
      pending = "";
    } else if (out.length === 0 || line.trimStart().startsWith("#")) {
      pending += line + "\n";
    } else {
      out.at(-1).text += line + "\n";
    }
  }
  if (pending) out.push({ key: "", text: pending });
  return out;
}

const blockText = (fmBlocks, name) => fmBlocks.find((b) => b.key === name)?.text ?? "";

function markdownFiles(dir, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) markdownFiles(path, out);
    else if (entry.name.endsWith(".md")) out.push(path);
  }
  return out;
}

function loadPages(files) {
  const pages = [];
  for (const file of files) {
    if (file.endsWith("log.md")) continue;
    const split = splitFrontmatter(read(file));
    if (!split) {
      report("error", file, "no YAML frontmatter");
      continue;
    }
    const fmBlocks = blocks(split.frontmatter);
    const keys = [];
    for (const { key } of fmBlocks) if (key) keys.push(key);
    const typeLine = blockText(fmBlocks, "type");
    pages.push({
      file,
      ...split,
      fmBlocks,
      keys,
      present: new Set(keys),
      type: typeLine.slice(typeLine.indexOf(":") + 1).trim(),
    });
  }
  return pages;
}

/** Bundle-wide key order: each key ranked by its mean position across the pages that carry it. */
function inferKeyRanks(pages) {
  const stats = new Map();
  for (const page of pages) {
    page.keys.forEach((key, index) => {
      const stat = stats.get(key);
      if (stat) {
        stat.sum += index;
        stat.count += 1;
      } else stats.set(key, { sum: index, count: 1 });
    });
  }
  const ordered = [...stats.entries()].sort((a, b) => a[1].sum / a[1].count - b[1].sum / b[1].count);
  return new Map(ordered.map(([key], rank) => [key, rank]));
}

/** Each type's field convention, taken from that type's own pages. */
function checkConvention(pages) {
  const byType = new Map();
  for (const page of pages) {
    if (!page.type) report("error", page.file, "no type — every page declares one");
    else if (page.file.endsWith("index.md")) continue; // one per directory, so no majority to compare against
    else if (byType.has(page.type)) byType.get(page.type).push(page);
    else byType.set(page.type, [page]);
  }
  for (const [type, group] of byType) {
    if (group.length < MIN_PAGES) {
      if (group.length === 1) report("warn", group[0].file, `type "${type}" is used by this page alone — a new page type, or a typo`);
      continue;
    }
    const counts = new Map();
    for (const page of group) for (const key of page.present) counts.set(key, (counts.get(key) ?? 0) + 1);
    for (const [key, count] of counts) {
      const rate = count / group.length;
      const lonelyHoldout = count === group.length - 1;
      if (lonelyHoldout || rate >= CONVENTION) {
        for (const page of group) {
          if (!page.present.has(key)) report(lonelyHoldout ? "error" : "warn", page.file, `missing "${key}" — ${count} of ${group.length} ${type} pages carry it`);
        }
      } else if (count === 1 || rate <= OUTLIER) {
        for (const page of group) {
          if (page.present.has(key)) report("warn", page.file, `"${key}" appears on ${count} of ${group.length} ${type} pages — a typo, or a convention not yet adopted`);
        }
      }
    }
  }
}

function checkTimestamps(page, now) {
  for (const [, key, raw] of page.frontmatter.matchAll(STAMP)) {
    const value = raw.trim();
    if (!ISO_UTC.test(value)) report("error", page.file, `${key} must be an absolute UTC timestamp (YYYY-MM-DDTHH:MM:SSZ), got ${value}`);
    else if (key === "stale_after" && Date.parse(value) < now) report("warn", page.file, `stale_after passed on ${value} — re-read this page against its sources`);
  }
}

function checkFootnotes(page) {
  const defined = new Set();
  for (const [, name] of page.body.matchAll(FOOTNOTE_DEF)) defined.add(name);
  const used = new Set();
  for (const [, name] of page.body.matchAll(FOOTNOTE_REF)) used.add(name);
  if (defined.size === 0 && used.size === 0) return;

  const sourceIds = new Set();
  for (const [, id] of blockText(page.fmBlocks, "sources").matchAll(SOURCE_ID)) sourceIds.add(id);
  for (const name of used) {
    if (!defined.has(name)) report("error", page.file, `footnote [^${name}] is referenced but never defined`);
    else if (!sourceIds.has(name)) report("error", page.file, `footnote [^${name}] does not match any sources[].id`);
  }
  for (const name of defined) {
    if (!used.has(name)) report("warn", page.file, `footnote [^${name}] is defined but never cited`);
  }
}

/** Root-absolute links (`/foo.md`) resolve against the bundle root or the working directory. */
function checkLinks(page, bundleRoot, known) {
  for (const [, href] of page.body.matchAll(MD_LINK)) {
    const target = href.split("#")[0];
    if (!target.endsWith(".md")) continue;
    const candidates = target.startsWith("/")
      ? [join(bundleRoot, target), join(process.cwd(), target)]
      : [resolve(dirname(page.file), target)];
    if (!candidates.some((path) => known.has(path) || existsSync(path))) {
      report("info", page.file, `link target ${target} does not exist — unwritten knowledge, or a typo`);
    }
  }
}

function checkLog(bundle) {
  const log = join(bundle, "log.md");
  if (!existsSync(log)) {
    report("warn", log, "no log.md at the bundle root — nothing records what happened");
    return;
  }
  for (const line of read(log).split("\n")) {
    if (line.startsWith("## ") && !LOG_HEADING.test(line)) report("error", log, `log heading must be "## YYYY-MM-DD", got ${line}`);
  }
}

function reordered(fmBlocks, ranks) {
  const rank = (key) => ranks.get(key) ?? ranks.size;
  return fmBlocks
    .map((block, index) => ({ block, index }))
    .sort((a, b) => rank(a.block.key) - rank(b.block.key) || a.index - b.index)
    .map(({ block }) => block.text)
    .join("");
}

function main(argv) {
  const fix = argv.includes("--fix");
  const bundle = argv.find((a) => !a.startsWith("--"))?.replace(/\/$/, "");
  if (!bundle) {
    console.error("usage: lint.mjs <bundle-dir> [--fix]");
    return 2;
  }
  const bundleRoot = resolve(bundle);
  const files = markdownFiles(bundle).sort();
  const known = new Set(files.map((file) => resolve(file)));

  const pages = loadPages(files);
  const ranks = inferKeyRanks(pages);
  const now = Date.now();
  checkConvention(pages);

  for (const page of pages) {
    checkTimestamps(page, now);
    checkFootnotes(page);
    checkLinks(page, bundleRoot, known);
    if (RESERVATION.test(page.frontmatter)) report("info", page.file, "open page-name reservation — clear it once the page is written");

    if (fix) {
      const normalized = reordered(page.fmBlocks, ranks);
      if (normalized !== page.frontmatter) {
        writeFileSync(page.file, `---\n${normalized}---\n${page.body}`);
        report("info", page.file, "frontmatter keys reordered to the bundle's prevailing order");
      }
    }
  }
  checkLog(bundle);

  let errors = 0;
  const lines = issues.map(({ level, file, msg }) => {
    if (level === "error") errors += 1;
    return `${level.toUpperCase().padEnd(5)} ${file}: ${msg}`;
  });
  lines.push("", `${pages.length} page(s), ${issues.length} issue(s), ${errors} error(s)`);
  console.log(lines.join("\n"));
  return errors ? 1 : 0;
}

process.exit(main(process.argv.slice(2)));
