---
name: creating-issues
description: Creates draft content for new issues as a single issue or dependency-aware issue set. Use when the user explicitly asks to turn a conversation or source material into a new issue/ticket draft or decompose work into multiple issue drafts. Do not use for implementing or reviewing existing issues, publishing an already-approved draft, or authoring issue templates.
license: MIT
metadata:
  author: h3y6e
---

# Issueを作成する

会話、既存issue、spec、plan、audit、researchから、承認可能なissue graphを作る。
単一issueは1 nodeのgraphとして扱い、入力側に単数か複数かを選ばせない。

## 境界

- 対象は新規issueの作成であり、既存issueの実装、triage、readiness reviewではない。
- 問題または観測可能なoutcomeを述べられない場合は`framing-problems`を使い、issue作成を止める。
- issueのblocking edgeは定義するが、実行時の並列安全性は`dispatching-parallel-agents`が判定する。
- repoを探索できるfresh-context executorを既定とし、変わりやすいfile pathやcode snippetは契約を固定する場合だけ書く。

## 手順

### 1. Sourceと既存issueを確認する

sourceの全文、既存issueならcomments、参照先、必要なrepo contextを読む。
trackerのtemplate、言語、label、issue typeを確認し、表現ではなくdomain conceptで重複issueを検索する。

**完了条件:** sourceと重複候補を列挙し、採用、除外、統合の判断にEvidenceがある。

### 2. Readinessを判定する

sourceから要求、決定、制約、riskだけを抽出し、各主張を`confirmed | inferred | assumption | unknown | contradiction`に分ける。

| 状態 | 次の行動 |
| --- | --- |
| 問題またはoutcomeが不明 | `framing-problems`へ渡す |
| outcomeは明確だが答えや実現性が不明 | investigation issueにする |
| 実装詳細だけが不明 | 通常のissueを作る |
| scope、acceptance、不可逆判断を変えるunknownまたはcontradictionがある | Decision Gateを置き、依存nodeを`blocked`にする |

**完了条件:** 結果を変えるunknownとcontradictionが、仮定や実装方針へ紛れ込んでいない。

### 3. Issue graphを決める

一つのfresh contextで完了でき、独立してlandできる中間outcomeやrollback境界がなければ1 nodeにする。
独立して承認、実装、検証できるoutcomeが複数ある場合、またはwide mechanical changeの場合は[issue setの規則](references/issue-sets.md)を読む。
一つのfresh contextに収まらず、独立outcomeもまだ特定できない場合は、境界を決めるinvestigation nodeだけを作る。

**完了条件:** 各nodeが一つのcoherent outcomeを持ち、edgeが実際の開始条件だけを表す。

### 4. 各nodeを書く

node metadataにtitle、readiness、blocking edgeを置き、本文は次を基本形にする。
空のsectionは残さない。
本文はstableなintent、constraint、acceptance、oracleに絞り、repoから調べられる実装手順はordering自体が契約になる場合だけ書く。

```markdown
## Source and evidence

- [confirmed] 根拠と参照先
- [inferred | assumption | unknown | contradiction] 結果に影響する主張と確認方法

## Problem

## Outcome

## Scope

- In scope:
- Must preserve:
- Out of scope:

## Acceptance criteria

- [ ] 観測可能な期待結果
- [ ] 禁止される結果が起きないこと

## Verification

- 検証方法 -> 第三者がpass / failを判定できるoracleと期待Evidence

## Decision gates

- 結果を分岐させる未決事項、必要なEvidence、owner
```

bug、investigation、migration、architectureに該当するnodeでは[issue種別の規則](references/issue-types.md)を読み、該当するoverlayだけを加える。
confirmed以外の主張はEvidence状態を本文に残し、contradictionの影響を受けるnodeを`ready-for-approval`にしない。
question、必要Evidence、stop conditionが明確なinvestigation nodeは、答えがunknownでも`ready-for-approval`にできる。
planned verificationを実行済みのEvidenceとして書かない。

### 5. Graph全体を検査する

- 抽出した要求、決定、制約、riskを一つのnodeのacceptanceとverification、またはEvidence付きout-of-scopeへ対応させる。
- node間のscope重複、要件欠落、循環edge、`TBD`、`TODO`、判定不能なacceptanceを解消する。
- 各nodeが本文とrepo contextだけで着手でき、単独でpass / failを判定できることを確認する。
- graphに少なくとも一つのunblocked nodeがあることを確認する。

### 6. 承認と公開を分ける

最終draft、source coverage、重複候補、blocking edgeを提示し、title、body、nodeの粒度、edgeへの承認を得る。
承認後にいずれかを変更した場合は再承認を得る。
公開依頼があり、対象trackerが判明し、公開対象nodeがすべて`ready-for-approval`で、graphが承認済みの場合だけ[issueを公開する](references/publishing.md)を読む。
trackerが不明な場合と、公開対象に`blocked` nodeがある場合はdraftで止める。
それ以外はdraftを最終成果物にする。
