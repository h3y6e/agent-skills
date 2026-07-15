# Issue種別のOverlay

該当するoverlayだけを共通本文へ加える。
該当しないfieldを埋めるために推測しない。

## Bug

- expected behaviorとobserved behaviorを分ける。
- reproduction、log、test、影響範囲をEvidence状態付きで記録する。
- 原因と解決案は仮説として、観測事実から分離する。
- failure後のstateと外部副作用が既知かunknownかを記録する。
- acceptanceには回帰testと、再発していないと判定できるoracleを含める。

## Investigation

- 実装作業ではなく、答えるquestionまたは下すdecisionを一つ置く。
- 必要なEvidence、取得方法、成果物、ownerを記録する。
- stop conditionと、どの結果なら後続issueが必要かを記録する。
- 結論が出る前に後続実装のscopeやacceptanceを推測しない。

## MigrationまたはArchitecture

- current state、target state、変えてはいけないcontractを記録する。
- deploy order、compatibility window、backfill、dual read/write、reconciliationの適用を判定する。
- observation window、exit criteria、abort conditionsを記録する。
- irreversible point、必要なapproval、rollbackまたはforward recoveryを記録する。
- flag、adapter、dual write、copy、old pathにはowner、観測方法、削除条件、削除phaseを付ける。
- old pathの利用がゼロであることを削除前のoracleにする。
