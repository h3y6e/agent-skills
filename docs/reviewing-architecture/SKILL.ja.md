---
source: skills/reviewing-architecture/SKILL.md
name: reviewing-architecture
description: 'refactoring candidate、shallow module、leaky interface、duplicated orchestration、test しにくい behavior、複数 file に広がる変更など、code structure の architecture friction を review するときに使う。'
---


# Architecture の review

interface を設計する前に architectural friction を表に出し、candidate を提案する。goal は locality、leverage、testability を改善すること。

## 語彙

- **Module**: interface と implementation を持つ code。
- **Interface**: caller が知る必要のあるすべてのもの: type、invariant、error、ordering、config、behavior。
- **Implementation**: interface の背後に隠された code。
- **Depth**: 小さな interface の背後にどれだけの behavior があるか。
- **Shallow module**: interface complexity が implementation complexity に近い module。
- **Seam**: caller を編集せずに behavior を変えられる場所。
- **Adapter**: seam の背後にある concrete implementation。
- **Locality**: change と bug が局所に留まること。
- **Leverage**: caller が少ない知識でより多くの behavior を得ること。

## 探索

まず関連 artifact を読む: `README.md`、`docs/adr/`、`docs/specs/`、`specs/`、referenced issues。主 task が proposed plan の stress-test である場合は、代わりに `designing-with-artifacts` を使う。

friction を探索する:

- 1 つの concept を理解するために多くの small module を行き来する必要がある
- helper は test のためだけに存在するが、bug は call site で起きる
- interface が implementation detail を露出しすぎている
- 複数の caller が同じ orchestration を重複している
- public behavior を通じた test が書きにくい
- change が boundary を越えて漏れる
- uncertainty の高い design work が、戻しにくい implementation と混ざっている

real friction が見つからない場合はそう言う。refactor を捏造しない。evidence なしに recommendation しない。各 candidate について、code、test、issue、spec、または concrete change scenario を cite する。

deletion test を適用する: module を削除して complexity が消えるなら、おそらく shallow だった。complexity が caller 群に再出現するなら、その module は役目を果たしている可能性がある。

## Candidate の提示

先に新しい interface を提案しない。candidate を提示する:

- 関連する files/modules
- problem
- locality、leverage、または tests にどう効いているか
- 改善の方向
- その change によって影響を受ける、または保護される tests
- その change によって保護される behavior または requirement coverage
- ADR/spec conflict があればそれ

detailed design の前に、どの candidate を探索するかを尋ねる。

この形を使う:

```markdown
## Candidate <N>: <name>
- 関連 files/modules:
- friction:
- 重要な理由:
- 改善の方向:
- tests:
- evidence:
```

## 設計 follow-up

選ばれた candidate を探索するとき:

- caller が必要とする behavior を定義する
- interface を implementation より小さく保つ
- recommendation の前に、意味のある 2-3 個の interface option を比較する
- plausible な場合は、minimal option、flexible option、common-case-optimized option を少なくとも含める
- abstraction seam を追加する前に、少なくとも 2 つの plausible adapter を要求する
- internal refactor 後も残るべき tests を特定する
- uncertainty の高い work は、戻しにくい refactor の前に research または spike として前倒しする
- ADR は、戻しにくく、意外性があり、trade-off がある decision にだけ提案する

interface option は次で比較する:

| option | interface size | hidden complexity | caller impact | test impact | evidence/risk |
| --- | --- | --- | --- | --- | --- |
