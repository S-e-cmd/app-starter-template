# Bootstrap Protocol

新規アプリを空のGitHubリポジトリへ展開するときに、AIが必ず先に通す初期化手順です。

## 前後の標準フロー

この手順単独ではなく `docs/CREATE_AND_DEPLOY_FLOW.md` の一部として扱います。

- ブートストラップ前: AIがGitHub新規リポジトリ作成設定を具体値で案内する。
- ブートストラップ後: アプリ初期実装を完了する。
- 公開が必要な場合: AIが実リポジトリを確認してCloudflare等の設定値を具体的に案内する。

GitHub作成設定やCloudflare設定をユーザーに推測させません。

## 対象

ユーザーが名前だけ付けた新規GitHubリポジトリURLと、作りたいアプリ要件を渡した場合に適用します。

GitHubの `Use this template` は不要です。ユーザーにテンプレート種類を選ばせません。

## 必須ゲート

アプリ固有の実装へ進む前に、次を完了してください。

1. `manifest.json` と共通ルールを読む。
2. 対象リポジトリを確認する。
3. 対象リポジトリに `ai-context.json` がない場合は、未ブートストラップ状態として扱う。
4. 要件から必要な構成を判断する。`core` は必須で、Worker / D1 / Sheets-GAS は必要なものだけ追加する。
5. 次の自己引き継ぎファイルを対象リポジトリへ作成する。
   - `ai-context.json`
   - `llms.txt`
   - `docs/ARCHITECTURE.md`
   - `docs/DATA_CONTRACT.md`
   - `docs/UI_RULES.md`
   - `docs/PROJECT_STATUS.md`
6. COREの責務分割済み基盤と、必要な追加構成を展開する。
7. その後に初めてアプリ固有機能を実装する。
8. 実装完了前に `docs/TEMPLATE_CHECKLIST.md` を使って必須ファイル、親manifest参照、責務分割、ビルド番号を確認する。
9. Cloudflare等で公開する場合は、対象リポジトリの実際の設定ファイル・package scripts・Worker構成・出力先・Bindingsを確認してから、作成画面へ入力する具体値を案内する。

## 禁止

- 自己引き継ぎファイルを作らず、通常のアプリ実装へ直行しない。
- `README.md` だけ作ってブートストラップ完了扱いにしない。
- ユーザーへ `Use this template` を要求しない。
- ユーザーへ CORE / Worker / D1 / Sheets-GAS の選択を要求しない。
- CloudflareのBuild command、Deploy command、出力先、Bindings等をリポジトリ確認なしで決め打ちしない。
- 1つの巨大な `app.js`、`style.css`、`worker.js`、`コード.gs` に実装を集約しない。

## 既に実装が始まっている場合

対象リポジトリにコードがあるのに `ai-context.json` 等が不足している場合は、作り直しを前提にしません。

1. 現在のコードと構成を確認する。
2. 現状に合わせて自己引き継ぎファイルを追加する。
3. 明らかな責務混在だけ安全に分離する。
4. 既存機能とデータ互換性を維持する。
5. 以後は通常の継続保守ルールへ移行する。

ブートストラップと初期実装は同じ作業単位で完了させ、自己引き継ぎ情報が欠けた状態を完成扱いにしません。
