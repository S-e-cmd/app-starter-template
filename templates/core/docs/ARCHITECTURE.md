# Architecture

Build: `YYYYMMDD-NN`

## Entry Point

- `src/main.js`: 起動と依存の組み立て。

## Responsibilities

- `src/config/`: 設定・定数・ビルド情報。
- `src/core/`: 初期化・状態管理・共通エラー処理。
- `src/ui/`: 共通UI。
- `src/features/`: 機能単位の実装。
- `src/api/`: API通信。
- `src/storage/`: クライアント保存。
- `src/utils/`: 共通ユーティリティ。

## Feature Map

機能追加時に、機能名と担当ファイルをここへ追記する。

## Dependency Notes

構成や依存関係を変更した場合は、このファイルをコードと同じ変更単位で更新する。
