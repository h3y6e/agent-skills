# Schema

`AGENTS.md` holds the one thing this skill cannot: the domain. Restating the layers, the page format, or the operations is worse than redundant. The schema loads on every task, which makes copying them in feel free — but an always-loaded file is read under a standing instruction to skip whatever looks irrelevant, so each restated paragraph lowers the odds that the precedence rules and the named failure modes beside it are read at all. Keep it short so the parts only it can carry survive. The copy drifts from the original too.

## Checklist

- [ ] **A pointer to this skill in the opening paragraph** — where it is installed, and that ingest, query, and lint read the format and the operations from there. This is the item that decides whether the skill is ever opened again: an agent that starts a session with only `AGENTS.md` in context and no instruction to look further will invent a format instead.
- [ ] The sources, and which of them are mirrored into `raw/` versus reachable only through `sources[].resource`.
- [ ] **Source precedence** — which source wins when two disagree, per kind of claim. For example: "history, points of contention, and attribution of statements come from the meeting notes; current status and owner come from the registry. The registry is a snapshot with no history; the notes carry history but settle the present poorly. Fill neither field from one side alone."
- [ ] What a subdirectory means in this domain, if anything. The layout itself is `page-format.md`'s; redrawing it as a tree here restates the skill and then drifts from it.
- [ ] The internal profile — permitted `type` values and the fields each one requires. See below.
- [ ] Link convention, chosen after deciding which tool the wiki is read in.
- [ ] **A pointer to the bundle's CONTEXT section for terminology**, read before writing or reviewing a page. The schema names where the vocabulary is; a copy of the terms here is the copy that drifts.
- [ ] Language convention (if mixing languages: which language the prose is in, and what stays in the original — proper nouns, API names).
- [ ] Where this domain's operations deviate from the definitions in `operations.md` — nothing, if they don't.
- [ ] **Named failure modes for this domain.** For example: "do not settle an owner from the roster alone, confirm it inside the document itself"; "abbreviations are sometimes reassigned each year"; "add abbreviations that collide with ordinary words to the exclusion list."

## Internal profile

OKF conformance is deliberately near-trivial, so "conformant" guarantees nothing about quality. The spec defines an interoperability surface, not a design discipline. The profile layered on top is the actual defence:

- The permitted set of `type` values, as a bare list of names in backticks and nothing else — that list is also how the linter separates a declared type with one page so far from a typo. What a type means is carried by its pages; a gloss per type here is the copy that drifts.
- Extra fields required per `type` — for example `generated` and `status` on every concept, `verified` on anything carrying numbers. A field required only under a condition is invisible to convention inference: the linter sees `verified` on one page in seven and reports the compliant page as the outlier. Make the condition its own `type` instead of writing the expected noise down.
- Validation of **this profile**, not of format conformance.
- Rules for assigning `stale_after` per `type` — including which types omit it because they describe a fixed past and cannot go stale — and what happens to expired concepts.
