# Batch Completion Choices

この文書は、既存アプリ整備batchの**報告形式とユーザーinteraction**を定義します。

continuation eligibility、maintenance needとの分離、preparation convergence、batch completion / current task completion、scope、Evidence、authorization、completion stateの意味は `docs/PROTOCOL_ROUTING_RULES.md` を正本とします。この文書では再定義しません。

## 毎batchの報告

ユーザーへ選択肢を出す必要がない場合でも、batch終了時には最低限次を報告します。

- 現在の整備必要度: `high / medium / low / hold`。
- 今回scopeの完了状態: `complete / work-complete-verification-pending / incomplete`。
- 推奨判断: `continue / finish-for-now / prioritize-another-area`。
- 推奨理由。
- `continue` の場合のみ、次に扱う具体的batch。

整備必要度は4値から1つだけ選びます。`low-medium` 等の中間値は使いません。

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
- 次候補を提示しただけで、`continue / finish-for-now / prioritize-another-area` の判定を省略する。
- 次候補がrequired workかoptional candidateかを曖昧にしたまま停止する。
- `continue` なのに具体的next batchを示さない。
- continuation可能なのに、同じ判断説明だけを繰り返して実作業へ進まない。
- 前回の不適切な停止を自己訂正しただけで、continuation eligibilityが成立しているのに再び停止する。
- `finish-for-now` の根拠を「直前batchがcomplete」だけにする。
- maintenance needの高さだけで `continue` を表示する。
- optional / exploratory workをrequired workのように表示する。
- user decisionが必要で停止したのに、未実行operation / 停止理由 / 選択肢 / 推奨を示さず状態説明だけで終える。
- 現在の停止理由がmerge可否なのに、「今回終了」「別責務へ進む」等の一段先・別軸の判断を同じ選択肢へ混ぜる。
- labelだけを並べ、各選択肢の意味を説明しない。
