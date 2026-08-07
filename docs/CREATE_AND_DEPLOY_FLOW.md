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

ただし、設定値をテンプレート内で一律固定してはいけません。アプリ要件、既存資産、公開予定、機密性を確認して、そのアプリに適した値を決めます。

案内対象:

- Repository name
- Description
- Visibility
- README / .gitignore / License 等の初期化有無

標準では、AIが後からbootstrapを行えるよう余計な初期ファイルを作らない構成を優先しますが、既存運用や要件がある場合はそちらを優先します。

ユーザーには新規リポジトリを作成してURLを返してもらいます。

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

GitHub側の初期実装が完了したら、AIは対象リポジトリの実際の構成と既存Cloudflare設定を確認してからCloudflare設定値を提示します。

### 固定してよいのは判断ルールだけ

Workers / Pages、Production branch、Project / Worker name、Framework preset、Build command、Deploy command、Root directory、Build output directory、Compatibility date、Bindings 等をテンプレート内で一律固定してはいけません。

必ず対象リポジトリの実物を確認し、必要に応じて次を確認します。

- `package.json`
- `wrangler.jsonc` / `wrangler.toml`
- Worker entrypoint
- 静的ファイル構成と出力先
- 既存Cloudflareプロジェクト
- 既存Production branch
- D1 / KV / R2 / その他Bindings
- 必要Secret / Variable
- 既存の自動デプロイ方式

既存CloudflareプロジェクトやBindingがある場合は、それを優先し、理由なく新規作成や名称変更を案内しません。

### ユーザーへの案内方法

確認後、ユーザーが判断し直さなくて済むよう、そのまま入力・選択できる完成した設定一覧を提示します。

案内項目の例:

```text
Cloudflare product
実構成から判断した Workers / Pages 等

Repository
owner/repository

Project / Worker name
確認後に確定した値

Production branch
確認後に確定した値

Framework preset
必要な場合のみ

Build command
確認後に確定した値。不要なら「空欄」と明記

Deploy command
確認後に確定した値。不要なら「空欄」と明記

Root directory
必要な場合のみ。不要なら「空欄」と明記

Build output directory
必要な場合のみ。不要なら「空欄」と明記
```

必要な場合は続けて次も具体値で案内します。

- Secrets
- Environment Variables
- D1 database と binding名
- KV / R2 / other bindings
- Compatibility date / flags
- Custom domain

Secretはリポジトリへ埋め込まず、Cloudflare等のSecret管理へ配置します。既存のSecret名やBinding名がある場合はそれを維持します。

## 5. 原則としてユーザーに考えさせない

初期設定の標準方針は「同じ値を毎回使う」ことではありません。

AIは実際の要件とリポジトリ構成を確認し、その時点で必要なGitHub・Cloudflare設定を具体値で提示します。

- 設定値を推測で固定しない。
- 不要項目は「空欄」「不要」と明記する。
- 複数の妥当な方式があり、結果に実質的な差がある場合だけユーザーへ選択を求める。
- 既存設定が確認できる場合は、新しい既定値より既存設定を優先する。
- ユーザーに設定値の調査や判断を丸投げしない。

## 6. ユーザー設定後

ユーザーがCloudflare設定完了を伝えたら、AIは可能な範囲で次を確認します。

- GitHubとCloudflareの接続対象が一致しているか
- デプロイ成功状況
- 公開URL
- ビルド番号
- 必須Secret / Variable / Bindingの不足
- 初回表示と主要機能

## 7. 完了条件

次が揃うまで新規アプリ作成フローを完了扱いにしません。

- GitHubリポジトリ作成設定を具体値で案内した
- 対象リポジトリへbootstrapと初期実装を行った
- 自己引き継ぎ情報が揃っている
- Cloudflareが必要な場合、実リポジトリと既存設定に基づく設定値を案内した
- 公開後の確認を行った、または未確認事項を明示した

Cloudflareを使用しない構成の場合は、不要なCloudflare設定を案内しません。
