# Batch Completion Choices

この文書は、既存アプリ整備batchの**報告形式とユーザーinteraction**を定義します。

continuation eligibility、maintenance needとの分離、preparation convergence、batch completion / current task completion、scope、Evidence、authorization、completion stateの意味は `docs/PROTOCOL_ROUTING_RULES.md` を正本とします。この文書では再定義しません。

既存アプリ整備では `docs/EXISTING_APP_ALIGNMENT_EXECUTION_GATE.md` も初回batchから適用します。

## 毎batchの報告

ユーザーへ選択肢を出す必要がない場合でも、batch終了時には最低限次を報告します。

- 現在の整備必要度: `high / medium / low / hold`。
- 今回scopeの完了状態: `complete / work-complete-verification-pending / incomplete`。
- 推奨判断: `continue / finish-for-now / prioritize-another-area`。
- 推奨理由。
- `continue` の場合のみ、次に扱う具体的batch。

整備必要度は4値から1つだけ選びます。`low-medium` 等の中間値は使いません。

### 初回batchも省略しない

既存アプリ整備では、最初の変更・整理を行ったturnから通常batch報告を適用します。「初回だから概要だけ」「まず整備しました」等の自由形式で終了しません。

最低限、ユーザーが次を判断できる情報を含めます。

1. 今回実施した具体的変更。
2. required verificationと結果。
3. 未完了required workの具体的item、または `なし`。
4. 推奨判断と理由。
5. `continue` の場合のみ具体的next batch。
6. Build: 更新後build / 更新不要とその理由 / blockedとその理由。
7. Commit / PR等、利用可能な識別情報。

`continue` を選ぶ場合、未完了itemの名前または責務と、それがcurrent scope内のdirect-change / valid required-propagationである理由を具体的に示します。「さらに整理可能」「責務分離可能」「追加確認可能」だけでは不足です。

### build情報は報告上も必須

今回batchにruntime / UI asset / user-visible static config / API behavior等の変更が含まれ、build policyに該当する場合、build更新・確認前に `complete` を報告しません。

build policyに該当しない場合も、既存アプリ整備の初回報告では `Build: 更新不要` と理由を短く示し、単に項目を落としません。

build位置が不明な場合は「不明なので省略」ではなく、current app内を確認します。build概念が存在しない、またはapp固有policyで不要とconfirmedできた場合のみ更新不要とします。

### ユーザー向け報告は結果を優先する

上記のstate / rule用語は**内部判断のための共通語**です。ユーザー向け報告では、必要がない限り `Evidence`、`current task`、`work-complete-verification-pending`、`continuation eligibility` 等を前面に出しません。

通常の報告は、次の順で簡潔にまとめます。

1. 何を変更・整理したか。
2. 何を確認できたか。
3. 未確認・blockedがある場合は、その対象と影響。
4. 次にどうするか。終了ならその旨、継続なら実行した次batchの結果。
5. build番号、commit、PR等の必要な識別情報。

starter ruleへ従ったこと自体を成果として長く説明しません。rule名やstate名を列挙して「正しく判断した」ことを弁明するのではなく、**ユーザーが作業結果と次の行動をすぐ理解できる文章**にします。

内部stateを明示するのは、次のいずれかの場合に限定します。

- ユーザーがstate / rule判定そのものを確認している。
- blocked / hold等を正確に区別しないと次の判断を誤る。
- 複数batch / outcomeの進捗比較に必要。

例えば `work-complete-verification-pending` と内部判定しても、通常報告では次のように書けます。

```text
build/cache bustingの整理は完了しました。
公開ページの確認だけ、外部アクセス障害のため未確認です。コード上の変更と回帰確認は完了しているため、今回はここで終了で問題ありません。
Commit: abcdef...
```

「starterを確認しました」「rule上は〜」「Evidenceでは〜」等の説明は、ユーザーが求めていない限り繰り返しません。

### 次候補を出しただけではbatch decisionは完了しない

「次の優先候補」「次に見るとよい箇所」「別batchに分けるのが安全」等の候補を提示した場合でも、**その候補がcurrent task scope内の具体的なunfinished workとしてcontinuation eligibilityを満たすかを中央ruleで判定し、必ず `continue / finish-for-now / prioritize-another-area` のいずれかへ着地させます。**

候補を挙げたまま、required workかoptional candidateかを判定せず停止しません。

