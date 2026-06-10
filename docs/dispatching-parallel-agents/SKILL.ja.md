---
source: skills/dispatching-parallel-agents/SKILL.md
name: dispatching-parallel-agents
description: 'file、state、dependencies、verification を分離でき、2 つ以上の独立した task、failure、investigation、または research question を parallel subagent に分割しても安全なときに使う。'
---


# Parallel Agents の dispatch

独立性が本物の場合にだけ subagent を dispatch する。parallelism が有効なのは、それぞれの agent が他 agent の context を必要とせず、同じ state に触れずに推論や編集を進められる場合である。

work unit がまだ定義されていない場合は、agent を dispatch する前に `slicing-issues` を使う。

## 使うとき

- 複数の failing test files が、それぞれ異なる原因を持つ可能性が高い
- 別々の subsystem が独立して壊れている
- research question を独立して回答できる
- 各 task に明確な owner と expected output がある
- agent が同じ file の編集を避けられる
- 各 task を integration 前に独立して検証できる

## 使わないとき

- 1 つの root cause がすべての failure を説明し得る
- system state を全体として理解する必要がある
- task が file、migration、generated output、または external state を共有している
- work の分解方法がまだ分かっていない
- correctness のために result の順序付けが必要である
- ある agent の answer が別 agent の task definition を変え得る

## 手順

1. work を、期待される verification を持つ独立 domain にまとめる。
2. 各 agent に 1 domain、明示的な file ownership、触れてはならない protected paths を割り当てる。
3. 各 agent に、自分だけが codebase にいるわけではなく、他者の edit を revert してはならないと伝える。
4. 各 agent に fresh で self-contained な context を渡す: goal、constraints、relevant errors、commands、expected output、verification、owned files、触れてはならない file。継承された session history に依存しない。
5. conflict の可能性を確認してから、agent を 1 回の parallel batch で実行する。
6. すべての result を読み、diff を確認し、overlap を解決する。
7. integration 後に関連する full verification を実行する。

## 独立性チェック

dispatch 前に、各 task は以下を満たしている必要がある:

- distinct files、または read-only research scope
- shared generated artifacts、migrations、global state がない
- 独立して review できる明確な result
- 別 agent の pending answer への依存がない
- その domain の完了を証明できる verification method

いずれかが失敗する場合は、parallelize せず順番に進める。

## Prompt の形

```text
タスク: <1 つの problem domain>

コンテキスト:
- relevant failure または requirement
- この agent が ownership を持つ files または modules
- constraints と触れてはならない files

ゴール:
- 完了時に true であるべきこと

返す内容:
- root cause または finding
- 実施した変更
- 実行した verification
- 証明できた requirement または task coverage
- 残る risk
```

ownership を明確に言えない場合は、まだ parallelize しない。

## 統合レポート

agent が戻ったら、以下を要約する:

```markdown
## 結果
- Agent/task: outcome と変更 file

## 競合
- overlap または contradiction と、その解決

## 検証
- integration 後に実行した command

## 残るリスク
- 確認していないこと
```
