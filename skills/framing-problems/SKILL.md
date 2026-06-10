---
name: framing-problems
description: request があいまいな pain、solution idea、product idea、または「何を作るべきか」から始まり、本当の問題、優先度、success criteria が不明確なときに使う。
license: MIT
metadata:
  author: h3y6e
  version: 2026.6.1
---

# 問題の framing

solution を形にする前に problem を見つける。user に pain、idea、または direction はあるが、その奥にある problem がまだあいまいなときに使う。

## 基本ルール

- まだ solution を評価したり提案したりしない。
- solution idea は、その背後にある pain への clue として扱う。
- 一度に 1 つの質問をする。
- 抽象的な opinion より、最近の具体的な episode を優先する。
- output の中に user 自身の言葉を見える状態で残す。
- suspected cause に user を誘導しない。
- request が独立した problem を束ねている場合は、detail を深掘りする前に止まり、分解の選択肢を表に出す。

## 使わないとき

problem、priority、success criteria が、spec、issue、または design を書くのに十分明確な場合は skip し、直接その next artifact に進む。

## インタビューの進め方

trigger から始める:

- "何が起きて、これを解く価値があると感じたのですか?"
- "最後にこの痛みを感じたのはいつですか?"
- "今は代わりに何をしていますか?"

その後、1 つの problem ずつ深める:

- **具体的な場面**: いつ、どこで、誰が、何が起きていたか
- **頻度**: どのくらい頻繁に起きるか
- **影響**: time、money、risk、frustration、opportunity cost
- **現在の workaround**: user が今日していることと、それでは不十分な理由
- **広がり**: 他の人も同じ problem を持つか
- **緊急度**: 何も変えない場合に何が悪化するか

user が solution に飛んだ場合は、それを受け止めてから、その solution が必要だと感じた scene に戻る。

solution idea を judge したり alternative を提案したりしない。解く価値があるほど painful だったものの evidence としてだけ使う。

## 終了条件

少なくとも 1 つの problem について、concrete scene、current workaround、impact、priority reason が揃ったら output に進む。複数の独立した problem が現れた場合は、分解の recommendation を添えて止める。3 つの focused question の後も key facts が不明な場合は、無期限に続けず uncertainty を要約する。

## 出力

最後は problem map にする:

```markdown
# 問題マップ: <theme>

## 要約
<2-3 文>

## 問題

### 1. <problem>
- Scene: <具体的 episode>
- Frequency: <既知または不明>
- Impact: <cost または risk>
- Current workaround: <現在の behavior>
- 優先理由: <この順位になる理由>

## 優先度
| 順位 | 問題 | 頻度 | 影響 | 確信度 |
| --- | --- | --- | --- | --- |

## 重要な不確実性
- <priority、scope、success criteria を変え得る unknown>

## 次の step
<research、hypothesis、spec、prototype、または no action>
```

## よくある誤り

- proposed app、tool、feature に problem を定義させる。
- 自分の仮説を忍び込ませる leading question を聞く。
- 最近の episode に grounding せず、広い survey を聞く。
- interview を advice に変える。
- excitement で優先順位を決め、frequency、impact、spread、urgency を無視する。