- current task scope内の具体的unfinished `direct-change` / valid `required-propagation` と確認できる → `continue`。
- 現時点では改善候補・exploratory candidate・optional workに留まる → `finish-for-now` を検討する。
- ユーザーが別対象を優先する意思決定を明示的に必要としている → `prioritize-another-area`。

`continue` と判定し、既存continuation authorizationが適用でき、新しいchoice / operation-specific authorizationが不要なら、次候補の説明だけで止まらず具体的next batchへ進みます。

## continue

中央ruleでcontinuation eligibilityが成立した場合に使用します。

表示時には、何を次に行うかを具体化します。

例:

```text
整備必要度: medium
今回scope: complete
推奨: continue
理由: current task scope内に未完了の責務分離が残る
次batch: 保存処理の責務分離と回帰確認
```

ただし「責務分離できる箇所がある」だけでは上記理由になりません。具体的なunfinished責務がcurrent scope内である必要があります。

ユーザーから「完了まで進める」等の既存continuation authorizationがあり、新しいchoice / operation-specific authorizationが不要なら、`continue` と報告するだけで停止せず、その具体的next batchへ進みます。

`continue` を単なる会話上のlabelとして繰り返し、実行可能なnext batchがあるのに説明だけで停止しません。

### 誤って停止した後の自己訂正

前turnで、本来 `continue` すべき状態なのに候補提示・判断説明・自己評価だけで停止していたことを後から確認した場合、**「前回止まったのは誤りでした」と説明するだけで再びturnを終了しません。**

その時点で中央ruleのcontinuation eligibilityを再確認し、条件がまだ成立しているなら、訂正と同じturnで未実行だった具体的next batchへ復帰します。

前回の不適切な停止や、その説明を挟んだこと自体は、新しいuser choiceを必要とする理由にも、既存continuation authorizationを失効させる理由にもなりません。

停止できるのは、再確認時に新しいuser choice / operation-specific authorization / blocked input / tool limitation / confirmed blockerが実際に生じている場合だけです。

したがって、次のような自己訂正だけで終えません。

```text
前回はここで止めたのが誤りでした。
current task: incomplete
推奨: continue
次batchは○○です。
```

continuation eligibilityが成立しているなら、この報告に続けて○○の実作業へ着手します。

### 実行可能なrequired verificationを残して終了しない

コード変更・設定変更・生成物更新等のworkが終わっていても、**その変更のrequired verificationが現在のtool / environmentで実行可能なら、未実施のまま `work-complete-verification-pending` や `finish-for-now` にしません。**

例:

- repository内で実行できる `npm test` / `npm run build` / lint / typecheck。
- 変更したmoduleを対象にした既存contract test。
- 現在利用可能なPreview / local runtimeでの必須確認。
- build policy該当時のbuild更新・source確認。

これらは「次にやる確認候補」ではなく、current batchのrequired verificationとして先に実行します。

`work-complete-verification-pending` にできるのは、中央ruleどおり、required verificationが実際にblockedな場合です。例えば外部runtimeへ接続できない、必要credentialがない、対象environmentが利用不能等です。

一部verificationだけblockedでも、独立して実行可能なrequired verificationは先に完了させます。**「実ブラウザ確認ができない」ことを理由に、同時に実行可能なbuild / testまで残して停止しません。**

## finish-for-now

中央ruleでcurrent task scope内のrequired workが尽き、残りがoptional improvement / exploratory work / separate taskだけの場合に使用します。

例:

```text
整備必要度: low
今回scope: complete
推奨: finish-for-now
理由: current task scope内のrequired workは完了。残りは任意改善のみ
```

`finish-for-now` を出す場合は、可能な範囲で「current task scope内に未完了required workがない」と判断した根拠を短く示します。

「さらに整理可能」「責務分離候補がある」「別の改善点が見つかった」場合でも、それらがoptionalなら `finish-for-now` を妨げません。

## prioritize-another-area

ユーザーが現在の自動候補とは別の箇所を優先したい場合に使用します。

例:

```text
[別の箇所を優先] — 気になる機能・UI・保存・公開周りなどを指定
```

対象をユーザーが指定していない場合、AIが勝手に別の整備対象を選びません。

## ユーザー判断で停止する場合

中央rule上、新しいuser choice / operation-specific authorizationが必要なため自動実行を止める場合は、**作業報告だけで終えず、ユーザーが次に何を選べばよいかまで提示します。**

