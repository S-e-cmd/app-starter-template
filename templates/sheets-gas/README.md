# Sheets / GAS Template

COREへ追加して使用します。GASを単一の巨大な `コード.gs` に集約しないことを標準とします。

```text
gas/
├─ main.gs
├─ config.gs
├─ api.gs
├─ sheet-service.gs
└─ utils.gs
```

- `main.gs`: エントリポイントのみ。
- `config.gs`: シート名・設定値。
- `api.gs`: Web API / doGet / doPost等。
- `sheet-service.gs`: Sheets読み書き。
- `utils.gs`: 共通処理。

定期処理はGitHub Actionsではなく、必要に応じてGASトリガーを優先します。
