# Protocol Routing Rules

この文書は、複数の開発プロトコルが同時に該当し得る場合の中央判断ルールです。個別Protocolへ入る前に、今回の主目的、変更範囲、根拠、許可状態、高リスク条件、検証可能性を判定します。

`manifest.json` は機械判定しやすい条件・状態・参照先を持ち、この文書は判断理由、例外、具体例を定義します。各Protocolは作業モード固有の実施手順を定義します。

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

直接変更対象を成立させるために不可避な内部変更。次の条件を満たすものだけを含めます。

- 直接変更対象がそのままでは実装・修正できない。
- 変更しないと回帰、互換性破壊、データ損失、公開失敗等の具体的リスクが生じる。
- 変更範囲を対象責務・契約・UI領域へ限定できる。

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

「必要最小限」は行数の少なさではなく、ユーザー要望を満たすために必要な責務・契約・UI領域だけを変更することを意味します。

## 3. 変更理由として認める根拠

変更理由として認めるのは、原則として次のいずれかです。

- ユーザー要望の実現に必要。
- 確認済み障害原因の除去に必要。
- 具体的なデータ損失・互換性破壊・公開障害・セキュリティリスクの回避に必要。
- 今回の変更によって発生した回帰を除去するために必要。
- 現在の依頼で明示的に許可された整備対象である。

「明確な理由」「必要な整理」「明らかな改善」等の表現は、上記の根拠へ結び付けられない限り変更許可を意味しません。

## 4. 事実・推測・未確認を分離する Evidence Rule

AIは次を区別します。

- **confirmed** — コード参照、runtime結果、ログ、設定実値、履歴、ユーザー確認等の根拠がある。
- **inferred** — 複数の根拠から推測できるが確認済みではない。
- **unknown** — 判断材料が不足している。

「未使用」「不要」「壊れている」「原因」「正常」「互換」「安全」と断定するには、対象に適した確認根拠が必要です。

命名、見た目、一般論、READMEだけ、単一の文字列一致だけでは断定しません。

外部consumerの不存在を確認できない公開API、URL、storage key、GAS function等は「未使用」ではなく「利用状況不明」と扱い、削除しません。

## 5. 通常仕様の情報源優先順位

通常仕様を判断する際は、次を基本順序とします。

1. 現在のユーザーの明示指示。
2. 対象アプリ固有の現在契約・UI維持事項・データ契約。
3. 確認できる実稼働状態・現在実装。
4. 親テンプレートの一般ルール。
5. README、古い説明資料、推測。

ただし、この順位は安全停止条件や破壊的操作の許可条件を上書きしません。上位の指示だからといって、未許可の破壊的操作を自動実行してよいことにはなりません。

文書と実装・実稼働状態が食い違う場合は、推測でどちらかを正として書き換えず「不一致」として扱い、変更に必要な範囲だけ確認します。

## 6. 安全停止条件は通常仕様の優先順位と分離する

次が発生した場合、通常作業をそのまま継続せず該当Protocolへ切り替えます。

- 障害・主要機能停止・データ消失疑い → `INCIDENT_RECOVERY_PROTOCOL.md`
- 保存形式、schema、列、API契約等の変更・移行 → `DATA_MIGRATION_PROTOCOL.md`
- Cloudflare、GAS、GitHub連携、Binding、Secret、Variable等の変更 → `ENVIRONMENT_CHANGE_PROTOCOL.md`
- 不要コード、旧API、互換処理、ファイル等の削除 → `CLEANUP_DELETION_PROTOCOL.md`
- ライブラリ、SDK、ランタイム、ビルド基盤等の更新 → `DEPENDENCY_UPDATE_PROTOCOL.md`
- Secret、token、認証情報、非公開データ漏えい疑い → セキュリティ封じ込めを最優先。

高リスクProtocolは該当部分へ一時的に上書き適用し、元の作業目的そのものは失いません。

## 7. 複数高リスク条件の優先順位

原則として次の順で安全確保します。

1. セキュリティ封じ込め・障害復旧・被害拡大防止。
2. データ保全・データ移行。
3. 環境・接続設定の復旧または変更。
4. 通常の機能追加・仕様変更。
5. 非破壊整備。
6. 削除・整理。

依存更新は状況依存です。

- 依存更新が障害原因または復旧条件 → 障害復旧の一部。
- 重大脆弱性の緊急更新 → セキュリティ対応として優先。
- 通常のバージョン更新 → 独立した依存更新バッチ。

migrationに伴う旧互換削除はmigration確認完了後のcleanupとして行います。

## 8. Production Mutation の定義

