# Cleanup and Deletion Protocol

不要コード、不要ファイル、古い設定、旧API、古いUI等を整理・削除する場合の安全手順です。

## 基本原則

- 「使っていなさそう」を削除理由にしない。
- 削除は整備の最後に行う。
- 参照元・動的参照・外部連携・互換処理を確認してから削除する。
- 大量削除、一括rename、大規模移動を同じバッチで行わない。
- 削除前後で機能差分を確認する。
- Evidence Ruleに従い、未確認を未使用と断定しない。

## 削除前確認

1. 静的参照を確認する。
2. HTML、Worker、GAS、設定、JSON、manifest等からの参照を確認する。
3. dynamic import、文字列参照、イベント名、API route、外部URL経由の利用を確認する。
4. 古いデータ読み込みやmigrationのために残っていないか確認する。
5. 公開環境でまだ必要な資産でないか確認する。
6. 外部consumerの不存在を確認できるか確認する。

repo内部参照がゼロでも、公開API、URL、storage key、exported function、GAS function等は外部利用されている可能性があります。不存在を確認できない場合は「未使用」ではなく「利用状況不明」と扱い、削除しません。

## renameの扱い

破壊性は変更数ではなく契約境界で判断します。単一renameでも次は高リスクです。

- API route。
- Binding名。
- Secret / Variable名。
- LocalStorage / storage key。
- exported function / public identifier。
- GAS function / Web App entrypoint。
- Sheet名・列名。
- 公開URLや外部参照されるfile path。

これらは互換策、移行方法、外部consumer影響、authorizationを確認してから変更します。

## 実施

- 1バッチの削除範囲を限定する。
- renameと削除を同時に大量実施しない。
- まず参照を外し、回帰確認後に削除する方法を優先する。
- migration互換コードはmigration完了条件確認前に削除しない。
- sourceが存在するgenerated / derived fileは、生成物だけを直接直して整合性を崩さない。

## 確認

重要項目は `verified / blocked / not-applicable` で扱います。

- 初期表示。
- 対象機能と隣接機能。
- 保存・再読み込み。
- API / route。
- external consumerへの影響確認。
- PC/SP表示。
- 公開環境。

blockedなら理由、代替確認、残存リスクを記録します。

## 禁止事項

- 行数削減だけを目的とした削除。
- 未確認fileを一括で消す。
- 動的参照を確認せず削除する。
- 外部consumer確認不能な公開contractを未使用扱いする。
- 削除と大規模refactorを同じバッチに混在させる。
- migration確認前の互換処理削除。

## 記録

削除理由、Evidence、確認した参照、外部consumer確認状況、削除・renameしたもの、残した互換処理、authorization状態、回帰確認結果を `docs/PROJECT_STATUS.md` に記録します。
