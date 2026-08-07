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
- 今回の契約・安全判断に必要 → 該当判断と、それを具体的input / contractとして依存する後続作業だけhold。
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

## 8. Production Mutationと独立resource作成

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

既存productionへ接続されない独立resource作成は、それだけで既存production mutationとはみなしません。ただし次のside effectがある場合は無害なcode editと同列に扱わず、Environment Change / Creation Flow側でauthorizationまたはuser choiceを確認します。

- paid / metered cost。
- external public exposure。
- privileged access / new permissions。
- production data copy / import。
- operationally significant name reservation。
- retention / compliance obligation。

Tool capabilityはuser authorizationを意味しません。

## 9. authorization stateとfingerprint

- **not-authorized** — 当該operationの許可を確認できない。
- **authorized-for-this-operation** — 当該operationを具体的に許可済み。
- **already-approved-in-current-task** — 同一の正規化authorization fingerprintを持つoperationが現在taskで既に許可済み。

fingerprintは最低限次の4項目です。

### environment

exact execution / deployment targetを使います。productionとstagingを暗黙一致させません。

### resource

provider側のstable identifierが利用可能ならそれを優先します。同名resourceが別account / project / environmentに存在し得る場合、表示名だけをidentityにしません。

stable identifierがない場合は、provider / account / project / parent hierarchy等、同名resourceを区別するために必要な階層付きidentityを使います。

alias、Binding名、表示名が同一resourceを指すと扱えるのは、stable IDや実設定でmappingをconfirmedできる場合だけです。「意味的に同じ」だけでは一致しません。

renameについて:

- provider stable IDがrename前後で同一とconfirmedできる → resource identity自体は継続可能。
- stable IDがなく名称しか確認できない → rename後resourceへ既存authorizationを自動継承しない。
- rename operationのauthorizationはrename後resourceへのupdate / delete / migrate等を許可しない。

### operation-type

単語ではなく**実際のside effect**でcanonicalizeします。

- side effectが異なる。
- reversibilityが異なる。
- contract boundaryが異なる。
- security consequenceが異なる。

場合は別operationです。

update / rewrite / backfill、rotate / replace / revoke、bind / switch、migrate / column-add、create / provision等は、単なる語感で同一operationへまとめません。明示mappingがありside effectも同一の場合だけ同じcanonical operationとして扱えます。

### target-scope

exact affected subsetを使います。column、field、route、setting、job、record filter等を具体化します。

文字列完全一致だけを要求するのではなく、**決定論的に同一集合だと確認できる場合だけ**canonicalizeできます。

例:

- `status='pending' AND active=true`
- `active=true AND status='pending'`

は、同じparser / type / NULL / collation等のsemanticsで単なるAND順序差と確認できる場合は同scopeへcanonicalize可能です。

一方、次を推測で同一扱いしません。

- NULL semanticsが違い得る。
- string / number型変換がある。
- timezone / collation差がある。
- dynamic `NOW()` / relative time range等で実行時集合が変わる。
- queryの実行時parameterが未固定。

filtered subsetとall records、subsetとsupersetは別scopeです。dynamic scopeのauthorization reuseには、実行時の具体的bounds / parametersが同じである必要があります。

## 10. plan単位のauthorization

ユーザーは、複数operationを**1回の承認操作**で許可できます。ただし承認対象は抽象的なplan名ではなく、事前に列挙されたfingerprint集合です。

- plan提示時に各fingerprintを列挙する。
- ユーザーがその列挙済みplan全体を承認 → 列挙fingerprintはauthorized。
- 実施途中でfingerprintが追加・変更された → 新規または変更fingerprintだけ追加authorizationが必要。
- 未変更fingerprintを毎operation再確認する必要はない。
- 「migrationに必要な操作全部」「このplan一式」だけで、未列挙operationまで承認済みとみなさない。

## 11. security containmentとauthorization

Evidenceは**AIが自律的にcontainmentを選ぶ根拠**、authorizationは**production mutationを実行してよいか**の判定であり、別軸です。

