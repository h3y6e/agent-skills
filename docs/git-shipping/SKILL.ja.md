---
source: skills/git-shipping/SKILL.md
name: git-shipping
description: 'Git リポジトリでコード変更を行うとき、ブランチを切り替えるとき、または `push`、`commit`、`pr`、ブランチ管理を依頼されたときに使う。実装を始める前に、正しいブランチにいることを確認する。'
compatibility: 'git、gh、cxg、git-wt が必要。生の git worktree は使わない。'
---

# Git shipping

すべてのコード変更は、ブランチ → commit → push → PR の流れを通す。このスキルは、それぞれの手順をプロジェクトの慣習に沿わせる。

## 意図の展開

短い Git 依頼は、単一コマンドの実行依頼ではなく、作業手順全体の省略表現として扱う。

| ユーザーの依頼 | 意味 |
|-----------|---------------|
| `commit` | リポジトリの状態を確認し、まとまりごとに stage し、適切なメッセージで commit する |
| `push` | リポジトリを確認し、必要ならまとまった commit を作り、その後 push する |
| `pr` | リポジトリを確認し、必要ならデフォルトブランチから移動し、commit、push、PR 作成まで行う |

意図した変更範囲が不明確で、無関係な作業を含めてしまいそうな場合だけ質問する。

## 言語ルール

`gh repo view --json visibility -q '.visibility'` でリポジトリの公開範囲を確認する。

- **PUBLIC**: commit message、PR title、PR body は英語で書く。
- **PRIVATE / INTERNAL**: ユーザーが現在使っている言語で書く。

## ブランチ

新しい作業はデフォルトブランチ上で直接始めず、変更のない feature branch の worktree で始める。
worktree を作るときは、フラグを選ぶ前に `git wt -h` を確認し、`git wt` を使う。
生の `git worktree` は呼ばない。

すでに始まっている作業を、この手順を満たすためだけに新しい worktree へ移動しない。現在の checkout でファイルがすでに編集中なら、そこで作業を続け、安全な場合にその場で適切なブランチを作成または切り替える。

## コミット

**必須サブスキル:** commit message の形式には `cxg` スキルを使う。

## プルリクエスト

- リポジトリに該当する PR template がある場合は、それを優先して使う。
- 該当する template がない場合は、次の節だけをこの順序で使う: `## Summary`、`## Background`、`## Changes`、必要な場合のみ `## Impact`。
- `## Impact` は、PR を merge することで変わるふるまいにだけ使う。ふるまいの変更がない場合は省略する。変わらないこと、非目標、実施していない作業を列挙しない。
- その場限りの `Testing`、`Verification`、`Checklist`、`Related issues`、`Screenshots` 節を追加しない。手元で実行した検証コマンドをすべて PR body に貼り付けない。
- 新規 PR は既定で draft にする (`gh pr create --draft`)。依頼がない限り、既存 PR の draft/ready 状態は変えない。

## よくある誤り

| 誤り | 修正 |
|---------|-----|
| 新しい作業をデフォルトブランチ上で直接始める | 先に変更のない feature branch の worktree を作る |
| 手順を満たすためだけに、すでに始まっている作業を移動する | 現在の checkout で作業を続け、安全な場合にその場でブランチを切る。変更を移す前に質問する |
| 変更済みファイルや未追跡ファイルを、既定で新しい worktree にコピーする | 変更のない worktree を作る。進行中の変更は明示依頼がある場合だけ移す |
| `push` / `commit` を単一の Git コマンドとして扱う | 上記の意図の展開に従う |
| 生の `git worktree` を使う | `git wt` を使う。フラグを選ぶ前に `git wt -h` を実行する |
| `cxg lint` を省略する | commit 前に必ず `cxg lint` を通す |
