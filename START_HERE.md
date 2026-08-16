# Start Here

このstarterを参照してcode作成・修正・整備を行うAIは、最初にこの文書を読みます。通常作業はここから開始し、該当条件が発生した場合だけ詳細Protocolを追加で読みます。

## 1. current outcomeを固定する

作業開始時に、ユーザーが今回得たい結果を具体的に定義します。Repository URL、公開URL、starter参照の存在だけで作業モードを決めません。

## 2. 3つのwork modeから1つを選ぶ

### create-new

新しいアプリを作成する場合。

要求確認 → 構成決定 → 実装 → 検証 → 必要な公開 → 実環境確認 → handoff

参照:
- `docs/CREATE_AND_DEPLOY_FLOW.md`
- `docs/BOOTSTRAP_PROTOCOL.md`

### align-existing

current contractを基本的に維持して、不具合修正、機能追加、UI改善、code整理、責務分離、安定化を行う場合。

現状確認 → 処理経路確認 → 原因・変更根拠の特定 → 必要範囲だけ変更 → 回帰確認 → 公開確認 → 完了判定

参照:
- `docs/FEATURE_CHANGE_PROTOCOL.md`
- 全体整備では `docs/EXISTING_APP_ALIGNMENT_PROTOCOL.md`
- 全体整備では `docs/EXISTING_APP_ALIGNMENT_EXECUTION_GATE.md`

### transform-existing

architecture、storage、auth、data structure、API contract、主要責務またはproduction切替経路を計画的に変更する場合。

現状調査 → 必要性確認 → 目標状態決定 → 移行・検証・復旧計画 → 段階実装 → 各段階の検証 → 承認後の切替 → 新系確認 → 旧系整理の別判定

参照:
- `docs/MAJOR_CHANGE_PLANNING.md`
- 影響部分に応じた高リスクProtocol

file数、変更行数、codeの長さ、templateとの差、より新しい設計が存在することだけではtransform-existingにしません。必要性が未確認ならalign-existingでread-only調査し、contractやtransitionの変更が必要とconfirmedになった時点で切り替えます。

## 3. code変更前の必須確認

不具合修正・機能改修・code整備では、今回の挙動に関係する範囲で次を追います。

- 再現条件またはcurrent behavior
- 入力
- state
- 処理
- 保存
- 描画
- 出力
- current behaviorを決めている箇所
- 原因または変更根拠
- 変更対象を選んだ理由
- protected target

周辺だけを見た条件追加、原因未確認の後段補正、改善しない修正の上への追加修正、templateとの差だけを理由にした再構成は禁止します。原因を確定できなければ、再現test、log、runtime観測、data比較へ戻ります。

実装時は `docs/DEVELOPMENT_RULES.md` を適用します。

## 4. scope

すべての候補を次に分類します。

- direct-change: ユーザーが求めた結果そのもの
- required-propagation: direct-changeを成立させる、または今回の変更による具体的な回帰・互換性・data loss・deployment failureを防ぐために不可避
- out-of-scope: 有益でも今回の結果に必須ではない

「さらに整理できる」「同じfileにある」「将来便利」「追加testでさらに安心」「templateと違う」だけではrequired-propagationにしません。out-of-scope候補をcurrent taskの必須残作業へ昇格しません。

詳細なEvidence、authorization、安全条件は `docs/PROTOCOL_ROUTING_RULES.md` を正本とします。

## 5. 継続と停止

次をすべて満たす必須作業は、次のアクションを説明するだけで終了せず、そのまま実行します。

- current taskの未完了direct-changeまたはconfirmedなrequired-propagation
- current scope内
- 実行方法が具体的
- 安全に実行可能
- 新しいuser choiceやoperation-specific authorizationが不要
- 必要なtoolと情報が利用可能

停止できるのは、user choice、Production Mutation・destructive operationの承認、必要情報・権限不足、原因・変更対象未確定、回復困難なrisk、未確定contract等がある場合です。blockedな部分に依存しないscope内作業は継続します。

## 6. 検証と完了

検証項目は固定一覧ではなくcurrent outcomeから導出します。commit、deploy、HTTP 200、画面表示、部分test、Build更新だけではfunctional successにしません。

- complete: direct-changeから導出した変更とrequired verificationが完了し、必須残作業なし
- verification-pending: 実装完了、required verificationの一部がblocked
- incomplete: 実装・移行・設定変更自体に必須残作業あり

実行可能なrequired verificationを残したままverification-pendingやfinishにしません。任意候補が残っていても必須残作業がなければfinishします。

transform-existingではplanning / implementation / migration / cutover / verification / cleanupを分離します。planning完了を全体完了にせず、新系成功を旧系削除authorizationへ拡張しません。

## 7. batch報告

報告形式の正本は `docs/BATCH_COMPLETION_CHOICES.md` です。最低限、次を区別できる情報を必ず含めます。

- 今回の変更
- 原因・変更根拠
- 確認結果
- Build
- Commit
- 公開反映
- current taskの完了状態
- 必須の残作業
- continue / finish / user-decision
- continueの場合だけ具体的next action

形式を埋めること自体を成果にしません。報告は、安全な進行、反映経路の識別、必須作業と任意候補の分離、次の実行判断に使います。

## 8. 条件付きProtocol

- data / schema / API contract移行: `docs/DATA_MIGRATION_PROTOCOL.md`
- environment / Binding / Secret / deployment変更: `docs/ENVIRONMENT_CHANGE_PROTOCOL.md`
- 削除・旧互換整理: `docs/CLEANUP_DELETION_PROTOCOL.md`
- dependency / runtime更新: `docs/DEPENDENCY_UPDATE_PROTOCOL.md`
- 障害・主要機能停止: `docs/INCIDENT_RECOVERY_PROTOCOL.md`
- 判断が合理的に割れる場合: `docs/POLICY_INTERPRETATION_CASES.md`

通常作業の開始時に、該当しないProtocolや全Interpretation Casesを読む必要はありません。
