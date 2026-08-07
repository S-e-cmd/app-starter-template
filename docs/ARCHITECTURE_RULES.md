# Architecture Rules

## 標準責務

- `src/main.js`: 起動と依存の組み立てのみ。
- `src/config/`: 定数、環境依存設定、ビルド情報。
- `src/core/`: 初期化、状態管理、共通エラー処理。
- `src/ui/`: 汎用UI部品と表示制御。
- `src/features/`: 機能単位のUI・controller・service。
- `src/api/`: HTTP/API通信。
- `src/storage/`: LocalStorage等のクライアント保存。
- `src/utils/`: 副作用の少ない共通関数。
- `worker/routes/`: HTTPルーティング。
- `worker/services/`: 業務処理。
- `worker/repositories/`: DB・外部保存先アクセス。

## 分割判断

次のいずれかに該当したら分割を優先する。

- 1ファイルが複数の責務を持つ。
- UI処理と通信・保存・変換処理が混在する。
- 新機能追加で既存責務とは別の処理が増える。
- 同じ処理が複数箇所へ複製される。
- 修正時に関係のない機能まで読み解く必要がある。

行数だけを基準にはしない。小さなファイルを大量生成すること自体を目的にしない。

## 継続保守

- 機能追加後も責務分離を維持する。
- 構成変更時は各アプリの `docs/ARCHITECTURE.md` を同じ変更単位で更新する。
- READMEまたは `ai-context.json` から現在構成へ辿れる状態を維持する。
- 別Chat・別作業者がリポジトリだけ受け取っても、対象機能の場所を判断できる状態を完成条件とする。
