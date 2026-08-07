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
- parent resourceへ丸めて一致させていない。
- rename前後を同一identityとする場合、stable provider ID継続をconfirmedした。
- rename authorizationをrename後の別operationへ継承していない。
- operation-typeはverb文字列ではなくside effect / reversibility / contract boundary / security consequenceで正規化した。
- target-scopeはexact affected set。
- filter表記差を同一scopeにする場合、type / NULL / collation / timezone / parameter semanticsまで保ったdeterministic equivalenceを確認した。
- dynamic time rangeやruntime parameterが変わるscopeを文字列だけで再利用していない。
- subset / supersetを同じscopeとみなしていない。

## plan authorization

複数operationをまとめて承認する場合:

- planにfingerprint集合を事前列挙した。
- userが列挙済み集合を一括承認した場合、各operation前の再確認を強制していない。
- plan名だけで未列挙operationをauthorizationしていない。
- plan revisionでfingerprintが追加・変更された場合、新規/変更fingerprintだけ追加authorizationを求めた。
- 既承認で未変更のfingerprintを不必要に再確認していない。

## ブートストラップ完了ゲート

- `ai-context.json` / `llms.txt` / `docs/ARCHITECTURE.md` / `docs/DATA_CONTRACT.md` / `docs/UI_RULES.md` / `docs/PROJECT_STATUS.md` がある。
- ai-contextにstarter schemaVersion、bootstrap template commit SHA / revision、current parent manifest URLがある。
- top-level `schemaVersion` と `starter.schemaVersion` を別概念として扱っている。
- `schemaVersionMeaning` が一致する対象同士だけ比較している。
- parent starter schemaが新しくなっただけでlocal ai-context schema mismatchと誤判定していない。
- 古いappがbootstrap時starter versionを保持していることだけでlocal migrationを強制していない。
- public ai-context / llms.txtにSecret、internal-only URL、private identifier、個人情報、未修正脆弱性詳細等がない。
- public fieldはfield名だけでなく実値を確認した。
- bootstrapだけを理由に既存codeをrefactor / rename / move / deleteしていない。

## 通常の機能追加・修正

- direct-changeとEvidence条件を満たすrequired-propagationだけを変更した。
- 類似部品再利用で不要な結合を増やしていない。
- 無関係refactor / cleanupを混在させていない。
- API / data contract / LocalStorage key / D1 schema / Sheets列 / Binding等を未許可で壊していない。
- 無関係問題は別taskへ回した。

## 既存アプリ非破壊整備

- template準拠を目的にしていない。
- 新規app用directory例へ既存appを寄せていない。
- 整備候補がscope外なら記録だけにした。
- 既に「完了まで」「ロードマップ通り」等の継続指示がある場合、毎batch停止していない。
- scope拡大 / Production Mutation / 高リスク操作 / 実質的方針選択が必要な該当部分だけ停止した。

## dependent hold

hold伝播が必要な場合:

- 後続作業がblocked inputを直接使用する、または
- blocked contractの結果で実装内容が変わる、または
- safety / authorization判断がblocked結果に依存する。

次だけでholdを広げていない:

- 同じfile。
- 同じscreen。
- 同じfeature group。
- 間接的に関係する可能性。
- 念のため。

独立したin-scope作業は継続した。

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
- 独立resource作成でも、paid cost / public exposure / privileged access / production data copy / significant name reservation / retention obligationがある場合は無害なcode edit扱いにしていない。
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
- adjacent regression checkは因果的に関連する範囲だけ追加した。
- requested outcomeと無関係な独立機能を完了条件へ勝手に追加していない。
- 保存修正なら保存 / 必要なreload persistenceを確認した。
- sync修正なら保存成功だけで完了にせず、sync目的状態まで確認した。
- blockedの場合、理由・代替確認・residual riskを記録した。
- partial verificationを未確認の目的状態へ一般化していない。

全体状態:

- **完了** — direct-changeから導出した必要変更と検証が完了。
- **作業完了 / 検証保留** — 変更は完了したが必要検証の一部blocked。
- **未完了** — 実装・復旧・移行・設定変更そのものに残作業がある。

## 解釈一致テスト

大きなpolicy変更後またはrule矛盾review時は `docs/POLICY_INTERPRETATION_CASES.md` を使います。

重点:

- stable ID / account / project / alias / renameによるresource identity。
- equivalent / non-equivalent / dynamic target-scope。
- operation side effect normalization。
- enumerated plan approvalとplan revision。
- inferred / unknown riskのscope拡大。
- security Evidenceとexplicit authorization。
- dependent holdの不足・過大伝播。
- direct-change別のcompletion criteria。
- independent resource creation risk。
- schema version drift。
- silent fallback / fake success / partial verification。

同じcaseで別AIのscope、Evidence、authorization、Production Mutation、continuation、Protocolが大きく割れる場合は、rule不足または表現曖昧として扱います。