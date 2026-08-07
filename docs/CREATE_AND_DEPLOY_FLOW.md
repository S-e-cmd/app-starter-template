# Create and Deploy Flow

新規アプリ作成時に、AIがユーザーへGitHub作成設定からCloudflare公開設定までを順番に案内する標準フローです。

## 1. 要件整理

AIはユーザーのアプリ要件を確認し、実装前に次を内部判断します。

- Repository name の候補
- Description
- Visibility の推奨
- 必要テンプレート構成（core は必須）
- Cloudflare Worker / D1 / Sheets-GAS 等の必要性
- Secret / Variable / Binding の必要性

テンプレート種類をユーザーに選ばせません。

## 2. GitHub新規リポジトリ作成案内

AIはユーザーへ、そのまま入力できる具体値でGitHub作成設定を提示します。

例:

```text
Repository name
mini-maker

Description
自然文からその場で使えるミニアプリUIを生成するAIアプリ

Visibility
Private

Initialize this repository
初期ファイルなし
```

ユーザーには空リポジトリを作成してURLを返してもらいます。

GitHubの `Use this template` は通常案内しません。

## 3. 空リポジトリ受領後

対象リポジトリURLを受け取ったら `docs/BOOTSTRAP_PROTOCOL.md` を実行します。

順序:

1. starter manifest と共通ルールを読む。
2. 対象リポジトリを確認する。
3. 必要テンプレート構成を要件から自動判断する。
4. 自己引き継ぎファイルを作成する。
5. 責務分割済み基盤を展開する。
6. アプリ固有機能を実装する。
7. `docs/TEMPLATE_CHECKLIST.md` で確認する。

## 4. Cloudflare公開設定の案内

GitHub側の初期実装が完了したら、AIは対象リポジトリの実際の構成を確認してからCloudflare設定値を提示します。

固定値を推測して案内してはいけません。必ず対象リポジトリの `package.json`、`wrangler.jsonc` / `wrangler.toml`、Worker構成、静的出力先、必要Bindings等を確認してから案内します。

案内項目の例:

```text
Cloudflare product
Workers / Pages のどちらを使うか

Repository
owner/repository

Project / Worker name
実際に使用する名前

Production branch
main

Build command
リポジトリ構成から確定した値

Deploy command
リポジトリ構成から確定した値

Build output directory
必要な場合のみ
```

必要な場合は続けて次も具体値で案内します。

- Secrets
- Environment Variables
- D1 database と binding名
- KV / R2 / other bindings
- Compatibility date / flags
- Custom domain

## 5. ユーザー設定後

ユーザーがCloudflare設定完了を伝えたら、AIは可能な範囲で次を確認します。

- GitHubとCloudflareの接続対象が一致しているか
- デプロイ成功状況
- 公開URL
- ビルド番号
- 必須Secret / Variable / Bindingの不足
- 初回表示と主要機能

## 6. 完了条件

次が揃うまで新規アプリ作成フローを完了扱いにしません。

- GitHubリポジトリ作成設定を具体値で案内した
- 空リポジトリへbootstrapと初期実装を行った
- 自己引き継ぎ情報が揃っている
- Cloudflareが必要な場合、実リポジトリに基づく設定値を案内した
- 公開後の確認を行った、または未確認事項を明示した

Cloudflareを使用しない構成の場合は、不要なCloudflare設定を案内しません。
