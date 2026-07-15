# Issueを公開する

ユーザーがtitle、body、nodeの粒度、blocking edgeを承認し、公開を依頼した場合だけ読む。

## Preflight

- 対象trackerとrepositoryを特定し、認証状態を確認する。
- 公開対象が承認済みかつ`ready-for-approval`のnodeだけであることを確認し、`blocked` nodeはdraftに残す。
- repository visibility、issue template、既存label、issue type、relation機能を確認する。
- 公開直前にdomain conceptで重複検索をやり直す。
- 新しい重複候補が見つかった場合は公開を止め、採用、統合、除外を判断してdraftと承認へ戻る。
- public trackerへsecurity finding、credential location、個人情報を公開する場合は、内容を示して個別承認を得る。
- 承認済みdraftとtracker上の必須fieldが矛盾する場合は、変更案を提示して再承認を得る。
- native relationがなく本文へ`Blocked by`を加える場合は、変換後の全bodyを提示して再承認を得る。

## Publish

1. topological orderでblocker nodeから作成し、IDとURLを記録する。
2. 全nodeのID取得後、native blocking relationとparent / child relationを接続する。
3. native relationがないtrackerだけ、承認済み本文の`Blocked by`をfallbackにする。
4. 明示依頼がないparent / source issueは変更もcloseもしない。
5. 各issueとrelationを読み戻し、承認済みtitle、body、edge、label、typeと比較する。

## 部分失敗

作成済みissue、未作成node、未接続edgeを分けて報告し、停止する。
同じnodeをblind retryしたり、作成済みissueを自動削除したりしない。
再開前にtrackerの現状を読み戻し、残作業だけを提示する。

完了時は全issueのID、title、URLとrelationの検証結果を返す。
