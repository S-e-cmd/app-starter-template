# Development Rules

この文書は実装時の作法を定義します。

作業モード、scope、Evidence、required-propagation、continuation、preparation convergence、Production Mutation、authorization、verification state、completion state、build policyの共通判断は `docs/PROTOCOL_ROUTING_RULES.md` を正本とします。この文書では再定義しません。

## 実装前

今回のscopeに必要な範囲で、次を確認します。

1. 対象機能と関連file。
2. 呼び出し元・呼び出し先・共有state。
3. 保存data、API、UI、外部service等への実依存。
4. `ai-context.json` と関連docsのcurrent state。
5. 中央ruleでrouting / authorization / safety gateが済んでいること。

無関係な全体再確認は行いません。

## 変更前に処理経路を確認する

不具合修正・機能改修・コード整備では、症状や変更箇所の周辺だけを見て修正を始めません。

変更前に、今回の挙動に関係する入力、state、処理、保存、描画、出力までの既存処理経路を必要な範囲で追い、現在の挙動がどこで決まっているかを確認します。

修正は、その確認結果に基づいて既存の責務を持つ箇所へ行います。

処理経路を確認せず、「この辺が怪しい」「ここに条件を足せば直りそう」「既存箇所を触らず後段で補正する」といった局所的な推測だけでcodeを追加・変更しません。

修正後に改善しない、または悪化した場合は追加修正を重ねず、まず処理経路と原因判定を再確認します。

### 変更前Evidence

不具合修正では、可能な範囲で修正前に失敗するtest、再現script、runtime log、API response、DOM / state観測、保存前後data比較のいずれかを残します。

最低限、再現条件またはcurrent behavior、関係する入力・state・処理・保存・描画・出力、挙動決定箇所、原因または変更根拠、変更対象を選んだ理由、protected targetを具体化します。「処理経路を確認した」という宣言だけで変更を開始しません。

原因をconfirmedにできない場合は推測によるcode追加へ進まず、Evidence取得へ戻ります。暫定対応が明示的に必要な場合も、未確認事項、適用範囲、解除条件を記録し、恒久修正のcompleteと混同しません。

## 責務分離

- 新規アプリは、UI、状態管理、通信、保存、data変換、業務logic等を責務単位で分離する。
- 新しい責務をentry fileへ無制限に追記しない。
- 既存アプリでは現在architecture、責務境界、命名、directory構成を優先する。
- template例へ合わせるだけの移動・rename・新設を行わない。
- 既存moduleが今回の責務を自然に担えるなら既存moduleを使う。
- 新しい責務が明確に生じた場合だけ、現在architectureに合うmodule / fileへ分離する。
- file sizeや行数削減だけを目的に過剰分割しない。
- event handlerへ通信、保存、変換、業務logicを無制限に埋め込まない。
- 共通処理は責務が一致し、不要な依存を増やさない場合に再利用する。

## error / loading

- errorを握り潰さない。
- 利用者向け表示と確認用logを分ける。
- 待ち時間のある操作では、必要に応じ処理中表示と二重操作防止を入れる。
- 失敗時にstorage、auth、API、deployment等を独自判断でsilent fallbackしない。fallback判定は中央ruleを参照する。

## generated / derived files

sourceがあるgenerated / derived fileは原則source側を変更します。

生成物を直接変更する必要がある場合は、再生成時に上書きされるか、生成物自体がcanonicalかを確認し、理由を残します。

## 同時編集・stale SHA

GitHub等へのwriteでは古い内容で上書きしません。

SHA conflict / stale SHAを検出した場合:

1. 対象fileの最新版とcurrent SHAを再取得する。
2. concurrent changeと今回のown diffを比較する。
3. file単位ではなく、変更するlogic / contract / state / assumptionとのsemantic overlapを確認する。
4. 安全に統合できる場合はconcurrent changeを維持し、自分のdiffだけをcurrent stateへ再適用する。
5. 同等の目的状態が既に実装済みなら重複適用しない。
6. safe merge方法をEvidence付きで一意に決められないaffected partだけblockedとして扱う。
7. 再適用後は今回scopeに必要なverificationを行う。

同じfile / function / 行付近の変更だけではsemantic conflictとみなしません。競合解消を理由に他の正常変更を削除・巻き戻しません。

長時間作業後や重要fileへのwrite前は、必要に応じてcurrent state / SHAを再確認します。

## 実装変更後の確認

verification stateとcompletion semanticsは中央ruleを使います。この文書では、今回の変更に対して何を確認するかだけを定義します。

direct-changeの目的と因果的な回帰riskに応じて、必要なものを選びます。

- 対象機能の目的状態。
- 関連する既存機能の回帰。
- 構文 / JSON / config形式。
- 通信 / API。
- 保存 / 再読み込み / persistence。
- 初期表示 / bootstrap。
- error / loading状態。
- PC / SP表示や操作への実影響。
- 必要なdocs / handoff更新。
- deploy済みruntime / asset確認。

固定チェックを無関係な変更へ機械的に要求しません。例えばserver-only変更でUIへ因果的影響がなければ、PC/SP確認だけを理由に完了をholdしません。

## build番号

build更新要否の正本は `docs/PROTOCOL_ROUTING_RULES.md` と `manifest.json` です。

実装側では、公開runtime / UI asset / API behavior等が変わる場合にapp固有policyを確認して適用します。docs / READMEのみの変更では原則buildを変更しません。

## GitHub Actions

GitHub Actionsは標準採用しません。

自動化は原則として次の順で検討します。

1. アプリ実行時処理。
2. 手動実行。
3. Cloudflare側の機能。
4. GAS trigger。
5. その他の既存基盤。
6. GitHub Actions。

Actionsを採用するのは、GitHub上で実行する必然性があり、実行頻度と消費量が妥当で、他の方法より明確に適している場合に限ります。
