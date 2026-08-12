# Existing App Alignment Protocol

既存アプリを壊さず、今後の修正・引き継ぎを安全にするための非破壊整備手順です。

scope、Evidence、required-propagation、continuation、preparation convergence、maintenance need、Production Mutation、authorization、verification / completion、Major Change gateは `docs/PROTOCOL_ROUTING_RULES.md` を正本とします。このProtocolでは既存アプリ整備固有の手順だけを定義します。

## 適用条件

ユーザーの主目的が次の場合に使用します。

- 既存アプリ全体の整理・安定化。
- 責務混在の段階的改善。
- 引き継ぎ情報の整備。
- 今後の変更を安全にするための保守性改善。
- 特定の新機能ではなく、既存アプリ全体の状態確認と整備。

具体的な機能追加・仕様変更が主目的なら `FEATURE_CHANGE_PROTOCOL.md` を使用します。Repository URL、公開URL、starter参照の存在だけではこのmodeを選びません。

## required outcome

このProtocolのrequired outcomeは、**現在の正常動作・data contract・公開方式・既存architectureを保護しながら、current task scope内の具体的な整備とhandoff改善を完了すること**です。

templateとの一致そのものは完了条件ではありません。

## 整備依頼の実行ゲート

一般的な「整備して」「整理して」「starterを参考に整備して」等の依頼では、初回batchから `docs/EXISTING_APP_ALIGNMENT_EXECUTION_GATE.md` を必須適用します。

このgateにより、少なくとも次を固定します。

- 一般的な整備依頼のdefault scope。
- 「さらに整理可能」と「current taskを継続すべき」を分離すること。
- `continue` に具体的unfinished itemを要求すること。
- 初回batchから報告項目を省略しないこと。
- build policy該当時にbuild更新・確認をcompletion hard gateとすること。

`EXISTING_APP_ALIGNMENT_EXECUTION_GATE.md` は中央ruleを上書きせず、既存アプリ整備での誤適用を防ぐ実行gateです。

## 既存アプリで保護するもの

current scopeに応じ、少なくとも次のうち実際に存在するものを保護対象として確認します。

- 既存機能・主要UI behavior。
- 保存data、key、ID、schema、列構成。
- API contract / GAS function / external consumer。
- auth方式。
- public URL / routing。
- storage backend。
- deployment方式 / production branch。
- Binding / Secret / Variable等のenvironment contract。

公開中の正常動作と既存data互換性をtemplate形状より優先します。

## templateの扱い

既存アプリでは次を目的にしません。

- template準拠率を上げる。
- 新規app用directory構成へ寄せる。
- file名・directory・公開方式をtemplateへ合わせる。
- templateとの差を理由に正常な既存方式を置き換える。

新しい責務分離が必要な場合も、現在architectureに合う形で段階的に行います。

## 最初に確認すること

current scopeに必要な範囲で次を確認します。

- repository構成と現在build。
- 主要機能・現在の責務境界。
- API / storage / auth / deploymentのcurrent contract。
- `ai-context.json` / `llms.txt` / `docs/*` の有無と鮮度。
- 公開runtime確認が今回の目的に必要なら実際の表示・主要動作。

文書と実装・runtimeが食い違う場合の扱いは中央ruleに従います。

一般的な整備依頼では、この確認結果から `EXISTING_APP_ALIGNMENT_EXECUTION_GATE.md` のdefault scopeを確定し、単なる改善余地をunfinished workへ自動追加しません。

## README / docsの鮮度

古い記述を次へ分類します。

- **required documentation fix** — current architecture、public method、storage、API、主要責務、必須handoff等を誤って説明し、次の作業者がcurrent stateを誤認するもの。
- **optional documentation note** — 過去計画、古い次段階メモ、将来候補、補助リンク等で、current stateの理解や今回scopeの成功判定を妨げないもの。

required documentation fixはcurrent scopeに含まれる場合に修正します。optional noteだけを理由に整備scopeを拡大しません。

## 整備の優先順

1. current stateと保護対象を確認する。
2. current scopeに必要なhandoff不足を修正する。
3. current architecture / data contract / UI制約 / project statusを必要な範囲で更新する。
4. current scope内で具体的に確認された責務混在だけ段階整理する。
5. 将来候補は記録し、current taskへ自動追加しない。
6. 削除が必要なら `CLEANUP_DELETION_PROTOCOL.md` へroutingする。

「さらに分割できる」「もっと整理できる」「追加確認できる」は5の将来候補であり、それだけでは4のunfinished workになりません。

## 1batchの標準手順

1. 今回扱う具体的対象を決める。
2. current implementationと保護対象を確認する。
3. 必要最小限の整備を実施する。
4. `DEVELOPMENT_RULES.md` と中央verification ruleで確認する。
5. build policy該当時はbuild更新・確認を完了する。未完了ならcompleteにしない。
6. `docs/PROJECT_STATUS.md` にcurrent state、今回変更、verified / blocked、残taskを反映する。
7. 中央ruleと `EXISTING_APP_ALIGNMENT_EXECUTION_GATE.md` でbatch completion、current task completion、continuation eligibilityを判定する。
8. `BATCH_COMPLETION_CHOICES.md` の形式で初回batchからdecisionを報告し、継続可能なら具体的next batchへ進む。

不具合修正と無関係な大規模refactorを同じbatchへ混在させません。

## 「できない」で止めない

権限、tool、外部service等の制約がある場合も、current scope内で独立して進められる確認・修正・切り分け・安全な準備を先に進めます。

ユーザー操作が本当に必要な箇所だけ、対象・場所・必要入力・次の確認事項を具体的に示します。blockedの伝播範囲は中央dependent-hold ruleに従います。

## Major Change Planningへの出口

通常の局所的・段階的な整備ではrequired outcomeを安全に達成できないことが中央ruleの条件でconfirmedされた場合だけ、`MAJOR_CHANGE_PLANNING.md` へroutingします。

整備の延長として大規模実装へ直行しません。

## 自己引き継ぎ情報

既存アプリに不足している場合は、作り直さずcurrent stateに合わせて必要なものを追加・更新します。

- `ai-context.json`
- `llms.txt`
- `docs/ARCHITECTURE.md`
- `docs/DATA_CONTRACT.md`
- `docs/UI_RULES.md`
- `docs/PROJECT_STATUS.md`

既存アプリに `ai-context.json` がないことだけを理由に、新規アプリとして再bootstrapしません。

### Major Change時のアプリ固有handoff

`app-starter-template` に準じた既存アプリ整備では、将来大きな改修が必要になった際に、アプリ単体のhandoffから安全な入口を判断できるようにします。

共通のMajor Change手順は各repositoryへ複製せず、parent starterの `docs/MAJOR_CHANGE_PLANNING.md` / `docs/PROTOCOL_ROUTING_RULES.md` を正本として参照し、アプリ固有情報だけを残します。

必要に応じて次を `ai-context.json`、`llms.txt`、`docs/PROJECT_STATUS.md`、または最適な既存handoff文書へ記録します。

- Major Change判断前に最新parent starterを再確認する入口。
- 現在のprotected targets。
- Major Change候補になり得るアプリ固有境界。確認できない境界は推測で作らない。
- 大規模変更でも勝手に変更・削除してはいけない既存contract / compatibility条件。
- 実在するroadmap / migration / transition / rollback planの参照先。

この記録は将来のMajor Change実行authorizationではなく、候補境界の列挙だけで `major-change-planning-required` と判定しません。

**共通のやり方はparent starter、各アプリにはcurrent contract・protected targets・app-specific boundariesだけを保持する**ことを原則とします。