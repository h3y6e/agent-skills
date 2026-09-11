# Bootstrapping

Run unattended, every answer the user would have given becomes an assumption: report the list.

1. **Interview.** Which sources, who reads, and which questions the wiki must answer. Classify each source as mirrored into `raw/` or reachable only by URI.
2. **Lay out the bundle** per [`page-format.md`](page-format.md) and render it with GitHub Pages per [`github-pages.md`](github-pages.md), unless the user names another viewer. Done when `docs/README.md` opens with a CONTEXT section, empty until a term earns an entry, and every mirrored source sits under `docs/raw/`.
3. **Write the schema** per [`schema.md`](schema.md).
4. **Pilot** with one or two sources per [`operations.md`](operations.md), reviewing the resulting diffs rather than the plans. Done when lint reports zero errors and the user recognizes the domain the wiki describes. Page count is an outcome, not a target.
