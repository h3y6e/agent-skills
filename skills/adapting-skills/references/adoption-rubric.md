# 採用 rubric

外部または reference skill を採用、適応、または却下する前に評価するときに使う。

## 採用条件

繰り返し発生し、近いうちに必要になる task にだけ採用する。既存の local/adopted skill がすでに need を cover している場合は、それを使うか改善することを優先する。同じ candidate を後で再評価しないよう、却下理由を記録する。

## 評価軸

| 軸 | 質問 |
| --- | --- |
| Fit | description は実際の task と user intent に合っているか。 |
| Non-redundancy | installed skill や repo-local skill がまだ cover していない価値を提供するか。 |
| Compatibility | 利用できない tool、private convention、固定 path、lifecycle assumption を避けているか。 |
| Quality | when-not-to-use、concrete workflow、output contract、validation story が明確か。 |
| Footprint | 重い detail が demand-loaded になっており、context cost が正当化できるか。 |
| Maintenance | upstream は十分新しいか、安全に fork しやすいか。 |
| License | 対象 repository での reuse が許可されているか。 |

## 手順

1. まず既存 catalog/adopted/repo-local skills を確認する。
2. 広く検索する前に、trusted または curated source から top-down に candidate を評価する。
3. 惜しいがそのままでは合わない candidate には、call-site workaround より `absorb` または `adapt` を優先する。
4. 外部から採用する場合は、評価した exact source を pin または snapshot する。
5. high-impact または ambiguous な candidate には empirical validation を使う。

## 注意信号

- title は一致しているが trigger が一致していないという理由で採用する
- "念のため" の installation
- production use に floating refs を使う
- license がない、または provenance が不明
- 単独価値が弱い広い setup/router skill
- new evidence なしに、以前却下した candidate を再評価する
