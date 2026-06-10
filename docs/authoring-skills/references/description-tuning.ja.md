---
source: skills/authoring-skills/references/description-tuning.md
---

# Description の調整

skill が trigger されにくい、trigger されすぎる、または user が trigger accuracy の tuning を依頼したときに使う。すべての edit 後に自動実行しない。

## 中核ルール

`description` は trigger contract である。狭すぎる、広すぎる、または user の situation ではなく workflow を説明していると、silent failure が起きる。

## 分類

rewrite の前に track を選ぶ:

| Track | 用途 | 形 |
| --- | --- | --- |
| Meta | skill authoring、selection、evaluation、retrospective、setup | `Use ONLY when...` または `Invoke ONLY when...`。near-miss として `Do NOT auto-invoke...` を含める。 |
| Project | user が proactive trigger を期待する domain/task skill | `Use when...`。symptom、file name、command、error、tool を含め、適切な場合は "even if the tool/domain is not named" を含める。 |

## Checklist

- 最初の clause が trigger を述べている。
- wording は implementation focus ではなく user-intent focus である。
- description が workflow を要約していない。
- concrete surface keyword が含まれている: symptom、file shape、command、error、tool。
- over-triggering が起きやすい場合は near-miss case を名指ししている。
- frontmatter は 1024 chars 未満を保つ。description は 500 chars 未満を優先する。
- body と description が一致している。

## Trigger 評価

重要な description change では、現実的な query を約 20 個定義する:

- 8-10 個は、言い回しが異なり implicit need を含む should-trigger query。
- 8-10 個は should-not-trigger query。多くは keyword を共有するが別 skill を必要とする near-miss。
- 明らかに無関係な negative query は避ける。
- iteration する場合は train/validation に分ける。train score ではなく validation performance で選ぶ。

miss を記録し、1 iteration につき 1 theme を更新する。body/description mismatch が原因でない限り、description-only tuning と body rewrite を混ぜない。
