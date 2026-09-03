# Page Format

Markdown, YAML frontmatter, and git are the whole substrate. Before inventing a layout, put the bundle on [OKF](https://github.com/GoogleCloudPlatform/open-knowledge-format) so it stays portable.

## Layout

The bundle is `docs/` in the repository the knowledge is about. The schema is a section of that repository's root `AGENTS.md`, the one file every agent loads before touching a page.

```text
repo/
  AGENTS.md             # project instructions, with the domain schema as a section
  docs/                 # the bundle
    README.md           # optional directory listing, for progressive disclosure
    log.md              # optional chronological update history
    raw/                # immutable mirror of the sources that can be committed
    <subdir>/           # one group of pages, typically one type
      README.md
      <concept>.md      # one concept per file
```

- **`raw/` is read by agents and never written**, and holds only the sources that can be committed. Credentials, confidential material under a retention policy, and licensed text cannot be. For those the wiki holds every claim's `sources[].resource` URI as the only handle on its origin, and fidelity checks re-fetch instead of diffing against a local copy — a source that later disappears takes its verifiability with it, so decide per source which risk to take. A bundle can be mixed; the schema records which sources are mirrored.
- **One concept, one file.** The path from the bundle root, minus `.md`, is that concept's id — independent of where the bundle sits in the repository.
- **`README.md`, `log.md`, and `raw/` are the only reserved names.** The listing is `README.md` rather than `index.md` because GitHub renders it under the directory view, where `index.md` is just another file. Date headings in `log.md` are `## YYYY-MM-DD`, so `grep '^## ' log.md | head -5` returns the latest entries.
- **Links are ordinary markdown links.** `[[wikilinks]]` resolve only in the editors that implement them, so choose them only when every viewer in play does. Relative paths resolve everywhere; absolute paths survive file moves but only where the viewer resolves `/` against a known root (commonly the repository root, so `/docs/reference/apple.md`). Confirm the choice against the actual viewer before the first ingest. The resulting graph carries far more than the directory tree does.
- **Broken links are legal.** A link to a page that does not exist marks knowledge not yet written, and it is the only record of who wanted it. A bare list of planned names in `README.md` carries the intent without the demand, so no page ever contradicts it and it ages quietly — link from the page that needs the concept instead. The `status: planned` reservations in `scale.md` are for concurrent ingest, not for a backlog.

## Frontmatter

`type` is the only required key; `title`, `description`, `resource`, and `tags` are recommended. There is no central registry of `type` values — the domain profile defines them.

```yaml
---
type: Meeting Summary
title: 2026-05 plenary day 1
description: One-line summary, used for index generation and search snippets
resource: https://...          # canonical URI of the thing described, if it exists
tags: [meeting, 2026]
---
```

## Trust, freshness, provenance

Optional in the format, mandatory once generation is automated — otherwise nobody can answer who wrote a claim, who checked it, and when it goes stale.

```yaml
generated: { by: agent-name/model-id, at: 2026-06-20T22:53:05Z }
verified:  { by: human:h3y6e, at: 2026-06-25T09:00:00Z }
status: stable                 # draft | stable | deprecated (default stable)
stale_after: 2026-12-31T00:00:00Z
sources:
  - id: policy-doc
    resource: https://wiki.example/policy
    title: Source document
    author: team:platform
    last_modified: 2026-04-02T00:00:00Z
```

- `generated` records **who wrote it**, `verified` **who checked it**. Keep them separate: content changes without re-verification, and re-verification happens without regeneration.
- Prefix anything human-written or human-checked with `human:`. Trust judgements key off that prefix.
- Attach a source to an individual claim with a markdown footnote labelled by `sources[].id`:

```markdown
This table is sharded daily.[^policy-doc]

[^policy-doc]: Source document
```

## Rewrite-safe design

Agents rewrite these files constantly, so distinguish identity that survives a rewrite from references that break in one.

- **Bind by id, not position.** `sources[0]` misattributes silently the moment the list is reordered. The same reasoning picks section headings over line numbers and slugs over array indexes.
- **Store signals, not verdicts.** Record objective facts — who wrote it, when the source last changed, how often it is cited — and leave the judgement to the reader. A model-scored confidence number is subjective, unportable between readers, and goes stale. For the same reason, `status` and trust fields are advisory signals, never access control; permissions do not belong here.
- **Use absolute timestamps.** `stale_after: 2026-12-31T00:00:00Z` makes staleness a plain comparison. A relative TTL has to be composed with a generation time, and agents get that wrong.
- **Never copy a moving value.** Documents describe the shape of a contract, not its current value. Anything that moves — last-synced SHA, HEAD, line counts, item counts, last audit date — lives in frontmatter or the real data and is read at run time. A quoted value creates a second home for it that decays silently while readers trust the copy.
  - A credential is the limiting case: name the key in the secret store, never the value. The page documenting a working configuration is exactly where one gets pasted, because the example does not work without it.
  - Write non-moving values (absolute paths, hostnames, branch names) out in full; vague paths invite wrong guesses.
  - Historical claims are exempt: "the revision at the time was `ec0bf80`" is a statement about the past.
  - When unsure, quote the exact value only if a downstream consumer depends on it and can be named in the same sentence. An unnameable citation is a copy nobody watches.
  - Counts are values: write "these rules", not "these five rules". The sixth breaks it — not because updating is hard, but because remembering to is.
  - Date literals embedded in executing code are the worst case: they compute confidently wrong answers and never raise an error.

## Protecting human corrections

When a human fixes a page, the next ingest of a related source regenerates it and silently reverts the fix. Record the **intent**, not the diff, in a human-owned file kept beside the bundle rather than inside it:

```yaml
# pins.yaml
- page: concepts/threshold
  kind: correction              # correction | addition | deletion
  claim: The threshold applies per shipment, not per account
  anchor: "## Registration threshold"   # a section, not a line number
  provenance: human
  status: active
```

Reconcile every pin against the new body on each regeneration: still satisfied → leave it; contradicted by a newer source → raise it to a human rather than dropping it; section gone → flag it as orphaned. Storing the claim rather than the diff is what lets a pin reapply after the wording changes, and it keeps a retired source from erasing a human's addition.
