---
source: skills/authoring-skills/SKILL.md
name: authoring-skills
description: '再利用可能な教訓を厳密な agent skill として作成、編集、検証、または体系化するときに使う。'
---


# Skills の作成

Skill 作成は process docs の TDD である: scenario、failure、`SKILL.md`、verify、refactor。skill は再利用可能な技法、pattern、tool、reference であり、session history ではない。

## 作成するか見送るか

再利用可能で、非自明で、広く使え、判断を伴う教訓、または failure/success evidence が対になっているものだけを作成または編集する。まず重複排除する。一回限りのもの、local convention、一般的な hygiene、trigger や repo instructions や tool docs から明らかに推測できる助言は見送る。強制できるルールは自動化する。

## 構造

`skill-name/SKILL.md` を使う。frontmatter には一致する `name` / `description` が必要で、1024 chars 未満に保つ。名前は lowercase letters、numbers、hyphens のみを使う。action または core insight で命名する。process skill には gerund が合う。再利用可能な tool には `scripts/`、重い reference には `references/` を使う。

## Description の書き方

Description は trigger であり、workflow ではない。`Use when...` で始める。symptom や situation を名指しする。必要な場合を除き tech-agnostic にする。first person を避ける。500 chars 未満に保つ。検索可能な keyword を含める。

## 厳密なループ

対応関係: test case = pressure/application scenario、production code = `SKILL.md`、RED = baseline violation または rationalization、GREEN = compliant use、refactor = loophole を塞ぐ。

失敗 scenario が先にない状態で、ふるまいを変える skill を deploy したり valid として扱ったりしてはならない。

1. **RED**: pressure scenario を書く。discipline skill では、time、sunk cost、authority、exhaustion を組み合わせる。baseline rationalization を記録する。
2. **GREEN**: その failure を防ぐ最小の `SKILL.md` を書く。
3. **VERIFY**: 同じ scenario を test する。できれば fresh subagent を使う。
4. **REFACTOR**: rationalization を塞ぎ、余分な text を削り、再 test する。

type 別に検証する: discipline skill には pressure compliance が必要。technique には application/variation が必要。pattern には recognition/counter-example が必要。reference には retrieval、application、gap test が必要。

References: empirical review や大きなふるまい変更には `empirical-validation.md` を使う。再利用可能な教訓には `retrospective-codification.md` を使う。trigger miss には `description-tuning.md` を使う。配置には `skill-structure.md` を使う。

## 品質ルール

- 頻繁に load される skill は非常に短く保ち、それ以外も 500 words 未満に保つ。これは上限であり目標ではない。skill はもっと短くてよい。500 words に近づけるために水増ししない。
- 非自明な guidance だけを書く: trap、judgment call、failure mode、exception。agent behavior を変えない一般的な checklist は削除する。
- 重い example、API、syntax は references へ移す。
- script は deterministic repeated operations のためだけに追加する。
- 優れた example を 1 つ優先する。複数言語に薄く広げることを避ける。
- flowchart は非自明な decision または loop にだけ使う。
- skill を cross-reference するときは、explicit requirement marker とともに skill name で参照する。path や `@` link は避ける。
- counter や red flag は実際の rationalization に対してだけ追加する。
- narrative session history と hidden dependency を避ける。
- feedback から改善するときは、関連のない section を書き直すのではなく、観測された behavior を修正して再検証する。

## Evidence の記録

skill が機能すると主張する前に、以下を記録する:

- 使用した scenario
- critical requirement
- baseline failure、または baseline を省略した理由
- result: `untested`、`structurally reviewed`、または `scenario-tested`
- unclear point または discretionary fill-in

validation を省略した場合は `untested` と言う。通ったかのように示唆しない。

## 最終確認

Trigger-only description。簡潔で実行可能な body。必要な supporting file。RED scenario。記録済みの validation status。
