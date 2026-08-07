# Cloudflare Worker Template

COREへ追加して使用します。

```text
worker/
├─ index.js
├─ routes/
├─ services/
├─ repositories/
└─ utils/
```

`index.js` はルーティング入口に限定し、業務処理を直接肥大化させません。ルートは `routes/`、業務処理は `services/`、保存先アクセスは `repositories/` に分離します。

GitHub Actionsによるデプロイ・定期実行は標準化しません。Cloudflare側の自動デプロイまたは明示的な手動運用を優先します。
