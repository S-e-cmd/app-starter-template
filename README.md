# App Starter Template

新規アプリを初期段階から保守しやすく作るための基盤と、既存アプリを壊さず整備するためのAI向け正本です。

## 最重要: モードを取り違えない

### 新規アプリ

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

対象リポジトリに `ai-context.json` がない場合は、未ブートストラップ状態です。READMEやアプリコードだけを作って初期実装完了扱いにしてはいけません。

GitHubの `Use this template` は必須ではなく、通常は案内しません。ユーザーが明示的に希望した場合だけ使用します。

GitHub作成設定やCloudflare公開設定をユーザーに考えさせるのではなく、AIが要件と実装構成から具体値を提示します。CloudflareのBuild command、Deploy command、出力先、Bindings等は固定値を推測せず、対象リポジトリを確認してから決定します。

### 既存アプリ

既存アプリのGitHubリポジトリ、公開ページ、このスターターテンプレートが提示された場合は `docs/EXISTING_APP_ALIGNMENT_PROTOCOL.md` を優先します。

既存アプリではテンプレート準拠を目的にしません。

- テンプレートのディレクトリ構成へ無理に変換しない。
- テンプレートとの差分だけを理由に変更しない。
- 既存機能、UI、データ契約、API、Cloudflare設定、公開方式を優先して守る。
- 現在の構成を把握し、不足する引き継ぎ情報から補う。
- 安全な小単位で `確認 → 修正 → 回帰確認 → 記録` を完結してから次へ進む。
- 権限やツール上の制約がある場合も、そこで「できない」と終了せず、可能な確認・修正・代替作業を進める。
- ユーザー操作が必要な箇所だけ、何をどこで行うかを具体的に提示する。

既存アプリの完了条件はテンプレートとの一致ではなく、既存動作・データ互換性・公開状態を維持しながら、次の作業者が安全に継続できる状態になっていることです。

## 目的

- 新規実装では初期段階から責務単位で分割する
- UI・通信・保存・状態管理・業務ロジックを分離する
- 各アプリ自身に引き継ぎ情報を持たせる
- 公開URLやGitHubリポジトリだけを共有した場合でも開発ルールへ辿れるようにする
- GitHub Actionsを標準の自動化手段にしない
- 既存機能・保存データ・API互換性を維持する
- GitHub作成から公開確認までを一連の案内として扱う
- 既存アプリではテンプレート準拠より非破壊整備を優先する

## 入口

- `manifest.json` — 新規作成モードと既存アプリ非破壊整備モードの機械可読ルール
- `docs/CREATE_AND_DEPLOY_FLOW.md` — GitHub新規リポジトリ作成設定からCloudflare等の公開確認までの標準フロー
- `docs/BOOTSTRAP_PROTOCOL.md` — 新規アプリでアプリ固有実装より先に必ず完了する初期化手順
- `docs/EXISTING_APP_ALIGNMENT_PROTOCOL.md` — 既存アプリを壊さず小さい安全単位で整備する手順
- `docs/TEMPLATE_CHECKLIST.md` — 新規ブートストラップ、改修、既存アプリ整備の確認
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