- leak Evidenceがunknown → AIの自律判断だけでcredential revoke / disable / access blockしない。read-only確認を優先。
- confirmedまたは直接露出を示す強いEvidence → containmentを最優先候補として評価。
- ユーザーが「token Xを今すぐ失効」のように具体的mutationを明示した場合 → leak Evidenceがunknownでもnamed targetのrevokeはauthorized-for-this-operationとして扱える。
- 上記の場合もleak自体をconfirmedとは報告しない。
- 「確認して」「怪しい」だけではrevoke authorizationにならない。
- 事前runbook authorizationは定義されたresource / operation / scopeだけに限定。
- token Xの失効許可をtoken Y、別account、別Bindingへ広げない。

緊急性はscopeやauthorizationの無制限拡張理由になりません。恒久修正は別途authorizationを判定します。

## 12. production data test

安全な順序:

1. read-only。
2. copy / snapshot / staging / export。
3. production上の新規isolated test record等、既存実dataを書き換えない方法。
4. 既存production実data変更。

4は明示authorizationなしに行いません。test dataは識別・削除可能にします。

## 13. backupを分離する

- code / Git history。
- schema / migration history。
- actual data / snapshot / export。
- environment settings / current value record。

GitHubにcodeがあるだけでactual data backup済みとはみなしません。

## 14. rollback / roll-forward

rollback前に最低限確認:

- codeと現在data/schemaの互換。
- environment互換。
- post-migration data影響。
- 失われる正常変更。
- restore targetの実在。
- external API現在互換。

rollbackがより危険・復元不能で、原因が十分特定され小さなroll-forwardが安全ならroll-forward可能です。last known goodはcode / deployment / environment / data-schema / external API compatibilityを必要に応じ別軸で扱います。history-preserving rollbackを優先します。

## 15. 1回の限定修正

1. 原因仮説1つ。
2. 小規模変更。
3. 対象environmentへ反映。
4. 復旧確認。

未反映editやcommitだけでは1回に数えません。1回失敗で機械的rollbackせず、第14節を評価します。

## 16. Scope Expansion Rule

- required-propagation — 第2節条件を満たす不可避変更。
- recommended-improvement — 有益だが不要。記録のみ。
- unrelated-issue — 別task。

高リスク問題へ切り替えてもscopeとauthorization判定は継続します。

## 17. Generated / Derived Files

sourceがあるbuild成果物、生成JSON、bundle、export等は原則sourceを修正します。生成物をcanonicalとして直接変更する必要がある場合は理由と再生成時の扱いを記録します。

## 18. No Silent Fallback

既存仕様として定義済みでない限り、storage、auth、API、deployment、sync方式を失敗時に勝手に切り替えません。D1失敗を理由にLocalStorageへ無断切替しません。

## 19. No Fake Successと完了条件

HTTP 200、commit成功、deploy成功、API応答、画面表示だけではfunctional successとしません。partial verificationは未確認の目的状態へ一般化しません。

検証項目は固定チェックリストだけで決めず、**現在のdirect-changeの完了条件から導出**します。

例:

- direct-changeが「保存できない問題を直す」 → 保存・必要なreload persistenceが完了条件。別端末同期は、それが保存仕様の一部または今回変更による回帰riskと確認されない限り独立条件。
- direct-changeが「端末間同期を直す」 → 保存だけ成功しても不十分。別端末同期の目的状態まで必要。

隣接回帰確認は因果的に関係する範囲だけ追加し、無関係な機能を完了条件へ増やして過剰停止しません。

## 20. environment情報源

1. 実稼働設定 / runtime behavior。
2. deployment metadata / provider configuration。
3. production branch設定file。
4. handoff docs。
5. README。
6. inference。

Inferenceは変更根拠にしません。Secret値そのものを不要に取得・記録しません。

## 21. concurrency / stale state

