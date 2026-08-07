# Environment Change Protocol

Cloudflare、GAS、GitHub連携、Secrets、Variables、Bindings、外部API等の環境設定を変更する場合の手順です。

## 基本原則

- コード変更と環境設定変更を区別して扱う。
- 現在の実設定を確認してから変更案内する。
- 既存Project名、Worker/Pages方式、Production branch、Binding名、Secret名、Variable名、公開URLを勝手に変更しない。
- ユーザー操作が必要な場合は、画面・項目・入力値・変更後の確認まで具体的に示す。
- 設定変更後は公開ページまたは実接続まで確認する。

## 変更前確認

1. 現在のデプロイ方式を確認する。
2. 現在のProject/Worker名、branch、Bindings、Secrets、Variablesを確認する。
3. コード側が参照する名前と一致しているか確認する。
4. 既存公開URL、自動デプロイ、GAS deployment等への影響を確認する。
5. 元へ戻すための現在値を記録する。

## 実施

- 必要な項目だけ変更する。
- Secret値そのものをリポジトリへ書かない。
- 名前変更が必要な場合は参照箇所と移行手順を先に確認する。
- CloudflareとGitHubの接続先を推測で切り替えない。
- 既存設定が正常なら、テンプレート既定値より既存値を優先する。

## 確認

- デプロイ成功。
- 公開URLが維持または意図どおり変更。
- API/Binding/Secret参照が正常。
- 自動デプロイやトリガーが意図どおり動作。
- ビルド番号と公開状態が一致。

## 禁止事項

- 実設定を見ず固定値を案内する。
- 既存BindingやSecret名を理由なく変更する。
- コード側だけ変更して環境設定変更を記録しない。
- 公開確認なしで完了扱いにする。

## 記録

`docs/ARCHITECTURE.md` または `docs/PROJECT_STATUS.md` に、変更した環境項目、維持した設定、ユーザー操作が必要だった箇所、確認結果を記録します。
