---
name: building-wiki
description: Bootstraps a knowledge base an agent builds and maintains — an agent-owned wiki over cited sources, and a domain schema defining ingest, query, and lint. Use when asked to set up an LLM wiki, knowledge repo, or knowledge bundle, make notes compound across sources instead of being re-derived per question, or write the schema for an existing knowledge repo.
license: MIT
metadata:
  author: h3y6e
  version: 2026.9.1
---

# Building a Wiki

A knowledge base is a **compiler**, not an interpreter: knowledge is compiled once and kept current, not re-derived from raw sources at every question. The human picks sources, explores, and asks good questions. The agent does the bookkeeping — cross-references, freshness, contradictions across dozens of pages — which is the part whose cost makes humans abandon wikis.

The deliverable is a repository plus a schema file (`AGENTS.md`) that turns any agent into a disciplined wiki maintainer for one domain. Day-to-day ingest then runs from that schema, not from this skill.

## When Not To Use

- The user wants retrieval over documents as they stand — RAG, full-text search, and MCP complement a knowledge base rather than being replaced by one.
- A single source summarized once, with nothing accumulating — just summarize it.
- The knowledge already exists as a machine-readable schema (OpenAPI, Protobuf) — reference it instead of absorbing it.

## Workflow

1. **Interview the domain.** Establish the sources, the readers, the questions the base must answer, and the tool the wiki gets read in — that last one decides the link convention, per [`references/page-format.md`](references/page-format.md). Then decide **source precedence**: when two sources disagree, which wins, for which kind of claim. Without written precedence the agent believes whatever it read last. Done when precedence is recorded per claim type.

2. **Lay out the layers.** `wiki/` (agent-owned; the human reads and steers), `tools/` (deterministic scripts), and `_generated/` for anything a script can derive. Anything reproducible by script — listings, back-references, staleness reports — is generated and marked as overwritten on regeneration, so hand-written and generated content never share a file.

   Add `raw/` (immutable — agents read it, never write it) when the sources can be committed. Some cannot: credentials, confidential material under a retention policy, licensed text. Then the wiki holds every claim's `sources[].resource` URI as the only handle on its origin, and fidelity checks re-fetch instead of diffing against a local copy — which means a source that later disappears takes its verifiability with it, so decide per source which risk you are taking. A bundle can be mixed; the schema records which sources are mirrored and which are not.

3. **Fix the page format** before the first ingest, following [`references/page-format.md`](references/page-format.md).

4. **Write the schema.** Author `AGENTS.md` against the checklist in [`references/schema.md`](references/schema.md), which also holds the operation definitions and the failure modes that appear at scale. Most of its value is the domain-specific part: name the mistakes the agent actually makes in this domain. Keep slash commands as thin pointers to it so each definition lives in one place. Done when every checklist item is either answered in `AGENTS.md` or reported to the user as not applicable — an item that does not apply earns no line in the schema.

5. **Pilot at 20–50 concepts.** Ingest one source at a time with the user in the loop, discussing the takeaways before any page is written. Review generated diffs rather than plans — approving what the agent intends to do misses far more than reading what it wrote. Settle lint (`scripts/lint.mjs`, run from the installed skill), `stale_after` handling, and named reviewers here, while the scale is still reversible. Add full-text search and other tooling only once the index demonstrably stops finding answers.
