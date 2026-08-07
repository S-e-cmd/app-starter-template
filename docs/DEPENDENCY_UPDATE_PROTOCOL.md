# Dependency Update Protocol

ライブラリ、SDK、ランタイム、ビルド基盤等の依存更新を通常の機能追加から分離して安全に扱うための手順です。

Evidence、scope、Production Mutation、authorization、verification、rollback / roll-forwardの共通定義は `docs/PROTOCOL_ROUTING_RULES.md` を正本とします。このProtocolではdependency update固有の確認・実施手順だけを定義します。

## 基本原則

- 機能追加のついでに依存更新しない。
- major updateは独立バッチで扱う。
- 「新しいから」という理由だけで置き換えない。
- API変更、ブラウザ互換、Cloudflare/GAS/Node等の実行環境互換を確認する。
- 正常稼働している既存依存を、テンプレート既定へ合わせるだけの目的で置換しない。
- direct dependencyだけでなくtransitive dependencyとlockfile差分も確認する。

## 変更前確認

1. 現在versionと利用箇所を確認する。
2. 更新理由をEvidenceとともに明確にする。
3. breaking changes、deprecated API、設定変更を確認する。
4. direct dependency差分、transitive dependency差分、lockfile差分を確認する。
5. build設定、runtime、browser、Cloudflare / GAS / Node等への影響を、対象dependencyの実際の利用範囲に応じて確認する。
6. 元versionへ戻せる状態を確保する。
7. Production Mutationや環境変更を伴う場合は該当authorizationを確認する。

packageを1件更新しただけでもlockfileで多数の間接依存が変わる場合があります。「1件だけ更新」と報告する場合も、実際のlockfile差分を無視しません。

## 実施

- 一度に複数の大きな依存を更新しない。
- 依存更新と大規模refactorを分ける。
- 必要な設定変更だけ行う。
- 既存APIを置き換える場合は影響範囲を限定する。
- sourceが存在するgenerated / derived fileは生成物だけを手修正しない。

## セキュリティ更新の例外

重大脆弱性の対応では通常の「機能追加と依存更新を分離」の原則より封じ込め・安全確保を優先できます。

- 漏えい・攻撃継続リスクがある → セキュリティ事故・障害Protocolを優先。
- 緊急更新が必要 → 影響範囲を限定し、通常機能追加を止めて独立した緊急updateとして扱う。
- 緊急性を理由に互換確認やrollback / roll-forward評価を省略しない。

## 確認

重要項目は中央verification policyの `verified / blocked / not-applicable` で扱います。

更新dependencyのdirect-changeと実際の影響範囲に応じて確認します。

- install / build。
- direct / transitive dependency差分。
- lockfile差分。
- 初期表示。
- 主要機能。
- API通信。
- 保存・再読み込み。
- PC/SP表示。
- 公開環境。

上記を固定で全項目要求しません。例えばserver-only dependency更新でUIへ因果的影響がない場合、PC/SP表示確認だけを理由に完了を止めません。逆にruntime、保存、API等がdirect-changeのpurpose stateまたは回帰riskに含まれる場合は必要確認として扱います。

blockedなら理由、代替確認、残存リスクを記録します。

## 禁止事項

- 更新理由のない一括update。
- major updateと通常機能追加の同時実施。
- transitive / lockfile差分を無視して小変更と断定する。
- 互換確認なしのruntime変更。
- deploy成功だけで完了扱いにする。
- dependencyと因果関係のない確認項目を固定チェックとして追加し、通常更新を不必要にholdする。

## 記録

更新理由、Evidence、旧/新version、direct / transitive / lockfile差分、必要なcode変更、verified / blocked結果、戻し方を `docs/PROJECT_STATUS.md` に記録します。
