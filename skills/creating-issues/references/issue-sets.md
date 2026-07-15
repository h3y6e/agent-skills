# Issue Set

独立したoutcomeが複数ある場合、または一度にgreenを保てないwide mechanical changeの場合に読む。

## Graphの規則

- tracer bulletを基本にし、schema、backend、frontend、testのようなlayer別nodeを作らない。
- 各nodeは一つのfresh contextで完了でき、単独でland、demo、verificationできる大きさにする。
- setup、config、documentationは、それを必要とする最初のoutcomeへ含める。
- edgeは「先にあると便利」ではなく、後続nodeを開始できない条件だけに付ける。
- sourceの各要求を一つのnodeへ割り当て、意図的な重複は理由を記録する。
- 精密に問えない領域を推測でnode化しない。
  後続境界を変えるunknownは、質問と必要Evidenceを明記できるinvestigation nodeだけにする。

## Wide Mechanical Change

一つの変更が多数のcallerを同時に壊し、vertical sliceを単独でgreenにできない場合だけ使う。

1. **Expand:** 新旧を共存させ、既存挙動を保つ。
2. **Migrate:** packageやdirectoryなどblast radius単位でcallerを移す。
3. **Contract:** 全callerの移行を確認して旧経路を削除する。

各phaseにprecondition、verification、abort、rollbackまたはforward recovery、completion conditionを持たせる。
各migrate nodeはExpandに、Contractは全migrate nodeにblockされる。

## Draftの提示

```markdown
## Issue graph

1. <title>
   - Readiness: ready-for-approval | blocked
   - Blocked by: none | <node title>
   - Covers: <source requirement>

## Source coverage

| Source item | Issue | Acceptance | Verification |
| --- | --- | --- | --- |
```

graphがacyclicで、一つ以上のfrontierを持ち、blockerから順に公開できることを確認する。
