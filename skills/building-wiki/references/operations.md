# Operations

Read the repository's `AGENTS.md` first. Pages follow [`page-format.md`](page-format.md). Cite every claim by page or source. Every operation ends with one line in `log.md`.

## Ingest

One source at a time. Grep the index for related pages and read the source — from `raw/` where it is mirrored, otherwise fetched.

State the takeaways to the user before writing. Then write the pages the takeaways need — an entity or concept worth returning to, not one per source heading. A concept referred to from one place stays a paragraph on the page that uses it.

Update the index and every existing page the source confirms or contradicts in the same change; deferring the rest plants a contradiction. Add a CONTEXT entry only when a second name for a term has actually appeared, or the source uses a term more narrowly than its general meaning.

When material arrives in bulk, ask for structure discovery first — which pages and types the archive implies — and ingest topic by topic afterwards.

## Query

Descend from the index to pages to the sources behind them, and cite in the answer.

When an answer synthesizes something the wiki does not yet say, ask "should this become a page?" and file it only on a yes.

## Lint

Run [`scripts/lint.mjs`](../scripts/lint.mjs) on the bundle directory. It infers each type's fields from the pages that exist, so a deliberate exception is answered in the schema's type list, never by editing the script.

Then walk the pages for what it cannot decide: contradictions between pages, claims overturned by a newer source, orphan pages, drift from the source. Report every finding or "none found"; the source is the truth when fixing. A finding is a defect in a page, not a demand for a new one.

## Update

For a changed source: the human refreshes its mirror in `raw/`; otherwise re-read it. Show the user what changed, record it in `log.md`, then ingest.
