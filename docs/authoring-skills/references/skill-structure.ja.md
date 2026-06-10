---
source: skills/authoring-skills/references/skill-structure.md
source_sha256: b6f83a086219a55a641e2ff8b2d2d27c9b1cac4677b6bf7017ae2d2eef6fa417
---

# Skill の構造

何を `SKILL.md`、`references/`、または `scripts/` に入れるかを決めるときに使う。

## 具体例から始める

skill を構造化する前に、user、現在の conversation、または realistic generated scenario から具体的な usage example を集める。各 example について次を問う:

- どの task が skill を trigger すべきか。
- どの output を生成すべきか。
- agent がなければ再発見する repeated work は何か。
- core workflow と reference detail のどちらに属する information か。
- workflow を変える edge case または dependency は何か。

## Resource の配置

| Location | ここに置くもの | ここに置かないもの |
| --- | --- | --- |
| `SKILL.md` | Core principle、trigger-sensitive workflow、decision rule、output contract、short example | Long API docs、exhaustive variant、session history |
| `references/` | 重い docs、detailed pattern、advanced case、variant-specific guide | pointer なしで毎 invocation に必要な instruction |
| `scripts/` | deterministic repeated operations、validators、generators、reusable helpers | one-off command、または agent が rerun しない code |

実際に使う directory だけを作る。参照された file はすべて存在し、`SKILL.md` body はいつそれを読むかを述べていなければならない。

## 構造チェック

- Progressive disclosure が明確である: metadata -> `SKILL.md` -> references/scripts on demand。
- body は common path に対して lean かつ self-contained である。
- 複数の evaluation で生まれた repeated helper は `scripts/` に昇格する。
- large reference file には heading または search term が含まれている。
- example は adapt するのに十分 complete であり、多数の shallow variant に分散していない。
