# App Starter Template

新規アプリの作成、既存アプリの安全な整備、大規模整備を、安全かつ確実に完了まで進めるためのAI向けstarterです。

## 最初に読むもの

**最初に [START_HERE.md](START_HERE.md) を読みます。**

START_HEREは、current outcome、3つのwork mode、変更前調査、scope、安全停止、検証、継続・終了、報告を通常作業に必要な量へ集約した入口です。READMEだけで実装を始めず、該当しない全Protocolを開始時に読みません。

## 3つのwork mode

- `create-new` — 新規アプリを作成する。
- `align-existing` — current contractを基本的に維持し、不具合修正、機能追加、UI改善、code整理、安定化を行う。
- `transform-existing` — architecture、storage、auth、data、API contract、主要責務またはproduction切替経路を計画的に変更する。

選択基準と進行順はSTART_HEREを正本とします。file数、変更行数、codeの長さ、templateとの差だけでtransform-existingを選びません。

## 文書の役割

- `START_HERE.md` — 通常作業の強制入口と3モードの基本進行。
- `manifest.json` — 機械判定する列挙値・参照先。
- `docs/PROTOCOL_ROUTING_RULES.md` — scope、Evidence、authorization、高リスク条件、継続、完了の詳細な正本。
- 各Protocol — 該当する作業・高リスク条件固有の手順。
- `docs/DEVELOPMENT_RULES.md` — 処理経路確認、実装、検証の作法。
- `docs/BATCH_COMPLETION_CHOICES.md` — Build、Commit、公開反映、必須残作業、次の判断を含む報告。
- `docs/TEMPLATE_CHECKLIST.md` — validation layer。
- `docs/POLICY_INTERPRETATION_CASES.md` — 判断が割れる場合のadversarial test layer。

ChecklistやInterpretation Casesだけで新しい判断ruleを定義しません。通常作業で全Interpretation Casesを事前に読みません。

## 条件付きProtocol

- 新規作成 → `docs/CREATE_AND_DEPLOY_FLOW.md` / `docs/BOOTSTRAP_PROTOCOL.md`
- 通常の修正・機能追加・UI改善 → `docs/FEATURE_CHANGE_PROTOCOL.md`
- 既存アプリ全体の安全な整備 → `docs/EXISTING_APP_ALIGNMENT_PROTOCOL.md` / `docs/EXISTING_APP_ALIGNMENT_EXECUTION_GATE.md`
- 大規模整備 → `docs/MAJOR_CHANGE_PLANNING.md` と影響部分のProtocol
- data / schema / API contract移行 → `docs/DATA_MIGRATION_PROTOCOL.md`
- environment / Binding / Secret / deployment変更 → `docs/ENVIRONMENT_CHANGE_PROTOCOL.md`
- 削除・旧互換整理 → `docs/CLEANUP_DELETION_PROTOCOL.md`
- dependency / runtime更新 → `docs/DEPENDENCY_UPDATE_PROTOCOL.md`
- 障害・主要機能停止 → `docs/INCIDENT_RECOVERY_PROTOCOL.md`

## 新規アプリと既存アプリ

新規アプリは `templates/` を共通土台として利用できます。

既存アプリでは、現在の正常動作、data contract、architecture、公開方式をtemplate形状より優先します。templateとの差だけを理由に再構成しません。

生成アプリのhandoffには必要に応じて次を使用します。

- `ai-context.json`
- `llms.txt`
- `docs/ARCHITECTURE.md`
- `docs/DATA_CONTRACT.md`
- `docs/UI_RULES.md`
- `docs/PROJECT_STATUS.md`

GitHub Actionsは標準では使用しません。ローカルのstarter整合確認は次で実行できます。

```bash
node tools/verify-template.mjs
```
