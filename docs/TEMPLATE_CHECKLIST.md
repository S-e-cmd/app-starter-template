# Template Validation Checklist

新規作成、通常更新、既存アプリ整備、高リスク変更で、`docs/PROTOCOL_ROUTING_RULES.md` と `manifest.json` の中央判断を実際の作業へ適用できているか確認するためのチェックリストです。

## 共通ゲート

- 主作業モードをユーザーの現在目的から選んだ。
- Repository URL / 公開URL / starter参照の存在だけで整備モードを選んでいない。
- `direct-change / required-propagation / out-of-scope` を区別した。
- 「改善できる」「関連している」「同じfile」「fileが長い」「将来riskがあるかもしれない」だけをscope拡大理由にしていない。
- required-propagationは原則confirmed Evidenceを持つ。inferredなら複数独立根拠、直接因果、可逆・非破壊・非Production Mutationを満たす。
- unknown riskをrequired-propagationへ格上げしていない。
- `confirmed / inferred / unknown` を区別した。
- tool capabilityとuser authorizationを混同していない。
- Production Mutation対象とauthorization状態を確認した。
- generated / derived fileのsourceがある場合、生成物だけを手修正していない。
- silent fallbackを追加・使用していない。
- mismatch / blocked / unknownがscopeに無関係なら他のin-scope作業を不必要に停止していない。

## authorization fingerprint

`already-approved-in-current-task` を使う場合:

- environmentはexact target。
- provider stable IDが利用可能ならresource identityに優先使用した。
- stable IDがない場合、provider / account / project / parent hierarchyまで含めて同名resourceを区別した。
- display nameやaliasだけで同一resourceとみなしていない。
- alias / Binding名を同一resourceへcanonicalizeする場合、stable IDまたは実設定mappingをconfirmedした。
- mapping確認後にBinding / environment変更があった場合、古いmappingをreuseせず再確認した。
- 高リスクmutation実行前にidentity mappingの鮮度が必要なら再確認した。
- parent resourceへ丸めて一致させていない。
- clone / restore / delete→recreate / replacement / provider migrationでstable IDが変わったresourceを「同じ役割だから同一」とみなしていない。
- rename前後を同一identityとする場合、stable provider ID継続をconfirmedした。
- rename authorizationをrename後の別operationへ継承していない。
- operation-typeはverb文字列ではなくside effect / reversibility / contract boundary / security consequenceで正規化した。
- `cascade / overwrite / force / replace-existing / delete-source-after-copy / dry-run` 等、side effectを変えるoptionをfingerprint判定から落としていない。
- target-scopeは承認された対象集合またはpredicateを正確に表現している。
- filter表記差を同一scopeにする場合、type / NULL / collation / timezone / parameter semanticsまで保ったdeterministic equivalenceを確認した。
- OR / NOT / IN / implicit cast / floating point / cursor / pagination / server-side filter / RLS等で同値が証明できない場合、無理にcanonicalizeしていない。
- subset / supersetを同じscopeとみなしていない。

## dynamic scope

- authorizationが **concrete-set** か **predicate** かを区別した。
- concrete-setならrecord ID / snapshot / boundsが変わった集合へauthorizationをreuseしていない。
- predicate authorizationなら、userが「execution時にこの条件へ一致する全対象」を承認していることを確認した。
- predicate、parameter、RLS、implicit filter、cursor基準等が変わった場合は別scopeとして再判定した。
- dynamic setが増減しただけで、承認済みpredicateまで機械的に毎回再authorizationして過剰停止していない。

## plan authorization

複数operationをまとめて承認する場合:

- planにfingerprint集合を事前列挙した。
- userが列挙済み集合を一括承認した場合、各operation前の再確認を強制していない。
- plan名 / revision labelだけで未列挙operationをauthorizationしていない。
- planの正本を実fingerprint集合として扱った。
- 同じplan名のままfingerprint集合が変わった場合、新規/変更fingerprintを再authorizationした。
- 説明文や並び順だけ変わりfingerprint集合が同一なら、不必要に再authorizationしていない。

## ブートストラップ完了ゲート

