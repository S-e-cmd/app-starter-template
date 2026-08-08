# Feature Change Protocol

立ち上げ後の通常の機能追加・仕様変更・小規模改修に使うProtocolです。

scope、Evidence、required-propagation、continuation、preparation convergence、Production Mutation、authorization、verification / completion、Major Change gateは `docs/PROTOCOL_ROUTING_RULES.md` を正本とします。このProtocolでは通常更新固有の作業手順だけを定義します。

## 適用範囲

- 新機能追加。
- 既存機能の拡張。
- UI追加・操作改善。
- 保存処理やAPI連携の追加。
- 既存挙動の明示的な仕様変更。
- 小規模な不具合修正。

新規アプリ初期作成は `BOOTSTRAP_PROTOCOL.md`、既存アプリ全体の整理・安定化・引き継ぎ改善が主目的なら `EXISTING_APP_ALIGNMENT_PROTOCOL.md` を使用します。

## required outcome

このProtocolのrequired outcomeは、**ユーザーが求めたbehavior / UI / data processing / integrationの変更を、保護対象を壊さず実現し、必要な回帰確認まで完了すること**です。

## 変更前

1. ユーザー要望と目的状態を具体化する。
2. 対象機能の現在実装、関連file、呼び出し元・呼び出し先、共有stateを確認する。
3. 既存の共通部品・類似機能を確認する。
4. 保存先、API、外部service、公開方式、PC / SP UI等のうち実影響があるものを確認する。
5. `ai-context.json` と関連docsを確認する。
6. 中央ruleで必要なrouting / authorization / Major Change gateを適用する。

変更対象と隣接範囲が把握できたら、無関係な全体再確認は行いません。

## 実装

- requested behaviorの実現に必要な変更だけを行う。
- 既存責務の延長なら既存moduleを使用する。
- 新しい責務が明確なら現在architectureに合うmodule / fileへ分離する。
- 既存componentを再利用する場合、不要な結合を増やさない。
- 新しいUIは既存の情報量、一覧性、主要導線、PC / SPそれぞれの目的を不必要に悪化させない。
- 待ち時間のある操作では必要に応じloading / duplicate-operation preventionを入れる。
- error handling、generated files、concurrency等の実装作法は `DEVELOPMENT_RULES.md` に従う。
- data migration / environment change / cleanup / dependency updateが必要になった部分は中央routingに従う。

## Major Change Planningから戻る場合

Planningでcode restructuring / feature implementation batchが定義された場合、このProtocolへ戻して実装します。

- Planningで定義されたrequired outcome、protected targets、batch dependencyを引き継ぐ。
- Data Migration / Environment Change / Cleanup等が別batchなら該当Protocolへroutingする。
- Planningの方式選択を無制限のrewrite authorizationとして扱わない。

## 検証中に別問題を発見した場合

中央のScope Expansion Ruleを使用します。

今回の変更が原因のregressionは原則として同じoutcome内で修正・再確認します。別問題は中央ruleでscope分類し、current taskへ自動追加しません。

## 変更後の確認

`DEVELOPMENT_RULES.md` の実装変更後確認と中央verification ruleを使い、今回の目的状態と因果的な回帰riskから必要項目を選びます。

特に今回変更したbehavior、関連保存 / API / UI、error / loading、必要なreload persistence、deploy反映を確認します。

## ドキュメント更新

変更内容に応じて必要なhandoffだけ更新します。

- 構成・責務・依存関係 → `docs/ARCHITECTURE.md`
- API・保存形式・schema・列構成 → `docs/DATA_CONTRACT.md`
- UI維持事項・操作ルール → `docs/UI_RULES.md`
- 現在状態・残task → `docs/PROJECT_STATUS.md`
- entrypointや主要構成 → `ai-context.json`

build更新要否は中央build policyまたはapp固有policyに従います。
