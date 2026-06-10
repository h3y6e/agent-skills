---
source: skills/tracking-tasks/SKILL.md
source_sha256: 387fdf8b7b27d35bca9f7c9b3c659fc60cd811cb53de855dd7609f56921c0ba5
name: tracking-tasks
description: 'multi-step work の開始、既存 task の再開、task 途中の方向転換、wrap-up、または Obsidian で cross-session task context を記録するときに使う。'
compatibility: 'CLI が有効な Obsidian と vault "log" が必要。'
---


# タスク追跡

## Vault

`~/ghq/github.com/h3y6e/log`。存在しない場合は `ghq get log`。

## Task note

Path: `task/YYYY-MM-DD-<slug>.md`。Frontmatter: `title`、`status` (`backlog`→`todo`→`in-progress`→`done`/`canceled`)。Sections: Goal、DoD (checklist)、Research、Notes。

- context から slug と title を推測する。質問しない。
- session start 時は、`obsidian search:context` または log vault 配下の direct `rg` で検索し、その file を直接読む。
- substantial work の前に Goal と DoD を埋め、その後 status を `in-progress` にする。
- note は source of truth である。initial plan、各 work batch、direction change、final response 前に sync する。
- claim の前に evidence。verification が記録されるまで done にしない。

## Graph

Obsidian graph が役に立つように `[[wikilinks]]` を使う。note を孤立した log として扱わない。

- concrete context を link する: active project/repo、related task notes、daily notes、issues/PRs、ADRs/specs。
- task を再開するときは、広く検索する前に linked notes/backlinks を確認する。新しい抽象 concept node より既存 page を優先する。
- cross-cutting finding を daily note に記録するときも、active task と relevant project/source page を link する。

## Daily note

trigger は **session-wide**。task note がなくても、single-response task でも対象。発見した時点で書き、最後に batch しない。

Path: `obsidian daily:path vault=log` → `daily/YYYY-MM-DD.md`。CLI が失敗した場合は `~/ghq/github.com/h3y6e/log/daily/YYYY-MM-DD.md`。

**Triggers**: TIL、workaround、cross-cutting decision、env/tooling issue、useful link、recurring pattern。

finding が task-relevant かつ cross-cutting の場合は、task impact を task note に、より広い concern を daily note に別々に記録する。

## Obsidian CLI

CLI は不安定。command が error になった場合は、**すぐに direct file editing に fallback** する。retry や debug をしない。backticks や shell-sensitive content には `obsidian append` より direct editing を優先する。

## 手順

1. `obsidian daily:path vault=log` → 今日の日付を得る (`date` command ではなくこれを使う)
2. 既存 task を検索する。なければ `obsidian create vault=log path="task/YYYY-MM-DD-slug.md" template=task`
3. 直接編集する: Goal、DoD、Research、Notes
4. `[[wikilinks]]` を追加または更新し、graph/backlinks が task と関連 work をつなぐようにする
5. `obsidian property:set vault=log path="task/..." name=status value=in-progress`
6. 各 batch 後、finding/decision/verification を Notes に更新する
7. `obsidian task vault=log path="task/..." line=N toggle`
8. final sync checkpoint
9. `obsidian property:set vault=log path="task/..." name=status value=done`
