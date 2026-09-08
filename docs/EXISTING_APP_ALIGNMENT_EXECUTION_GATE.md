# Existing App Alignment Execution Gate

この文書は、ユーザーが既存アプリについて「整備して」「整理して」「安定化して」「starterを参考に整備して」等と依頼したときの**実行・継続・初回報告の強制ゲート**です。

判断概念の正本は `PROTOCOL_ROUTING_RULES.md`、作業手順は `EXISTING_APP_ALIGNMENT_PROTOCOL.md`、通常のbatch報告は `BATCH_COMPLETION_CHOICES.md` とします。この文書はそれらを再定義せず、既存アプリ整備で起きやすい誤適用を禁止します。

## 1. 「整備して」のdefault scope

ユーザーが具体的対象を追加指定していない一般的な整備依頼では、開始時のdefault scopeを次に限定します。

1. current stateとprotected targetsの確認。
2. current stateを誤認させるrequired documentation / handoff不足の修正。UI表示・状態・操作の取得元、保存先、source of truthが次の作業者に判別できず修正事故につながる場合は、`DATA_FLOW_MAP` または同等文書の不足・陳腐化もここに含める。ただしdata-flow本体の採取はcode整備完了後の専用フェーズで行う。
3. confirmed Evidenceがあり、現在の保守性・安定性・引き継ぎを直接妨げている具体的問題の修正。
4. 上記変更に因果的に必要なrequired-propagation。
5. 今回変更に必要なrequired verification。
6. build policyに該当する変更がある場合のbuild更新・確認。
7. code整備完了後、必要なdata-flow handoffをread-onlyで採取・更新する。
8. `PROJECT_STATUS` 等、今回変更により更新が必要になったcurrent handoffの反映。

次はdefault scopeに含めません。

- さらに責務分離できる箇所。
- fileをもっと小さくできる箇所。
- templateとの差。
- modern化候補。
- best practice上の改善候補。
- 将来便利そうな追加整理。
- 現在正常で、今回のrequired outcomeを妨げていない構造。
- 調査中に偶然見つけた別問題。

これらは記録可能ですが、current taskのunfinished workへ自動昇格しません。

## 2. 整備可能性と継続必要性を分離する

**整備可能であることは、continueの根拠ではありません。**

`continue` を選べるのは、開始時scopeまたは有効なrequired-propagationとして分類された具体的unfinished itemが残っている場合だけです。

次の理由だけで `continue` にしてはいけません。

- 「まだ整理できる」。
- 「責務分離できる」。
- 「追加で確認できる」。
- 「より安全にできる」。
- 「保守性をさらに上げられる」。
- 「次に見るべき候補がある」。
- maintenance need が high / medium である。

発見した候補がoptional / exploratory / out-of-scopeなら、current scopeが完了している限り `finish` を選びます。

### continueに必要な根拠

`continue` の報告には、必ず次の2点を具体的に示せる必要があります。

- 未完了itemの名前または責務。
- そのitemが今回scope内のdirect-changeまたはvalid required-propagationである理由。

「コード整理」「責務分離」「追加確認」等の抽象語だけでは不足です。

## 3. code整備とdata-flow採取の強制分離

一般的な既存アプリ整備で `DATA_FLOW_MAP` または同等文書を作る場合、次をhard gateとします。

### data-flow採取へ進める条件

- current scope内の非破壊なcode整備が完了している。
- valid required-propagationが完了している。
- 実行可能なrequired verificationが完了している。
- build requiredならbuild更新・確認が完了している。
- 採取対象のimplementationが途中変更状態ではない。

これらを満たす前に、完成版のdata-flow一覧を作成しません。

### data-flow採取フェーズの禁止事項

data-flow採取開始後は、次を変更してはいけません。

- application code。
- runtime設定・environment。
- route / API contract。
- storage behavior / schema / data。
- fallback / cache / refresh behavior。
- handler / service / repository責務。

このフェーズで許可される変更は、`DATA_FLOW_MAP` または同等handoff文書と、それを参照するために直接必要な文書上の参照だけです。

重複経路、誤配線、不自然なfallback、責務混在、古い経路、複数source等を発見しても、採取中には直しません。**経路一覧作成と正常化は別作業です。** まずcurrent implementationをそのまま記録し、改善が必要なら別変更候補として扱います。

採取開始後にcode変更が必要になった場合はdata-flow採取を中断し、変更・verification・build確認を完了してimplementationを再固定した後、影響経路を再採取します。

## 4. 初回batchから通常報告を適用する

初回batchだけ自由形式にしません。最初の変更を行ったturnから `docs/BATCH_COMPLETION_CHOICES.md` の報告形式を適用し、最低限次を区別できる情報を示します。

- 今回の変更。
- 原因・変更根拠。
- required verificationと結果。
- Build、Commit、公開反映。
- complete / verification-pending / incomplete。
- 必須の残作業、またはなし。
- continue / finish / user-decision。
- continueの場合だけ具体的next action。

項目名の文字列ではなく、反映経路、必須作業と任意候補、継続・終了判断をユーザーが識別できることをhard gateとします。Build、Commit、公開反映を混同または省略しません。

