# App Starter Template

新規アプリを、初期段階から保守しやすく、AI支援で継続開発しても構造が崩れにくい形で作るためのスターターテンプレートです。

## 目的

- 初期実装から責務単位で分割する
- UI・通信・保存・状態管理・業務ロジックを分離する
- 各アプリ自身に引き継ぎ情報を持たせる
- 公開URLやGitHubリポジトリだけを共有した場合でも開発ルールへ辿れるようにする
- GitHub Actionsを標準の自動化手段にしない
- 既存機能・保存データ・API互換性を維持する

## 入口

- `manifest.json` — テンプレート一覧と共通ルール
- `docs/DEVELOPMENT_RULES.md` — 実装・継続保守ルール
- `docs/ARCHITECTURE_RULES.md` — 責務分割・構成ルール
- `docs/UI_RULES.md` — UI維持ルール
- `docs/DATA_RULES.md` — データ互換ルール

## テンプレート

- `templates/core/` — 共通フロント基盤、build/config、共通UI、API、Storage、自己引き継ぎ資料
- `templates/cloudflare-worker/` — route / service / repository 分割のWorker構成
- `templates/d1/` — schema / migration / repository を追加するD1構成
- `templates/sheets-gas/` — config / API / Sheets / utils に分割したGAS構成

## 新規アプリ作成時

1. `manifest.json` と共通ルールを確認する。
2. `templates/core/` を基礎として必要な追加テンプレートを組み合わせる。
3. アプリ自身の `ai-context.json` と `docs/` を残す。
4. アプリ固有の構成・データ契約・UI維持事項・現在状態へ書き換える。
5. 以後の機能追加でもコードと引き継ぎ資料を同じ変更単位で更新する。

途中のChatで公開URLまたはGitHubリポジトリだけが共有された場合も、対象アプリ自身の `ai-context.json` と `docs/` から現在構成を確認し、親テンプレートの共通ルールへ戻れる状態を維持します。

GitHub Actionsは標準では使用しません。
