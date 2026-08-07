# Template Validation Checklist

新規アプリ作成時と継続改修時に、GitHub Actionsへ依存せずその場で確認するためのチェックリストです。

## ブートストラップ完了ゲート

新規アプリでは、アプリ固有機能の実装完了より先に `docs/BOOTSTRAP_PROTOCOL.md` を満たしてください。

次のすべてが揃うまで初期実装完了扱いにしません。

- `ai-context.json` がアプリ直下にある。
- `llms.txt` がアプリ直下にある。
- `docs/ARCHITECTURE.md` がある。
- `docs/DATA_CONTRACT.md` がある。
- `docs/UI_RULES.md` がある。
- `docs/PROJECT_STATUS.md` がある。
- `ai-context.json` から親テンプレートの公開 `manifest.json` へ戻れる。
- `core` が適用されている。
- 要件に応じた追加構成だけが適用されている。
- 責務分割済みの基盤がある。

READMEやアプリ固有コードだけが存在しても、上記が欠けていれば未ブートストラップです。

## 新規アプリ作成時

- ユーザーへ `Use this template` を要求していない。
- ユーザーへ CORE / Worker / D1 / Sheets-GAS の選択を要求していない。
- AIが要件から構成を判断した。
- `index.html` から `/ai-context.json` を発見できる。
- ビルド番号が `YYYYMMDD-NN` 形式で画面と設定に反映されている。
- UI、通信、保存、状態管理、業務処理が責務別に分離されている。
- GitHub Actionsが理由なく追加されていない。

## 機能追加・修正時

- 変更対象と関連ファイルを先に確認した。
- 新しい責務を既存巨大ファイルへ追記していない。
- APIや保存形式の互換性を確認した。
- 待ち時間のある操作に処理中表示と二重操作防止がある。
- PC/SP双方への影響を確認した。
- 構文・通信・保存・初期表示・再読み込みを確認した。
- 構成変更時に `ARCHITECTURE.md` を更新した。
- データ契約変更時に `DATA_CONTRACT.md` を更新した。
- UI制約変更時に `UI_RULES.md` を更新した。
- 状態変更時に `PROJECT_STATUS.md` を更新した。
- ビルド番号を更新した。

## 引き継ぎ確認

次のどちらからでも現在状態と共通ルールへ辿れることを確認する。

1. 公開アプリURL → `/ai-context.json` / `/llms.txt` → ローカルdocs → 親manifest
2. GitHubリポジトリ → `ai-context.json` / README → ローカルdocs → 親manifest

コードだけが更新され、引き継ぎ情報が古い状態は完了扱いにしない。
