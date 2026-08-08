# App Starter Template

新規アプリを保守しやすく立ち上げ、既存アプリを壊さず更新・整備・復旧するためのAI向けstarterです。

## 最初に読むもの

判断ruleの正本は `docs/PROTOCOL_ROUTING_RULES.md` です。

作業開始時は、まずユーザーの現在目的から主作業モードを決め、scope / Evidence / authorization / Production Mutation / continuation / completionを中央ruleで判定します。

Repository URL、公開URL、starter参照があること自体は作業モードの選択理由にしません。

## 文書の役割

- `manifest.json` — 機械判定しやすい状態・列挙値・参照先。
- `docs/PROTOCOL_ROUTING_RULES.md` — cross-cuttingな判断ruleの正本。
- 各Protocol — その作業モード固有の手順・確認対象・required outcome。
- `docs/DEVELOPMENT_RULES.md` — 実装時の作法。
- `docs/BATCH_COMPLETION_CHOICES.md` — batch判断の表示・ユーザーinteraction。
- `docs/TEMPLATE_CHECKLIST.md` — 正本ruleの適用漏れを検査するvalidation layer。
- `docs/POLICY_INTERPRETATION_CASES.md` — 正本ruleから同じ判定を導けるか確認するadversarial test layer。

ChecklistやInterpretation Casesだけで新しい判断ruleを定義しません。新しい境界が必要になった場合は、まず正本ruleを更新し、検証層を追従させます。

## 作業モード

- 新規作成 → `docs/CREATE_AND_DEPLOY_FLOW.md` / `docs/BOOTSTRAP_PROTOCOL.md`
- 通常の機能追加・仕様変更・UI改善 → `docs/FEATURE_CHANGE_PROTOCOL.md`
- 既存アプリ全体の整理・安定化・引き継ぎ改善 → `docs/EXISTING_APP_ALIGNMENT_PROTOCOL.md`
- 障害・主要機能停止 → `docs/INCIDENT_RECOVERY_PROTOCOL.md`

必要に応じて中央routing ruleから次へ切り替えます。

- Major Change planning → `docs/MAJOR_CHANGE_PLANNING.md`
- data / schema / API contract移行 → `docs/DATA_MIGRATION_PROTOCOL.md`
- environment / Binding / Secret / deployment変更 → `docs/ENVIRONMENT_CHANGE_PROTOCOL.md`
- 削除・旧互換整理 → `docs/CLEANUP_DELETION_PROTOCOL.md`
- dependency / runtime更新 → `docs/DEPENDENCY_UPDATE_PROTOCOL.md`

## 新規アプリと既存アプリ

新規アプリは `templates/` を共通土台として利用できます。

既存アプリでは、現在の正常動作、data contract、architecture、公開方式をtemplate形状より優先します。templateとの差だけを理由に再構成しません。詳細は `docs/EXISTING_APP_ALIGNMENT_PROTOCOL.md` を参照します。

生成アプリのhandoffは必要に応じて次を使用します。

- `ai-context.json`
- `llms.txt`
- `docs/ARCHITECTURE.md`
- `docs/DATA_CONTRACT.md`
- `docs/UI_RULES.md`
- `docs/PROJECT_STATUS.md`

## テンプレート構成

- `templates/core/`
- `templates/cloudflare-worker/`
- `templates/d1/`
- `templates/sheets-gas/`

これらのdirectory構成は新規アプリ向けであり、既存アプリへの変更要求ではありません。

GitHub Actionsは標準では使用しません。実装方針は `docs/DEVELOPMENT_RULES.md` を参照します。