最低限、次を示します。

- 何が未実行なのか。
- なぜAIが自動実行しなかったのか。
- 現実的な選択肢。
- 推奨案とその理由。

### 選択肢は同じdecision levelに揃える

選択肢は、**現在の停止理由を解消するための同一decision point**に揃えます。

例えば停止理由が「Draft PRをmainへmergeしてproductionへ反映してよいか」なら、選択肢はそのmerge / production反映判断に限定します。

- mergeして本番反映する。
- Draftのまま保留する。
- 必要な追加確認を行ってからmerge可否を判断する。

この段階で、次のような**一段先・別軸の判断**を同じ選択肢へ混ぜません。

- 今回の整備task自体を終了するか。
- 別の責務へ進むか。
- 別の箇所を優先するか。

現在のdecision pointが解消して本番反映・必要検証まで終わった後に、中央ruleで改めてbatch completion / current task completion / continuationを判定し、その次のinteractionを提示します。

例えば、変更をDraft PRへ隔離し、mergeするとproduction自動deployが走る場合:

```text
未実行: PR #3 の main へのmergeと本番反映
停止理由: mergeによりproduction deploymentが発生するため、既存authorizationだけでは自動実行しない

[PR #3をマージして本番反映] ← 推奨 — Preview / required verificationが完了しており、本番反映へ進む
[Draftのまま保留] — productionは現状維持
[追加確認してから判断] — Preview等を追加確認してからmerge可否を決める
```

このとき「merge候補として妥当」「本番は変わっていない」等の状態説明だけで終えません。停止理由がuser decisionであるなら、**decision handoffまでがそのbatchの報告責務**です。

選択肢は常に3つ作る必要はありません。実際に成立する選択肢だけを示し、推奨案がある場合は `← 推奨` を付けます。

## ユーザー選択を求める場合

中央rule上、次のようなuser choice / authorizationが必要なときだけ選択を求めます。

- current task scopeを超える。
- 新しいProduction Mutation / destructive operationのauthorizationが必要。
- 複数の実質的に異なる方針から選択が必要。
- Major Change Planning等で方式選択が必要。
- ユーザーが各batchで選択肢提示を希望している。

表示する場合、推奨案には `← 推奨` を付け、各選択肢で何が起きるかを短く説明します。

例:

```text
[今回は終了] ← 推奨 — current task scopeのrequired workは完了
[続ける] — current scopeへ追加したい具体的対象がある場合のみ
[別の箇所を優先] — 気になる箇所を指定
```

## 禁止

- batch decision reportingを省略する。
- 初回batchだけ自由形式にしてrequired report項目を落とす。
- build情報を報告から省略する。
- build policy該当変更があるのに、build更新・確認前に `complete` とする。
- build場所が不明というだけでbuild確認を打ち切る。
- ユーザー向け報告をstarter rule名・state名・自己弁明中心にする。
- 作業結果より先に、ruleへ従った経緯や判断過程を長く説明する。
- 次候補を提示しただけで、`continue / finish-for-now / prioritize-another-area` の判定を省略する。
- 次候補がrequired workかoptional candidateかを曖昧にしたまま停止する。
- 「さらに整理可能」「責務分離可能」「追加確認可能」だけを `continue` の理由にする。
- `continue` なのに具体的unfinished itemとscope内理由を示さない。
- `continue` なのに具体的next batchを示さない。
- continuation可能なのに、同じ判断説明だけを繰り返して実作業へ進まない。
- 前回の不適切な停止を自己訂正しただけで、continuation eligibilityが成立しているのに再び停止する。
- 実行可能なrequired test / build / verificationを残したまま、`work-complete-verification-pending` や `finish-for-now` として停止する。
- blockedなverificationが1つあることを理由に、独立して実行可能なrequired verificationまで未実施のまま残す。
- `finish-for-now` の根拠を「直前batchがcomplete」だけにする。
- maintenance needの高さだけで `continue` を表示する。
- optional / exploratory workをrequired workのように表示する。
- user decisionが必要で停止したのに、未実行operation / 停止理由 / 選択肢 / 推奨を示さず状態説明だけで終える。
- 現在の停止理由がmerge可否なのに、「今回終了」「別責務へ進む」等の一段先・別軸の判断を同じ選択肢へ混ぜる。
- labelだけを並べ、各選択肢の意味を説明しない。