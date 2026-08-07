# Development Rules

## 最初に作業モードとscopeを決める

実装前に `docs/PROTOCOL_ROUTING_RULES.md` を確認し、ユーザーの現在の目的から主作業モードを決めます。

Repo URL、公開URL、starter参照の有無だけではモードを決めません。

- 新規作成 → create / bootstrap
- 通常の機能追加・仕様変更 → feature change
- 全体整理・安定化・引き継ぎ改善 → existing-app alignment
- 障害 → incident recovery

続けて `direct-change / required-propagation / out-of-scope` を区別します。改善可能、関連、同じfile、fileが長い、一般的best practiceとの差だけではscopeを広げません。

## 基本方針

- 新規アプリは初期実装から責務単位で分割する。
- 巨大file化してから分割するのではなく、新しい責務が生じた時点で分離する。
- UI、状態管理、通信、保存、data変換、業務logicを混在させない。
- 依頼範囲外の既存機能、既存data、既存APIの互換性を維持する。
- 依頼されていない全面書き直し、大規模layout変更、library置換を行わない。
- `confirmed / inferred / unknown` を区別し、推測だけで不要・原因・安全等を断定しない。

## 高リスク変更への切替

通常の機能追加・整備中でも、次に該当した部分では専用Protocolを優先します。

- 公開障害、起動不能、主要機能停止、data消失疑い → `INCIDENT_RECOVERY_PROTOCOL.md`
- LocalStorage / D1 / Sheets / KV / R2 / JSON / API等の形式変更・移行 → `DATA_MIGRATION_PROTOCOL.md`
- Cloudflare / GAS / GitHub連携 / Binding / Secret / Variable等の環境設定変更 → `ENVIRONMENT_CHANGE_PROTOCOL.md`
- 不要code・file・旧API・互換処理等の削除整理 → `CLEANUP_DELETION_PROTOCOL.md`
- library、SDK、runtime、build基盤等の更新 → `DEPENDENCY_UPDATE_PROTOCOL.md`

複数該当時は `PROTOCOL_ROUTING_RULES.md` の安全停止・優先順位を使います。

## 変更前

1. 対象機能と関連fileを確認する。
2. 呼び出し元・呼び出し先を確認する。
3. 保存data・API・PC/SP表示への影響を確認する。
4. `ai-context.json` と `docs/` の現在情報を確認する。
5. Evidence状態を確認する。
6. Production Mutation、破壊的操作、高リスク条件の有無を確認する。
7. Production Mutationならauthorization状態を確認する。

**toolで実行可能であることは、ユーザーが変更を許可したことを意味しません。**

## 実装

- 新機能追加時は既存fileへの追記を第一選択にしない。
- 新しい責務なら `features/`、`services/`、`repositories/` 等へ分離する。
- 既存アプリではdirectory名をtemplateへ合わせることを目的にしない。
- event handler内に通信、保存、変換、業務logicを直接埋め込まない。
- 共通処理は、責務が一致し不要な依存を増やさない場合に再利用する。
- 行数削減だけを目的とした過剰分割はしない。
- errorを握り潰さず、利用者向け表示と確認用logを分ける。
- 待ち時間のある操作には処理中表示と二重操作防止を入れる。
- 検証中に見つけた無関係な既存問題を「ついで」に同じbatchへ混ぜない。
- sourceが存在するgenerated / derived fileは、原則source側を変更する。
- 主要保存先、認証、API、公開方式をsilent fallbackで切り替えない。

## Production Mutation

Production Mutationの対象・許可状態は `PROTOCOL_ROUTING_RULES.md` を正本とします。

広い依頼だけで、実data削除、schema破壊、Secret削除、Binding改名、production branch変更、公開URL変更等の個別操作まで許可済みとみなしません。

## 同時編集・競合

GitHub等への書き込み時にSHAや内容の競合が起きた場合、古い内容で上書きしません。

1. 最新版を再取得する。
2. 他者・別Chatの変更を確認する。
3. 自分の差分だけを最新内容へ再適用する。
4. 競合解消のために他の正常変更を無断で削除しない。

長時間作業後や重要fileへの書き込み前は、必要に応じて現在SHA・内容を再確認します。

## 変更後

重要項目は `verified / blocked / not-applicable` で扱います。blockedなら理由、代替確認、残存riskを記録します。

1. 対象機能。
2. 関連する既存機能の回帰。
3. 構文・JSON・通信・保存・初期表示・再読み込み。
4. PC/SP双方への影響。
5. 必要なdocs更新。
6. 公開runtime / deployed assetが変わる場合はbuild番号policyを適用。

## build番号

共通policyは `PROTOCOL_ROUTING_RULES.md` と `manifest.json` を正本とします。

- ユーザーが確認する公開code / UI / runtime behavior / deployed assetが変わる → 原則 `YYYYMMDD-NN` を更新。
- docsのみ、READMEのみ、runtimeへ影響しないreview記録のみ → 原則更新不要。
- rollback / roll-forwardで公開内容が変わる → 新しいbuild番号を付ける。
- 対象アプリに明示的な別version policyがある → そのapp固有policyを優先。

## 完了状態

全体状態:

- **完了** — 作業と必要検証が完了。
- **作業完了 / 検証保留** — 変更は完了したが必要検証の一部がblocked。
- **未完了** — 実装・復旧・移行・設定変更そのものに残作業がある。

必要に応じて implementation / deployment / verification / documentation を `complete / pending / not-applicable` で記録します。

commit成功、HTTP 200、deploy成功、画面表示だけでは機能成功とみなしません。目的状態を確認します。

## GitHub Actions

GitHub Actionsは標準採用しません。

自動化は原則として次の順で検討します。

1. アプリ実行時処理
2. 手動実行
3. Cloudflare側の機能
4. GAS trigger
5. その他の既存基盤
6. GitHub Actions

Actionsを採用するのは、GitHub上で実行する必然性があり、実行頻度と消費量が妥当で、他の方法より明確に適している場合に限ります。
