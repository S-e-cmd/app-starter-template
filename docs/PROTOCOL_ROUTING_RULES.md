# Protocol Routing Rules

この文書は複数Protocolが同時に該当し得る場合の中央判断ルールです。個別Protocolへ入る前に、主目的、scope、Evidence、authorization、高リスク条件、検証可能性を判定します。

`manifest.json` は機械判定しやすい条件・状態・参照先、本文書は意味・例外・境界、各Protocolは作業モード固有の実施手順、`POLICY_INTERPRETATION_CASES.md` は解釈一致テストを担当します。中央ruleを個別Protocolへ再定義しません。

## 1. 主作業モード

Repository URL、公開URL、starter参照の存在ではなく、ユーザーの現在目的で決めます。

- 新規アプリ → `CREATE_AND_DEPLOY_FLOW.md` / `BOOTSTRAP_PROTOCOL.md`
- 機能追加・仕様変更・UI改善・限定的不具合修正 → `FEATURE_CHANGE_PROTOCOL.md`
- 既存アプリ全体の整理・安定化・引き継ぎ改善 → `EXISTING_APP_ALIGNMENT_PROTOCOL.md`
- 正常稼働していたアプリや主要機能の障害 → `INCIDENT_RECOVERY_PROTOCOL.md`

## 2. scopeを3区分する

- **direct-change** — ユーザーが具体的に変更を求めた機能、挙動、UI、data処理、設定。
- **required-propagation** — direct-changeを成立させるため不可避な内部変更。
- **out-of-scope** — 改善可能でも今回の目的には不要な変更。

required-propagationは原則confirmed Evidenceを必要とします。inferredの場合は、複数の独立した関連Evidence、direct-changeとの直接因果、可逆、非破壊、非Production Mutationをすべて満たす場合だけ候補にできます。unknown riskはrequired-propagationへ分類しません。

Production Mutation、破壊的変更、契約境界変更をrequired-propagationとして実行する場合はconfirmed Evidenceと該当authorizationの両方が必要です。

次はscope拡大の根拠になりません。

- 改善できる、関連している、同じfileにある、fileが長い。
- best practiceと違う、最新方式ではない、templateと違う。
- 見た目やcodeが美しくなる。
- 将来問題になるかもしれないという未確認仮説。

「必要最小限」は行数ではなく、要望に必要な責務・契約・UI領域だけを意味します。

## 3. 変更理由として認める根拠

原則として次のいずれかへ結び付く必要があります。

- ユーザー要望の実現。
- confirmedな障害原因の除去。
- confirmed、または第2節の条件を満たす具体的なdata loss・互換性・公開障害・security riskの回避。
- 今回の変更による回帰除去。
- 現在の依頼で明示的に許可された整備対象。

「明確な理由」「必要な整理」「明らかな改善」だけでは変更許可になりません。

## 4. Evidence Rule

- **confirmed** — code reference、runtime結果、log、設定実値、履歴、ユーザー確認等の対象に適した根拠がある。
- **inferred** — 複数の関連根拠から推測できるが確認済みではない。
- **unknown** — 判断材料不足。

「未使用」「不要」「壊れている」「原因」「正常」「互換」「安全」と断定するには対象に適したEvidenceが必要です。命名、見た目、一般論、READMEだけ、単一文字列一致だけでは断定しません。

外部consumerの不存在を確認できない公開API、URL、storage key、GAS function等はusage unknownとして扱い、削除しません。

Evidence stateはscope、authorization、rollback、security containmentへ引き継ぎます。unknownを都合よくconfirmedへ格上げしません。

## 5. 通常仕様の情報源優先順位

1. 現在のユーザーの明示指示。
2. 対象アプリ固有の現在契約・UI維持事項・data contract。
3. 確認済みruntime・現在実装。
4. 親template一般rule。
5. README、古い説明、inference。

この順位は安全停止や破壊的操作authorizationを上書きしません。

文書とruntimeが不一致の場合:

- 今回scope・契約・安全判断に無関係 → mismatchを記録して継続。
- 今回の契約・安全判断に必要 → 該当判断と、それを入力として依存する後続作業だけhold。
- 不一致があるだけで全面停止しない。

## 6. 高リスクProtocolへの切替

- 障害・主要機能停止・data消失疑い → Incident Recovery。
- 保存形式、schema、列、API contract変更 → Data Migration。
- Cloudflare / GAS / GitHub連携 / Binding / Secret / Variable等 → Environment Change。
- 不要code、旧API、互換処理、file削除 → Cleanup / Deletion。
- library / SDK / runtime / build基盤更新 → Dependency Update。
- credentialや非公開data露出のconfirmedまたは直接露出を示す強いEvidence → security containmentを優先評価。

切替は該当部分へ適用し、元の作業目的を失いません。

## 7. 複数高リスク条件

原則:

1. security containment / incident recovery / 被害拡大防止。
2. data保全・migration。
3. environment / connection復旧・変更。
4. 通常feature change。
5. 非破壊整備。
6. cleanup。

