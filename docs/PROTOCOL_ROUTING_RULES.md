# Protocol Routing Rules

この文書は、複数の開発プロトコルが同時に該当し得る場合の中央判断ルールです。個別Protocolへ入る前に、今回の主目的、変更範囲、根拠、許可状態、高リスク条件、検証可能性を判定します。

`manifest.json` は機械判定しやすい条件・状態・参照先を持ち、この文書は判断理由、例外、具体例を定義します。各Protocolは作業モード固有の実施手順を定義します。同じ中央ruleを各Protocolへ再定義せず、Protocol側は中央ruleへの参照とその作業固有手順を中心にします。

## 1. 主作業モードはユーザーの現在の目的で決める

Repository URL、公開URL、`app-starter-template` が提示されていること自体は、整備モードを選ぶ理由にしません。

- 新しいアプリを作る → `CREATE_AND_DEPLOY_FLOW.md` / `BOOTSTRAP_PROTOCOL.md`
- 既存アプリへ機能追加、仕様変更、UI改善、限定的な不具合修正を行う → `FEATURE_CHANGE_PROTOCOL.md`
- 既存アプリ全体の整理、安定化、責務整理、引き継ぎ改善を行う → `EXISTING_APP_ALIGNMENT_PROTOCOL.md`
- 正常稼働していたアプリや主要機能が壊れた → `INCIDENT_RECOVERY_PROTOCOL.md`

## 2. 依頼範囲を3区分する

作業前に変更対象を次の3区分で解釈します。

### 直接変更対象

ユーザーが具体的に変更を求めた機能、挙動、UI、データ処理、設定。

### 付随変更対象

直接変更対象を成立させるために不可避な内部変更。次の条件をすべて満たすものだけを含めます。

- 直接変更対象がそのままでは実装・修正できない、または直接変更によって具体的な回帰・互換性破壊・データ損失・公開失敗等が発生する。
- その必要性をEvidence Ruleで評価できる。
- 変更範囲を対象責務・契約・UI領域へ限定できる。

required-propagationへ自動分類する根拠は原則 **confirmed** を必要とします。**inferred** の場合は、直接変更との因果関係を示す複数の独立した根拠があり、変更が可逆的・非破壊的・非Production Mutationである場合だけ候補にできます。**unknown** のriskはrequired-propagationへ分類しません。

AIが一般論や仮想的なriskを作っただけではscopeを拡大できません。Production Mutation、破壊的変更、契約境界変更をrequired-propagationとして実行する場合は、confirmed Evidenceと該当authorizationの両方を必要とします。

### 範囲外

今回の目的を満たすために不要な変更。改善可能でも自動実施しません。

次は付随変更の根拠になりません。

- 改善できる。
- 関連している。
- 同じファイルにある。
- ファイルが長い。
- 一般的なベストプラクティスと違う。
- 最新方式ではない。
- テンプレートと違う。
- 見た目やコードが美しくなる。
- 将来問題になるかもしれないという根拠未確認の仮説。

「必要最小限」は行数の少なさではなく、ユーザー要望を満たすために必要な責務・契約・UI領域だけを変更することを意味します。

## 3. 変更理由として認める根拠

変更理由として認めるのは、原則として次のいずれかです。

- ユーザー要望の実現に必要。
- confirmedな障害原因の除去に必要。
- confirmed、または前節の条件を満たす十分に裏付けられたriskとして、具体的なデータ損失・互換性破壊・公開障害・セキュリティriskの回避に必要。
- 今回の変更によって発生した回帰を除去するために必要。
- 現在の依頼で明示的に許可された整備対象である。

「明確な理由」「必要な整理」「明らかな改善」等の表現は、上記の根拠へ結び付けられない限り変更許可を意味しません。

## 4. 事実・推測・未確認を分離する Evidence Rule

AIは次を区別します。

- **confirmed** — コード参照、runtime結果、ログ、設定実値、履歴、ユーザー確認等の対象に適した根拠がある。
- **inferred** — 複数の関連根拠から推測できるが確認済みではない。
- **unknown** — 判断材料が不足している。

