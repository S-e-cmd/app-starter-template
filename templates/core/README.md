# Core Application Template

新規アプリの共通土台です。見た目の完成形ではなく、後から機能が増えても保守しやすい責務分割と自己引き継ぎを標準化します。

## 必須構成

- `index.html`
- `src/main.js`
- `src/config/app-config.js`
- `src/core/`
- `src/ui/`
- `src/api/`
- `src/storage/`
- `src/features/`
- `src/utils/`
- `styles/base.css`
- `styles/layout.css`
- `styles/components.css`
- `styles/responsive.css`
- `docs/ARCHITECTURE.md`
- `docs/DATA_CONTRACT.md`
- `docs/UI_RULES.md`
- `docs/PROJECT_STATUS.md`
- `ai-context.json`

## 標準基盤

- `APP_CONFIG` にアプリ名、ビルド番号、API設定を集約
- ビルド番号を画面上で確認可能
- API timeout とJSON検証
- LocalStorageの安全な読み書き
- 処理中オーバーレイ
- トースト
- 共通エラー通知
- 空状態表示
- モーダル
- PC/SP向け最低限の共通CSS

## 継続ルール

機能追加や構造変更後も `ai-context.json` と `docs/` を最新状態に維持してください。新しい責務は既存巨大ファイルへの追記ではなく適切なモジュールへ分離し、コードだけを更新して引き継ぎ情報を古いまま残した状態は完了扱いにしません。

GitHub Actionsは標準では使用しません。
