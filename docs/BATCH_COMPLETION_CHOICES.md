# Batch Completion Choices

この文書は、すべてのwork modeに共通するbatch報告とユーザーinteractionを定義します。報告形式を埋めること自体を成果にせず、安全な進行、反映経路の識別、必須作業と任意候補の分離、次の実行判断に使います。

continuation eligibility、scope、Evidence、authorization、completion stateの意味は `docs/PROTOCOL_ROUTING_RULES.md` を正本とします。

## 毎batchの必須報告

```text
今回の変更:
- 実際に行った変更

原因・変更根拠:
- 確認した処理経路
- 原因または変更対象を選んだ根拠

確認結果:
- 実行したrequired verification
- 成功、失敗、未確認

反映情報:
- Build:
- Commit:
- 公開反映:

今回の依頼の状態:
- complete / verification-pending / incomplete

必須の残作業:
- なし
または
- 具体的な作業と、それがcurrent outcomeに必須である理由

次の判断:
- continue / finish / user-decision

次のアクション:
- continueの場合だけ具体的な実行対象
- user-decisionの場合は必要な選択・承認
```

文章は簡潔にしてよいですが、上記の判断情報は省略しません。starter ruleへ従った経緯や内部用語の説明より、作業結果と次の行動を優先します。

## Build / Commit / 公開反映

runtime、production UI asset、user-visible static config、API response・side effect等が変わる場合、build policyに従ってBuildを更新・確認します。

例:

```text
Build: 20260816-03
Commit: abc12345
公開反映: 確認済み
```

Build更新対象外でも項目を落としません。

```text
Build: 更新不要
理由: docsのみでruntime・UI・API挙動に変更なし
Commit: abc12345
公開反映: 対象外
```

build位置が不明ならcurrent app内を確認します。「不明なので省略」にはしません。Build、Commit、公開反映を分離し、未commit、未deployment、古いartifact、cache・配信経路、修正自体の不成立を切り分けられるようにします。

## 完了状態

- `complete` — direct-changeから導出した変更とrequired verificationが完了し、必須残作業なし。
- `verification-pending` — 実装は完了したがrequired verificationの一部が実際にblocked。
- `incomplete` — 実装、移行、設定変更自体に必須残作業あり。

実行可能なrequired test、build、preview、runtime確認を残したままverification-pendingやfinishにしません。一部がblockedでも独立して実行可能なverificationは完了させます。

## 次の判断

### continue

current task scope内に具体的な未完了direct-changeまたはvalid required-propagationがあり、既存authorizationで安全に実行可能な場合。

具体的unfinished itemと、current outcomeに必須である理由を示します。そのまま実行可能なら「次は○○」という説明だけで停止せず、同じturnで実作業へ進みます。

### finish

current task scope内のrequired workが尽き、必須残作業がない場合。optional improvement、exploratory work、別task候補が残っていてもfinishを妨げません。

### user-decision

新しい仕様選択、operation-specific authorization、Production Mutation、destructive operation、必要権限・情報不足等により自動継続できない場合。

最低限、未実行operation、停止理由、現実的な選択肢、推奨案と理由を示します。選択肢は現在の停止理由を解消する同じdecision levelに揃えます。

## 必須作業と任意候補

次だけではcontinueにしません。

- さらに整理できる。
- 責務分離できる。
- 追加確認できる。
- 別の改善点が見つかった。
- maintenance riskが残っている。

候補がcurrent outcomeに必要なdirect-changeまたはrequired-propagationかを判定します。任意候補は必須残作業へ昇格させず、current taskがcompleteならfinishします。

## 誤って停止した場合

前turnで本来continueすべき状態なのに説明だけで停止したと判明した場合、訂正だけで再び終了しません。continuation条件が現在も成立するなら、同じturnで未実行だった具体的作業へ復帰します。

## 禁止

- Build、Commit、公開反映を省略する。
- build policy該当変更をBuild更新・確認前にcompleteとする。
- commit、deploy、HTTP 200、画面表示だけでfunctional successとする。
- 必須残作業を具体化せずcontinueにする。
- optional / exploratory workを必須残作業として表示する。
- continueなのに実行可能なnext actionへ進まない。
- 実行可能なrequired verificationを残して停止する。
- planning完了をtransform-existing全体のcompleteとする。
- user-decisionで停止したのに未実行operation、停止理由、選択肢を示さない。
- 報告形式やrule遵守の説明を実作業より優先する。
