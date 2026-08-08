# Feature Change Protocol

立ち上げ後の通常の機能追加・仕様変更・小規模改修を、安全に継続するための標準手順です。

作業モード、scope分類、Evidence、Production Mutation、authorization、generated files、fallback、build、verificationの共通定義は `docs/PROTOCOL_ROUTING_RULES.md` を正本とします。このProtocolでは通常更新固有の実施順序だけを定義します。

## 適用範囲

次のような依頼では、このProtocolを使用します。

- 新機能追加。
- 既存機能の拡張。
- UI追加・操作改善。
- 保存処理やAPI連携の追加。
- 既存挙動の明示的な仕様変更。
- 小規模な不具合修正。

新規アプリの初期作成は `BOOTSTRAP_PROTOCOL.md`、既存アプリ全体の整理・安定化・引き継ぎ改善が主目的なら `EXISTING_APP_ALIGNMENT_PROTOCOL.md` を使用します。既存Repoや公開URLが提示されていること自体は整備モードへの切替理由にしません。

通常の局所的・段階的変更ではrequired outcomeを安全に達成できないことがconfirmedされた場合は、このProtocolのまま大規模実装へ直行せず、`MAJOR_CHANGE_PLANNING.md` をplanning / routing gateとして適用します。

## 変更前

1. ユーザー要望と完了条件を確認する。
2. 中央ruleで `direct-change / required-propagation / out-of-scope` を分類する。
3. required-propagation候補は中央Evidence条件を満たすか確認する。
4. 対象機能の現在実装、関連file、呼び出し元・呼び出し先・共有stateを確認する。
5. 既存の共通部品・類似機能を確認する。ただし再利用のために不要な依存を増やさない。
6. 保存先、API、外部service、公開方式、PC / SP UIへの影響を確認する。
7. `ai-context.json` と関連docsを確認する。
8. 高リスクProtocol切替やProduction Mutation authorizationが必要か中央ruleで判定する。
9. 局所変更ではrequired outcomeを安全に達成できないconfirmed Evidenceがあるか確認し、該当する場合だけMajor Change Planningへ切り替える。

変更対象と隣接範囲が把握できたら、無関係な全体再確認は行いません。

Major Change判定はfile数・line数・変更量では行いません。古い構成、巨大file、UI/API両方を触ること、modern化可能であることだけではPlanningへ移しません。Evidenceがinferred / unknownなら `possible major change` に留めます。

## 実装方針

- direct-changeと、中央Evidence条件を満たすrequired-propagationだけを実装する。
- 既存責務の延長なら既存moduleを使用する。
- 新しい責務なら、その責務に合うmoduleやfileを追加する。
- 巨大fileの分割は今回scope内で必要な境界だけに限定する。
- event handlerへ通信、保存、変換、業務logicを直接埋め込まない。
- 新しいUIは既存の情報量、一覧性、操作感、PC/SPそれぞれの目的を維持する。
- 待ち時間のある操作には処理中表示と二重操作防止を入れる。
- errorは握り潰さず、利用者向け表示と確認用logを分ける。
- data contract変更が必要なら `DATA_MIGRATION_PROTOCOL.md` を適用する。
- environment変更が必要なら `ENVIRONMENT_CHANGE_PROTOCOL.md` を適用する。
- cleanup / dependency updateが必要なら該当Protocolを適用する。
- out-of-scopeな改善・refactor・cleanupを「ついで」に混ぜない。
- Major Change Planningを経由しても、方式承認だけで未列挙Production Mutationやdestructive operationをauthorized扱いしない。

## 準備作業から実変更への収束

準備・test・staging・migration helper等をrequired-propagationとして追加する場合は、`DEVELOPMENT_RULES.md` の準備作業収束ruleを適用します。

- 準備が支えるconcrete execution targetを明示する。
- その準備がtargetの安全な実行、required verification、必要なrollback / recoveryのどれに不可欠かをconfirmed Evidenceで示す。
- 準備のための追加準備も、最終execution targetまで必要因果を戻して再判定する。
- required conditionsが満たされたらpreparationは完了とし、direct-change本体が未完了なら次batchは原則executionへ進む。
- 追加の安心材料、より強い任意test、さらなるcoverageだけでexecutionを延期しない。
- 新しいconfirmed blockerまたはrequired safety / verification / recovery conditionの変化が出た場合だけpreparationを再開する。

## Major Change Planningから戻る場合

Planningでcode restructuring / 新機能実装batchが定義された場合、このProtocolへ戻して実装します。

- Planningで定義されたrequired outcome・保護対象・batch依存関係を引き継ぐ。
- Planningの方式承認をscope無制限拡張やrewrite authorizationにしない。
- Data Migration / Environment Change / Cleanup等が別batchなら、それぞれ該当Protocolへroutingする。
- Planning completeをImplementation completeとして扱わない。

## 検証中に別問題を発見した場合

中央Scope Expansion Ruleに従います。

- 今回の変更が原因 → 原則同じbatchで修正・再確認。
- required-propagation → Evidence条件を満たす場合だけ現在batchで扱える。
- recommended improvement → 記録のみ。
- unrelated issue → `PROJECT_STATUS.md` 等へ記録し別batchへ回す。
- 重大障害、data損失、security問題 → 該当高リスクProtocolへ切り替える。

blocked / unknownが無関係な箇所にあるだけで、他のin-scope作業を止めません。

## 変更後の確認

中央verification policyを使用します。

対象に応じて確認します。

1. 構文・JSON・設定形式。
2. 初期表示。
3. 追加・変更した機能の目的状態。
4. 隣接する既存操作。
5. 保存・再読み込み。
6. 関連API・外部連携。
7. error / loading状態。
8. PC / SP表示と主要操作。
9. data contract互換。
10. 公開runtimeへ変更がある場合のdeploy反映・build番号。

`HTTP 200 / commit成功 / deploy成功 / 画面が開いた` だけでは成功とみなしません。

## ドキュメント更新

変更内容に応じて必要なものだけ更新します。

- 構成・責務・依存関係 → `docs/ARCHITECTURE.md`
- API・保存形式・schema・列構成 → `docs/DATA_CONTRACT.md`
- UI維持事項・操作ルール → `docs/UI_RULES.md`
- 安定機能、開発中項目、既知問題、次task → `docs/PROJECT_STATUS.md`
- entrypointや主要構成 → `ai-context.json`

build番号は中央build policyまたはapp固有policyに従います。

## 完了状態

中央verification policyの状態を使用します。

- **完了** — 実装と必要検証まで完了。
- **作業完了 / 検証保留** — 実装は完了したが必要検証の一部がblocked。
- **未完了** — 実装、移行、設定変更そのものに残作業がある。

Major Change Planning経由では、Planning complete / Implementation complete / Cleanup completeを分離します。新系の実装成功だけで旧系削除まで完了扱いしません。