---
source: skills/tracking-tasks/SKILL.md
name: tracking-tasks
description: '複数手順の作業を始めるとき、既存タスクを再開するとき、途中で方針を変えるとき、作業を締めるとき、または Obsidian にセッションをまたぐタスク文脈を残すときに使う。'
compatibility: 'CLI が有効な Obsidian と vault "log" が必要。'
---

# タスク追跡

## Vault

`~/ghq/github.com/h3y6e/log`。存在しない場合は `ghq get log`。

## タスクノート

パス: `task/YYYY-MM-DD-<slug>.md`。フロントマター: `title`、`status` (`backlog`→`todo`→`in-progress`→`done`/`canceled`)。セクション: Goal、DoD (checklist)、Research、Notes。

- 文脈から slug と title を推測する。質問しない。
- セッション開始時は、`obsidian search:context` または log vault 配下で直接 `rg` を使って既存タスクを探し、見つかったファイルを直接読む。
- 本格的に作業する前に Goal と DoD を埋め、その後 status を `in-progress` にする。
- タスクノートを正本として扱う。初期計画、各作業単位、方針変更、最終回答の前に同期する。
- 主張の前に根拠を残す。検証結果を記録するまで done にしない。

## グラフ

Obsidian graph が役に立つように `[[wikilinks]]` を使う。ノートを孤立したログとして扱わない。

- 具体的な文脈をリンクする: 作業中のプロジェクト/リポジトリ、関連タスクノート、daily note、issue/PR、ADR/仕様。
- タスクを再開するときは、広く検索する前にリンク済みノートやバックリンクを確認する。新しい抽象的な概念ノートより既存ページを優先する。
- 横断的な気づきを daily note に記録するときも、作業中のタスクと関連するプロジェクト/情報源ページをリンクする。

## Daily note

記録の契機は **セッション全体** にかかる。task note がなくても、単発の返答でも対象になる。発見した時点で書き、最後にまとめて書かない。

パス: `obsidian daily:path vault=log` → `daily/YYYY-MM-DD.md`。CLI が失敗した場合は `~/ghq/github.com/h3y6e/log/daily/YYYY-MM-DD.md`。

**記録の契機**: TIL、回避策、横断的な判断、環境/ツールの問題、役に立つリンク、繰り返し現れる型。

気づきがタスクに関わり、かつ横断的でもある場合は、タスクへの影響をタスクノートへ、より広い関心事を daily note へ、それぞれ別に記録する。

## Obsidian CLI

CLI は不安定。コマンドがエラーになった場合は、**すぐに直接ファイル編集へ切り替える**。再試行やデバッグはしない。バッククォートや、シェル上で扱いに注意が必要な内容を扱うときは、`obsidian append` より直接編集を優先する。

## 手順

1. `obsidian daily:path vault=log` → 今日の日付を得る (`date` コマンドではなくこれを使う)
2. 既存タスクを検索する。なければ `obsidian create vault=log path="task/YYYY-MM-DD-slug.md" template=task`
3. 直接編集する: Goal、DoD、Research、Notes
4. `[[wikilinks]]` を追加または更新し、グラフ/バックリンクがタスクと関連作業をつなぐようにする
5. `obsidian property:set vault=log path="task/..." name=status value=in-progress`
6. 各作業単位の後、発見/判断/検証を Notes に追記する
7. `obsidian task vault=log path="task/..." line=N toggle`
8. 最終同期チェックポイント
9. `obsidian property:set vault=log path="task/..." name=status value=done`