- `ai-context.json` / `llms.txt` / `docs/ARCHITECTURE.md` / `docs/DATA_CONTRACT.md` / `docs/UI_RULES.md` / `docs/PROJECT_STATUS.md` がある。
- ai-contextにstarter schemaVersion、bootstrap template commit SHA / revision、current parent manifest URLがある。
- top-level `schemaVersion` と `starter.schemaVersion` を別概念として扱っている。
- `schemaVersionMeaning` が一致する対象同士だけ比較している。
- parent starter schemaが新しくなっただけでlocal ai-context schema mismatchと誤判定していない。
- parent schemaのbreaking changeがあっても、それだけをlocal app restructure / migration authorizationにしていない。
- public ai-context / llms.txtにSecret、internal-only URL、private identifier、個人情報、未修正脆弱性詳細等がない。
- public fieldはfield名だけでなく実値を確認した。
- bootstrapだけを理由に既存codeをrefactor / rename / move / deleteしていない。

## 通常の機能追加・修正

- direct-changeとEvidence条件を満たすrequired-propagationだけを変更した。
- 類似部品再利用で不要な結合を増やしていない。
- 無関係refactor / cleanupを混在させていない。
- API / data contract / LocalStorage key / D1 schema / Sheets列 / Binding等を未許可で壊していない。
- 無関係問題は別taskへ回した。
- 通常の局所変更でrequired outcomeを安全に達成できないconfirmed Evidenceがある場合だけMajor Change Planningへ切り替えた。
- file数 / line数 / UIとAPIを両方触る等の変更量だけでMajor Changeへ昇格していない。

## Major Change Planning

- `major-change-planning-required` を変更量ではなくcontract / architecture / transition impactで判定した。
- 通常の局所的・段階的変更ではrequired outcomeを安全に達成できないことをconfirmed Evidenceで確認した。
- inferred / unknownの段階では `possible major change` に留め、Major Change Requiredと断定していない。
- fileが大きい、古い、modern化可能、templateと違う、全面整理すると綺麗、という理由だけでPlanningへ移していない。
- `Major Change Planning Required ≠ rewrite authorized` を維持した。
- Planningで保護対象 / 変更対象 / 変更しない対象 / contract impact / migration / environment / rollback / recoveryを整理した。
- 現実的な移行方式を比較し、形式的に3案を作ること自体を目的にしていない。
- 大規模再構成を「最も綺麗」「将来的に理想」という理由だけで推奨していない。
- A/B等の段階案ではrequired outcomeを満たせない、または具体的risk・複雑性・migration負荷が増えるEvidenceがある場合だけ大規模再構成を候補にした。
- Planning承認をMajor Change専用の包括authorizationとして扱っていない。
- 方式承認だけで未列挙Production Mutation / destructive operationをauthorized扱いしていない。
- exact fingerprint集合まで列挙・承認済みなら既存plan authorization ruleで重複確認を省いた。
- code / migration / environment / cleanup / incident / dependencyを各既存Protocolへroutingした。
- Major Change Planningが各Protocol固有のEvidence / authorization / verification条件を上書きしていない。
- `major-change-planning-required` をoverall completion stateへ混ぜていない。
- Planning complete / Implementation complete / Cleanup completeを分離した。
- Planning completeだけでMajor Change全体をcompleteにしていない。
- new system verifiedだけでold system deletion authorized / cleanup completeにしていない。
- 旧系削除ではconsumer / migration完了 / rollback必要性 / 保持期間等をCleanup側で再確認した。
- Major Change Planningを新しい過剰停止gateにしていない。

## 既存アプリ非破壊整備

- template準拠を目的にしていない。
- 新規app用directory例へ既存appを寄せていない。
- 整備候補がscope外なら記録だけにした。
- 既に「完了まで」「ロードマップ通り」等の継続指示がある場合、毎batch停止していない。
- scope拡大 / Production Mutation / 高リスク操作 / 実質的方針選択が必要な該当部分だけ停止した。
- 各batch終了時に、user choiceの有無とは別にmaintenance need / scope completion / recommended action / reasonをユーザーへ報告した。
- `continue` を推奨する場合は具体的なnext batchを報告した。
- continuation eligibilityをexecution method / safetyより先に判定した。
- auto continueはcurrent task scope内の未完了direct-changeまたはvalid required-propagationが残る場合だけにした。
- `read-only` / `限定確認` / `安全な範囲` であることをscope inclusionやunfinished statusの根拠にしていない。
- 「confirmedなものだけ変更する前提の調査」を、それだけでunfinished in-scope workへ昇格していない。
- scope complete後の追加inspectionをoptional future workとして分離した。
- current scope外のknown issue / bug / recommended improvement / unrelated issueをcontinuation justificationへ使っていない。
- known issueがconfirmedでも、それだけでcurrent task scopeへ昇格させていない。
- Major Change Planningが必要とconfirmedされた場合、整備の延長として大規模実装へ直行していない。
- Major Change候補の必要性確認がscope外なら、それ自体を新しいexploratory continuation理由にしていない。
- README / docsの古い記述を、current stateを誤認させるrequired fixか、単なる過去計画・将来メモ等のoptional noteかに分類した。
- current architecture / public method / storage / API / handoff情報を誤って説明するREADME / docsを、今回scope内ならdocumentation direct-changeとして扱った。
- 単なる将来メモや利便性リンク追加だけでcurrent scopeを広げたり `continue` を推奨したりしていない。
- required documentation writeがblockedなのにscopeを `complete` としていない。
- required documentation writeのblockedをverification pendingと誤分類していない。
- optional documentation writeがblockedした場合は、optionalである理由を明示し、required outcomeの未完了と混同していない。

