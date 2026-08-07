# Data Migration Protocol

LocalStorage、D1、Sheets、KV、R2、JSON、API等の保存形式やデータ契約を変更する場合の安全手順です。通常の機能追加より高リスクとして扱います。

## 基本原則

- 旧データを読める状態を原則維持する。
- 既存キー、ID、列、schema、JSON項目、API形式を不用意に破壊しない。
- 破壊的変更が必要ならmigrationを用意する。
- migration前に code / schema / actual data / environment settings の復旧手段を別々に確認する。
- 新旧形式を一度に切り替えず、必要に応じて段階移行する。
- 実データ検証を理由に既存production実データへ勝手に書き込まない。
- 旧互換処理の削除はmigration完了条件を満たした後の独立cleanupとして扱う。

## 変更前確認

1. 現在の保存先とデータ形式を特定する。
2. 既存データ量、代表データ、古い形式の有無を確認する。
3. 読み取り元・書き込み先・API・UIへの影響を確認する。
4. code backup / schema backup / actual data backup / environment settings backup のうち該当するものを別々に確認する。
5. migration失敗時の戻し方を決める。
6. Production Mutationに該当する操作のauthorization状態を確認する。

GitHubにコードが残っていることだけを、実データのbackup完了とはみなしません。

## 実装

- 旧形式読み込み互換を残す。
- 新形式への変換は再実行しても壊れないようにする。
- migration済み判定を曖昧にしない。
- 一部失敗時に全データを初期化しない。
- D1 migration、Sheets列追加等は既存データを保持する方向を優先する。
- 保存先を切り替える場合は、新旧両方の読み取り・移行期間を検討する。
- silent fallbackで別保存先へ切り替えない。

## 実データ検証の優先順位

検証は安全な方法から順に行います。

1. 読み取りのみ。
2. copy / snapshot / staging / export等の複製環境。
3. production上の新規テストレコード等、既存実データを書き換えない方法。
4. 既存production実データへの変更。

4はユーザーの明示的許可なしに行いません。テストデータを作る場合は本番データと識別でき、後で安全に削除できる形にします。

## 確認

- 新規データ保存。
- 旧データ読み込み。
- migration済みデータ再読み込み。
- 再実行時の重複・二重変換がないこと。
- 一部欠損データへの耐性。
- APIレスポンスやUI表示への影響。
- rollback時に旧版が現在data/schemaを読めるか。
- migration対象範囲がどこまで完了したか。

重要検証項目は `verified / blocked / not-applicable` で記録し、blockedなら理由、代替確認、残存リスクを残します。

## 旧互換処理の削除条件

次を確認するまで旧キー・旧列・旧table・旧reader・互換処理を削除しません。

- migration対象範囲の完了が確認できる。
- 旧形式の残存数がゼロ、または残存条件と扱いが把握できている。
- rollbackで旧形式が必要かどうか判断済み。
- 旧client / API consumer / external consumerの不存在を確認できる、または互換終了が明示的に許可されている。
- 削除を独立したcleanupバッチとして回帰確認できる。

外部consumerの不存在を確認できない場合は「未使用」ではなく「利用状況不明」と扱い、互換処理を削除しません。

## 禁止事項

- migrationなしの破壊的schema変更。
- 「古そう」という理由だけで旧互換を削除する。
- 実データ確認なしで旧キー・列・tableを削除する。
- データ不整合を初期化で解決する。
- コード変更と大量データ変換を無計画に同時実行する。
- production実データへ未許可のテスト書き込みを行う。
- migration失敗を理由に別保存方式へ無断fallbackする。

## 記録

`docs/DATA_CONTRACT.md` と `docs/PROJECT_STATUS.md` に、旧形式、新形式、migration方法、互換期間、各backup / recovery手段、authorization状態、確認済み範囲、blocked項目、互換削除条件を記録します。
