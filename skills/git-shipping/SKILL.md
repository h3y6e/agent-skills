---
name: git-shipping
description: git repo で code change を行う、branch を切り替える、または `push`、`commit`、`pr`、branch 管理を依頼されたときに使う。実装を始める前に、正しい branch 上にいることを確認する。
compatibility: git、gh、cxg、git-wt が必要。生の git worktree を使わない。
license: MIT
metadata:
  author: h3y6e
  version: 2026.6.1
---

# Git shipping

すべての code change は branch → commit → push → PR を通る。この skill は、各 step が project conventions に従うようにする。

## 意図の展開

短い git request は、文字通りの単一 command ではなく workflow の shorthand として扱う。

| ユーザーの依頼 | 意味 |
|-----------|---------------|
| `commit` | repo を確認し、coherent chunks を stage し、適切な message で commit する |
| `push` | repo を確認し、必要なら coherent commit を作り、その後 push する |
| `pr` | repo を確認し、必要なら default branch から移動し、commit、push、PR 作成を行う |

意図した change scope が不明確で、unrelated work を含めてしまう可能性がある場合だけ質問する。

## 言語ルール

`gh repo view --json visibility -q '.visibility'` で repo visibility を確認する。

- **PUBLIC**: commit message、PR title、PR body には English を使う。
- **PRIVATE / INTERNAL**: user が現在使っている言語を使う。

## ブランチ

新規 feature work は default branch 上ではなく、clean feature-branch worktree で始める。
worktree を作るときは、flag を選ぶ前に `git wt -h` を確認し、`git wt` を使う。
生の `git worktree` を呼ばない。

すでに始まっている work を、この workflow を満たすためだけに新しい worktree へ移動しない。file が現在の checkout ですでに編集中なら、そこで作業を続け、安全な場合にその場で適切な branch を作成または切り替える。

## コミット

**必須サブスキル:** commit message format には `cxg` skill を使う。

## Pull Request

- 該当する repository PR template がある場合は優先して使う。
- 該当する template がない場合は、次の section だけをこの順序で使う: `## Summary`、`## Background`、`## Changes`、任意の `## Impact`。
- `## Impact` は PR merge によって変わる behavior にだけ使う。behavior change がない場合は省略する。unchanged behavior、non-goals、未実施の作業を列挙しない。
- ad hoc な `Testing`、`Verification`、`Checklist`、`Related issues`、`Screenshots` section を追加しない。local verification command をすべて PR body に dump しない。
- 新規 PR は draft を default にする (`gh pr create --draft`)。依頼がない限り、既存 PR の draft/ready state は保つ。

## よくある誤り

| 誤り | 修正 |
|---------|-----|
| 新規 work を default branch 上で直接始める | 先に clean feature-branch worktree を作る |
| workflow を満たすためだけに、すでに始まっている work を移動する | 現在の checkout で作業を続け、安全な場合にその場で branch を切る。change を移す前に質問する |
| modified file や untracked file を default で新しい worktree へ copy する | clean worktree を作る。in-progress change は明示依頼がある場合だけ transfer する |
| `push` / `commit` を単一 git command として扱う | 上記の意図の展開に従う |
| 生の `git worktree` を使う | `git wt` を使う。flag を選ぶ前に `git wt -h` を実行する |
| `cxg lint` を skip する | commit 前に必ず `cxg lint` を通す |