「未使用」「不要」「壊れている」「原因」「正常」「互換」「安全」と断定するには、対象に適した確認根拠が必要です。

命名、見た目、一般論、READMEだけ、単一の文字列一致だけでは断定しません。

外部consumerの不存在を確認できない公開API、URL、storage key、GAS function等は「未使用」ではなく「利用状況不明」と扱い、削除しません。

Evidenceの強さはscope拡大、Production Mutation、security containment、rollback / roll-forwardの判断にも引き継ぎます。unknownを安全側という理由だけでconfirmedへ格上げしません。

## 5. 通常仕様の情報源優先順位

通常仕様を判断する際は、次を基本順序とします。

1. 現在のユーザーの明示指示。
2. 対象アプリ固有の現在契約・UI維持事項・データ契約。
3. 確認できる実稼働状態・現在実装。
4. 親テンプレートの一般ルール。
5. README、古い説明資料、推測。

ただし、この順位は安全停止条件や破壊的操作の許可条件を上書きしません。上位の指示だからといって、未許可の破壊的操作を自動実行してよいことにはなりません。

文書と実装・実稼働状態が食い違う場合は、推測でどちらかを正として書き換えず「不一致」として扱います。

- 今回のdirect-change、required-propagation、契約判断、安全判断に無関係な不一致 → 記録して作業を継続する。
- 今回の変更対象の正しい契約や安全性を決めるために必要な不一致 → 必要範囲だけ確認・解消してから該当変更を進める。
- 不一致があるだけで作業全体を一律停止しない。

## 6. 安全停止条件は通常仕様の優先順位と分離する

次が発生した場合、通常作業をそのまま継続せず該当Protocolへ切り替えます。

- 障害・主要機能停止・データ消失疑い → `INCIDENT_RECOVERY_PROTOCOL.md`
- 保存形式、schema、列、API契約等の変更・移行 → `DATA_MIGRATION_PROTOCOL.md`
- Cloudflare、GAS、GitHub連携、Binding、Secret、Variable等の変更 → `ENVIRONMENT_CHANGE_PROTOCOL.md`
- 不要コード、旧API、互換処理、ファイル等の削除 → `CLEANUP_DELETION_PROTOCOL.md`
- ライブラリ、SDK、ランタイム、ビルド基盤等の更新 → `DEPENDENCY_UPDATE_PROTOCOL.md`
- Secret、token、認証情報、非公開データ漏えいのconfirmed Evidence、または直接露出を示す強いEvidenceがある → security containmentを優先して評価する。

高リスクProtocolは該当部分へ一時的に上書き適用し、元の作業目的そのものは失いません。

## 7. 複数高リスク条件の優先順位

原則として次の順で安全確保します。

1. security containment・障害復旧・被害拡大防止。
2. データ保全・データ移行。
3. 環境・接続設定の復旧または変更。
4. 通常の機能追加・仕様変更。
5. 非破壊整備。
6. 削除・整理。

依存更新は状況依存です。

- 依存更新が障害原因または復旧条件 → 障害復旧の一部。
- 重大脆弱性の緊急更新 → security対応として優先。
- 通常のバージョン更新 → 独立した依存更新バッチ。

migrationに伴う旧互換削除はmigration確認完了後のcleanupとして行います。

## 8. Production Mutation の定義

既存productionの状態・権限・接続・データ・実行スケジュール・公開挙動を変更する操作は、作成・変更・削除の別を問わず通常コード編集と分離して扱います。

例:

- 本番実データの削除、初期化、再書き込み、import、bulk create / bulk update。
- D1等のproduction schema migration・破壊的変更。
- production Sheetsの列・シート変更、既存値の一括変更。
- production Secret / Variable / Bindingの追加・削除・改名・値変更。
- production branch、deployment、Project / Worker設定の変更。
- production公開URL・custom domain変更。
- production API routeの破壊的変更。
- 本番認証方式や保存先の切替。
- production権限、role、ACL、access control、認証ポリシーの変更。
- cron、GAS trigger、scheduled job、queue consumer等のproduction実行スケジュール・自動実行条件の追加・変更・削除。
- 本番resourceの新規作成で、既存appのBinding、接続先、保存先、routing、権限、実行対象が切り替わるもの。