- 長時間作業や複数変更後は重要fileのwrite直前にstate / SHAを再確認。
- 409等では最新取得。
- 他変更を残し、自分のdiffだけ再適用。
- 競合解消を理由に他の正常変更を消さない。

## 22. template driftとschemaVersionの意味

生成appの`ai-context.json`にはstarter schemaVersion、bootstrap時template commit SHA / revision、current parent manifest URLを残します。

同じ名称でもschemaVersionの意味を区別します。

- `manifest.json` top-level `schemaVersion` → **app-starter manifest自身のschema version**。
- `ai-context.json` top-level `schemaVersion` → **ai-context文書自身のschema version**。
- `ai-context.json` の `starter.schemaVersion` → **参照するparent starter manifestのschema version**。

数値が異なるだけでschema mismatchとはみなしません。`schemaVersionMeaning` が同じ対象同士だけを比較します。

parent manifestが将来5、6へ進んでも、古いappがbootstrap時starter schema 3 / 4を保持していること自体は**version drift metadata**でありlocal schema mismatchではありません。最新親ruleは安全原則・判断補助として参照できますが、親version上昇だけで既存appを再構成しません。

## 23. public ai-context safety

公開`ai-context.json` / `llms.txt` に含めないもの:

- Secret / API key / token / credential。
- internal-only URL / private resource identifier。
- personal data。
- private repository confidential information。
- unfixed vulnerability detail / attack procedure。
- operationally sensitive internal information。

field名だけでなく実値を確認し、repository内部handoffを無加工でpublic contextへcopyしません。

## 24. build number policy

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

## 25. verification stateとhold範囲

- **verified** — 実施済み。
- **blocked** — 実施不能。理由、代替確認、residual riskを記録。
- **not-applicable** — 非該当。

blocked / unknownは全面停止理由ではありません。holdを伝播できるのは、具体的な依存がある場合だけです。

hold伝播の根拠:

- 後続作業がblocked inputを直接使用する。
- blocked contractの確定結果によって後続実装内容が変わる。
- safety / authorization判断がblocked結果に依存する。

次だけではholdを伝播しません。

- 同じfileにある。
- 同じscreen / feature groupにある。
- 間接的に関係する可能性がある。
- 念のため一緒に確認したい。

依存がある作業はholdし、独立したin-scope作業は継続します。

全体state:

- **complete** — direct-changeから導出した必要な変更・検証が完了。
- **work-complete-verification-pending** — 変更完了、必要検証の一部blocked。
- **incomplete** — 実装・復旧・migration・setting変更自体に残作業。

必要に応じimplementation / deployment / verification / documentationも個別管理します。

## 26. 解釈一致テスト

`docs/POLICY_INTERPRETATION_CASES.md` で正常ケースだけでなく、意図的に逆結論を成立させようとします。

重点:

- stable ID / display name / alias / renameでresource identityを都合よく変えられないか。
- logically equivalent filterを厳格すぎて別scopeにし続けないか、逆にsemantics不明なのに同scopeへまとめられないか。
- operation verbの名称差だけで過剰分割・過剰統合しないか。
- enumerated plan承認を効率的に継承しつつ、追加fingerprintへ勝手に拡張できないか。
- inferred / unknownをrequired-propagationへ格上げできないか。
- Evidence不足を理由に具体的user authorizationまで無効化できないか。
- securityを理由に未許可mutationへ拡張できないか。
- independent resource createを無害扱いし、高コスト・公開・権限side effectを見落とせないか。
- blocked / mismatchを理由に全面停止できないか、逆に依存作業まで進められないか。
- direct-changeと無関係なverificationを完了条件へ追加して過剰停止できないか。
- partial verification / deploy / HTTP successでfake successにできないか。
- schemaVersionの異なる意味やversion driftをschema mismatchと混同できないか。

別AIでscope / Evidence / Production Mutation / authorization / continuation / Protocolの結論が合理的に割れるcaseは、rule不足または表現曖昧のEvidenceとして扱います。