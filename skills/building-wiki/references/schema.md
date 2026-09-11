# Schema

`AGENTS.md` loads on every task, so it carries only what this skill cannot: the domain. Write it as one `<important if>` block conditioned on the wiki directory, one line per bullet. A first schema is exactly this:

```markdown
<important if="you are reading or writing anything under `docs/`">
- `docs/` is a wiki; use the building-wiki skill.
- Page types: `Index`, `Concept`, `Meeting Summary`.
</important>
```

Add a line only for a mistake that keeps recurring; fix a one-off in the page. Delete a line that has stopped preventing anything.

Not in the schema: the source list (`raw/`, `sources[].resource`, and `log.md` already carry it), the repository's own code and pull requests (downstream of the wiki, never a source), and any convention the pages already show — link style, prose language — which the linter infers.
