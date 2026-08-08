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
- `continue` なのに具体的next batchを示さない。
- continuation可能なのに、同じ判断説明だけを繰り返して実作業へ進まない。
- `finish-for-now` の根拠を「直前batchがcomplete」だけにする。
- maintenance needの高さだけで `continue` を表示する。
- optional / exploratory workをrequired workのように表示する。
- labelだけを並べ、各選択肢の意味を説明しない。
