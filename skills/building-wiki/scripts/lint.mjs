#!/usr/bin/env node

// Usage: lint.mjs <bundle-dir> [--fix]
//
// Type conventions and key order are inferred from the pages that exist, so no
// spec file can drift from them. Frontmatter is parsed textually rather than as
// YAML so that a date-only timestamp cannot be silently defaulted to midnight.

import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, dirname, join, resolve, sep } from "node:path";

const CONVENTION_RATE = 0.8;
const OUTLIER_RATE = 0.2;
const MIN_PAGES_FOR_MAJORITY = 3;

const ISO_UTC = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/;
const LOG_HEADING = /^## \d{4}-\d{2}-\d{2}$/;
const KEY_LINE = /^([A-Za-z_][\w-]*):/;
const RESERVATION = /status:\s*planned\b/;
const STAMP = /(?:^|[\s{,])(at|stale_after):\s*([^,}\n]+)/g;
const FOOTNOTE_DEF = /^\[\^([^\]]+)\]:/gm;
const FOOTNOTE_REF = /\[\^([^\]]+)\](?!:)/g;
const MD_LINK = /\[[^\]]*\]\(([^)\s]+)\)/g;
const EXTERNAL_URL = /^[a-z][a-z0-9+.-]*:\/\//i;
const SOURCE_ID = /\bid:\s*"?([^\s,}"]+)/g;
const NOT_A_PAGE = new Set(["log.md", "AGENTS.md"]);
const RAW_DIR = "raw";

const captures = (text, regex) => [...text.matchAll(regex)].map((m) => m[1]);
const isIndex = (page) => basename(page.file) === "README.md";

function pageFiles(bundle) {
  return readdirSync(bundle, { recursive: true })
    .filter((p) => p.endsWith(".md") && !p.startsWith(RAW_DIR + sep) && !NOT_A_PAGE.has(basename(p)))
    .sort()
    .map((p) => join(bundle, p));
}

function splitFrontmatter(text) {
  if (!text.startsWith("---\n")) return null;
  const end = text.indexOf("\n---\n", 4);
  if (end === -1) return null;
  return { frontmatter: text.slice(4, end + 1), body: text.slice(end + 5) };
}

