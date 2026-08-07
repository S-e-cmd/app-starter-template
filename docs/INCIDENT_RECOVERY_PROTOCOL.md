# Incident Recovery Protocol

公開中アプリや主要機能が壊れたとき、壊れた状態へ推測修正を重ねず、まず正常稼働へ戻すための手順です。

Evidence、scope、Production Mutation authorization、security containment、last known good、rollback / roll-forward、安全停止条件の定義は `docs/PROTOCOL_ROUTING_RULES.md` を正本とします。このProtocolでは障害復旧固有の実施順序だけを定義します。

## 適用条件

中央routingに従い、次のような状態では通常の機能追加・整備よりincident recoveryを優先します。

- 白画面、起動不能、ログイン不能。
- 主要機能が使えない。
- 修正後に複数機能が同時に落ちた。
- データが消えた、読めない、初期化されたように見える。
- 公開ページとrepository / deploymentの状態が大きく食い違い、主要機能へ影響している。
- 原因不明のまま次の推測修正を重ねようとしている。
- Secret、認証情報、非公開データの漏えいについて中央security containment条件を満たすEvidenceがある。

不一致やunknownがあるだけで一律にincident扱いしません。今回の主要機能・データ・securityへ実際に影響するかを中央Evidence Ruleで判断します。

## 復旧の標準手順

1. 現在の症状、直前変更、公開buildを記録する。
2. 必要に応じて `code / deployment / environment / data-schema / external API compatibility` を別軸で確認する。
3. last known goodまたは候補を特定する。
4. 原因仮説とEvidence stateを記録する。
5. rollback / roll-forward安全性評価を行う。
6. Production Mutationが必要なら、中央authorization fingerprintで許可状態を判定する。
7. security containmentが必要なら、中央security containment policyに従い、許可済みの最小対象だけ封じ込める。
8. history-preserving rollbackまたはEvidenceに基づく限定roll-forwardを実施する。
9. 起動だけでなく、障害対象の主要操作、保存、再読み込み、API / external integration、公開状態を確認する。
10. 正常稼働へ戻った時点で復旧batchを終了する。
11. 原因調査・恒久修正は別batchとして扱う。
12. `docs/PROJECT_STATUS.md` に症状、Evidence、復旧方法、commit / build / deployment、verified / blocked、未解決原因、次batchを記録する。

## 限定修正

中央ruleで定義された「1回の限定修正」は、`原因仮説1つ → 小変更 → 対象環境へ反映 → 復旧確認` の1cycleです。

次を満たす場合に限定roll-forwardを検討できます。

- 原因箇所がconfirmed、または復旧判断に十分なEvidenceで限定されている。
- 変更範囲が狭い。
- data / schema / environmentへの影響が評価済み。
- 修正後の回帰確認が可能。
- 次の推測を追加しない。

1cycleで復旧しない場合は推測修正を重ねず、中央rollback policyで再評価します。

## security incident

security containmentのauthorization境界は中央ruleを使用します。

- 「確認して」「怪しい」だけでcredentialを失効しない。
- unknownならread-only確認を優先する。
- confirmed leak等でユーザーがcontain / revoke / disableを明示した場合も、その指定resource・operation・scopeだけに限定する。
- 事前runbookのauthorizationを使う場合もrunbook記載範囲を超えない。
- Secret値そのものをlog、issue、commit、chatへ再掲しない。

## 禁止事項

- 原因不明のまま修正を上書きし続ける。
- 壊れた状態を土台に大規模refactorする。
- 復旧と無関係な恒久改善を同じbatchへ混ぜる。
- data異常時に安易な初期化・削除・再作成を行う。
- rollback安全性を確認せず機械的に巻き戻す。
- force pushやhistory rewriteを通常復旧手段として使用する。
- securityを理由にauthorization対象を別credential・別resourceへ拡張する。
- 「画面が開いた」「deploy成功」「HTTP success」だけで復旧完了扱いにする。

## 復旧結果の状態

中央verification policyを使用します。

- **完了** — 正常稼働復旧と必要な確認が完了。
- **作業完了 / 検証保留** — 復旧変更は完了したが、必要確認の一部がblocked。
- **未完了** — 正常稼働へまだ戻っていない、または復旧作業そのものに残作業がある。

blocked項目が今回の復旧判断に不要なら、他のin-scope復旧作業を継続します。
