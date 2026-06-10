---
name: adapting-skills
description: 指定された既存の agent skill を評価、採用、吸収、または適応し、skill の乱立を避けながらローカルワークフローに合う skill セットへ取り込むときに使う。
license: MIT
metadata:
  author: h3y6e
  version: 2026.6.1
---

# Skills の適応

指定された移行元 skill を、より小さく、ローカルワークフローに合う skill セットへ適応する。デフォルトでは skill 数を減らす。

**必須サブスキル:** `SKILL.md` を作成または編集する前に `authoring-skills` を使う。この skill は採用、適応、吸収、却下を選ぶ。`authoring-skills` は草稿作成、RED シナリオ、description 品質、検証 evidence を扱う。外部候補には `references/adoption-rubric.md` を使う。

## 入力

必要な入力だけを読む:

- 移行元 skill: ローカルパス、インストール済み skill、URL、または貼り付けられたテキスト
- 対象ワークフローの制約と既存の project instructions
- すでに採用済みの skill と repo-local skill
- 名前付きの検証期待値

## 判断

各移行元 skill を分類する:

| 判断 | 使う条件 |
| --- | --- |
| `adopt as-is` | 単独で成立し、互換性があり、対象ワークフローと衝突しない。 |
| `adapt` | 中核となるワークフローには価値があるが、移行元の慣習、tool 構文、または scope を変える必要がある。 |
| `absorb` | 小さな考え方だけが有用で、新しい skill を作るのではなく既存 skill に追加する。 |
| `reject` | 重複している、一回限りである、広すぎる、tool 固有すぎる、または context cost に見合わない。 |

`adapt` より `adopt as-is` または `absorb` を優先する。単独で繰り返し価値がある場合だけ新しい skill を作る。

## 適応ルール

- 移行元 skill の有用なふるまいを保つ。偶発的な命名、ディレクトリ構成、tool 前提は保たない。
- 対象ワークフローがすでに使っている場合を除き、setup workflow、private conventions、lifecycle state machine を削る。
- 競合する skill を残すのではなく、重なっている trigger を統合する。
- 実用上可能なら、生成される `SKILL.md` は 500 words 未満に保つ。
- Description は workflow の要約ではなく、その skill をいつ使うかを述べる。
- ふるまいを変える skill には、output contract、stop condition、validation scenario を追加する。
- fresh evaluator が実際に scenario を実行していない限り、empirical validation を主張しない。

## 手順

1. 移行元 skill を読み、それが守っている再利用可能なふるまいを特定する。
2. すでに採用済みの skill と repo-local skill と比較する。
3. 編集前に decision table を作る。
4. 最小の変更を適用する: adopt、absorb、adapt、reject。
5. 残る skill についてだけ README や catalog を更新する。
6. 検証状態を記録する: `untested`、`structurally reviewed`、または `scenario-tested`。

## 出力

```markdown
## 判断表
| 移行元 skill | 判断 | 理由 | 反映先 |
| --- | --- | --- | --- |

## 変更
- <skill または file>: <何を、なぜ変えたか>

## 却下
- <移行元 skill>: <理由>

## 採用 evidence
- 移行元 snapshot:
- 確認した rubric 軸:
- 重複/互換性 evidence:
- License/provenance:

## 検証
- 構造 check:
- scenario の状態:
- empirical の状態:
```

## よくある誤り

- 1 段落だけ吸収すればよいのに、skill 全体を fork する。
- 元の skill に含まれていたという理由で、移行元固有の setup を残す。
- description を重複させる router skill を作る。
- static review だけで skill が検証済みだと言う。
