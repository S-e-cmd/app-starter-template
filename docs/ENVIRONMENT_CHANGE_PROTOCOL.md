# Environment Change Protocol

Cloudflare、GAS、GitHub連携、Secrets、Variables、Bindings、外部API、trigger / scheduled job等の環境設定を変更する場合の手順です。

Production Mutationの定義、authorization fingerprint、Evidence、情報源優先順位、blocked / unknownの扱いは `docs/PROTOCOL_ROUTING_RULES.md` を正本とします。このProtocolでは環境変更固有の確認・実施・検証手順だけを定義します。

## 基本原則

- code変更とenvironment変更を区別して扱う。
- 現在の実設定を確認してから変更する。
- toolで変更可能であることはuser authorizationを意味しない。
- 既存Project名、Worker/Pages方式、Production branch、Binding名、Secret名、Variable名、公開URLをscope外で変更しない。
- user操作が必要な場合は、画面・項目・入力値・変更後の確認まで具体的に示す。
- deploy成功だけで完了扱いにせず、目的状態を確認する。

## 変更前確認

1. 中央ruleの情報源順序に従い、現在のdeployment方式・provider設定を確認する。
2. 対象Project / Worker / branch / Binding / Secret / Variable / trigger / job等の現在状態を確認する。
3. code側の参照名・runtime参照と一致しているか確認する。
4. 公開URL、自動deploy、GAS deployment、cron / trigger、外部API等への影響を確認する。
5. applicableなenvironment settings backup / 現在値記録を残す。
6. 対象操作がProduction Mutationか中央ruleで判定する。
7. Production Mutationなら `environment / resource / operation-type / target-scope` のauthorization fingerprintを確認する。

広い「環境も整えて」「本番変更も含めて対応」は、個別のSecret削除、Binding改名、production branch変更、trigger追加、access control変更、Worker / Project削除等への包括authorizationではありません。

## 実施

- authorization済みのfingerprint範囲だけ変更する。
- Secret値そのものをrepositoryへ書かない。
- resource名・Binding名・Secret名等のrenameはcontract boundaryとして影響範囲を確認する。
- CloudflareとGitHub等の接続先を推測で切り替えない。
- 新しいresourceを作成する場合、既存productionのBinding / routing / storage / target切替まで許可されたとはみなさない。
- permission / role / ACL / access control変更を通常設定編集として扱わない。
- cron / trigger / scheduled job / consumerの追加・変更・削除を通常code editとして扱わない。
- 既存仕様として定義されていないfallbackへ勝手に切り替えない。

## 確認

重要項目は中央verification policyの `verified / blocked / not-applicable` で扱います。

対象に応じて確認します。

- deployment結果。
- 公開URLが維持または意図どおり変更されたか。
- API / Binding / Secret / Variable参照が正常か。
- access control / permissionが意図した対象だけ変わったか。
- cron / trigger / scheduled jobが意図したschedule・targetで動作するか。
- 自動deployや外部integrationが維持されているか。
- 対象機能が目的状態になっているか。
- build番号は中央build policyまたはapp固有policyと整合しているか。

blocked項目が今回の変更判断に無関係なら、他のin-scope確認・作業を継続します。

## 禁止事項

- 実設定を見ず固定値を案内する。
- tool権限だけを理由にproduction設定を変更する。
- authorization fingerprintの一部だけ一致した別操作へ許可を継承する。
- inferenceだけを設定変更の根拠にする。
- code側だけ変更してenvironment変更を記録しない。
- deploy成功だけで機能成功とみなす。
- 主要保存先・認証・公開方式をsilent fallbackで切り替える。

## 記録

`docs/ARCHITECTURE.md` または `docs/PROJECT_STATUS.md` に、確認した情報源、変更したenvironment項目、authorization fingerprint、維持した設定、user操作が必要だった箇所、verified / blocked項目、確認結果を記録します。