依存更新が障害原因ならincident、重大脆弱性ならsecurity、通常更新なら独立batchです。migration後の互換削除はmigration確認後のcleanupです。

## 8. Production Mutation

既存productionの状態・権限・接続・data・schedule・公開挙動を変える操作は、create / update / deleteを問わず通常code編集と分離します。

対象例:

- production実data delete / initialize / rewrite / import / bulk create / bulk update。
- production schema migration・破壊的変更。
- production Sheets structure / bulk data変更。
- Secret / Variable / Binding変更。
- production branch / deployment / provider / Project / Worker設定変更。
- 公開URL / custom domain変更。
- breaking API route変更。
- auth方式 / storage backend切替。
- permission / role / ACL / access control変更。
- cron / GAS trigger / scheduled job / queue consumerの追加・変更・削除。
- 新規production resource作成によって既存Binding / routing / storage / target等を切り替える操作。

既存productionへ接続されない独立resource作成は、そのresource固有riskを評価し、既存production mutationとは分離できます。

Tool capabilityはuser authorizationを意味しません。

## 9. authorization stateとfingerprint

- **not-authorized** — 当該operationの許可を確認できない。
- **authorized-for-this-operation** — 当該operationを具体的に許可済み。
- **already-approved-in-current-task** — 同一の正規化authorization fingerprintを持つoperationが現在taskで既に許可済み。

fingerprintは最低限次の4項目です。

- **environment** — exact execution/deployment target。productionとstagingを暗黙一致させない。
- **resource** — 最も具体的な既知canonical resource。tableをdatabaseへ、SecretをProjectへ、triggerをappへ等、親resourceへ丸めて一致させない。
- **operation-type** — concrete mutation category。create / update / delete / migrate / import / rewrite / permission-change / schedule-change / bind / unbind / rotate / revoke / switch等を意味的に同じとしてまとめない。
- **target-scope** — exact affected subset。column、field、route、setting、job、record filter等を具体化する。

一致は意味的類似ではなく、正規化後の対象が同一であることを要求します。

- `database:app-db/table:users` と `database:app-db/table:sessions` は別resource。
- `filter:status=pending` と `all-records` は別target-scope。
- column subsetとtable全体は別target-scope。
- scopeがsupersetへ広がる場合は不一致。

複数operationを事前承認する場合は、許可されたfingerprintを個別に列挙します。「migration全体」「整備一式」等の抽象labelだけで未列挙operationへ継承しません。

4項目のいずれかが変わる・広がる場合は新authorizationです。広い「本番も対応」「必要なら直して」「環境も整えて」は個別破壊操作への包括許可ではありません。

## 10. security containmentとauthorization

Evidenceは**AIが自律的にcontainmentを選ぶ根拠**、authorizationは**production mutationを実行してよいか**の判定であり、別軸です。

- leak Evidenceがunknown → AIの自律判断だけでcredential revoke / disable / access blockしない。read-only確認を優先。
- confirmedまたは直接露出を示す強いEvidence → containmentを最優先候補として評価。
- ユーザーが「token Xを今すぐ失効」のように具体的mutationを明示した場合 → leak Evidenceがunknownでもnamed targetのrevokeはauthorized-for-this-operationとして扱える。
- 上記の場合もleak自体をconfirmedとは報告しない。
- 「確認して」「怪しい」だけではrevoke authorizationにならない。
- 事前runbook authorizationは定義されたresource / operation / scopeだけに限定。
- token Xの失効許可をtoken Y、別account、別Bindingへ広げない。

緊急性はscopeやauthorizationの無制限拡張理由になりません。恒久修正は別途authorizationを判定します。

## 11. production data test

安全な順序:

1. read-only。
2. copy / snapshot / staging / export。
3. production上の新規isolated test record等、既存実dataを書き換えない方法。
4. 既存production実data変更。

4は明示authorizationなしに行いません。test dataは識別・削除可能にします。

## 12. backupを分離する

- code / Git history。
- schema / migration history。
- actual data / snapshot / export。
- environment settings / current value record。

GitHubにcodeがあるだけでactual data backup済みとはみなしません。

## 13. rollback / roll-forward

rollback前に最低限確認:

- codeと現在data/schemaの互換。
- environment互換。
- post-migration data影響。
- 失われる正常変更。
- restore targetの実在。
- external API現在互換。

rollbackがより危険・復元不能で、原因が十分特定され小さなroll-forwardが安全ならroll-forward可能です。last known goodはcode / deployment / environment / data-schema / external API compatibilityを必要に応じ別軸で扱います。history-preserving rollbackを優先します。

## 14. 1回の限定修正

1. 原因仮説1つ。
2. 小規模変更。
3. 対象environmentへ反映。
4. 復旧確認。

未反映editやcommitだけでは1回に数えません。1回失敗で機械的rollbackせず、第13節を評価します。

## 15. Scope Expansion Rule

