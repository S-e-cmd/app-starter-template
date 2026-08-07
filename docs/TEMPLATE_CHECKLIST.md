# Template Validation Checklist

新規作成、通常更新、既存アプリ整備、高リスク変更で、`docs/PROTOCOL_ROUTING_RULES.md` と `manifest.json` の中央判断を実際の作業へ適用できているか確認するためのチェックリストです。

## 共通ゲート

- 主作業モードをユーザーの現在目的から選んだ。
- Repository URL / 公開URL / starter参照の存在だけで整備モードを選んでいない。
- `direct-change / required-propagation / out-of-scope` を区別した。
- 「改善できる」「関連している」「同じfile」「fileが長い」だけをscope拡大理由にしていない。
- `confirmed / inferred / unknown` を区別した。
- 不要、未使用、原因、正常、安全等をEvidenceなしで断定していない。
- tool上の実行権限とユーザーの変更authorizationを混同していない。
- Production Mutationの対象とauthorization状態を確認した。
- generated / derived fileのsourceがある場合、生成物だけを手修正していない。
- 既存仕様にないsilent fallbackを追加・使用していない。

## ブートストラップ完了ゲート

新規アプリでは `docs/BOOTSTRAP_PROTOCOL.md` を先に満たします。

- `ai-context.json` / `llms.txt` / `docs/ARCHITECTURE.md` / `docs/DATA_CONTRACT.md` / `docs/UI_RULES.md` / `docs/PROJECT_STATUS.md` がある。
- `ai-context.json` に starter schemaVersion、bootstrap時template commit SHA、bootstrap時revision、current parent manifest URLがある。
- public `ai-context.json` / `llms.txt` にSecret、内部専用URL、private identifier、個人情報、未修正脆弱性詳細等が含まれていない。
- 既存コードがある場合、bootstrapだけを理由にrefactor・rename・移動・削除していない。
- 後から変更コストの高いvisibility、auth、永続保存先、個人情報保存、課金service、公開範囲等を根拠なく推測していない。

## 通常の機能追加・修正

- `FEATURE_CHANGE_PROTOCOL.md` を使用した。
- 直接変更とrequired-propagationだけを変更した。
- 類似機能・共通部品を確認したが、再利用のために不要な結合を増やしていない。
- 無関係なrefactor・cleanupを混在させていない。
- API / data contract / LocalStorage key / D1 schema / Sheets列 / Binding等を未許可で壊していない。
- 検証中に見つけた無関係問題は別taskへ回した。

## 既存アプリ非破壊整備

- template準拠を目的にしていない。
- `ARCHITECTURE_RULES.md` の新規アプリ用directory例へ既存アプリを寄せていない。
- 整備候補がscope外なら記録だけにした。
- ユーザーが「完了まで」「ロードマップ通り」等の継続を既に許可している場合、機械的に毎batch停止していない。
- scope拡大、Production Mutation、新たな高リスク操作、実質的な方針選択が必要な場合は停止してauthorization / choiceを確認した。

## 障害・復旧

- code / deployment / environment / data-schema / external API compatibilityを必要に応じて別軸で確認した。
- last known goodを単なる直前commitとみなしていない。
- 原因不明のまま推測修正を積み重ねていない。
- rollback前にcode-data互換、environment互換、migration後data影響、失われる正常変更、復元targetの存在、external API互換を確認した。
- rollbackがより危険なら、根拠のある限定roll-forwardを選択可能としている。
- force push / history rewriteを通常復旧手段にしていない。
- HTTP 200 / deploy成功 / 画面表示だけで復旧成功とみなしていない。

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

## 削除・rename

- repo内部参照ゼロだけで未使用と断定していない。
- external consumer確認不能な公開API / URL / storage key / GAS function等を「利用状況不明」と扱った。
- 単一renameでもAPI route、Binding、storage key、exported function、GAS function等のcontract boundaryは破壊的変更として扱った。

## 依存更新

- direct dependencyだけでなくtransitive dependencyとlockfile差分を確認した。
- major updateを通常機能追加と混在させていない。
- 重大脆弱性対応ではセキュリティ封じ込め・緊急updateを優先しつつ、互換・rollback評価を省略していない。

## UI

- 見栄え改善で情報量・一覧性・操作数・主要導線を悪化させていない。
- SP対応のためPC版を悪化させていない。
- 画面幅だけを理由に主要機能を削除していない。
- 対象に応じ、押下領域、scroll、overflow、modal close、focus、keyboard、gesture、fixed/sticky、z-index等を確認した。

## build number

- 公開code / UI / runtime behavior / deployed assetが変わった場合はapp固有policyまたは `YYYYMMDD-NN` 共通policyに従って更新した。
- docs / READMEのみなら原則buildを上げていない。
- rollback / roll-forwardで公開内容が変わった場合、過去build番号を新変更として再利用していない。

## 検証と完了状態

重要項目を `verified / blocked / not-applicable` で扱う。

blockedの場合:

- 実施不能理由を記録した。
- 代替確認を記録した。
- 残存riskを記録した。

全体状態:

- **完了** — 必要な変更と検証が完了。
- **作業完了 / 検証保留** — 変更は完了したが必要検証の一部がblocked。
- **未完了** — 実装・復旧・移行・設定変更そのものに残作業がある。

必要に応じ、implementation / deployment / verification / documentation を `complete / pending / not-applicable` で記録します。

commit成功、deploy成功、HTTP successだけでは完了扱いにしません。目的状態を確認します。
