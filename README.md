# App Starter Template

新規アプリを、初期段階から保守しやすく、AI支援で継続開発しても構造が崩れにくい形で作るためのAI向け正本です。

## 標準運用

このリポジトリを人間がコピーして使うことは前提にしていません。

標準フローは次のとおりです。

1. ユーザーがGitHubで名前だけ付けた空の新規リポジトリを作る。
2. そのリポジトリURLと作りたいアプリの要件をChatへ渡す。
3. AIがこのリポジトリの `manifest.json` と共通ルールを読む。
4. AIが要件から必要な構成を自動判断する。
5. AIが対象の空リポジトリへ必要なテンプレート基盤と初期実装を直接書き込む。
6. 生成したアプリ自身に引き継ぎ情報を残す。

GitHubの `Use this template` は必須ではなく、通常は案内しません。ユーザーが明示的に希望した場合だけ使用します。

## 目的

- 初期実装から責務単位で分割する
- UI・通信・保存・状態管理・業務ロジックを分離する
- 各アプリ自身に引き継ぎ情報を持たせる
- 公開URLやGitHubリポジトリだけを共有した場合でも開発ルールへ辿れるようにする
- GitHub Actionsを標準の自動化手段にしない
- 既存機能・保存データ・API互換性を維持する

## 入口

- `manifest.json` — AIによる空リポジトリ展開方式、構成判断、テンプレート一覧、共通ルール
- `docs/DEVELOPMENT_RULES.md` — 実装・継続保守ルール
- `docs/ARCHITECTURE_RULES.md` — 責務分割・構成ルール
- `docs/UI_RULES.md` — UI維持ルール
- `docs/DATA_RULES.md` — データ互換ルール

## テンプレート構成

- `templates/core/` — 全アプリ共通のフロント基盤、build/config、共通UI、API、Storage、自己引き継ぎ資料
- `templates/cloudflare-worker/` — route / service / repository 分割のWorker構成
- `templates/d1/` — schema / migration / repository を追加するD1構成
- `templates/sheets-gas/` — config / API / Sheets / utils に分割したGAS構成

AIはユーザーにテンプレート種類を選ばせず、要件から必要な構成を判断します。

## 生成アプリに必ず残すもの

- `ai-context.json`
- `llms.txt`
- `docs/ARCHITECTURE.md`
- `docs/DATA_CONTRACT.md`
- `docs/UI_RULES.md`
- `docs/PROJECT_STATUS.md`

途中のChatで公開URLまたはGitHubリポジトリだけが共有された場合も、対象アプリ自身の `ai-context.json` と `docs/` から現在構成を確認し、親テンプレートの共通ルールへ戻れる状態を維持します。

GitHub Actionsは標準では使用しません。
