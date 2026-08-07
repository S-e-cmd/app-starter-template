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

- `templates/core/`
- `templates/cloudflare-worker/`
- `templates/d1/`
- `templates/sheets-gas/`

GitHub Actionsは標準では使用しません。
