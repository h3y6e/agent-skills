---
source: skills/slicing-issues/SKILL.md
source_sha256: e5a30d5a46d9582a93918d429895c1866e54894b6064dfda804707b5b178ea64
name: slicing-issues
description: 'spec、plan、PRD、feature idea、または conversation を、vertical slice、acceptance criteria、dependencies、verification を持つ、独立実装可能な GitHub/Linear issue や ticket に分割するときに使う。'
---


# Issue の slicing

source material を、独立して実装・検証できる thin vertical issue に分割する。この skill は tool-neutral な issue draft を作る。issue tracker が明確な場合だけ publish する。

## 入力素材

存在するものを使う:

- 現在の conversation
- 参照された issue
- `docs/specs/*`、`specs/*`、または PRD
- implementation plan
- boundary を理解するために必要な場合は code exploration

problem または success criteria がまだ不明確な場合は、slicing の前に `framing-problems` を使う。slice がすでに存在し、execution だけが parallel の場合は `dispatching-parallel-agents` を使う。

## Slice rules

- layer-by-layer task より vertical slice を優先する。
- 各 issue は relevant layers を通る narrow complete path を deliver する。
- 各 issue は単独で demo または verify できるべきである。
- 1 つの大きな issue より、多くの thin slice を優先する。
- 各 slice は、それが cover する source requirement、user story、risk、または decision に対応している必要がある。
- 各 slice には concrete acceptance criteria と、expected evidence を含む verification が必要である。
- uncertainty の高い discovery は、戻しにくい implementation slice の前に置く。
- concrete scope なしに `TBD`、`TODO`、"handle errors"、"write tests" のような placeholder を使わない。
- human judgment が必要な場合だけ slice を `HITL` と mark する。
- agent が issue と repo context から実装できる場合は `AFK` と mark する。
- approved issue は dependency order で、blocker から publish する。

単独で verify できない slice、または observable behavior なしに infrastructure だけを作る slice は却下する。

## 手順

1. source と parent issue context があれば集める。
2. bad boundary を避けるために必要な場合だけ codebase を探索する。
3. title、mode、dependencies、covered requirements、acceptance criteria、verification を含む slice を draft する。
4. granularity と dependencies について user の approve を求める。
5. approve 後、issue body を作るか、利用可能な GitHub/Linear workflow で publish する。
6. 明示的に依頼されていない限り、parent/source issue を close または modify しない。

## Issue body

```markdown
## 親または source

parent issue、PRD、spec、または conversation section への参照。

## 作るもの

layer-by-layer implementation ではなく、end-to-end behavior を説明する。

## 境界

分かっている場合は、files、modules、systems、明示的な out-of-scope work。

## Mode

AFK または HITL。理由を 1 文で説明する。

## Covered requirements

- この issue が満たす requirement または source section。

## Acceptance criteria

- [ ] 具体的で test 可能な criterion
- [ ] 具体的で test 可能な criterion

## Verification

- 完了を証明する expected evidence を含む command、manual check、または review method。

## Blocked by

なし、または blocking issue への参照。

## Notes

関連する decision、source spec、または out-of-scope boundary。
```
