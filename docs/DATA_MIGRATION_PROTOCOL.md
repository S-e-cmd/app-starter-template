# Data Migration Protocol

LocalStorage、D1、Sheets、KV、R2、JSON、API等の保存形式やデータ契約を変更する場合の安全手順です。

Evidence、scope、Production Mutation、authorization fingerprint、実データ検証順序、backup区分、rollback / roll-forward、verificationは `docs/PROTOCOL_ROUTING_RULES.md` を正本とします。このProtocolではmigration固有の実施手順だけを定義します。

## 基本原則

- 旧データを読める状態を原則維持する。
- 既存key、ID、列、schema、JSON項目、API形式を互換策なしで破壊しない。
- 破壊的変更が必要ならmigrationとして扱う。
- 新旧形式を一度に切り替えず、必要に応じて段階移行する。
- migration済み判定を曖昧にしない。
- migrationは再実行しても重複・二重変換・初期化を起こさない形を優先する。
- 旧互換処理の削除はmigration完了条件を満たした後の独立cleanupとして扱う。

## 変更前確認

1. 現在の保存先とdata形式を特定する。
2. 既存data量、代表data、旧形式の有無を確認する。
3. 読み取り元・書き込み先・API・UI・external consumerへの影響を確認する。
4. 中央backup policyに従い、該当するcode / schema / actual data / environment settingsの復旧手段を確認する。
5. migration失敗時の戻し方を決める。
6. Production Mutationのauthorization fingerprintを確認する。

migration許可は、別resource、別operation-type、別target-scopeの削除・rewrite・追加migrationへ自動継承しません。

## 実装

- 旧形式reader / compatibility layerを必要期間残す。
- 新形式への変換はidempotentを優先する。
- 一部失敗時に全dataを初期化しない。
- D1 migration、Sheets列追加等は既存data保持を優先する。
- 保存先を切り替える場合は、新旧両方の読み取り・移行期間を検討する。
- silent fallbackで別保存方式へ切り替えない。
- production import / bulk rewrite / bulk createは、code実装と実data mutationを分離してauthorizationを判定する。

## migration検証

中央production data test policyに従い、安全な方法から検証します。

migration固有で確認する項目:

- 新規data保存。
- 旧data読み込み。
- migration済みdata再読み込み。
- 再実行時の重複・二重変換がないこと。
- 一部欠損dataへの耐性。
- API response / UI表示への影響。
- rollback時に旧版が現在data/schemaを読めるか。
- migration対象範囲がどこまで完了したか。

既存production実data変更は中央authorizationなしに行いません。

## 旧互換処理の削除条件

次を確認するまで旧key・旧列・旧table・旧reader・compatibility処理を削除しません。

- migration対象範囲の完了がconfirmed。
- 旧形式の残存数がゼロ、または残存条件と扱いが把握できている。
- rollbackで旧形式が必要か判断済み。
- 旧client / API consumer / external consumerの不存在がconfirmed、または互換終了が明示的にauthorizedされている。
- 削除を独立cleanup batchとして回帰確認できる。

external consumerの不存在を確認できない場合は「未使用」ではなくusage unknownとして扱います。

## 禁止事項

- migrationなしの破壊的schema変更。
- 「古そう」「不要そう」だけで旧互換を削除する。
- data不整合を初期化で解決する。
- code変更と大量data変換を無計画に同時実行する。
- production実dataへ未許可のtest writeを行う。
- migration失敗を理由に別保存方式へ無断fallbackする。
- 1つのmigration authorizationを別resource / operation / scopeへ拡張する。

## 記録

`docs/DATA_CONTRACT.md` と `docs/PROJECT_STATUS.md` に、旧形式、新形式、migration方法、互換期間、applicable backup / recovery、authorization fingerprint、verified / blocked、互換削除条件を記録します。