## concurrency / stale SHA

- SHA conflict / stale SHAを検出しただけでstopしていない。
- conflict後にcurrent fileとcurrent SHAをrefetchした。
- concurrent changeを確認し、古い内容で上書きしていない。
- semantic conflictをfile単位・行単位だけで決めず、今回変更するlogic / contract / state / assumptionとの実overlapで判定した。
- 安全に統合可能ならconcurrent changeを維持し、own diffだけをcurrent stateへ再構成して再適用した。
- concurrent changeによって同等の目的状態がすでに実装済みなら、own diffを重複適用せずpurpose stateを再確認した。
- 同じfile / functionに変更があるだけで自動blockedにしていない。
- safe merge方法をEvidence付きで一意に決められない場合だけaffected partをblockedにした。
- conflict blocked時もdependent holdを適用し、実dependencyのないin-scope作業を全面停止していない。
- conflict解消のために他者・別Chatの正常変更を削除・巻き戻ししていない。

## dependent hold

hold伝播が必要なのは、後続作業がblocked inputを直接使用する、blocked contractで実装内容が変わる、またはsafety / authorization判断がblocked結果に依存する場合です。

- 実際のinput / contract / safety / authorization依存を確認した。
- 同じfile / screen / module / feature groupというだけでholdを広げていない。
- 「間接的に関係する可能性」だけで全面停止していない。
- 逆に、blocked結果を実際に使う後続作業を「別fileだから」と進めていない。
- 独立したin-scope作業は継続した。

## 障害・復旧

- code / deployment / environment / data-schema / external API compatibilityを必要に応じ別軸で確認した。
- last known goodを直前commitだけで決めていない。
- 原因不明の推測修正を積み重ねていない。
- rollback前に互換・data影響・失われる正常変更・restore target等を確認した。
- rollbackが危険なら根拠ある限定roll-forwardを選択可能としている。
- force push / history rewriteを通常復旧手段にしていない。
- HTTP 200 / deploy成功だけで復旧成功としていない。

## security containment

- unknown leakでAIの自律判断だけによるcredential mutationをしていない。
- confirmed / direct exposure Evidenceのみ自律containment候補として扱った。
- userが具体的にtoken X revokeを指示した場合、Evidence unknownでもXへのauthorizationとして扱えることを妨げていない。
- その指示をleak confirmedへ変換していない。
- authorizationを別token / account / Bindingへ広げていない。

## データ移行・実データ

- code / schema / actual data / environment settingsのrecoveryを別々に確認した。
- Git historyだけをactual data backupとみなしていない。
- `read-only → copy/snapshot/staging → new isolated test record → modify existing production data` の順を優先した。
- existing production data変更はoperation-specific authorizationなしに行っていない。
- migration完了条件まで旧互換処理を削除していない。

## 環境・Production Mutation / resource creation

- 実稼働設定 → deployment metadata → production branch設定file → handoff docs → README → inference の順を基準に確認した。
- inferenceを設定変更根拠にしていない。
- permission / role / ACL / access control変更をProduction Mutationとして扱った。
- cron / trigger / scheduled job / consumer変更をProduction Mutationとして扱った。
- production import / bulk rewrite等をProduction Mutationとして扱った。
- 新resource作成で既存Binding / routing / storage / targetが切り替わる場合はProduction Mutationとして扱った。
- 独立resource作成でも、cost / quota / future auto-billing / public exposure / credential issuance / privileged access / production data copy / significant name reservation / audit-retention-complianceがある場合はrisk gateを通した。
- Creation Flowで具体的構成とrisk特性を既に承認済みなら、同一範囲のresource作成を毎回再確認して過剰停止していない。
- 承認後にmaterial riskが増えた場合だけ追加authorization / choiceを求めた。
- tool capabilityだけでresource作成をauthorization済みとみなしていない。

