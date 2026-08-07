# Template Validation Checklist

新規作成、通常更新、既存アプリ整備、高リスク変更で、`docs/PROTOCOL_ROUTING_RULES.md` と `manifest.json` の中央判断を実際の作業へ適用できているか確認するためのチェックリストです。

## 共通ゲート

- 主作業モードをユーザーの現在目的から選んだ。
- Repository URL / 公開URL / starter参照の存在だけで整備モードを選んでいない。
- `direct-change / required-propagation / out-of-scope` を区別した。
- 「改善できる」「関連している」「同じfile」「fileが長い」「将来riskがあるかもしれない」だけをscope拡大理由にしていない。
- required-propagationは原則confirmed Evidenceを持つ。inferredなら複数の独立根拠、直接因果、可逆・非破壊・非Production Mutationの条件を満たす。
- unknown riskをrequired-propagationへ格上げしていない。
- `confirmed / inferred / unknown` を区別した。
- 不要、未使用、原因、正常、安全等をEvidenceなしで断定していない。
- tool上の実行権限とユーザーの変更authorizationを混同していない。
- Production Mutationの対象とauthorization状態を確認した。
- generated / derived fileのsourceがある場合、生成物だけを手修正していない。
- 既存仕様にないsilent fallbackを追加・使用していない。
- documentation / runtime mismatchやblocked / unknownが今回scopeに無関係なら、記録だけして他のin-scope作業を不必要に停止していない。

## authorization継承

`already-approved-in-current-task` を使う場合:

- environmentが同じ。
- resourceが同じ。
- operation-typeが同じ。
- target-scopeが同じ。
- 4項目のいずれかが広がる場合、新しいauthorizationとして扱った。
- D1 migration許可を別table削除、別schema破壊、全data rewrite等へ包括継承していない。

## ブートストラップ完了ゲート

新規アプリでは `docs/BOOTSTRAP_PROTOCOL.md` を先に満たします。

- `ai-context.json` / `llms.txt` / `docs/ARCHITECTURE.md` / `docs/DATA_CONTRACT.md` / `docs/UI_RULES.md` / `docs/PROJECT_STATUS.md` がある。
- `ai-context.json` に starter schemaVersion、bootstrap時template commit SHA、bootstrap時revision、current parent manifest URLがある。
- public `ai-context.json` / `llms.txt` にSecret、内部専用URL、private identifier、個人情報、未修正脆弱性詳細等が含まれていない。
- public contextへ追加するfieldは、field名だけでなく実際の値がpublic-safeか確認した。
- repository内部handoffを無加工でpublic contextへコピーしていない。
- 既存コードがある場合、bootstrapだけを理由にrefactor・rename・移動・削除していない。
- 後から変更コストの高いvisibility、auth、永続保存先、個人情報保存、課金service、公開範囲等を根拠なく推測していない。

## 通常の機能追加・修正

- `FEATURE_CHANGE_PROTOCOL.md` を使用した。
- 直接変更とEvidence条件を満たすrequired-propagationだけを変更した。
- 類似機能・共通部品を確認したが、再利用のために不要な結合を増やしていない。
- 無関係なrefactor・cleanupを混在させていない。
- API / data contract / LocalStorage key / D1 schema / Sheets列 / Binding等を未許可で壊していない。
- 検証中に見つけた無関係問題は別taskへ回した。

## 既存アプリ非破壊整備

- template準拠を目的にしていない。
- `ARCHITECTURE_RULES.md` の新規アプリ用directory例へ既存アプリを寄せていない。
- 整備候補がscope外なら記録だけにした。
- ユーザーが「完了まで」「ロードマップ通り」等の継続を既に許可している場合、機械的に毎batch停止していない。
- scope拡大、Production Mutation、新たな高リスク操作、実質的な方針選択が必要な場合は該当部分だけ停止してauthorization / choiceを確認した。

## 障害・復旧

- code / deployment / environment / data-schema / external API compatibilityを必要に応じて別軸で確認した。
- last known goodを単なる直前commitとみなしていない。
- 原因不明のまま推測修正を積み重ねていない。
- rollback前にcode-data互換、environment互換、migration後data影響、失われる正常変更、復元targetの存在、external API互換を確認した。
- rollbackがより危険なら、根拠のある限定roll-forwardを選択可能としている。
- force push / history rewriteを通常復旧手段にしていない。
- HTTP 200 / deploy成功 / 画面表示だけで復旧成功とみなしていない。

## security containment

