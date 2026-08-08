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

## 自動継続できる条件

自動継続理由にできるのは、current task scope内に残っている次の未完了作業だけです。

- 未完了の `direct-change`。
- 中央Evidence条件を満たし、current scopeへ属する未完了の `required-propagation`。

次は自動継続理由にしません。

- current scope外のknown issue / bug。
- recommended improvement。
- unrelated issue。
- 任意refactor / cleanup候補。
- 将来改善候補。

known issueであることやEvidenceがconfirmedであることだけでは、current task scopeへ昇格しません。必要なら記録し、別task候補として扱います。

ユーザーが現在の依頼で「完了まで進める」「ロードマップ通り継続」「残課題を順に処理」等を既に明示している場合、上記条件を満たす当初scope内の安全な次batchへ進むために毎回choiceを要求しません。

## ユーザー選択が必要な条件

- 当初scopeを超える。
- 新たなProduction Mutation・破壊的操作の個別authorizationが必要。
- 高リスクProtocolへの切替でユーザー判断が必要。
- 複数の実質的に異なる方針から選択が必要。
- ユーザーが各batchで選択肢提示を希望している。
- 整備必要度が低く、当初scopeのrequired workが完了し、次に進むなら任意改善または別taskになる。

## 表示ルール

推奨する選択肢には `← 推奨` を付けます。

例:

```text
整備必要度: Low
今回scope: Complete

[今回は終了] ← 推奨 — 当初scopeは完了。残りは任意改善または別task
[続ける] — current scopeへ追加したい具体的な対象がある場合のみ
[別の箇所を優先] — 気になる機能・UI・保存・公開周りなどを指定
```

## 選択肢の意味

### 今回は終了

現在状態、verified / blocked範囲、残タスク、次回再開位置を `docs/PROJECT_STATUS.md` に残して終了します。

current scope外のknown issueが残っていても、それだけを理由に `continue` を推奨しません。別task候補として記録・提示できます。

### 続ける

current task scope内に未完了のdirect-changeまたはvalid required-propagationが残る場合に推奨できます。

表示時には、何を次に行う予定かを短く具体的に添えます。

現在scopeがcompleteで、残りがknown issue / recommended improvement / unrelated issueだけなら、AIが勝手にそれを次batchへ選びません。

### 別の箇所を優先

現在の自動候補ではなく、ユーザーが指定した箇所を次batch対象に切り替えます。表示時には `気になる機能・UI・保存・公開周りなどを指定` のように、何を指定すればよいか分かる説明を添えます。

ユーザーが対象を指定せずこの選択肢だけを選んだ場合は、対象箇所だけを確認します。勝手に別の整備対象を選びません。

## 禁止

- batch終了時のmaintenance need / scope completion / recommended action / reasonを省略する。
- `continue` 推奨なのに具体的next batchを示さない。
- 既に継続許可があることを理由にdecision reportingまで省略する。
- current scope外のknown issueを自動継続理由へ使う。
- `[続ける]` などlabelだけを並べ、何が起きるか説明しない。
- 推奨理由を示さずに選択を求める。
- `別の箇所を優先` をAI側の別候補選択として扱う。
- 整備必要度が低くcurrent scopeがcompleteなのに、任意改善を理由として継続を既定にする。
