# Core Application Template

新規アプリの共通土台です。見た目の完成形ではなく、後から機能が増えても保守しやすい責務分割と自己引き継ぎを標準化します。

## 必須構成

- `src/main.js`
- `src/config/`
- `src/core/`
- `src/ui/`
- `src/api/`
- `src/storage/`
- `src/features/`
- `src/utils/`
- `styles/`
- `docs/ARCHITECTURE.md`
- `docs/DATA_CONTRACT.md`
- `docs/UI_RULES.md`
- `docs/PROJECT_STATUS.md`
- `ai-context.json`

## 継続ルール

機能追加や構造変更後も `ai-context.json` と `docs/` を最新状態に維持してください。コードだけを更新して引き継ぎ情報を古いまま残した状態は完了扱いにしません。

GitHub Actionsは標準では使用しません。