// Comments attach to the key that follows them, so they move with it on --fix.
function blocks(frontmatter) {
  const out = [];
  let pending = "";
  for (const line of frontmatter.split("\n").slice(0, -1)) {
    const key = KEY_LINE.exec(line)?.[1];
    if (key) {
      out.push({ key, value: line.slice(key.length + 1).trim(), text: pending + line + "\n" });
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

function parsePage(file, report) {
  const split = splitFrontmatter(readFileSync(file, "utf8"));
  if (!split) {
    report("error", file, "no YAML frontmatter");
    return null;
  }
  const fmBlocks = blocks(split.frontmatter);
  const block = (key) => fmBlocks.find((b) => b.key === key);
  return { file, ...split, fmBlocks, block, keys: fmBlocks.map((b) => b.key).filter(Boolean), type: block("type")?.value ?? "" };
}

// README.md is one per directory, so it has no majority to compare against.
function checkConventions(pages, report) {
  const byType = Map.groupBy(pages.filter((p) => p.type && !isIndex(p)), (p) => p.type);
  for (const [type, group] of byType) {
    if (group.length === 1) report("warn", group[0].file, `type "${type}" is used by this page alone — a new page type, or a typo`);
    if (group.length < MIN_PAGES_FOR_MAJORITY) continue;
    const counts = new Map();
    for (const page of group) for (const key of page.keys) counts.set(key, (counts.get(key) ?? 0) + 1);
    for (const [key, count] of counts) {
      const rate = count / group.length;
      const lonelyHoldout = count === group.length - 1;
      if (lonelyHoldout || rate >= CONVENTION_RATE) {
        for (const page of group) {
          if (!page.keys.includes(key)) report(lonelyHoldout ? "error" : "warn", page.file, `missing "${key}" — ${count} of ${group.length} ${type} pages carry it`);
        }
      } else if (count === 1 || rate <= OUTLIER_RATE) {
        for (const page of group) {
          if (page.keys.includes(key)) report("warn", page.file, `"${key}" appears on ${count} of ${group.length} ${type} pages — a typo, or a convention not yet adopted`);
        }
      }
    }
  }
}

function checkTimestamps(page, now, report) {
  for (const [, key, raw] of page.frontmatter.matchAll(STAMP)) {
    const value = raw.trim();
    const parsed = Date.parse(value);
    const exact = ISO_UTC.test(value) && !Number.isNaN(parsed) && new Date(parsed).toISOString() === value.replace("Z", ".000Z");
    if (!exact) report("error", page.file, `${key} must be an absolute UTC timestamp (YYYY-MM-DDTHH:MM:SSZ), got ${value}`);
    else if (key === "stale_after" && parsed < now) report("warn", page.file, `stale_after passed on ${value} — re-read this page against its sources`);
  }
}

function checkFootnotes(page, report) {
  const defined = new Set(captures(page.body, FOOTNOTE_DEF));
  const used = new Set(captures(page.body, FOOTNOTE_REF));
  const sourceIds = new Set(captures(page.block("sources")?.text ?? "", SOURCE_ID));
  for (const name of used) {
    if (!defined.has(name)) report("error", page.file, `footnote [^${name}] is referenced but never defined`);
    else if (!sourceIds.has(name)) report("error", page.file, `footnote [^${name}] does not match any sources[].id`);
  }
  for (const name of defined) {
    if (!used.has(name)) report("warn", page.file, `footnote [^${name}] is defined but never cited`);
  }
}

// Viewers resolve `/` against either the bundle root or the repository root.
function checkLinks(page, bundleRoot, report) {
  for (const href of captures(page.body, MD_LINK)) {
    const target = href.split("#")[0];
    if (EXTERNAL_URL.test(href) || !target.endsWith(".md")) continue;
    const candidates = target.startsWith("/") ? [join(bundleRoot, target), join(process.cwd(), target)] : [resolve(dirname(page.file), target)];
    if (!candidates.some(existsSync)) report("info", page.file, `link target ${target} does not exist — unwritten knowledge, or a typo`);
  }
}

function checkPage(page, bundleRoot, now, report) {
  if (!page.type) report("error", page.file, "no type — every page declares one");
  checkTimestamps(page, now, report);
  checkFootnotes(page, report);
  checkLinks(page, bundleRoot, report);
  if (isIndex(page) && RESERVATION.test(page.body)) report("info", page.file, "open page-name reservation — clear it once the page is written");
}

function checkLog(bundle, report) {
  const log = join(bundle, "log.md");
  if (!existsSync(log)) {
    report("warn", log, "no log.md at the bundle root — nothing records what happened");
    return;
  }
  for (const line of readFileSync(log, "utf8").split("\n")) {
    if (line.startsWith("## ") && !LOG_HEADING.test(line)) report("error", log, `log heading must be "## YYYY-MM-DD", got ${line}`);
  }
}

function keyRanks(pages) {
  const positions = new Map();
  for (const { keys } of pages) keys.forEach((key, i) => positions.set(key, [...(positions.get(key) ?? []), i]));
  const mean = (xs) => xs.reduce((a, b) => a + b) / xs.length;
  return new Map([...positions].sort(([, a], [, b]) => mean(a) - mean(b)).map(([key], rank) => [key, rank]));
}

function reordered(page, ranks) {
  const rank = (block) => ranks.get(block.key) ?? ranks.size;
  return page.fmBlocks
    .map((block, index) => ({ block, index }))
    .sort((a, b) => rank(a.block) - rank(b.block) || a.index - b.index)
    .map(({ block }) => block.text)
    .join("");
}

function fixKeyOrder(pages, report) {
  const ranks = keyRanks(pages);
  for (const page of pages) {
    const frontmatter = reordered(page, ranks);
    if (frontmatter === page.frontmatter) continue;
    writeFileSync(page.file, `---\n${frontmatter}---\n${page.body}`);
    report("info", page.file, "frontmatter keys reordered to the bundle's prevailing order");
  }
}

function lint(bundle, { fix }) {
  const issues = [];
  const report = (level, file, msg) => issues.push({ level, file, msg });
  const pages = pageFiles(bundle).map((file) => parsePage(file, report)).filter(Boolean);
  const bundleRoot = resolve(bundle);
  const now = Date.now();
  checkConventions(pages, report);
  for (const page of pages) checkPage(page, bundleRoot, now, report);
  if (fix) fixKeyOrder(pages, report);
  checkLog(bundle, report);
  return { pages: pages.length, issues };
}

function main(argv) {
  const fix = argv.includes("--fix");
  const bundle = argv.find((a) => !a.startsWith("--"))?.replace(/\/$/, "");
  if (!bundle) {
    console.error("usage: lint.mjs <bundle-dir> [--fix]");
    return 2;
  }
  const { pages, issues } = lint(bundle, { fix });
  const errors = issues.filter(({ level }) => level === "error").length;
  const lines = issues.map(({ level, file, msg }) => `${level.toUpperCase().padEnd(5)} ${file}: ${msg}`);
  console.log([...lines, "", `${pages} page(s), ${issues.length} issue(s), ${errors} error(s)`].join("\n"));
  return errors ? 1 : 0;
}

process.exit(main(process.argv.slice(2)));
