# D1 Template

CORE + Cloudflare Workerへ追加して使用します。

```text
db/
├─ schema.sql
└─ migrations/

worker/repositories/
```

DBアクセスはrouteやUIへ直書きせず `repositories/` へ分離します。スキーマ変更は既存データとの互換性を確認し、migrationとして履歴を残します。