単に新規resourceを作るだけで既存productionへ接続・参照されない場合は、そのresource作成自体のriskを評価した上で、既存production mutationとは分離して扱えます。

ツールで実行可能であることは、ユーザーが実行を許可したことを意味しません。

## 9. Production Mutation の許可状態

個別操作ごとに次の状態で扱います。

- **not-authorized** — 現在の依頼から当該本番操作の許可を確認できない。
- **authorized-for-this-operation** — ユーザーが当該操作を具体的に許可した。
- **already-approved-in-current-task** — 現在の依頼で、同一のauthorization fingerprintを持つ操作が既に具体的に許可されており、その許可範囲内で継続できる。

authorization fingerprintは最低限、次を分けて持ちます。

- **environment** — production / staging等。
- **resource** — 対象database、table、sheet、Worker、Project、Secret、Binding、trigger等。
- **operation-type** — create / update / delete / migrate / import / rewrite / permission-change / schedule-change等。
- **target-scope** — table名、列、record集合、設定項目、対象job等の具体範囲。

`already-approved-in-current-task` を継承できるのは、environment・resource・operation-type・target-scopeが既存許可と一致する場合だけです。いずれかが広がる、別resourceになる、別種類の破壊操作が追加される場合は、新しいauthorizationとして扱います。

例: `users` tableへの非破壊migration許可は、別table削除、同tableのcolumn削除、全record rewrite、別database migrationへの許可を意味しません。

広い依頼、例:「本番変更も含めて対応」「必要なら直して」「環境も整えて」は、Secret削除、schema破壊、データ削除、公開URL変更等の個別破壊操作への包括許可とはみなしません。

不可逆・復旧困難・データ破壊を伴う操作は、対象・影響・復旧方法が特定された個別許可を必要とします。

## 10. security containment と authorization

security containmentは優先度が高くても、Evidenceとauthorizationを消去しません。

- 漏えい・不正アクセスが **unknown** の場合 → production credential失効やaccess遮断を自動実施せず、read-only確認と必要な証拠収集を優先する。
- 直接露出、公開commit、runtime log等で漏えいが **confirmed**、またはそれに準ずる強いEvidenceがある場合 → 封じ込めを最優先の操作候補として提示・実施判断する。
- token失効、Secret rotation、account disable、access block等のProduction Mutationは、ユーザーが現在タスクで「漏えい対応・封じ込め・失効」まで明示している場合のみ、その具体的対象範囲でauthorized-for-this-operationとして扱える。
- 単なる「調べて」「確認して」「怪しい」ではcredential無効化のauthorizationにならない。
- 事前に対象appのincident runbook等で具体的な自動封じ込め権限が明記されている場合は、そのrunbookの対象・操作・範囲内に限って既存authorizationとして扱える。

緊急性はscopeやauthorizationを無制限に拡張する理由にしません。封じ込めに必要な最小の対象・操作へ限定し、その後の恒久変更は別途通常authorizationを判定します。

## 11. 実データ検証の優先順位

本番データを使う検証は、次の順で安全な方法を優先します。

1. 読み取りのみ。
2. copy / snapshot / staging / export等の複製環境。
3. production上の新規テストレコードなど、既存実データを書き換えない方法。
4. 既存production実データへの変更。

4はユーザーの明示的許可なしに行いません。

テストデータ、dummy data、sample recordを既存本番データへ無断で混在させません。作成する場合は識別・削除方法を明確にします。

## 12. バックアップを分離して確認する

「バックアップ済み」を一括で扱いません。該当するものを別々に確認します。

- code backup / Git history。
- schema backup / migration history。
- actual data backup / snapshot / export。
- environment settings backup / 現在値記録。

