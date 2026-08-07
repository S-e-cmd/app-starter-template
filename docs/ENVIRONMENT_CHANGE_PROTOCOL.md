# Environment Change Protocol

Cloudflare、GAS、GitHub連携、Secrets、Variables、Bindings、外部API等の環境設定を変更する場合の手順です。

## 基本原則

- コード変更と環境設定変更を区別して扱う。
- 現在の実設定を確認してから変更案内する。
- ツールで変更可能であることは、ユーザーが変更を許可したことを意味しない。
- 既存Project名、Worker/Pages方式、Production branch、Binding名、Secret名、Variable名、公開URLを勝手に変更しない。
- ユーザー操作が必要な場合は、画面・項目・入力値・変更後の確認まで具体的に示す。
- 設定変更後は目的状態まで確認する。deploy成功だけで完了扱いにしない。

## 現在設定の情報源優先順位

情報が食い違う場合は原則として次を確認します。

1. 実稼働環境の現在設定・runtime behavior。
2. deployment metadata / provider configuration。
3. 対象production branchの設定ファイル。
4. 対象アプリのhandoff docs。
5. README等の説明資料。
6. 推測。

推測は変更根拠にしません。Secret値そのものを無理に取得・記録する必要はなく、存在・名前・参照関係を必要範囲で確認します。

## 変更前確認

1. 現在のデプロイ方式を確認する。
2. 現在のProject/Worker名、branch、Bindings、Secrets、Variablesを確認する。
3. コード側が参照する名前と一致しているか確認する。
4. 既存公開URL、自動デプロイ、GAS deployment等への影響を確認する。
5. 元へ戻すための現在値を記録する。
6. 対象操作がProduction Mutationか確認する。
7. Production Mutationなら `not-authorized / authorized-for-this-operation / already-approved-in-current-task` の許可状態を確認する。

広い依頼、例:「環境も整えて」「本番変更も含めて対応」は、Secret削除、Binding改名、production branch変更、Worker/Project削除等への包括許可とはみなしません。

## 実施

- 許可された必要項目だけ変更する。
- Secret値そのものをリポジトリへ書かない。
- 名前変更が必要な場合は参照箇所と移行手順を先に確認する。
- CloudflareとGitHubの接続先を推測で切り替えない。
- 既存設定が正常なら、テンプレート既定値より既存値を優先する。
- 既存仕様として定義されていないfallbackへ勝手に切り替えない。

## 確認

重要項目は `verified / blocked / not-applicable` で扱います。

- デプロイ結果。
- 公開URLが維持または意図どおり変更。
- API / Binding / Secret参照が正常。
- 自動デプロイやトリガーが意図どおり動作。
- 対象機能が目的状態になっている。
- 公開runtimeへ変更がある場合はapp固有version policyに従ってbuild番号が整合している。

blockedなら理由、代替確認、残存リスクを記録します。

## 禁止事項

- 実設定を見ず固定値を案内する。
- ツール権限があることだけを理由に本番設定を変更する。
- 既存BindingやSecret名を理由なく変更する。
- コード側だけ変更して環境設定変更を記録しない。
- deploy成功だけで機能成功とみなす。
- 主要保存先・認証・公開方式をsilent fallbackで切り替える。

## 記録

`docs/ARCHITECTURE.md` または `docs/PROJECT_STATUS.md` に、確認した情報源、変更した環境項目、維持した設定、authorization状態、ユーザー操作が必要だった箇所、verified / blocked項目、確認結果を記録します。
