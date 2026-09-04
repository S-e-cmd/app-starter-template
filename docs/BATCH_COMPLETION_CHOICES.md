# Batch Completion Choices

この文書は、すべてのwork modeに共通するbatch報告とユーザーinteractionを定義します。報告形式を埋めること自体を成果にせず、安全な進行、反映経路の識別、必須作業と任意候補の分離、次の実行判断に使います。

continuation eligibility、scope、Evidence、authorization、completion stateの意味は `docs/PROTOCOL_ROUTING_RULES.md` を正本とします。

## starter参照時の報告契約

ユーザーが対象repository / appについて `starterを参考に`、`starter準拠`、`templateに則して`、`templateを参考に整備` 等と指定した場合、この文書の報告形式もstarter適用範囲に含みます。

実装・調査ルールだけをstarter準拠にし、報告を自由形式へ戻してはいけません。ユーザーが別形式を明示した場合だけ、その形式を優先します。

作業を実際に行ったbatchの報告は、原則として次の見出しと順序を使用します。見出しを別名へ言い換えたり、複数項目を一つの説明文へ埋め込んだりしません。該当なし・変更なし・対象外の場合も項目自体は残し、その理由を短く記載します。

```text
Work mode:
- create-new / align-existing / transform-existing

Direct change:
- 今回ユーザーが求めた結果そのもの

Evidence:
- 確認したcurrent behavior / 処理経路 / current contract
- 原因または変更対象を選んだ根拠

Changes:
- 実際に行った変更

Required propagation:
- direct-change成立に不可避な追加変更
- なしの場合は「なし」

Out of scope / untouched:
- 今回触れていない重要領域
- optional candidateをrequired workと混同しない

Verification:
- 実行したrequired verification
- 成功 / 失敗 / 未確認 / blockedを区別

Build:
- 新しいBuild、更新不要、または未完了
- 更新不要の場合は理由

Commit:
- commit SHA、未commit、または対象外

公開反映:
- 確認済み / 未反映 / 対象外 / blocked

Completion state:
- complete / verification-pending / incomplete

Required remaining work:
- なし
または
- current outcomeに必須な具体的残作業と理由

Next decision:
- continue / finish / user-decision

Next action:
- continueの場合だけ、同じturnで実行へ進む具体的対象
- user-decisionの場合は必要な選択・承認
- finishの場合は「なし」
```

この形式はユーザー向けhandoff interfaceです。starter ruleを知っていることの説明、内部用語の講義、作業予定の宣言を、この報告の代わりにしてはいけません。

## 毎batchの必須報告

上記の各欄は、次の判断情報を明示するために必須です。

- 今回の変更
- 原因・変更根拠
- required verificationと結果
- Build、Commit、公開反映
- complete / verification-pending / incomplete
- 必須の残作業、またはなし
- continue / finish / user-decision
- continueの場合だけ具体的next action

文章は簡潔にしてよいですが、判断情報は省略しません。starter ruleへ従った経緯や内部用語の説明より、作業結果と次の行動を優先します。

### 報告より実作業を優先する

報告形式が必須でも、報告だけして停止する理由にはなりません。current task内に安全に実行可能なrequired workが残る場合は、その作業を先に継続し、batchとして区切る時点でこの形式を使用します。

前回報告が形式不備だった場合も、形式を訂正するだけで終了しません。未完了required workが現在も実行可能なら、そのturnで実作業へ復帰します。

## Build / Commit / 公開反映

runtime、production UI asset、user-visible static config、API response・side effect等が変わる場合、build policyに従ってBuildを更新・確認します。

例:

```text
Build:
- 20260816-03

Commit:
- abc12345

公開反映:
- 確認済み
```

Build更新対象外でも項目を落としません。

```text
Build:
- 更新不要
- 理由: docsのみでruntime・UI・API挙動に変更なし

Commit:
- abc12345

公開反映:
- 対象外
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

新しい仕様選択、通常delivery authorizationに含まれない高リスクProduction Mutation、destructive operation、必要権限・情報不足等により自動継続できない場合。安全・検証済みの通常code deliveryをmain / 公開先へ反映するだけの場合はuser-decisionにせず、そのまま反映と確認まで進めます。

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

- starter参照指定があるのに、報告形式だけ自由形式へ戻す。
- 所定見出しを省略・別名化し、長い説明文の中へ判断情報を埋め込む。
- Work mode、Direct change、Evidence、Changes、Required propagation、Out of scope / untouched、Verification、Build、Commit、公開反映、Completion state、Required remaining work、Next decision、Next actionを理由なく省略する。
- Build、Commit、公開反映を省略する。
- build policy該当変更をBuild更新・確認前にcompleteとする。
- commit、deploy、HTTP 200、画面表示だけでfunctional successとする。
- 必須残作業を具体化せずcontinueにする。
- optional / exploratory workを必須残作業として表示する。
- continueなのに実行可能なnext actionへ進まない。
- 実行可能なrequired verificationを残して停止する。
- planning完了をtransform-existing全体のcompleteとする。
- 安全・検証済みで通常delivery条件を満たすのに、Draft PRまたは反映確認で停止する。
- user-decisionで停止したのに未実行operation、停止理由、選択肢を示さない。
- 報告形式やrule遵守の説明を実作業より優先する。