## 5. Buildはcompletion hard gate

build policyに該当する変更が1つでもある場合、**build更新とその確認が完了するまで overall `complete` にしてはいけません。**

対象例は `PROTOCOL_ROUTING_RULES.md` / `manifest.json` の `buildNumberPolicy` を正本とします。

実行時の扱い:

1. 変更前に対象アプリ固有のbuild表現・保存場所・version policyを確認する。
2. runtime / UI asset / user-visible static config / API behavior等が変わりbuild policyに該当するなら更新する。
3. 新しい公開内容に既存build番号を使い回さない。
4. 更新後、実際のsourceまたは生成物で新buildが入っていることを確認する。
5. 公開runtime確認がrequiredかつ可能なら、runtime側でもbuild反映を確認する。
6. build場所が見つからない場合は無視せず、検索・current app contract確認を行う。
7. 本当にbuild概念が存在しない、またはapp固有policyで不要とconfirmedできた場合だけ `更新不要` とし、その理由を報告する。

次は禁止します。

- build番号を見つけられなかったため省略する。
- docsだけ見て「たぶん不要」と判断する。
- runtime変更後に旧build番号のままcompleteにする。
- build更新を「次batch候補」へ回す。

## 6. 初回整備での停止条件

一般的な「整備して」という依頼は、default scope内の通常・非破壊整備を実行するauthorizationとして扱えます。ただし、次は既存の中央ruleどおり別途停止・routingします。

- Production Mutation。
- destructive operation。
- data / schema / API contract migration。
- environment / Secret / Binding / deployment target変更。
- Major Change Planningが必要な方式選択。
- current scopeを明確に超える新機能・別問題修正。

逆に、これらに該当しないdefault scope内のrequired workについて、毎batchユーザー確認を要求して停止しません。

## 7. completion判定順

batch終了時は、次の順で判定します。

1. 今回scopeのdirect-changeは完了したか。
2. valid required-propagationは完了したか。
3. 実行可能なrequired verificationは完了したか。
4. build policy該当時、build更新・確認は完了したか。
5. data-flow handoffがrequiredなら、code整備完了後のread-only採取として完了したか。
6. data-flow採取中にcodeやruntimeを変更していないか。
7. current handoffのrequired updateは完了したか。
8. 残っているものはrequired workか、optional candidateか。
9. required workが残る場合のみ `continue`。
10. required workがなく、残りがoptionalなら `finish`。

maintenance needや改善余地の大きさを、この順序より先に置きません。

## 8. 代表的な誤判定

### Case A: さらに分割できる

状態:
- 今回確認されたhandoff不足と具体的責務混在は修正済み。
- build / required verificationも完了。
- entry fileにはさらに分割可能な箇所があるが、現在のrequired outcomeを妨げていない。

正解:
- `finish`

誤り:
- 「さらに責務分離可能なのでcontinue」

### Case B: runtime変更済み、build未更新

状態:
- UI挙動を変更した。
- testは成功。
- build番号は旧値のまま。

正解:
- `incomplete` / `continue`。同じbatchでbuild更新と確認を行う。

誤り:
- test成功だけでcomplete。

### Case C: 初回整備でhandoffだけ追加

状態:
- `ai-context.json` / docsを追加した。
- current scope内にconfirmedな具体的整備itemが残っている。

正解:
- code整備を先に完了し、data-flow採取はその後に行う。

誤り:
- code整備途中の状態で `DATA_FLOW_MAP` を完成させる。

### Case D: data-flow採取中に重複経路を発見

状態:
- current implementationに同じ目的の経路が複数存在する。
- 片方が不要に見える。

正解:
- 両方をcurrent flowとして記録する。
- 必要なら改善候補として残す。
- data-flow採取フェーズでは変更しない。

誤り:
- 一覧を綺麗にするため片方を削除・統合してから記載する。

### Case E: optional issueを発見

状態:
- current scopeは完了。
- 調査中に別機能の改善候補を発見した。

正解:
- optional candidateとして記録。`finish`。

誤り:
- 発見したこと自体を理由にcurrent taskへ追加してcontinue。

## 9. 最終セルフチェック

既存アプリ整備の各batch終了前に、最低限次を確認します。

- [ ] 「まだ改善できる」だけをcontinue理由にしていない。
- [ ] continueなら具体的unfinished itemを言える。
- [ ] optional candidateをrequired workへ昇格していない。
- [ ] 初回batchでも報告項目を省略していない。
- [ ] build policy該当有無を判定した。
- [ ] build requiredなら更新・確認前にcompleteにしていない。
- [ ] data-flow採取はcode整備・required verification完了後に開始した。
- [ ] data-flow採取中にapplication code / runtime / data / route / storage behaviorを変更していない。
- [ ] 重複・誤配線・不自然なfallback等を採取中に正常化していない。
- [ ] data-flow handoffはtemplate例や理想構成ではなく、安定したcurrent implementationをそのまま追跡した内容になっている。
- [ ] 実行可能なrequired verificationを残していない。
- [ ] current scope完了後に探索を自己増殖させていない。
