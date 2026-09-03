---
name: building-wiki
description: Bootstraps and operates an agent-maintained knowledge base — a wiki of cited pages compiled from sources, plus an `AGENTS.md` schema for one domain. Use when asked to set up an LLM wiki, knowledge repo, or knowledge bundle, to make notes compound across sources instead of being re-derived per question, to write the schema for an existing knowledge repo, or when a bundle's `AGENTS.md` routes an ingest, query, lint, or source update here.
license: MIT
metadata:
  author: h3y6e
  version: 2026.9.4
---

# Building a Wiki

A knowledge base is a **compiler**, not an interpreter: knowledge is compiled once and kept current, not re-derived from raw sources at every question. The human picks sources, explores, and asks good questions. The agent does the bookkeeping — cross-references, freshness, contradictions across dozens of pages — the part whose cost makes humans abandon wikis.

The deliverable is a bundle of pages plus a schema in the root `AGENTS.md` of the repository that holds it. This skill holds the format and the operations; the schema holds only the domain and routes every later ingest, query, and lint back here.

## When Not To Use

- Retrieval over documents as they stand — RAG, full-text search, and MCP complement a knowledge base rather than replace one.
- A single source summarized once, with nothing accumulating — summarize it.
- Knowledge that already exists as a machine-readable schema (OpenAPI, Protobuf) — reference it instead of absorbing it.

## Operating an Existing Bundle

Read the repository's `AGENTS.md` for the domain, then run the operation as [`references/operations.md`](references/operations.md) defines it — ingest, query, lint, or update — deviating only where `AGENTS.md` says so.

Before letting ingests run in parallel, adding a second audience, or passing roughly 100 sources, read [`references/scale.md`](references/scale.md).

## Bootstrapping a Bundle

1. **Interview the domain.** Establish the sources, the readers, the questions the base must answer, and the tool the wiki is read in — the last decides the link convention. Then decide **source precedence**: when two sources disagree, which wins, for which kind of claim. Without written precedence the agent believes whatever it read last. Done when precedence is recorded per claim type and each source is classified as mirrored or reachable only by URI.

2. **Lay out the bundle and fix the page format**, following [`references/page-format.md`](references/page-format.md). When the bundle is published with GitHub Pages, configure it per [`references/github-pages.md`](references/github-pages.md). Done when `docs/` exists, the link convention is confirmed against the actual viewer, and every mirrored source sits under `docs/raw/`.

3. **Write the schema.** `AGENTS.md` carries only what this skill cannot know: the sources and their precedence, the permitted types, the conventions this domain picked, and the mistakes the agent actually makes here. Author it against the checklist in [`references/schema.md`](references/schema.md). Done when every checklist item is either answered in `AGENTS.md` or reported to the user as not applicable — an item that does not apply earns no line in the schema.

4. **Pilot at 20–50 concepts.** Ingest one source at a time with the user in the loop, discussing the takeaways before any page is written. Review generated diffs rather than plans — approving what the agent intends to do misses far more than reading what it wrote. Done when lint reports zero errors, every `type` has a `stale_after` rule, and a named reviewer owns each `type`. Add full-text search and other tooling only once the index demonstrably stops finding answers.
