# App Starter Template

新規アプリを初期段階から保守しやすく作るための基盤と、既存アプリを壊さず更新・整備・復旧するためのAI向け正本です。

## 最重要: まず作業モードを決める

最初に `docs/PROTOCOL_ROUTING_RULES.md` を読み、ユーザーの現在の目的から主作業モードを決めます。

- 新しいアプリを作る → 新規立ち上げ
- 既存アプリへ機能追加・仕様変更・UI改善を行う → 更新
- 既存アプリ全体の整理・安定化・引き継ぎ改善を行う → 整備
- 正常稼働していたアプリや主要機能が壊れた → 障害復旧

GitHubリポジトリURL、公開URL、このスターターテンプレートが提示されていること自体は、整備モードを選ぶ理由にしません。

通常の更新・整備中でも、データ移行、環境設定変更、削除、依存更新等の高リスク条件が発生した部分では専用プロトコルを優先します。

ユーザーが明示的に変更を依頼した範囲は変更してよく、それ以外の既存機能、データ、UI、API、公開方式を保護します。

## 新規アプリ

新規アプリでは `docs/CREATE_AND_DEPLOY_FLOW.md` と `docs/BOOTSTRAP_PROTOCOL.md` を使います。

標準フロー:

1. ユーザーが作りたいアプリの要件を伝える。
2. AIがGitHub新規リポジトリ作成設定を具体値で提示する。
3. ユーザーが新規リポジトリを作り、そのURLをChatへ渡す。
4. AIが `manifest.json` と新規アプリ用ルールを読む。
5. AIはアプリ実装より先に `docs/BOOTSTRAP_PROTOCOL.md` を完了する。
6. AIが要件から必要な構成を自動判断する。
7. AIが対象リポジトリへ自己引き継ぎファイルと責務分割済み基盤を作成する。
8. その後にアプリ固有機能を実装する。
9. `docs/TEMPLATE_CHECKLIST.md` で確認してから初期実装完了とする。
10. Cloudflare等で公開する場合、AIは実際のリポジトリ構成を確認してから、そのまま入力できる公開設定値を案内する。
11. ユーザー設定後、公開URL・ビルド・必要Secret / Variable / Binding・主要動作を確認する。

新規アプリとして作成された対象リポジトリに `ai-context.json` がない場合は未ブートストラップ状態です。既存アプリに `ai-context.json` がないことだけを理由に、新規アプリとして作り直しません。

GitHubの `Use this template` は必須ではなく、通常は案内しません。ユーザーが明示的に希望した場合だけ使用します。

GitHub作成設定やCloudflare公開設定をユーザーに考えさせるのではなく、AIが要件と実装構成から具体値を提示します。

## 更新

立ち上げ後の通常の機能追加・仕様変更・UI改善・限定的不具合修正は `docs/FEATURE_CHANGE_PROTOCOL.md` を使用します。

- ユーザーが変更を求めた範囲は変更対象。
- 依頼範囲外の既存挙動は維持。
- 変更対象と隣接範囲だけ確認し、無関係な全体再確認を繰り返さない。
- 機能追加のついでに大規模整理をしない。
- 再利用は責務と依存関係が自然な場合だけ優先する。
- 高リスク条件が出た部分は専用プロトコルへ切り替える。

## 整備

既存アプリ全体の整理、安定化、責務整理、引き継ぎ改善は `docs/EXISTING_APP_ALIGNMENT_PROTOCOL.md` を使用します。

- テンプレート準拠を目的にしない。
- テンプレートのディレクトリ構成へ無理に変換しない。
- 安全な小単位で `確認 → 修正 → 回帰確認 → 記録` を完結する。
- 各バッチ終了時に整備必要度、理由、推奨、説明付き選択肢を提示する。

## 障害復旧

白画面、起動不能、ログイン不能、主要機能停止、データ消失疑い等では `docs/INCIDENT_RECOVERY_PROTOCOL.md` を最優先します。

- 壊れた状態へ推測修正を重ねない。
- `last known good` は単なる直前commitではなく、正常動作を確認できる最新状態を指す。
- 原因不明、影響大、または1回の限定修正サイクルで復旧しない場合はロールバックを優先する。
- `revert` や正常版を新commitとして復元する等、Git履歴を壊さない復旧を優先する。
- force pushや履歴改変を通常の復旧手段にしない。
- 復旧と恒久修正は別バッチにする。

## 共通安全ルール

`docs/PROTOCOL_ROUTING_RULES.md` では、次も共通ルールとして定義します。

- 破壊的操作の停止条件
- 複数プロトコル該当時の優先順位
- `last known good` とロールバックの定義
- 検証状態を `完了 / 作業完了・検証保留 / 未完了` の3状態で表す
- 検証中に見つけた無関係な既存問題を勝手に同じバッチへ混ぜない
- 競合時は最新内容を再取得し、自分の差分だけ再適用する
- セキュリティ事故ではSecret失効等の封じ込めを通常復旧より優先する

## 入口

- `manifest.json` — 機械可読の中央ルール
- `docs/PROTOCOL_ROUTING_RULES.md` — 作業モード判定、優先順位、共通安全ルール
- `docs/CREATE_AND_DEPLOY_FLOW.md` — GitHub新規リポジトリ作成設定から公開確認まで
- `docs/BOOTSTRAP_PROTOCOL.md` — 新規アプリ初期化
- `docs/FEATURE_CHANGE_PROTOCOL.md` — 立ち上げ後の通常更新
- `docs/EXISTING_APP_ALIGNMENT_PROTOCOL.md` — 既存アプリ全体の非破壊整備
- `docs/INCIDENT_RECOVERY_PROTOCOL.md` — 障害復旧
- `docs/DATA_MIGRATION_PROTOCOL.md` — データ移行
- `docs/ENVIRONMENT_CHANGE_PROTOCOL.md` — 環境・設定変更
- `docs/CLEANUP_DELETION_PROTOCOL.md` — 削除・整理
- `docs/DEPENDENCY_UPDATE_PROTOCOL.md` — 依存・ランタイム更新
- `docs/BATCH_COMPLETION_CHOICES.md` — 整備バッチ終了時の判断提示
- `docs/TEMPLATE_CHECKLIST.md` — 全モードの確認
- `docs/DEVELOPMENT_RULES.md` — 実装・継続保守ルール
- `docs/ARCHITECTURE_RULES.md` — 責務分割・構成ルール
- `docs/UI_RULES.md` — UI維持ルール
- `docs/DATA_RULES.md` — データ互換ルール

## テンプレート構成

- `templates/core/` — 全アプリ共通のフロント基盤、build/config、共通UI、API、Storage、自己引き継ぎ資料
- `templates/cloudflare-worker/` — route / service / repository 分割のWorker構成
- `templates/d1/` — schema / migration / repository を追加するD1構成
- `templates/sheets-gas/` — config / API / Sheets / utils に分割したGAS構成

これらの構成選択は新規アプリ向けです。既存アプリをこの構成へ合わせるためには使用しません。

## 生成・整備アプリに残す引き継ぎ情報

- `ai-context.json`
- `llms.txt`
- `docs/ARCHITECTURE.md`
- `docs/DATA_CONTRACT.md`
- `docs/UI_RULES.md`
- `docs/PROJECT_STATUS.md`

既存アプリへ追加する場合は、テンプレートの理想状態ではなく現在のアプリの実態を記録します。

途中のChatで公開URLまたはGitHubリポジトリだけが共有された場合も、対象アプリ自身の `ai-context.json` と `docs/` から現在構成を確認し、親テンプレートの共通ルールへ戻れる状態を維持します。

GitHub Actionsは標準では使用しません。