次は通常コード編集と分離して扱うProduction Mutationです。

- 本番実データの削除、初期化、再書き込み。
- D1等のproduction schema migration・破壊的変更。
- production Sheetsの列・シート削除や既存値の一括変更。
- production Secret / Variable / Bindingの追加・削除・改名・値変更。
- production branch、deployment、Project / Worker設定の変更。
- production公開URL・custom domain変更。
- production API routeの破壊的変更。
- 本番認証方式や保存先の切替。

ツールで実行可能であることは、ユーザーが実行を許可したことを意味しません。

## 9. Production Mutation の許可状態

個別操作ごとに次の状態で扱います。

- **not-authorized** — 現在の依頼から当該本番操作の許可を確認できない。
- **authorized-for-this-operation** — ユーザーが当該操作を具体的に許可した。
- **already-approved-in-current-task** — 現在の依頼で対象・種類・範囲が明確に含まれ、追加確認なしで同一操作を継続できる。

広い依頼、例:「本番変更も含めて対応」「必要なら直して」「環境も整えて」は、Secret削除、schema破壊、データ削除、公開URL変更等の個別破壊操作への包括許可とはみなしません。

不可逆・復旧困難・データ破壊を伴う操作は、対象・影響・復旧方法が特定された個別許可を必要とします。

## 10. 実データ検証の優先順位

本番データを使う検証は、次の順で安全な方法を優先します。

1. 読み取りのみ。
2. copy / snapshot / staging / export等の複製環境。
3. production上の新規テストレコードなど、既存実データを書き換えない方法。
4. 既存production実データへの変更。

4はユーザーの明示的許可なしに行いません。

テストデータ、dummy data、sample recordを既存本番データへ無断で混在させません。作成する場合は識別・削除方法を明確にします。

## 11. バックアップを分離して確認する

「バックアップ済み」を一括で扱いません。該当するものを別々に確認します。

- code backup / Git history。
- schema backup / migration history。
- actual data backup / snapshot / export。
- environment settings backup / 現在値記録。

コードがGitHubにあることだけを、実データのbackup完了とはみなしません。

## 12. rollback / roll-forward 判定

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

## 13. 「1回の限定修正」の定義

障害時の1回の限定修正は、次の1サイクルです。

1. 原因仮説を1つに絞る。
2. 小規模な変更を行う。
3. 対象環境へ反映する。
4. 復旧確認を行う。

未反映のcode editやcommitだけでは1回に数えません。

1回で復旧しない場合は機械的にrollbackせず、前項のrollback安全性評価を行い、追加推測修正を重ねない方法を選択します。

## 14. Scope Expansion Rule

作業中に別変更が必要に見えた場合、次に分類します。

- **required-propagation** — 直接変更を成立させるため不可避。付随変更対象として実施可能。
- **recommended-improvement** — 有益だが今回の目的には不要。記録のみ。
- **unrelated-issue** — 今回の変更と無関係。別タスクへ回す。

重大障害、データ損失、セキュリティ問題は例外として該当高リスクProtocolへ切り替えます。

## 15. Generated / Derived Files Rule

sourceから生成されるbuild成果物、生成JSON、bundle、export等は、sourceが存在する場合は原則sourceを修正します。

生成物だけを手修正してsourceと不一致にしません。生成物を正本として直接変更する必要がある場合は、その理由と再生成時の扱いを記録します。

## 16. No Silent Fallback Rule

主要保存先、認証方式、API、公開方式、同期方式等が失敗した場合、既存仕様として定義済みのfallbackを除き、別方式へ勝手に切り替えません。

例: D1失敗を理由にLocalStorageへ無断切替しない。

fallbackが必要なら、互換性、データ所在、利用者影響を確認し、今回の許可範囲に含まれない場合は別判断として扱います。

## 17. No Fake Success Rule

操作成功の判定は目的状態の確認で行います。

次だけでは機能成功とみなしません。

- HTTP 200。
- commit成功。
- deploy成功。
- APIが応答した。
- 画面が開いた。

目的に応じて、保存結果、再読み込み、UI反映、データ互換、主要導線等を確認します。

## 18. 環境設定の情報源優先順位

環境設定が食い違う場合、原則として次を確認します。

1. 実稼働環境の現在設定・runtime behavior。
2. deployment metadata / provider configuration。
3. 対象production branchの設定ファイル。
4. 対象アプリのhandoff docs。
5. README等の説明資料。
6. 推測。

推測は変更根拠にしません。Secret値そのものを無理に取得・記録する必要はなく、存在・名前・参照関係を必要範囲で確認します。

## 19. 競合・stale state

