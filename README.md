# App Starter Template

新規アプリを保守しやすく立ち上げ、既存アプリを壊さず更新・整備・復旧するためのAI向け正本です。

## 最重要: まず作業モード・scope・Evidence・authorizationを決める

最初に `docs/PROTOCOL_ROUTING_RULES.md` を読み、ユーザーの現在の目的から主作業モードを決めます。

- 新しいアプリを作る → 新規立ち上げ。
- 既存アプリへ機能追加・仕様変更・UI改善 → 更新。
- 既存アプリ全体の整理・安定化・引き継ぎ改善 → 整備。
- 正常稼働していたアプリや主要機能が壊れた → 障害復旧。

GitHub repository URL、公開URL、starter参照があること自体は整備モードを選ぶ理由にしません。

作業開始前に `direct-change / required-propagation / out-of-scope` と `confirmed / inferred / unknown` を区別します。tool上で実行可能であることと、ユーザーが本番変更を許可したことも分離します。

## 中央ルールの役割分担

- `manifest.json` — 機械判定しやすい条件、状態、列挙値、参照先。
- `docs/PROTOCOL_ROUTING_RULES.md` — 判断理由、例外、scope、Evidence、authorization、Production Mutation、検証状態等の中央説明。
- `docs/POLICY_INTERPRETATION_CASES.md` — 同じruleを別AIが読んでも同じ分類になるか確認するadversarial cases。
- 各Protocol — その作業モード固有の実施手順。

中央ruleを各Protocolへ詳細コピーせず、共通定義は中央policyを参照します。

## 新規アプリ

`docs/CREATE_AND_DEPLOY_FLOW.md` と `docs/BOOTSTRAP_PROTOCOL.md` を使用します。

- GitHub新規repository作成設定をAIが具体値で案内。
- bootstrap完了後にapp固有実装。
- `ai-context.json` にstarter schemaVersion、bootstrap時template commit SHA / revision、current parent manifest URLを記録。
- public `ai-context.json` / `llms.txt` はpublic-safe情報のみ。
- visibility、auth、永続保存先、個人情報保存、課金service、外部公開範囲等の高コスト事項は、要件から明確でない場合に推測で固定しない。
- Cloudflare等の設定値は実repository・実設定を確認してから案内。

`ai-context.json` のtop-level `schemaVersion` と `starter.schemaVersion` は別概念です。前者はai-context文書自身、後者は参照するparent starter manifestのschema versionを表します。数値が違うだけでtemplate driftやschema mismatchとはみなしません。

既存アプリに `ai-context.json` がないことだけを理由に新規bootstrap扱いしません。bootstrap不足を補うだけの作業で既存codeを勝手に分割・rename・移動しません。

## 更新

通常の機能追加・仕様変更・UI改善・限定的不具合修正は `docs/FEATURE_CHANGE_PROTOCOL.md` を使用します。

- direct-changeと、中央Evidence条件を満たすrequired-propagationだけを変更。
- unknown riskをscope拡大理由にしない。
- out-of-scopeは記録だけにする。
- 既存部品再利用は不要な結合を増やさない場合だけ。
- generated fileはsourceがあるならsource側を変更。
- silent fallbackを行わない。
- `verified / blocked / not-applicable` で検証する。

## 整備

既存アプリ全体の整理、安定化、責務整理、引き継ぎ改善は `docs/EXISTING_APP_ALIGNMENT_PROTOCOL.md` を使用します。

- template準拠を目的にしない。
- 新規アプリ用directory例へ既存アプリを無理に寄せない。
- ユーザーが「完了まで」「ロードマップ通り」等を既に明示している場合、当初scope内の安全なbatchで毎回停止しない。
- scope拡大、Production Mutation、新たな高リスク操作、実質的な方針選択が必要な場合に該当部分だけ停止する。
- blocked / unknown / mismatchに依存する後続作業もholdするが、独立したin-scope作業は継続する。
- 選択肢が必要な場合だけ `docs/BATCH_COMPLETION_CHOICES.md` を使用する。

## Major Change Planning

通常のFeature Change / Existing App Alignmentだけではrequired outcomeを安全に達成できないことがconfirmedされた場合、実装へ直行せず `docs/MAJOR_CHANGE_PLANNING.md` をplanning / routing gateとして使用します。

- Major判定はfile数・line数・変更量ではなく、contract / architecture / transition impactで行う。
- inferred / unknownの段階では `possible major change` に留める。
- `Major Change Planning Required ≠ rewrite authorized`。
- Planningでは保護対象、変更対象、contract impact、migration、environment、rollback、現実的な移行方式、batch依存関係を整理する。
- 方式承認だけで未列挙のProduction Mutationやdestructive operationをauthorized扱いしない。
- 実operationはFeature Change / Data Migration / Environment Change / Cleanup / Incident Recovery / Dependency Update等へroutingする。
- `major-change-planning-required` はrouting状態でありoverall completion stateではない。
- Planning complete / Implementation complete / Cleanup completeを分離する。
- `new system verified ≠ old system deletion authorized`。