## 削除・rename

- repo内部参照ゼロだけで未使用と断定していない。
- external consumer確認不能な公開contractをusage unknownとして扱った。
- contract boundary renameは件数に関係なくbreaking riskとして扱った。

## 依存更新

- direct / transitive dependencyとlockfile差分を確認した。
- major updateを通常feature workと混在させていない。
- security updateでも互換・rollback評価を省略していない。

## UI

- 見栄え改善で情報量・一覧性・操作数・主要導線を悪化させていない。
- SP対応のためPC版を悪化させていない。
- 画面幅だけで主要機能を削除していない。
- 対象に応じ、押下領域、scroll、overflow、modal close、focus、keyboard、gesture、fixed/sticky、z-index等を確認した。

## build number

- production executable code / UI asset / runtime behavior / API behaviorが変わる場合はversion policyに従った。
- docs / READMEのみなら原則buildを上げていない。
- environment-only変更でartifact・user behaviorが変わらない場合は原則build不要とした。
- rollback / roll-forwardで公開内容が変われば新buildとした。
- app固有version policyがあれば優先した。

## verificationと完了状態

- verification criteriaを固定列挙だけでなく、現在のdirect-changeの目的状態から導出した。
- 複数目的の依頼ではoutcome単位でverified / blocked / pendingを保持した。
- 一部outcomeの成功を依頼全体のcompleteへ一般化していない。
- adjacent regression checkは因果的に関連する範囲だけ追加した。
- requested outcomeと無関係な独立機能を完了条件へ勝手に追加していない。
- 保存修正なら保存 / 必要なreload persistenceを確認した。
- sync修正なら保存成功だけで完了にせず、sync目的状態まで確認した。
- blockedの場合、理由・代替確認・residual riskを記録した。
- partial verificationを未確認の目的状態へ一般化していない。
- required documentation writeがblockedなら、変更未完了として `incomplete` にした。
- required writeが完了し検証だけblockedの場合と、write自体がblockedの場合を区別した。
- `major-change-planning-required` を `complete / work-complete-verification-pending / incomplete` の代替値にしていない。
- Major Change Planning completeとMajor Change全体completeを混同していない。

全体状態:

- **完了** — direct-changeから導出した全required outcomeの必要変更と検証が完了。
- **作業完了 / 検証保留** — 変更は完了したがrequired outcomeの必要検証の一部blocked。
- **未完了** — 実装・復旧・移行・設定変更・required documentation writeそのものに残作業がある。

## rule complexity / 収束確認

新しい境界を見つけた場合:

- まず既存ruleで判定できないか確認した。
- 新概念を作らず既存ruleの説明改善で済むなら、ruleを追加していない。
- 同じ概念を別名称で増やしていない。
- manifestへ自然言語Protocolを過剰に詰め込んでいない。
- 同じruleを確認するだけのcaseを無制限に追加していない。
- 重大な抜け道がなければ、rule追加より重複整理・実app適用・過剰停止確認を優先した。
- Major Change Planningを「変更が大きそう」という曖昧な理由で常用し、新しい過剰停止gateにしていない。

## 解釈一致テスト

大きなpolicy変更後またはrule矛盾review時は `docs/POLICY_INTERPRETATION_CASES.md` を使います。

重点:

- stable ID lifetime / clone / restore / recreate / replacement。
- stale alias / Binding mapping。
- query semanticsとdynamic predicate / concrete-set scope。
- side effectを変えるoperation option / flag。
- enumerated plan approvalと実fingerprint集合。
- inferred / unknown riskのscope拡大。
- security Evidenceとexplicit authorization。
- dependent holdの不足・過大伝播。
- 複数direct-change outcomeのcompletion criteria。
- independent resource creation riskと既承認Creation Flow。
- schema version drift。
- silent fallback / fake success / partial verification。
- Major Changeの過剰昇格 / 過小判定。
- Major Change Planningとauthorization / completion / cleanupの境界。

同じcaseで別AIのscope、Evidence、authorization、Production Mutation、continuation、completion、Protocolが大きく割れる場合は、rule不足または表現曖昧として扱います。
