# Feature Change Protocol

立ち上げ後の通常の機能追加・仕様変更・小規模改修を、安全に継続するための標準手順です。

## 適用範囲

まず `docs/PROTOCOL_ROUTING_RULES.md` で主作業モードを判定します。

次のような依頼では、この手順を使用します。

- 新機能追加。
- 既存機能の拡張。
- UI追加・操作改善。
- 保存処理やAPI連携の追加。
- 既存挙動の明示的な仕様変更。
- 小規模な不具合修正。

新規アプリの初期作成は `BOOTSTRAP_PROTOCOL.md`、既存アプリ全体の整理・安定化・引き継ぎ改善が主目的なら `EXISTING_APP_ALIGNMENT_PROTOCOL.md` を使用します。既存Repoや公開URLが提示されていること自体は整備モードへの切替理由にしません。

## scope

作業前に次を分類します。

- **direct-change** — ユーザーが具体的に変更を求めた箇所。
- **required-propagation** — direct-changeを成立させるため不可避な内部変更。
- **out-of-scope** — 改善可能でも今回の目的に不要な変更。

「改善できる」「関連している」「同じfileにある」「fileが長い」はrequired-propagationの理由にしません。

## 基本原則

- direct-changeは要望どおり変更してよい。
- required-propagationは具体的な必要性を確認して最小の責務・契約・UI領域に限定する。
- out-of-scopeは自動変更しない。
- 依頼範囲外の既存機能、data、UI、API、公開方式を維持する。
- `confirmed / inferred / unknown` を区別し、推測だけで原因・不要・安全等を断定しない。
- 同等機能や再利用可能な既存部品は、責務や依存関係が自然な場合だけ再利用する。
- 新しい責務を既存の巨大fileへ安易に追記しない。
- 機能追加のついでに無関係な大規模整理を行わない。

## 高リスク条件への切替

更新中に次が必要になった場合は、該当部分だけ専用Protocolを優先します。

- 障害・主要機能停止・data消失疑い → `INCIDENT_RECOVERY_PROTOCOL.md`
- 保存形式・schema・列・API契約等の変更 → `DATA_MIGRATION_PROTOCOL.md`
- Cloudflare / GAS / Binding / Secret / Variable等の変更 → `ENVIRONMENT_CHANGE_PROTOCOL.md`
- 不要code・旧互換・旧API等の削除 → `CLEANUP_DELETION_PROTOCOL.md`
- library / SDK / runtime等の更新 → `DEPENDENCY_UPDATE_PROTOCOL.md`

Production Mutationが必要なら、toolで実行可能でもauthorization状態を確認します。

## 変更前

1. ユーザー要望と完了条件を確認する。
2. direct-change / required-propagation / out-of-scope を整理する。
3. 対象機能の現在実装と関連fileを確認する。
4. 呼び出し元・呼び出し先・共有状態を確認する。
5. 既存の共通部品、類似機能、再利用候補を確認する。
6. 保存先、API、外部service、公開方式への影響を確認する。
7. PC / SP双方のUI影響を確認する。
8. `ai-context.json` と関連docsを確認する。
9. Evidenceとauthorization状態を確認する。

変更対象と隣接範囲が把握できたら、無関係な全体再確認は行いません。

## 実装方針

- 既存責務の延長なら既存moduleを使用する。
- 新しい責務なら、その責務に合うmoduleやfileを追加する。
- 巨大fileの分割は、今回のdirect-changeまたはrequired-propagationに含まれる範囲だけ検討する。
- event handlerへ通信、保存、変換、業務logicを直接埋め込まない。
- 新しいUIは既存の情報量、一覧性、操作感、PC/SPそれぞれの目的を維持する。
- 待ち時間のある操作には処理中表示と二重操作防止を入れる。
- errorは握り潰さず、利用者向け表示と確認用logを分ける。
- 既存dataを読めなくする変更が必要なら `DATA_MIGRATION_PROTOCOL.md` へ切り替える。
- Secret、Variable、Binding、公開URL、deploy方式を未許可で変更しない。
- sourceが存在するgenerated / derived fileは原則source側を変更する。
- 既存仕様にないsilent fallbackを追加しない。

## 検証中に別問題を発見した場合

- 今回の変更が原因 → 原則として同じbatchで修正・再確認する。
- required-propagation → 現在batchで扱える。
- recommended improvement → 記録のみ。
- unrelated issue → `PROJECT_STATUS.md` に記録して別batchへ回す。
- 重大障害、data損失、security問題 → 通常batchを中断し、高リスクProtocolへ切り替える。

## 変更後の必須確認

「可能な範囲で確認」という一括表現で省略せず、重要項目を `verified / blocked / not-applicable` で扱います。

対象に応じて確認するもの:

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

blockedなら理由、代替確認、残存riskを記録します。

commit成功、HTTP 200、deploy成功、画面が開いたことだけでは機能成功とみなしません。

## ドキュメント更新

変更内容に応じて必要なものだけ更新します。

- 構成・責務・依存関係 → `docs/ARCHITECTURE.md`
- API・保存形式・schema・列構成 → `docs/DATA_CONTRACT.md`
- UI維持事項・操作ルール → `docs/UI_RULES.md`
- 安定機能、開発中項目、既知問題、次task → `docs/PROJECT_STATUS.md`
- entrypointや主要構成 → `ai-context.json`

runtimeへ影響しないdocsのみの変更でbuild番号を上げる必要はありません。公開code / UI / runtime / deployed assetが変わる場合は中央build policyまたはapp固有policyに従います。

## 完了状態

- **完了** — 実装と必要検証まで完了。
- **作業完了 / 検証保留** — 実装は完了したが必要検証の一部がblocked。
- **未完了** — 実装、移行、設定変更そのものに残作業がある。

必要に応じて implementation / deployment / verification / documentation を `complete / pending / not-applicable` で記録します。
