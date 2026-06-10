---
source: skills/authoring-skills/references/empirical-validation.md
source_sha256: af13ef3dd963b30847a8ff5a3f55eed66837b525314511a6f8464de17453c957
---

# 実証的 validation

skill の重要度が高い、大きく revise した、予期しないふるまいをしている、または user が empirical evaluation を依頼したときに使う。trigger または behavior が変わっていない小さな wording edit では skip する。

## ループ

1. **Static consistency**: frontmatter `description` と body を比較する。description が body で cover していない behavior を約束している場合は、execution 前に直す。
2. **Scenario setup**: 評価前に現実的な scenario を 2-3 個定義する。median case を 1 つ、edge case を 1-2 個使う。
3. **Requirements checklist**: 各 scenario について、execution 前に 3-7 個の judged item を定義する。少なくとも 1 つの `[critical]` item を含める。result を見た後で item を追加、削除、retag しない。
4. **Baseline**: 新しい skill では no skill と比較する。既存 skill では old version を snapshot し、old と new を比較する。
5. **Fresh evaluator**: 各 round で新しい evaluator/subagent を使う。self-rereading で代用しない。dispatch が使えない場合は `empirical validation skipped` と報告するか、static structural review だけを実行する。
6. **Execution report**: evaluator は target skill を使って scenario を実行し、requirement achievement、unclear points、discretionary fill-ins、retries、phase weakness を報告する。
7. **Two-sided evaluation**: success は binary。失敗した `[critical]` item が 1 つでもあれば failure。accuracy、unclear points、discretionary fill-ins、利用可能なら optional step/duration/retry count も記録する。subjective output では、編集前に user review を集める。
8. **Minimum fix**: 編集前に、どの checklist item または judgment wording を fix が満たすべきかを述べる。1 iteration につき 1 theme を適用する。
9. **Re-evaluate**: 再び fresh evaluator を使う。new unclear point がなく、meaningful metric improvement もない round が 2 回連続したら止める。high-importance skill では 3 round を使う。

同じ failure class が 3 回以上繰り返す場合は、wording patch を止めて skill を再構成する。

trigger accuracy には `description-tuning.md` を使う。

## 評価者 prompt

```markdown
あなたは <skill name> の blank-slate evaluator です。

## 対象 skill
<path または full text>

## シナリオ
<現実的な task context>

## 要件 checklist
1. [critical] <minimum bar>
2. <通常の judged item>
3. <通常の judged item>

## タスク
target skill を使って scenario を実行し、その後次を報告してください:

- 成果物:
- Requirement achievement: 各 item について pass / fail / partial
- Trace: Understanding / Planning / Execution / Formatting。詰まった phase または skip した phase を含める
- 不明点:
  - issue:
  - cause:
  - general fix rule:
- discretionary fill-ins:
- retries:
```

## 結果記録

```markdown
## Iteration N

### 変更
- <minimum fix と、それが対象にする checklist item>

### 結果
| scenario | success | accuracy | 弱い phase | 新しい unclear point |
| --- | --- | --- | --- | --- |

### 台帳
- Added/Re-seen: <failure class> - <既存 instruction がそれを防げなかった理由>

### 次
- <次の minimum fix または stop reason>
```
