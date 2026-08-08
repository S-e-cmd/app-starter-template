# Existing App Alignment Protocol

既存アプリを壊さず、今後の修正・引き継ぎを安全にするための非破壊整備手順です。

## 適用条件

まず `docs/PROTOCOL_ROUTING_RULES.md` で主作業モードを判定します。

このモードは、ユーザーの現在の目的が次に該当する場合に使用します。

- 既存アプリ全体の整理・安定化。
- 責務混在や巨大化の段階的な改善。
- 引き継ぎ情報の整備。
- 今後の変更を安全にするための保守性改善。
- 特定の新機能ではなく、既存アプリ全体の状態確認と整備。

既存アプリのGitHubリポジトリ、公開ページ、`app-starter-template` が提示されていること自体は、このモードを選ぶ理由にしません。具体的な機能追加・仕様変更が主目的なら `FEATURE_CHANGE_PROTOCOL.md` を使用します。

## 最優先原則

### 1. 壊さない

- `direct-change / required-propagation / out-of-scope` を区別する。
- ユーザーが直接変更を求めた範囲は変更対象として扱う。
- 依頼範囲外の既存機能、既存UI、保存データ、API契約、公開方式、公開URLを保護対象として扱う。
- 公開中の正常動作と既存データ互換性をtemplate構成より優先する。
- 大規模変更、一括置換、根拠のない削除、templateに合わせるだけの再構成を行わない。

### 2. 「できない」で止めない

- 権限、tool、外部service等の制約があっても、そこで作業を終了しない。
- 現在可能な確認、修正、切り分け、代替手段、準備作業を先に進める。
- ユーザー操作が本当に必要な箇所だけ、対象・場所・入力値・次の確認事項を具体的に提示する。
- 未確認を「異常」「失敗」と同義に扱わない。

### 3. 善意でscopeを広げない

- 「改善できる」「関連している」「同じfileにある」「fileが長い」はrequired-propagationの理由にしない。
- 整備候補を発見しても、現在scope外なら `PROJECT_STATUS.md` に記録するだけにする。
- Evidenceがない「未使用」「原因」「不要」「安全」等の断定を行わない。
- 既知issueであることはcurrent task scopeに含まれることを意味しない。
- 「さらに調べれば問題が見つかるかもしれない」「保守性向上に役立つ」という理由だけでexploratory inspection、補助script、検査tool、任意refactorをcurrent scopeへ追加しない。

## 高リスク条件への切替

整備中に障害、データ移行、環境設定変更、削除、依存更新が必要になった場合は `PROTOCOL_ROUTING_RULES.md` に従い、該当部分だけ専用Protocolを優先します。

Production Mutationが必要になった場合は、tool上実行可能でもauthorizationを別途確認します。

## テンプレートの扱い

既存アプリでは次を禁止します。

- template準拠率を上げることを目的にする。
- 既存構成を `core` / `cloudflare-worker` / `d1` / `sheets-gas` の構成へ無理に変換する。
- file名、directory構成、公開方式をtemplateに合わせるだけの変更を行う。
- templateとの差分そのものを修正理由にする。
- 正常稼働している既存方式をtemplateの既定方式へ置き換える。

## 最初に確認すること

今回scopeに必要な範囲で次を確認します。

- 公開ページの実際の表示・主要動作。
- repository構成と現在build。
- 主要機能と既知問題。
- APIの入口・response形式。
- LocalStorage / D1 / Sheets / KV / R2等の保存先。
- 既存data形式、key、ID、schema、列構成。
- Cloudflare Workers / Pages等の公開方式。
- Git連携、自動deploy方式、Production branch。
- Binding、Secret、Variable、既存Project名。
- `ai-context.json` / `llms.txt` / `docs/*` の有無と鮮度。

文書と実装・実稼働が食い違う場合は、推測でどちらかを正として変更せず「不一致」として扱います。

## 整備の優先順位

1. 現状確認と保護対象の明確化。
2. 今回scopeに必要な自己引き継ぎ情報を追加・更新する。
3. 現在の構成、data contract、UI制約、現在状態を文書化する。
4. 直接変更またはrequired-propagationに含まれる責務混在だけ安全に整理する。
5. 今後の候補は記録し、scopeを勝手に広げない。
6. 不要code削除は `CLEANUP_DELETION_PROTOCOL.md` に従い安全確認後に行う。

## 1バッチの標準手順

1. 今回扱う範囲を限定する。
2. Evidenceを集め、`confirmed / inferred / unknown` を区別する。
3. 保護対象と影響範囲を確認する。
4. 必要最小限の変更を行う。
5. 重要確認項目を `verified / blocked / not-applicable` で記録する。
6. `docs/PROJECT_STATUS.md` に今回の変更、確認済み範囲、blocked項目、残タスク、意図的な例外を記録する。
7. 現在の整備必要度を評価する。
8. 今回scopeの完了状態を判定する。
9. continuation eligibilityを、maintenance needとは独立して判定する。
10. 推奨判断 `continue / finish-for-now / prioritize-another-area` と理由を決める。
11. batch decisionをユーザーへ報告する。`continue` の場合は具体的な次batchも報告する。
12. 継続条件に従い、自動継続するか、ユーザー選択・個別authorizationを求める。

