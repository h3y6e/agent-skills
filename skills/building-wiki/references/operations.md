# Operations

What ingest, query, lint, and update mean for any bundle. A domain records only where it deviates from these, in its `AGENTS.md`.

## Ingest

1. Pick the target. Grep the index for related passages and their sources.
2. Read the relevant source material — the `raw/` sections, or fetch the sources not mirrored there.
3. **Discuss the takeaways with the user.** Skipping this turns the base into a black box that rewrites notes behind their back.
4. Write the summary page, update `README.md`, and update related existing pages across the wiki.
5. Append one line to `log.md`.

One source can touch 10–15 pages. Default to one source at a time with the user involved; batch low-supervision runs only deliberately. When the material arrives in bulk (a whole archive at once), parsing everything up front exhausts the context — ask first for structure discovery and scaffolding only, then ingest topic by topic.

## Query

1. Descend `README.md` → related pages → their `README.md` → the sources behind them.
2. Cite sources in every answer.
3. **Good answers belong back in the wiki.** A requested comparison, a discovered connection, a re-organized understanding is worth keeping rather than losing to chat history — that is how exploration compounds too.
4. Ask before adding: "should this become a page?"

## Lint

Cover both sides. The mechanical half takes no configuration, because the bundle is its own specification:

```bash
.agents/skills/building-wiki/scripts/lint.mjs <bundle-dir> [--fix]
```

It infers each type's field convention and the prevailing frontmatter key order from the pages that exist, then reports what deviates — a field the rest of that type carries, a key only one page has — alongside what is decidable outright: absolute timestamps, expired `stale_after`, footnote labels resolving to a `sources[].id`, link targets, open page-name reservations, `log.md` heading format. `--fix` reorders frontmatter keys to the prevailing order, moving each key's lines verbatim. Inference keeps the schema the one place the convention is stated; a rule it cannot infer belongs in the repository's own check beside it. Everything below is what no script can decide.

**Internal consistency** (wiki only): contradictions between pages; old claims overturned by newer sources; orphan pages with no inbound links and missing reciprocal links; important concepts mentioned but page-less; open questions left unresolved; one-sided metadata that should exist on both ends (group membership, for instance).

**Fidelity to sources**: inspect with the intent of finding errors, and treat the source as truth when fixing. Against `raw/` this is a diff; against an unmirrored source it means re-fetching, so the check is only as reliable as the source's own stability — a page whose source has moved or vanished is a finding, not a pass. The domain's named failure modes tell the linter where to look hardest.

## Update

1. Note the pre-sync pointer.
2. Update `raw/`. Without one, re-read the source and compare against what the wiki already claims — the pages are the only prior state there is.
3. **Show the diff** — summarize what arrived. This is what ingest and summarize work from next; syncing without it halves the point.
4. Record it in `log.md`.

## Others

Add per domain — a `Summarise` for recurring material, a `Families` that bundles related concepts (details stay on the individual pages; the bundling page links rather than copies, to avoid double maintenance).
