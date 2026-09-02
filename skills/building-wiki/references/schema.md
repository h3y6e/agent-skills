# Schema

`AGENTS.md` holds the one thing this skill cannot: the domain. Restating the layers, the page format, or the operations below buys nothing and then drifts from the original.

## Checklist

- [ ] The sources, and which of them are mirrored into `raw/` versus reachable only through `sources[].resource`.
- [ ] **Source precedence** — which source wins when two disagree, per kind of claim. For example: "history, points of contention, and attribution of statements come from the meeting notes; current status and owner come from the registry. The registry is a snapshot with no history; the notes carry history but settle the present poorly. Fill neither field from one side alone."
- [ ] The directory layout this bundle uses, and what lives in each directory.
- [ ] The internal profile — permitted `type` values and the fields each one requires. See below.
- [ ] Link convention, chosen after deciding which tool the wiki is read in.
- [ ] Language convention (if mixing languages: which language the prose is in, and what stays in the original — proper nouns, API names).
- [ ] Where this domain's operations deviate from the definitions below — nothing, if they don't.
- [ ] **Named failure modes for this domain.** For example: "do not settle an owner from the roster alone, confirm it inside the document itself"; "abbreviations are sometimes reassigned each year"; "add abbreviations that collide with ordinary words to the exclusion list."

## Internal profile

OKF conformance is deliberately near-trivial, so "conformant" guarantees nothing about quality. The spec defines an interoperability surface, not a design discipline. The profile layered on top is the actual defence:

- The permitted set of `type` values.
- Extra fields required per `type` — for example `generated` and `status` on every concept, `verified` on anything carrying numbers.
- Validation of **this profile**, not of format conformance.
- Rules for assigning `stale_after` per `type` — including which types omit it because they describe a fixed past and cannot go stale — and what happens to expired concepts.

## Operations

### Ingest

1. Pick the target. Grep the index for related passages and their sources.
2. Read the relevant source material — the `raw/` sections, or fetch the sources not mirrored there.
3. **Discuss the takeaways with the user.** Skipping this turns the base into a black box that rewrites notes behind their back.
4. Write the summary page, update `index.md`, and update related existing pages across the wiki.
5. Append one line to `log.md`.

One source can touch 10–15 pages. Default to one source at a time with the user involved; batch low-supervision runs only deliberately. When the material arrives in bulk (a whole archive at once), parsing everything up front exhausts the context — ask first for structure discovery and scaffolding only, then ingest topic by topic.

### Query

1. Descend `index.md` → related pages → index → the sources behind them.
2. Cite sources in every answer.
3. **Good answers belong back in the wiki.** A requested comparison, a discovered connection, a re-organized understanding is worth keeping rather than losing to chat history — that is how exploration compounds too.
4. Ask before adding: "should this become a page?"

### Lint

Cover both sides. The mechanical half takes no configuration, because the bundle is its own specification:

```bash
.agents/skills/building-wiki/scripts/lint.mjs <bundle-dir> [--fix]
```

It infers each type's field convention and the prevailing frontmatter key order from the pages that exist, then reports what deviates — a field the rest of that type carries, a key only one page has — alongside what is decidable outright: absolute timestamps, expired `stale_after`, footnote labels resolving to a `sources[].id`, link targets, open page-name reservations, `log.md` heading format. `--fix` reorders frontmatter keys to the prevailing order, moving each key's lines verbatim. Inference keeps the schema the one place the convention is stated; a rule it cannot infer belongs in the repository's own check beside it. Everything below is what no script can decide.

**Internal consistency** (wiki only): contradictions between pages; old claims overturned by newer sources; orphan pages with no inbound links and missing reciprocal links; important concepts mentioned but page-less; open questions left unresolved; one-sided metadata that should exist on both ends (group membership, for instance).

**Fidelity to sources**: inspect with the intent of finding errors, and treat the source as truth when fixing. Against `raw/` this is a diff; against an unmirrored source it means re-fetching, so the check is only as reliable as the source's own stability — a page whose source has moved or vanished is a finding, not a pass. The domain's named failure modes tell the linter where to look hardest.

### Update

1. Note the pre-sync pointer.
2. Update `raw/`. Without one, re-read the source and compare against what the wiki already claims — the pages are the only prior state there is.
3. **Show the diff** — summarize what arrived. This is what ingest and summarize work from next; syncing without it halves the point.
4. Regenerate generated artifacts.
5. Record it in `log.md`.

### Others

Add per domain — a `Summarise` for recurring material, a `Families` that bundles related concepts (details stay on the individual pages; the bundling page links rather than copies, to avoid double maintenance).

## Failure modes at scale

Invisible at personal scale, fixable at the schema and workflow level.

**Concurrent ingest forks the wiki.** Two parallel ingests plan against the same index snapshot and independently create pages for one concept under slightly different names (`user-id` and `user-identifier`). Reserve target page names in the index as placeholders during planning, before generation, so the next plan sees the placeholder and chooses update over create. Reserve as `{ status: planned, claimed_by: [ingest#0421] }` with `claimed_by` as a set, so an aborted ingest releases only its own claim and leaves the slot. Keep inference outside the lock — putting an LLM call in a critical section holds it far too long and starves everything behind it — and use a conditional write for the name reservation alone.

**One-line index summaries do not reach deep facts.** Index-based navigation works remarkably well up to roughly 100 sources, but a specific figure or niche keyword buried in a page body never surfaces in its one-line summary, so page selection drops the page holding the answer. Add full-text search (BM25 suffices; embeddings are unnecessary) and take the **union** of index-selected pages and the top-k full-text hits. The union matters: being append-only, it cannot make recall worse than it is now.

**Visibility is a build boundary, not a label.** With multiple audiences, tagging pages with `audience` and filtering at read time leaks or forks on a single derivation bug: one mislabelled page vanishes from the planning stage, the agent "helpfully" creates a parallel copy, and that copy contradicts the original. If some knowledge must not be seen, the only real guarantee is never compiling it into that audience's bundle — build a second bundle from the publishable sources alone.