- required-propagation — 第2節条件を満たす不可避変更。
- recommended-improvement — 有益だが不要。記録のみ。
- unrelated-issue — 別task。

高リスク問題へ切り替えてもscopeとauthorization判定は継続します。

## 16. Generated / Derived Files

sourceがあるbuild成果物、生成JSON、bundle、export等は原則sourceを修正します。生成物をcanonicalとして直接変更する必要がある場合は理由と再生成時の扱いを記録します。

## 17. No Silent Fallback

既存仕様として定義済みでない限り、storage、auth、API、deployment、sync方式を失敗時に勝手に切り替えません。D1失敗を理由にLocalStorageへ無断切替しません。

## 18. No Fake Success

HTTP 200、commit成功、deploy成功、API応答、画面表示だけではfunctional successとしません。目的状態に応じて保存、reload、UI反映、data互換、主要導線等を確認します。

partial verificationは未確認の目的状態へ一般化しません。

## 19. environment情報源

1. 実稼働設定 / runtime behavior。
2. deployment metadata / provider configuration。
3. production branch設定file。
4. handoff docs。
5. README。
6. inference。

Inferenceは変更根拠にしません。Secret値そのものを不要に取得・記録しません。

## 20. concurrency / stale state

- 長時間作業や複数変更後は重要fileのwrite直前にstate / SHAを再確認。
- 409等では最新取得。
- 他変更を残し、自分のdiffだけ再適用。
- 競合解消を理由に他の正常変更を消さない。

## 21. template driftとschemaVersionの意味

生成appの`ai-context.json`にはstarter schemaVersion、bootstrap時template commit SHA / revision、current parent manifest URLを残します。

同じ名称でもschemaVersionの意味を区別します。

- `manifest.json` top-level `schemaVersion` → **app-starter manifest自身のschema version**。
- `ai-context.json` top-level `schemaVersion` → **ai-context文書自身のschema version**。
- `ai-context.json` の `starter.schemaVersion` → **参照するparent starter manifestのschema version**。

数値が異なるだけでschema mismatch / template driftとはみなしません。`schemaVersionMeaning` が同じ対象同士だけを比較します。

最新親ruleは安全原則・判断補助として参照できますが、後から追加された親ruleだけを理由に既存appのstructure / UI / data contractを変更しません。

## 22. public ai-context safety

公開`ai-context.json` / `llms.txt` に含めないもの:

- Secret / API key / token / credential。
- internal-only URL / private resource identifier。
- personal data。
- private repository confidential information。
- unfixed vulnerability detail / attack procedure。
- operationally sensitive internal information。

field名だけでなく実値を確認し、repository内部handoffを無加工でpublic contextへcopyしません。

## 23. build number policy

app固有policyがなければ、production artifact / runtimeの意味ある変更で`YYYYMMDD-NN`を更新します。

更新対象例:

- production JS / Worker / GAS web app等の実行code。
- CSS等production UI asset。
- runtimeが読むstatic JSON / config / templateで表示・挙動・API responseが変わるもの。
- internal APIでもproduction response / side effect / contract behaviorが変わるcode。
- published artifactを変えるrollback / roll-forward。

原則不要:

- docs / README / runtime-neutral review record。
- artifactやuser behaviorを変えないenvironment-only Secret rotation / permission変更。
- runtime / 表示 / contractに影響しないtimestamp等だけの変更。

過去build番号を新しい公開内容へ再利用しません。

## 24. verification stateとhold範囲

- **verified** — 実施済み。
- **blocked** — 実施不能。理由、代替確認、residual riskを記録。
- **not-applicable** — 非該当。

blocked / unknownは全面停止理由ではありませんが、hold範囲は依存関係まで含めます。

- success / safety / authorization判断に必要なblocked / unknown → 該当判断と、それを入力・契約として依存する後続作業をhold。
- 独立したin-scope作業 → 継続可能。

全体state:

- **complete** — 必要な変更・検証完了。
- **work-complete-verification-pending** — 変更完了、必要検証の一部blocked。
- **incomplete** — 実装・復旧・migration・setting変更自体に残作業。

必要に応じimplementation / deployment / verification / documentationも個別管理します。

## 25. 解釈一致テスト

`docs/POLICY_INTERPRETATION_CASES.md` で正常ケースだけでなく、意図的に逆結論を成立させようとします。

重点:

- fingerprintを親resource・意味的類似・supersetで広義一致できないか。
- inferred / unknownをrequired-propagationへ格上げできないか。
- Evidence不足を理由に具体的user authorizationまで無効化できないか。
- securityを理由に未許可mutationへ拡張できないか。
- createを理由にProduction Mutation判定から逃げられないか。
- blocked / mismatchを理由に全面停止できないか、逆に依存作業まで進められないか。
- partial verification / deploy / HTTP successでfake successにできないか。
- schemaVersionの異なる意味を混同できないか。

別AIでscope / Evidence / Production Mutation / authorization / continuation / Protocolの結論が合理的に割れるcaseは、rule不足または表現曖昧のEvidenceとして扱います。
