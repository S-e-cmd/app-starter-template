# Batch Completion Choices

既存アプリ非破壊整備モードでは、**batch decisionの報告**と**ユーザー選択の要求**を分離して扱います。

## batch decision reportingは毎batch必須

ユーザーへ選択肢を出す必要がないbatchでも、終了時には最低限次を必ず報告します。

- 現在の整備必要度: `high / medium / low / hold`。
- 今回scopeの完了状態: `complete / work-complete-verification-pending / incomplete`。
- 推奨判断: `continue / finish-for-now / prioritize-another-area`。
- 推奨理由。
- `continue` の場合のみ、次に扱う具体的batch。

「毎batchユーザー選択を要求しない」ことは、「batch終了時の判断提示を省略してよい」ことを意味しません。自動継続する場合も、現在状態と次batchを報告します。

## maintenance needとcontinuationは別判定

**Maintenance need is not continuation permission.**

`high / medium / low / hold` はアプリ全体に残る保守riskの評価です。`medium` や `high` であることだけでは `continue` を正当化しません。

current scopeがcompleteで、未完了のdirect-changeまたはvalid required-propagationが残っていなければ、maintenance needがmedium / highでも原則 `finish-for-now` とします。残るriskや改善候補は別task候補として記録・提示できます。

## 自動継続できる条件

自動継続できるのは、次をすべて満たす場合だけです。

1. 対象workが未完了である。
2. current task scope内にある。
3. 未完了の `direct-change`、または中央Evidence条件を満たす未完了の `required-propagation` である。
4. ユーザーの既存continuation authorizationがその次batchへ適用できる。
5. 新たなuser choice / operation-specific authorizationが不要である。

次は自動継続理由にしません。

- current scope外のknown issue / bug。
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

「具体的な問題があるかを見る価値がある」という理由だけではunfinished in-scope workになりません。

known issueであることやEvidenceがconfirmedであることだけでは、current task scopeへ昇格しません。必要なら記録し、別task候補として扱います。

exploratory inspection自体は禁止しません。次の場合はcurrent scope内のworkとして扱えます。

- ユーザーが全体確認・追加調査まで明示している。
- 既存ロードマップに具体的なinspection taskとして含まれている。
- direct-changeを安全に完了するためvalid required-propagationとして必要である。
- confirmed Evidenceによりcurrent taskの成功判定へ追加確認が必要である。

補助script・検査toolも同じscope ruleに従います。「今後便利」「保守性が上がる」「確認に役立つ」だけでは自動追加しません。

ユーザーが現在の依頼で「完了まで進める」「ロードマップ通り継続」「残課題を順に処理」等を既に明示している場合も、上記条件を満たす当初scope内の安全な次batchへ進むためにだけchoiceを省略できます。

## ユーザー選択が必要な条件

- 当初scopeを超える。
- 新たなProduction Mutation・破壊的操作の個別authorizationが必要。
- 高リスクProtocolへの切替でユーザー判断が必要。
- 複数の実質的に異なる方針から選択が必要。
- ユーザーが各batchで選択肢提示を希望している。
- current scopeのrequired workが完了し、次に進むなら任意改善・exploratory work・別taskになる。

## 表示ルール

推奨する選択肢には `← 推奨` を付けます。

例:

```text
整備必要度: Medium
今回scope: Complete

[今回は終了] ← 推奨 — 当初scopeは完了。残る保守risk候補は別task
[続ける] — current scopeへ追加したい具体的な対象がある場合のみ
[別の箇所を優先] — 気になる機能・UI・保存・公開周りなどを指定
```

## 選択肢の意味

### 今回は終了

現在状態、verified / blocked範囲、残タスク、次回再開位置を `docs/PROJECT_STATUS.md` に残して終了します。

maintenance needがmedium / highでも、current scopeがcompleteで残りがexploratory candidate / known issue / recommended improvement等だけなら、それだけを理由に `continue` を推奨しません。

### 続ける

current task scope内に具体的な未完了direct-changeまたはvalid required-propagationが残る場合だけ推奨できます。

表示時には、何を次に行う予定かを短く具体的に添えます。

現在scopeがcompleteで、残りがknown issue / recommended improvement / exploratory inspection / optional refactor等だけなら、AIが勝手にそれを次batchへ選びません。

### 別の箇所を優先

現在の自動候補ではなく、ユーザーが指定した箇所を次batch対象に切り替えます。表示時には `気になる機能・UI・保存・公開周りなどを指定` のように、何を指定すればよいか分かる説明を添えます。

ユーザーが対象を指定せずこの選択肢だけを選んだ場合は、対象箇所だけを確認します。勝手に別の整備対象を選びません。

## 禁止

- batch終了時のmaintenance need / scope completion / recommended action / reasonを省略する。
- `continue` 推奨なのに具体的next batchを示さない。
- 既に継続許可があることを理由にdecision reportingまで省略する。
- maintenance needがmedium / highであることだけをcontinuation justificationに使う。
- current scope外のknown issueを自動継続理由へ使う。
- exploratory inspection、potential improvement、unconfirmed maintenance riskをunfinished in-scope workへ自動昇格する。
- 「もっと調べる価値がある」だけで `continue` を推奨する。
- 補助script・検査toolを便利さだけでcurrent scopeへ自動追加する。
- `[続ける]` などlabelだけを並べ、何が起きるか説明しない。
- 推奨理由を示さずに選択を求める。
- `別の箇所を優先` をAI側の別候補選択として扱う。
