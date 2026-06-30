---
description: Use when the user provides an arbitrary line of text and you must echo it back verbatim, prefixed with "ECHO:".
metadata:
    github-path: tools/waxa/examples/echo-skill/skills/echo-skill
    github-ref: refs/tags/waxa-v0.1.1
    github-repo: https://github.com/mizchi/skills
    github-tree-sha: 6ebac3ef5968bc6e4ad88b7dfae6f072a602a80f
name: echo-skill
---
# echo-skill

When invoked, return the user's input verbatim with the literal prefix
`ECHO: ` and nothing else. Do not add commentary, formatting, or
clarification.

## Examples

| Input | Output |
|---|---|
| `hello world` | `ECHO: hello world` |
| `1 + 1` | `ECHO: 1 + 1` |
| `(empty)` | `ECHO: ` |
