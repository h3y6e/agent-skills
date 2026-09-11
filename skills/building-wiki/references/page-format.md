# Page Format

Markdown, YAML frontmatter, and git are the whole substrate. The bundle follows [OKF](https://github.com/GoogleCloudPlatform/open-knowledge-format); this file adds only what agents need to keep rewriting pages without breaking them.

## Layout

```text
repo/
  AGENTS.md             # project instructions, with the domain schema as a section
  docs/                 # the bundle
    README.md           # the index: CONTEXT vocabulary, then one line per page
    log.md              # append-only history, one line per operation under `## YYYY-MM-DD`
    raw/                # immutable mirror of the sources that can be committed
    <subdir>/           # a group of pages, typically one type; has its own README.md
      <concept>.md      # one concept per file
```

- **`raw/` is read by agents and never written.** Credentials, licensed text, and material under a retention policy stay out; for those the page's `sources[].resource` URI is the only handle on the origin.
- **One concept, one file.** The path from the bundle root, minus `.md`, is the concept's id. A concept earns a file when it is referred to from more than one place or asked about more than once.
- **`README.md`, `log.md`, and `raw/` are the only reserved names.**
- **Links are ordinary relative markdown links.** A link to a page that does not exist is legal and is not by itself a reason to write the page.

## CONTEXT

The bundle root `README.md` opens with a `## CONTEXT` section. It is not a glossary: an entry exists only for a term that has already been written under two names, or that means something narrower here than in general use. Product names, terms a source defines, and words with one plausible name earn no entry; an empty section is a valid state.

```markdown
**Report bucket**:
The bucket the vendor provisions per contracting entity, and exports every report into.
_Avoid_: GCS bucket (too generic), export bucket
```

An entry with nothing to avoid does not belong here.

## Frontmatter

`type` is the only required key, on every page including each `README.md` (`Index` is the conventional value). `title`, `description`, `resource`, `tags`, `generated`, and `sources` are recommended. The domain's schema lists the permitted `type` values.

```yaml
---
type: Meeting Summary
title: 2026-05 plenary day 1
description: One-line summary, used for the index and search snippets
resource: https://...          # canonical URI of the thing described, if it exists
tags: [billing, 2026]          # never restate `type`
generated: { by: agent-name/model-id, at: 2026-06-20T22:53:05Z }
sources:
  - id: policy-doc
    resource: https://wiki.example/policy
    title: Source document
    last_modified: 2026-04-02T00:00:00Z
---
```

Attach a source to a claim with a footnote labelled by `sources[].id`: `This table is sharded daily.[^policy-doc]`.

## Rewrite safety

- **Bind by id, not position.** `sources[0]` misattributes silently once the list is reordered; likewise section headings over line numbers.
- **Never copy a moving value.** A page describes the shape of a contract, not its current value. Anything that moves — a SHA, a count, a date — lives in frontmatter or in the real data and is read at run time. Quote an exact value only when a named downstream consumer depends on it. A credential is the limiting case: name the key in the secret store, never the value. Historical claims ("the revision at the time was `ec0bf80`") are exempt.
