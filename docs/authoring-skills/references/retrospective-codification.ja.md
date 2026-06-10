---
source: skills/authoring-skills/references/retrospective-codification.md
---

# Retrospective の codification

task が trial and error を通じて再利用可能な教訓を生んだとき、または user が教訓の codify を依頼したときに使う。すべての task 後に自動実行しない。

## 中核ルール

対になった教訓だけを codify する:

- first failure: 最初に試したことと、その失敗の仕方
- final solution: うまくいったこと
- bridging insight: 最初に知っておくべきだったこと

insight は session history ではなく、future-facing instruction として書く。

## ループ

1. **Extract**: first failure、final solution、bridging insight、命令形の future instruction を 1 つ記録する。
2. **Dedup**: insight から 2-3 個の key を使い、既存 skill、project instructions、rules を検索する。完全に cover されている場合は proposal を作らない。部分的に cover されている場合は、新しい skill を追加せず append/update する。
3. **Classify destination**:
   - mechanically detectable -> prose ではなく lint/static rule
   - short always-on instruction -> project または user agent instruction
   - multi-step procedure、judgment、template -> 既存 skill に append、または skill を作成
   - one-off または project-specific detail -> note、issue、PR、または no adoption
4. **Prefer smallest durable form**: detectable case では prose より lint。new skill より append/absorb。new skill は standalone recurring value がある場合だけ。
5. **Write only requested scope**: user の explicit request 外で persistent agent behavior を変える場合は、proposal を提示して待つ。

## 出力

```markdown
## 振り返り
- 最初の failure:
- 最終 solution:
- insight:

## 提案
- 採用 candidate:
- 検出した duplicate:
- 採用しないもの:

## 検証
- 反映先の rationale:
- dedup evidence:
- 書き込み approval または explicit request:
```

## 注意信号

- failure 側のない final solution
- "念のため" の skill
- mechanically enforceable rule を prose だけで書く
- dedup check を skip する
- silent persistent behavior change
- 体裁を保つためだけの薄い insight
