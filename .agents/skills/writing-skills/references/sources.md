# Sources

Where each rule in `SKILL.md` comes from. Before changing or deleting a rule, reread its source here; before adding one, add its source. Quotes are verbatim apart from ASCII quote marks; retrieved 2026-10-16.

## Sources

| Id | Kind | URL |
|---|---|---|
| spec | official | <https://agentskills.io/specification> |
| as-best | official | <https://agentskills.io/skill-creation/best-practices> |
| as-eval | official | <https://agentskills.io/skill-creation/evaluating-skills> |
| as-desc | official | <https://agentskills.io/skill-creation/optimizing-descriptions> |
| cc-skills | official | <https://code.claude.com/docs/en/skills> |
| codex | official | <https://learn.chatgpt.com/docs/build-skills> |
| astra | official | <https://developers.openai.com/blog/rethinking-skills-and-prompts-for-gpt-6-astra> |
| skillsbench | paper | <https://arxiv.org/abs/2602.12670> (v4) |
| regression | paper | <https://arxiv.org/abs/2607.22520> |
| reducer | paper | <https://arxiv.org/abs/2603.29919> |
| must-vs-why | measured blog | <https://dev.classmethod.jp/articles/claude-skill-must-vs-reason/> |
| pstack-eval | practitioner | `.vendor/skills/poteto-mode/playbooks/eval.md` |
| pstack-guide | practitioner | <https://github.com/cursor/plugins/blob/main/pstack/docs/guide/09-make-it-yours.md> |
| obra | practitioner | `.vendor/skills/writing-skills/SKILL.md` |

## Rules

| Rule | Source | Quote |
|---|---|---|
| Write only what the agent lacks; gotchas stay in `SKILL.md` | as-best | "Add what the agent lacks, omit what it knows"; "The highest-value content in many skills is a list of gotchas" |
| Model-authored procedure scores below no skill | skillsbench | "Self-generated Skills land below the no-Skills baseline on all three configurations" |
| Compact beats comprehensive | skillsbench | "compact and standard-length Skills (+19.0 and +21.5 pp) outperform detailed (+14.5 pp) and comprehensive documentation (+0.7 pp)" |
| Compact beats comprehensive | reducer | "Only 38.5% of skill body content is actionable core rules." |
| Three regression modes | regression | "(i) skill-description osmosis … (ii) grounding displacement … (iii) verification displacement" |
| No workflow summary in the description | obra | "Do NOT summarize the skill's process or workflow in the description." |
| Report gains and regressions separately | regression | "skill evaluations should report the paired gain and regression counts, not only the net pass rate" |
| Hooks for rules that must hold every time | cc-skills | "Claude skipped a rule that must hold every time: move the rule into a hook" |
| Key use case first in the description | cc-skills | "Put the key use case first" (listing truncates at 1,536 characters) |
| Short descriptions with concrete triggers | astra | "skill descriptions should be as short as possible while making it clear when the model should use them" |
| Over-constraint stops stronger models early | astra | "overly specific guidance can now hinder results where it previously helped" |
| References one level deep | spec | "Keep file references one level deep from SKILL.md." |
| Invoke bundled scripts through their interpreter | obra | "Invoke bundled scripts through their interpreter in the prose … never by bare path" |
| Explain why instead of stacking `MUST` | must-vs-why | fabricated cells "23 / 45 = 51%" with MUST-style rules vs "0 / 45 = 0%" with reasons |
| Explain why instead of stacking `MUST` | as-best | "explaining why can be more effective than rigid directives" |
| Pick the form by the baseline failure | obra | "Before writing guidance, classify the baseline failure." |
| Add a rule once the failure recurs | pstack-guide | "add a skill or a check when the same failure shows up twice" |
| Prove a new check fails on a real past mistake | pstack-guide | "proves each new check fails on a real past mistake" |
| Execution evals with and without the skill | as-eval | "run each test case twice: once with the skill and once without it (or with a previous version)" |
| Blind candidates; judge activation from transcripts; one judge | pstack-eval | "The candidate prompt looks like an organic user request."; "Grade chain-following from the files it really read"; "one judge scores both sets in a single pass on one scale" |
| About 20 discovery queries, near-misses, held-out split | as-desc | "Aim for about 20 queries"; "The most valuable negative test cases are near-misses"; "Avoid adding specific keywords from failed queries — that's overfitting." |
| Validator rejects unknown frontmatter fields | cc-skills | "Claude Code ignores a field it doesn't recognize without reporting an error." |
| `disable-model-invocation` needs `allow_implicit_invocation: false` | codex | "When false, Codex won't implicitly invoke the skill based on user prompt" |
| Eval cases in `<skill>/evals/`, results in `<skill-name>-workspace/` | as-eval | "Store test cases in evals/evals.json inside your skill directory"; "Organize eval results in a workspace directory alongside your skill directory." |

## Rejected

| Proposal | Reason |
|---|---|
| "Tell it to do the thing and skip the reason" (`.vendor/skills/poteto-mode/playbooks/authoring-a-skill.md`) | Unmeasured; must-vs-why and as-best measure or recommend the opposite. |
| Validator link check | rumdl MD057 already reports missing relative link targets. |
| rumdl MD061 forbidding `.vendor` in `skills/` | Misses code spans; no leak in `skills/` history. |
| Validator body word limit | Not chosen; `creating-issues` and `designing-cli` exceed 500 words and would need splitting first. |
