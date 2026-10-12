---
description: Apply when tempted to ask 'should I do X?' on reversible work.
disable-model-invocation: true
metadata:
    github-path: pstack/skills/principle-never-block-on-the-human
    github-ref: refs/heads/main
    github-repo: https://github.com/cursor/plugins
    github-tree-sha: d2578043c77706411c48c5b7cfe03dc3d45e3b15
name: principle-never-block-on-the-human
---
# Never Block on the Human

The human supervises asynchronously. Agents must stay unblocked. Make reasonable decisions, proceed, and let the human course-correct after the fact. Since code changes are reversible and reviewable, a wrong decision usually costs less than blocking.

- Proceed, then present. Do the work, show the result. Don't ask "should I do X?" Do X, explain why.
- Make the system self-healing. When you notice a problem, log it and fix it in the next round.
- Irreversible actions (force-push, delete production data, send external messages) still require confirmation.
- Reversible actions (write code, edit notes, split tasks) should proceed without blocking.
- Product direction comes from the human. Execution should not block.
