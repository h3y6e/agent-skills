---
description: 'Apply when context is filling up: large outputs, long files, repeated reads, fan-out planning. Route bulk to subagents; keep summaries in the main thread, not raw payloads.'
disable-model-invocation: true
metadata:
    github-path: pstack/skills/principle-guard-the-context-window
    github-ref: refs/heads/main
    github-repo: https://github.com/cursor/plugins
    github-tree-sha: bf09c18e975ded9dc137631c6529db941dda24a2
name: principle-guard-the-context-window
---
# Guard the Context Window

**Why:** Context overflow degrades reasoning quality, creates compression artifacts, and halts progress.

**Pattern:**
- **Size phases and cap scope.** Limit files per phase, set turn budgets, account for mechanism costs.
