# agent-skills

Personal [agent skills](https://agentskills.io/).

## Installation

```bash
gh skill install h3y6e/agent-skills
```

## Dependencies

- [h3y6e/cxg](https://github.com/h3y6e/cxg) — Used by `git-shipping` for commit message formatting and linting.

## Japanese docs

Installable skills under `skills/` stay English-only. Japanese human-facing copies live under `docs/<skill>/SKILL.ja.md` and `docs/<skill>/references/*.ja.md`.

Run `bash scripts/check-ja-docs.sh` to verify that Japanese docs still match their source files.

## Related

- [h3y6e/spec-skills](https://github.com/h3y6e/spec-skills) — Spec-driven development skills.
- [h3y6e/dotfiles](https://github.com/h3y6e/dotfiles/tree/main/dot_agents/exact_skills) — Agent skills managed via dotfiles with chezmoi.
