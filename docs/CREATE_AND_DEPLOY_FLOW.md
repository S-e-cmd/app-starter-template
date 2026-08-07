# Create and Deploy Flow

新規アプリ作成時に、AIがユーザーへGitHub作成設定から公開設定までを順番に案内する標準フローです。

## 1. 要件整理

AIはユーザーのアプリ要件を確認し、実装前に次を内部判断します。

- Repository name候補。
- Description。
- Visibilityの推奨。
- 必要template構成（coreは必須）。
- Cloudflare Worker / D1 / Sheets-GAS等の必要性。
- Secret / Variable / Bindingの必要性。

テンプレート種類をユーザーに選ばせません。

ただし、後から変更コスト、安全性、費用、data contractへ大きく影響する次の事項は、要件から明確でない場合に推測で固定しません。

- public / private。
- 認証要否・認証方式。
- 永続保存先。
- 個人情報・機密情報の保存有無。
- 課金service利用。
- 外部公開範囲。
- retention / deletion policy。

要件から合理的に一意に決まる場合は具体値まで提示し、複数の実質的に異なる安全・費用上の選択肢が残る場合だけユーザー判断を求めます。

## 2. GitHub新規リポジトリ作成案内

AIはユーザーへ、そのまま入力できる具体値でGitHub作成設定を提示します。

案内対象:

- Repository name。
- Description。
- Visibility。
- README / .gitignore / License等の初期化有無。

標準では、AIが後からbootstrapを行えるよう余計な初期fileを作らない構成を優先しますが、既存運用や要件がある場合はそちらを優先します。

ユーザーには新規repositoryを作成してURLを返してもらいます。GitHubの `Use this template` は通常案内しません。

## 3. 空リポジトリ受領後

対象repository URLを受け取ったら `docs/BOOTSTRAP_PROTOCOL.md` を実行します。

順序:

1. starter manifest、`PROTOCOL_ROUTING_RULES.md`、共通rulesを読む。
2. 対象repositoryを確認する。
3. 必要template構成を要件から自動判断する。
4. 自己引き継ぎfileを作成する。
5. bootstrap時のstarter schemaVersion / template commit SHA / revision / parent manifest URLを `ai-context.json` に記録する。
6. 責務分割済み基盤を展開する。
7. アプリ固有機能を実装する。
8. `docs/TEMPLATE_CHECKLIST.md` で確認する。

## 4. 公開設定の案内

GitHub側の初期実装が完了したら、AIは対象repositoryの実際の構成と既存deployment設定を確認してから設定値を提示します。

固定してよいのは判断rulesだけです。Workers / Pages、Production branch、Project / Worker name、Framework preset、Build command、Deploy command、Root directory、Build output directory、Compatibility date、Bindings等をtemplate内で一律固定しません。

必要に応じて次を確認します。

- `package.json`。
- `wrangler.jsonc` / `wrangler.toml`。
- Worker entrypoint。
- 静的file構成と出力先。
- 既存Cloudflare project。
- 既存Production branch。
- D1 / KV / R2 / その他Bindings。
- 必要Secret / Variable。
- 既存の自動deploy方式。

既存projectやBindingがある場合は理由なく新規作成や名称変更を案内しません。

## 5. 環境設定の情報源とauthorization

設定情報が食い違う場合は `PROTOCOL_ROUTING_RULES.md` の情報源優先順位に従います。推測を設定変更の根拠にしません。

ユーザーへ案内するだけでなく、AI自身がconnector等でproduction設定を変更できる場合でも、**tool上可能であることは変更authorizationを意味しません。**

Production Mutationに該当する変更は `not-authorized / authorized-for-this-operation / already-approved-in-current-task` を確認してから実行します。

広い「本番も含めて対応」等の依頼を、Secret削除、schema破壊、production branch変更、公開URL変更等への包括許可とはみなしません。

## 6. ユーザーへの案内方法

ユーザーが判断し直さなくて済むよう、そのまま入力・選択できる完成した設定一覧を提示します。

不要項目は「空欄」「不要」と明記します。複数の妥当な方式があり、結果に実質的な差がある場合だけユーザーへ選択を求めます。

Secretはrepositoryへ埋め込まず、providerのSecret管理へ配置します。既存Secret名やBinding名がある場合はそれを維持します。

## 7. 設定後の確認

ユーザーまたはAIがdeployment設定を完了したら、重要項目を `verified / blocked / not-applicable` で確認します。

- GitHubとproviderの接続対象が一致しているか。
- deployment結果。
- 公開URL。
- build番号。
- 必須Secret / Variable / Bindingの不足。
- 初回表示と主要機能。
- 保存・再読み込み等、目的状態に必要な操作。

HTTP successやdeploy成功だけでは機能成功とみなしません。

blockedなら理由、代替確認、残存riskを記録します。

## 8. 完了条件

- GitHub repository作成設定を具体値で案内した。
- 対象repositoryへbootstrapと初期実装を行った。
- 自己引き継ぎ情報が揃っている。
- bootstrap時template revision情報を記録した。
- 公開が必要な場合、実repositoryと既存設定に基づく設定値を案内または許可範囲内で設定した。
- 公開後の必要確認を行った、またはblocked項目を明示した。

Cloudflareを使用しない構成の場合は不要なCloudflare設定を案内しません。