コードがGitHubにあることだけを、実データのbackup完了とはみなしません。

## 13. rollback / roll-forward 判定

rollbackは常に最優先ではなく、実施前に最低限次を確認します。

- rollback対象codeが現在data/schemaと互換か。
- 現在のenvironment設定と互換か。
- migration後データへ悪影響がないか。
- rollbackで失われる正常変更がないか。
- rollback可能なcommit / build / deploymentが実在するか。
- external API等の現在仕様と互換か。

rollbackの方が危険または復元不能で、原因が十分特定され、小さなroll-forwardで安全に復旧できる場合はroll-forwardを選択できます。

`last known good` は単なる直前commitではありません。code、deployment、environment、data/schema、external API compatibilityを必要に応じて別軸で記録します。

Git履歴を書き換えないrollbackを優先し、force pushや無関係な正常変更を消す巻き戻しは原則避けます。

## 14. 「1回の限定修正」の定義

障害時の1回の限定修正は、次の1サイクルです。

1. 原因仮説を1つに絞る。
2. 小規模な変更を行う。
3. 対象環境へ反映する。
4. 復旧確認を行う。

未反映のcode editやcommitだけでは1回に数えません。

1回で復旧しない場合は機械的にrollbackせず、前項のrollback安全性評価を行い、追加推測修正を重ねない方法を選択します。

## 15. Scope Expansion Rule

作業中に別変更が必要に見えた場合、次に分類します。

- **required-propagation** — 第2節のEvidence条件を満たし、直接変更を成立させるため不可避。付随変更対象として実施可能。
- **recommended-improvement** — 有益だが今回の目的には不要。記録のみ。
- **unrelated-issue** — 今回の変更と無関係。別タスクへ回す。

重大障害、データ損失、security問題は例外として該当高リスクProtocolへ切り替えますが、scopeとauthorizationの判定は継続します。

## 16. Generated / Derived Files Rule

sourceから生成されるbuild成果物、生成JSON、bundle、export等は、sourceが存在する場合は原則sourceを修正します。

生成物だけを手修正してsourceと不一致にしません。生成物を正本として直接変更する必要がある場合は、その理由と再生成時の扱いを記録します。

## 17. No Silent Fallback Rule

主要保存先、認証方式、API、公開方式、同期方式等が失敗した場合、既存仕様として定義済みのfallbackを除き、別方式へ勝手に切り替えません。

例: D1失敗を理由にLocalStorageへ無断切替しない。

fallbackが必要なら、互換性、データ所在、利用者影響を確認し、今回の許可範囲に含まれない場合は別判断として扱います。

## 18. No Fake Success Rule

操作成功の判定は目的状態の確認で行います。

次だけでは機能成功とみなしません。

- HTTP 200。
- commit成功。
- deploy成功。
- APIが応答した。
- 画面が開いた。

目的に応じて、保存結果、再読み込み、UI反映、データ互換、主要導線等を確認します。

## 19. 環境設定の情報源優先順位

環境設定が食い違う場合、原則として次を確認します。

1. 実稼働環境の現在設定・runtime behavior。
2. deployment metadata / provider configuration。
3. 対象production branchの設定ファイル。
4. 対象アプリのhandoff docs。
5. README等の説明資料。
6. 推測。

推測は変更根拠にしません。Secret値そのものを無理に取得・記録する必要はなく、存在・名前・参照関係を必要範囲で確認します。

## 20. 競合・stale state

書き込み前に取得したSHAや内容が古くなっていた場合、古い内容で上書きしません。

- 長時間作業や複数変更後は、重要ファイルを書き込む直前にも現在SHA・内容を確認する。
- 409等の競合時は最新を再取得する。
- 他者・別Chatの変更を残したまま、自分の差分だけを再適用する。
- 競合解消を理由に他の正常変更を無断削除しない。

## 21. 親テンプレートとアプリ固有ルールのversion drift

生成アプリの `ai-context.json` には最低限次を残します。

