---
source: skills/designing-with-artifacts/SKILL.md
name: designing-with-artifacts
description: '実装前に、既存 code、issue、spec、ADR、README/CONTRIBUTING、または project instructions に照らして plan/design を stress-test、sanity-check、または選択するときに使う。'
---


# Artifacts を使った設計

これは artifact-aware な設計会話である。project-specific glossary file を必須にせず、documentation と code に照らして plan を厳しく検討する有用な部分を残す。

## 最初に読む

関連する source だけを読む:

- `README.md`、`CONTRIBUTING.md`
- 存在する場合は `docs/adr/`
- 存在する場合は `docs/specs/` または `specs/`
- linked GitHub または Linear issues
- 現在の design question に答えられる code

## 境界

problem が不明確な場合は、先に `framing-problems` を使う。module boundary、interface、testability が主な論点の場合は `reviewing-architecture` を使う。

## 会話ルール

- 一度に 1 つの質問をする。
- 各質問には、推奨回答がある場合それを含める。
- code や docs で答えられる質問は、質問するのではなく調べる。
- evidence なしに方向性を推奨しない。evidence が足りない場合は、質問する、調査する、または小さな prototype を提案する。
- あいまい、または多義的な言葉に challenge する。
- 具体的な scenario を使って boundary と edge case を test する。
- user description、既存 docs、code の矛盾を表に出す。
- 主要な challenge それぞれについて、それを支える artifact または code observation を cite する。
- 本当の trade-off がある場合は 2-3 個の plausible alternatives を比較し、却下した option がなぜ負けるかを明示する。
- product decision、technical decision、implementation detail を分ける。

## 手順

1. stress-test する design question を述べる。
2. その question に必要な artifact だけを調べる。
3. 2-3 個の具体的 scenario に照らして design を test する: happy path、edge case、failure または rollback。
4. impact を分類する: product behavior、data/API contract、technical design、implementation detail、または artifact update。
5. 最小の blocking question を聞く。evidence が十分なら recommended decision を述べる。
6. decision、open question、next artifact が明確になったら止める。

## ADR の discipline

以下がすべて true の場合だけ ADR を提案する:

1. その decision を戻すのが難しい、または高コストである。
2. 将来の読者が context なしでは意外に感じる。
3. plausible alternatives の間に実際の trade-off があった。

条件が 1 つでも欠ける場合は、decision を spec、issue、task note、または final summary に留める。

## 出力

最後はこの形にする:

```markdown
## 決定
- <決定と理由>

## 未解決の質問
- <質問、owner、blocking かどうかとその理由>

## 代替案
- <検討した option、trade-off、採用/却下の理由>

## 影響
- <product behavior、technical design、implementation、artifact の何が変わるか>

## リスク
- <risk または trade-off>

## 根拠
- <artifact path、issue、ADR、または code observation>

## 次の artifact
<issue | spec | ADR | research | prototype | implementation | no action>
```