Major Change Planningは「大きそうだから止める」ためのgateではありません。通常の局所的・段階的変更ではrequired outcomeを安全に達成できないconfirmed境界でだけ使用します。

## 障害復旧

白画面、起動不能、ログイン不能、主要機能停止、data消失疑い等では `docs/INCIDENT_RECOVERY_PROTOCOL.md` を使用します。

- 壊れた状態へ推測修正を重ねない。
- last known goodを code / deployment / environment / data-schema / external API compatibility に分けて考える。
- 1回の限定修正で戻らなくても機械的にrollbackしない。
- rollback前に現在data/schema、environment、migration後data、失われる正常変更、復元target、external API互換を評価する。
- rollbackがより危険なら、根拠のある小さなroll-forwardを選択可能。
- historyを壊さないrollbackを優先し、force push等は通常手段にしない。

## Production Mutation

既存productionのdata、schema、Secret、Binding、権限、schedule、deployment、公開URL、認証・保存先等の状態を変える操作は、作成・変更・削除の別を問わず通常code編集と分離します。

- tool capability ≠ user authorization。
- authorizationは `not-authorized / authorized-for-this-operation / already-approved-in-current-task` で扱う。
- `already-approved-in-current-task` は `environment / resource / operation-type / target-scope` の正規化fingerprintがexact matchする場合だけ継承可能。
- resourceは最も具体的な既知対象を使い、tableをdatabaseへ、SecretをProjectへ等の親resourceへの丸めで一致させない。
- filtered record集合と全record、column subsetとtable全体等は同じtarget-scopeとみなさない。
- 複数operationの事前承認は明示されたfingerprint列挙として扱い、「migration全体」等の抽象labelで未列挙操作へ拡張しない。
- 「本番も含めて対応」等の広い依頼は、個別の破壊操作への包括許可ではない。

## security containment

Evidence条件とuser authorizationは別軸です。

- 漏えいEvidenceがunknownなら、AIが自律的にtoken失効等を実行する根拠にはしない。
- ただしユーザーが「token Xを今すぐ失効」のように具体的なcredential mutationを明示した場合、そのnamed targetのauthorizationとして扱える。
- その場合も漏えいEvidence自体をconfirmedへ格上げしない。
- named target以外のtoken / account / Bindingへauthorizationを広げない。

## 共通安全ルール

`docs/PROTOCOL_ROUTING_RULES.md` では次を中央管理します。

- scope 3区分とrequired-propagation Evidence条件。
- Evidence Rule。
- 通常仕様の情報源優先順位と安全停止条件の分離。
- Major Change Planning gateと通常変更との境界。
- Production Mutationと正規化authorization fingerprint。
- security containmentとauthorizationの境界。
- 実data検証の段階。
- code / schema / actual data / environment backupの分離。
- rollback / roll-forward安全性評価。
- Scope Expansion Rule。
- Generated / Derived Files Rule。
- No Silent Fallback Rule。
- No Fake Success Rule。
- stale-state / SHA競合対応。
- 親template version driftとschemaVersion意味区分。
- public ai-context安全基準。
- build number policy。
- `verified / blocked / not-applicable` と完了状態。

## 入口

- `manifest.json` — 機械可読の中央policy。
- `docs/PROTOCOL_ROUTING_RULES.md` — 中央判断・例外・安全rule。
- `docs/POLICY_INTERPRETATION_CASES.md` — 抜け道・解釈差のadversarial test cases。
- `docs/CREATE_AND_DEPLOY_FLOW.md` — 新規作成から公開確認。
- `docs/BOOTSTRAP_PROTOCOL.md` — 新規app初期化。
- `docs/FEATURE_CHANGE_PROTOCOL.md` — 通常更新。
- `docs/EXISTING_APP_ALIGNMENT_PROTOCOL.md` — 非破壊整備。
- `docs/MAJOR_CHANGE_PLANNING.md` — 大規模変更前のplanning / routing gate。
- `docs/INCIDENT_RECOVERY_PROTOCOL.md` — 障害復旧。
- `docs/DATA_MIGRATION_PROTOCOL.md` — data移行。
- `docs/ENVIRONMENT_CHANGE_PROTOCOL.md` — 環境・設定変更。
- `docs/CLEANUP_DELETION_PROTOCOL.md` — 削除・整理。
- `docs/DEPENDENCY_UPDATE_PROTOCOL.md` — 依存・runtime更新。
- `docs/BATCH_COMPLETION_CHOICES.md` — 必要時の整備batch選択。
- `docs/TEMPLATE_CHECKLIST.md` — 全モードの確認。
- `docs/DEVELOPMENT_RULES.md` — 実装・継続保守rule。
- `docs/ARCHITECTURE_RULES.md` — 責務分割・構成rule。
- `docs/UI_RULES.md` — UI維持rule。
- `docs/DATA_RULES.md` — data互換rule。

## テンプレート構成

- `templates/core/`
- `templates/cloudflare-worker/`
- `templates/d1/`
- `templates/sheets-gas/`

これらのdirectory構成は新規アプリ向けです。既存アプリへの変更要求ではありません。

GitHub Actionsは標準では使用しません。