- starter schemaVersion。
- bootstrap時のtemplate commit SHA。
- bootstrap時に参照したtemplate revision / version相当情報。
- current parent manifest URL。

最新親ルールは安全原則・判断補助として参照できますが、後から追加された親ルールだけを理由に既存アプリの構造・UI・data contractを変更しません。

## 22. public ai-context の安全基準

公開URLから取得可能な `ai-context.json` / `llms.txt` はpublic-safeな情報だけを含めます。

公開しないもの:

- Secret、API key、token、credential。
- 内部専用URLや非公開resource identifier。
- 個人情報。
- 非公開repositoryの機密情報。
- 未修正の脆弱性詳細や攻撃手順。
- 運用上秘匿すべき内部情報。

公開contextへ新しいfieldを追加する場合は、そのfield名だけでなく実際に入る値がpublic-safeか確認します。repository内部handoff用の値を、そのままpublic contextへコピーしません。

`docs/PROJECT_STATUS.md` 等のrepository内部handoffと、公開自己記述情報は同一内容である必要はありません。

## 23. build number policy

`YYYYMMDD-NN` のbuild番号更新を必須とするのは、ユーザーが確認するproduction artifactまたはproduction runtimeの内容が変わり、app固有policyが別途定義されていない場合です。

原則としてbuild更新対象:

- productionへ配信されるJS / Worker / GAS web app等の実行code変更。
- CSS等、production UIの表示・操作に影響するasset変更。
- runtimeが読み込む静的JSON・config・template等の変更で、ユーザー表示・挙動・API responseへ影響するもの。
- 内部APIのみでも、productionへdeployされるcode変更でresponse・副作用・契約挙動が変わるもの。
- rollback / roll-forwardで公開artifactの内容が変わる場合。

原則としてbuild更新不要:

- docsのみ。
- READMEのみ。
- parent templateの説明のみ。
- runtimeへ影響しない内部review記録のみ。
- production artifactを変更しないSecret rotationや権限変更等のenvironment-only操作。ただしユーザーが確認する挙動が変わる、またはapp固有policyが要求する場合は更新対象。

静的assetがdeployされてもruntime・表示・契約に影響しない場合は、単にファイルtimestamp等が変わったことだけでbuildを上げません。

既存アプリ側に別の明示的version policyがある場合は、そのアプリ固有規則を優先します。過去build番号を再利用して新しい公開内容を表現しません。

## 24. 検証項目の状態

「可能な範囲で確認」で省略せず、各重要項目を次で扱います。

- **verified** — 実施済み。
- **blocked** — 実施不能。理由、代替確認、残存riskを記録。
- **not-applicable** — 今回は非該当。

blockedやunknownは作業全体の自動停止理由ではありません。

- direct-changeの成功判定、安全判断、authorization判断に必要なblocked / unknown → 該当部分を保留し、代替確認または必要なユーザー操作へ切り替える。
- 今回のscopeに無関係なblocked / unknown → 記録し、他のin-scope作業を継続する。

全体状態は次の3つを維持します。

- **完了** — 必要な実装・変更・検証が完了。
- **作業完了 / 検証保留** — 変更は完了したが必要検証の一部がblocked。
- **未完了** — 実装、復旧、移行、設定変更そのものに残作業がある。

さらに内部状態として、必要に応じて次を個別に `complete / pending / not-applicable` で記録します。

- implementation。
- deployment。
- verification。
- documentation。

## 25. 解釈一致テスト

中央policyの解釈を確認するときは `docs/POLICY_INTERPRETATION_CASES.md` のadversarial casesを使用します。

正常ケースだけでなく、次の抜け道を意図的に試します。

- 広い依頼を破壊的操作の包括authorizationとして解釈できないか。
- inferred / unknown riskをrequired-propagationへ格上げできないか。
- securityを理由に未許可Production Mutationを実行できないか。
- documentation/runtime mismatchやblockedを理由に無関係な作業まで停止できないか。
- build更新条件を都合よく広げたり狭めたりできないか。
- 中央policyと個別Protocolの表現差から別解釈を作れないか。