書き込み前に取得したSHAや内容が古くなっていた場合、古い内容で上書きしません。

- 長時間作業や複数変更後は、重要ファイルを書き込む直前にも現在SHA・内容を確認する。
- 409等の競合時は最新を再取得する。
- 他者・別Chatの変更を残したまま、自分の差分だけを再適用する。
- 競合解消を理由に他の正常変更を無断削除しない。

## 20. 親テンプレートとアプリ固有ルールのversion drift

生成アプリの `ai-context.json` には最低限次を残します。

- starter schemaVersion。
- bootstrap時のtemplate commit SHA。
- bootstrap時に参照したtemplate revision / version相当情報。
- current parent manifest URL。

最新親ルールは安全原則・判断補助として参照できますが、後から追加された親ルールだけを理由に既存アプリの構造・UI・data contractを変更しません。

## 21. public ai-context の安全基準

公開URLから取得可能な `ai-context.json` / `llms.txt` はpublic-safeな情報だけを含めます。

公開しないもの:

- Secret、API key、token、credential。
- 内部専用URLや非公開resource identifier。
- 個人情報。
- 非公開repositoryの機密情報。
- 未修正の脆弱性詳細や攻撃手順。
- 運用上秘匿すべき内部情報。

`docs/PROJECT_STATUS.md` 等のrepository内部handoffと、公開自己記述情報は同一内容である必要はありません。

## 22. build number policy

`YYYYMMDD-NN` のbuild番号更新を必須とするのは、ユーザーが確認する公開アプリのcode / UI / runtime behavior / deployed assetが変わる場合です。

原則としてbuild更新不要:

- docsのみ。
- READMEのみ。
- parent templateの説明のみ。
- runtimeへ影響しない内部レビュー記録のみ。

rollback / roll-forwardで公開内容が変わる場合は新しいbuildを付け、過去build番号を再利用して「新しい変更」を表現しません。ただし既存アプリ側に別の明示的version policyがある場合は、そのアプリ固有規則を優先します。

## 23. 検証項目の状態

「可能な範囲で確認」で省略せず、各重要項目を次で扱います。

- **verified** — 実施済み。
- **blocked** — 実施不能。理由、代替確認、残存リスクを記録。
- **not-applicable** — 今回は非該当。

全体状態は次の3つを維持します。

- **完了** — 必要な実装・変更・検証が完了。
- **作業完了 / 検証保留** — 変更は完了したが必要検証の一部がblocked。
- **未完了** — 実装、復旧、移行、設定変更そのものに残作業がある。

さらに内部状態として、必要に応じて次を個別に `complete / pending / not-applicable` で記録します。

- implementation。
- deployment。
- verification。
- documentation。

## 24. 整備モードの継続確認

整備モードで毎バッチ必ず停止するのは既定ではありません。

ユーザーが現在の依頼で、例えば次を明示している場合は、当初範囲内の安全な次バッチへ自動継続できます。

- 完了まで進める。
- ロードマップに沿って継続する。
- 残課題を順に処理する。
- 安定化を可能な範囲まで進める。

再確認が必要なのは次の場合です。

- 当初scopeを超える。
- 新たなProduction Mutationや破壊的操作が必要。
- 高リスクProtocolへ切り替わり、個別許可が必要。
- 複数の実質的に異なる方針から選択が必要。
- ユーザーが各バッチでの選択を明示的に希望している。

## 25. 新規アプリで推測しない高コスト事項

新規作成時でも、後から変更コストや安全影響が大きい事項は根拠なく決めません。

- public / private。
- 認証要否・認証方式。
- 永続保存先。
- 個人情報・機密情報の保存有無。
- 課金サービス利用。
- 外部公開範囲。
- retention / deletion policy。

要件から明確に決まる場合はAIが具体化し、明確でないまま安全性・費用・データ契約へ大きく影響する場合は推測で固定しません。

## 26. UI変更の安全原則

見栄えの改善を、情報量、一覧性、操作数、既存配置、主要導線を悪化させる理由にしません。

- スマホ対応のためにPC版を悪化させない。
- PCレイアウトの単純縮小をスマホ最適化とみなさない。
- 画面幅だけを理由に主要機能を削除しない。
- 既存の情報密度や一覧性が目的なら、その目的を維持する。

UI回帰では対象に応じて、押下領域、scroll、overflow、modal close、focus、keyboard、gesture、fixed/sticky、z-index等も確認します。

## 27. 完了判定

コードを書いた、commitした、deployが開始された、というだけでは完了ではありません。

目的状態が確認できたか、blockedなら何が未確認か、次回どこから再開するかを記録します。