不具合修正と無関係な大規模refactorは同じバッチへ混在させません。

## 整備必要度

各バッチ終了時に、templateとの差ではなく現在の運用riskを基準に評価します。

- **高** — data損失、互換破壊、公開障害、主要機能停止等の重要riskが残る。
- **中** — 現在は動くが、明確な保守riskや重要なhandoff不足が残る。
- **低** — 既存動作・data contract・公開方式が把握され、残りが主に任意改善。
- **保留** — 重要箇所がblockedで安全性評価に必要な材料が不足。

未確認を異常扱いしません。

**Maintenance need is not continuation permission.**

`high / medium` はアプリ全体に残るriskの評価であり、current taskの自動継続許可ではありません。maintenance needが高くても、current scopeがcompleteで自動継続可能な未完了workがなければ、それだけを理由に `continue` を推奨しません。

## バッチ終了時のdecision reporting

**ユーザー選択を要求するかどうかに関係なく、各batch終了時の判断提示は必須です。**

最低限、次をユーザーへ明示します。

- 現在の整備必要度: `high / medium / low / hold`。
- 今回scopeの完了状態: `complete / work-complete-verification-pending / incomplete`。
- 推奨判断: `continue / finish-for-now / prioritize-another-area`。
- 推奨理由。
- `continue` の場合のみ、次に扱う具体的batch。

「毎batchユーザー選択を要求しない」ことは、「判断結果を報告しなくてよい」ことを意味しません。自動継続する場合も、現在状態と次batchをユーザーへ見える形で報告します。

## バッチ継続の扱い

**毎バッチ必ずユーザー選択を要求しません。**

自動継続できるのは、次をすべて満たす場合だけです。

1. 対象workが未完了である。
2. current task scope内にある。
3. 未完了の `direct-change`、または中央Evidence条件を満たす未完了の `required-propagation` である。
4. ユーザーの既存continuation authorizationがその次batchへ適用できる。
5. 新たなuser choiceやoperation-specific authorizationを必要としない。

ユーザーが現在の依頼で、例えば次を明示している場合は、上記条件を満たす安全な次batchへ自動継続できます。

- 「完了まで進めて」。
- 「ロードマップ通り進めて」。
- 「残課題を順に処理して」。
- 「安定化を可能な範囲まで進めて」。
- 同等の継続指示。

次は自動継続理由になりません。

- current scope外の既知bug / known issue。
- recommended improvement。
- unrelated issue。
- 任意refactor / cleanup候補。
- 将来改善候補。
- potential improvement。
- exploratory inspection。
- 「調べれば問題があるかもしれない」という追加調査。
- unconfirmed maintenance risk。
- fileが大きい / 複雑であること。
- responsibility mixingの可能性だけがある状態。
- additional review opportunity。
- future maintenance candidate。

「具体的な問題があるかを見る価値がある」だけではunfinished in-scope workとして扱いません。

exploratory inspection自体は禁止しません。次のいずれかでcurrent scopeへ含まれている場合は実施できます。

- ユーザーが全体確認・追加調査まで明示している。
- 既存ロードマップに具体的なinspection taskとして含まれている。
- direct-changeを安全に完了するためvalid required-propagationとして必要である。
- confirmed Evidenceによりcurrent taskの成功判定に追加確認が必要である。

既知issueはEvidenceとしてconfirmedでも、current task scopeへ自動昇格しません。必要なら `PROJECT_STATUS.md` に記録し、別task候補として提示します。ユーザーが明示的にcurrent scopeへ追加した時点で初めて継続対象になります。

補助script・検査toolの新設も同じscope ruleに従います。「今後便利」「保守性が上がる」「確認に役立つ」だけでは自動追加しません。current direct-changeに不可欠ならEvidence付きrequired-propagationとして扱い、それ以外はoptional future workです。

次の場合は停止して選択または個別許可を求めます。

- 当初scopeを超える。
- 新たなProduction Mutationや破壊的操作が必要。
- 高リスクProtocolへ切り替わり、operation-specific authorizationが必要。
- 複数の実質的に異なる方式からユーザー判断が必要。
- ユーザーが各バッチで選択肢提示を希望している。

選択肢を提示する場合は `docs/BATCH_COMPLETION_CHOICES.md` に従います。

## 自己引き継ぎ情報

既存アプリに不足している場合は、作り直さず現状に合わせて次を追加・更新します。

- `ai-context.json`
- `llms.txt`
- `docs/ARCHITECTURE.md`
- `docs/DATA_CONTRACT.md`
- `docs/UI_RULES.md`
- `docs/PROJECT_STATUS.md`

既存アプリに `ai-context.json` がないことだけを理由に、新規アプリとして再bootstrapしません。

## 完了判定

- **完了** — 整備変更と必要検証が完了。
- **作業完了 / 検証保留** — 変更は完了したが必要検証の一部がblocked。
- **未完了** — 整備作業そのものに残作業がある。

必要に応じて implementation / deployment / verification / documentation を `complete / pending / not-applicable` で記録します。

既存アプリの完了条件はtemplateとの一致ではなく、今回scopeの変更が安全に完了し、既存動作とdata contractを保護し、次の作業者が現在状態を理解できることです。
