# Raw

`raw/` holds byte-for-byte copies of the sources, so every claim stays checkable against what it was read from. Pages cite `sources[].resource`, never a mirror path; the path rule below makes one derivable from the other.

## Path

A mirror's path is `raw/<host>/<path>`, with host and path taken from the source URI as they are; query and fragment are dropped.

- A path ending in `/` or empty ends in `index`.
- A path without an extension takes the one of the format fetched: `.html`, `.md`, `.json`, `.pdf`.
- `https://github.com/acme/api/blob/main/docs/auth.md` → `raw/github.com/acme/api/blob/main/docs/auth.md`.
- A source with no URI — a file handed over, a paste with no permalink — gets a path the human picks, and `sources[].resource` names that path.

## Content

- **The original, unedited.** Refreshing overwrites the file.
- **HTML and PDF get a `.txt` rendition beside them** under the same name; ingest reads the text and settles doubts against the original.
- **Pasted material opens with one provenance line** — who pasted it, from where, and the URI when one exists.

## Commit

A mirror clears when everyone who can read the repository can already read the source, its license permits redistribution, and it holds no credential or personal data. The user decides clearance per host or repository.

`docs/.gitignore` is an allowlist: ignore `raw/*`, then re-include each cleared host. Git cannot re-include a file inside an ignored directory, so where visibility differs by owner or repository, re-open each level as below. A comment above each group states why it cleared; an exclusion inside a cleared directory follows it with its reason.

```gitignore
raw/*

# Public documentation
!raw/docs.example.com/

# Repositories readable by every member of the organization
!raw/github.com/
raw/github.com/*
!raw/github.com/acme/
raw/github.com/acme/*
!raw/github.com/acme/handbook/

# Contains a webhook secret
raw/github.com/acme/handbook/blob/main/ops.md
```

An ignored mirror is still read like any other.