- 漏えい・不正アクセスがunknownなら、credential失効等のProduction Mutationを自動実施していない。
- confirmedまたは直接露出を示す強いEvidenceがある場合のみ、緊急containment候補として扱った。
- 「確認して」「怪しい」だけをtoken失効authorizationとみなしていない。
- ユーザーが明示したcontain / revoke / disable対象、または事前runbookで定義されたresource / operation / scopeだけにauthorizationを限定した。
- containment authorizationを恒久変更や別resourceへ拡張していない。

## データ移行・実データ

- code / schema / actual data / environment settingsのbackup・recoveryを別々に確認した。
- Git historyだけを実data backupとみなしていない。
- 実data検証は `read-only → copy/snapshot/staging → new isolated test record → modify existing production data` の順で安全側を優先した。
- 既存production実data変更はoperation-specific authorizationなしに行っていない。
- migration対象範囲、旧形式残存、rollback要否、旧client / external consumerを確認するまで互換処理を削除していない。

## 環境・Production Mutation

- 実稼働設定 → deployment metadata → production branch設定file → handoff docs → README → inference の順を基準に確認した。
- inferenceを設定変更の根拠にしていない。
- Production Mutationを `not-authorized / authorized-for-this-operation / already-approved-in-current-task` で扱った。
- 広い「本番も対応」依頼をSecret削除・schema破壊・URL変更等の包括許可とみなしていない。
- 権限 / role / ACL / access control変更をProduction Mutationとして扱った。
- cron / trigger / scheduled job / consumer変更をProduction Mutationとして扱った。
- production import / bulk create / bulk rewriteをProduction Mutationとして扱った。
- 新規resource作成でも既存Binding / routing / storage / targetが切り替わる場合はProduction Mutationとして扱った。

## 削除・rename

- repo内部参照ゼロだけで未使用と断定していない。
- external consumer確認不能な公開API / URL / storage key / GAS function等を「利用状況不明」と扱った。
- 単一renameでもAPI route、Binding、storage key、exported function、GAS function等のcontract boundaryは破壊的変更として扱った。

## 依存更新

- direct dependencyだけでなくtransitive dependencyとlockfile差分を確認した。
- major updateを通常機能追加と混在させていない。
- 重大脆弱性対応ではsecurity containment・緊急updateを優先しつつ、互換・rollback評価を省略していない。

## UI

- 見栄え改善で情報量・一覧性・操作数・主要導線を悪化させていない。
- SP対応のためPC版を悪化させていない。
- 画面幅だけを理由に主要機能を削除していない。
- 対象に応じ、押下領域、scroll、overflow、modal close、focus、keyboard、gesture、fixed/sticky、z-index等を確認した。

## build number

- production executable code変更はapp固有policyまたは `YYYYMMDD-NN` 共通policyに従って更新した。
- CSS等のproduction UI asset変更は更新対象として扱った。
- runtimeが読むstatic JSON / config等で表示・挙動・API responseが変わる場合は更新対象として扱った。
- internal APIのみでもproduction codeのresponse / side effect / contract behaviorが変わる場合は更新対象として扱った。
- docs / READMEのみなら原則buildを上げていない。
- Secret rotation等のenvironment-only変更でartifact・user behaviorが変わらない場合は、共通policy上は原則build不要とした。
- rollback / roll-forwardで公開内容が変わった場合、過去build番号を新変更として再利用していない。
- app固有version policyが明示されている場合はそちらを優先した。

## 検証と完了状態

重要項目を `verified / blocked / not-applicable` で扱う。

blockedの場合:

- 実施不能理由を記録した。
- 代替確認を記録した。
- 残存riskを記録した。
- 今回scopeと無関係なら他のin-scope作業を継続した。
- direct-changeの成功、安全、authorization判断に必要なら該当部分だけ保留した。

全体状態:

- **完了** — 必要な変更と検証が完了。
- **作業完了 / 検証保留** — 変更は完了したが必要検証の一部がblocked。
- **未完了** — 実装・復旧・移行・設定変更そのものに残作業がある。

必要に応じ、implementation / deployment / verification / documentation を `complete / pending / not-applicable` で記録します。

commit成功、deploy成功、HTTP successだけでは完了扱いにしません。目的状態を確認します。

## 解釈一致テスト

大きなpolicy変更後またはrule矛盾レビュー時は `docs/POLICY_INTERPRETATION_CASES.md` を使います。

- authorization fingerprintの一致 / 不一致。
- inferred / unknown riskによるscope拡大。
- security containmentとProduction Mutation authorization。
- documentation/runtime mismatch。
- blocked / unknownによる不要停止。
- build number境界。
- silent fallback / fake success。

同じcaseで別AIがscope、Evidence、authorization、Production Mutation、continuation、Protocolについて大きく異なる結論を出せる場合は、rule不足または表現曖昧として扱います。
