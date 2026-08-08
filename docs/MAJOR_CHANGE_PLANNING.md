# Major Change Planning

大規模変更を直接実行するProtocolではなく、**通常の局所変更ではrequired outcomeを安全に達成できないことをEvidenceで確認した後、方式・影響・migration・rollback・routingを整理するplanning / routing gate**です。

共通のscope、Evidence、authorization、Production Mutation、verification、completion定義は `docs/PROTOCOL_ROUTING_RULES.md` を正本とします。この文書はMajor Change固有の判定・計画・移行順序だけを定義します。

## 最重要原則

**Major Change Planning Required ≠ rewrite authorized.**

大規模変更が必要だと判断できても、architecture変更、data migration、environment変更、resource切替、旧系削除等の実operationが自動許可されるわけではありません。Planningは必要operationを特定・順序化するところまでです。

また、Major Change判定は変更量ではなく、**contract / architecture / transition impact**で行います。

- 複数fileを変更する。
- UIとAPIの両方を触る。
- code量が多い。
- 少しmigrationがある。

という理由だけではMajor Changeへ昇格しません。

逆に変更量が少なくても、storage backend切替、breaking public API change、authentication方式切替等で安全なtransition設計が必要ならMajor Change Planning候補になり得ます。

## 判定条件

原則として、次のような**confirmed Evidence**により、通常の局所的・段階的変更だけではrequired outcomeを安全に達成できないと判断できる場合に `major-change-planning-required` とします。

- 局所修正ではrequired outcomeを満たせない。
- 現在architecture上の制約が目的達成を直接妨げている。
- API / storage / UI / deployment等のcontract変更が不可避。
- 複数moduleをまたぐ変更を一体として扱わなければ整合性を保てない。
- 旧実装との互換維持にmigration / transition設計が必要。
- 部分修正の継続が、具体的にrisk・複雑性・migration負荷を増やす。

次だけではMajor Change判定にしません。

- fileが大きい / 古い。
- modern化できる。
- 分割した方が綺麗・保守しやすそう。
- templateと構成が違う。
- 全面的に整理した方が理想的。
- 変更量が多そう。

Evidenceがinferred / unknownなら `major-change-planning-required` と確定しません。必要性判断のための確認自体がcurrent scopeに含まれる場合だけread-only確認を行い、局所変更不能がconfirmedされてからPlanningへ移ります。

**possible major change ≠ major change required.**

## Planningで整理する項目

最低限、次を明示します。

1. required outcome / 変更目的。
2. Major Changeが必要なconfirmed Evidence。
3. 現在のarchitecture / contract上の制約。
4. 保護対象。
5. 変更対象。
6. 変更しない対象。
7. API / data / UI / public URL / auth / storage / deploymentへの影響。
8. data migrationの有無。
9. Environment Change / Production Mutationの有無。
10. rollback / recovery方針。
11. 現実的な移行方式の比較。
12. 推奨方式と理由。
13. 実装batch、依存関係、各batchのrouting先。
14. Planning / Implementation / Cleanupそれぞれのcompletion条件。

## 移行方式の比較

形式的に3案を作ることが目的ではありません。現実的な代替方式を比較します。代表例は次です。

### A. 現行構成を段階的に改修

既存contractを可能な限り維持し、責務・実装を順次置換します。

### B. 新旧を並行稼働して切替

新系を既存系の横に構築し、検証後にtraffic / storage / UI / routing等を切り替えます。

### C. architecture自体を大きく再構成

A/Bでrequired outcomeを満たせない、またはA/Bの方が具体的にrisk・複雑性・migration負荷を増やすEvidenceがある場合に選択候補とします。

「最も綺麗」「将来的に理想」という理由だけでCを推奨しません。成立しない方式は、成立しない理由をEvidence付きで除外できます。

## ユーザー判断とauthorization

Planningでは、方式と影響を整理してユーザー判断へ渡します。

- `major-change-planning-required` はrouting / planning状態であり、overall completion stateではありません。
- 「B方式で進める」等の方式承認だけで、未列挙のProduction Mutationまで包括承認されたことにはしません。
- Planning段階で exact environment / resource / operation-type / target-scope / risk / recovery まで具体的に列挙され、ユーザーがそのplanを承認した場合は、既存のplan authorization / fingerprint ruleを使用できます。
- Major Change専用の新authorization方式は作りません。

## 実装時のrouting

Major Change Planning自身は実operation固有の安全条件を上書きしません。一つのMajor Changeが複数Protocolを順番に通ることを許容します。

例:

- code restructuring / 新機能実装 → `FEATURE_CHANGE_PROTOCOL.md`
- schema / stored data変更 → `DATA_MIGRATION_PROTOCOL.md`
- Binding / Secret / Variable / deployment / backend切替 → `ENVIRONMENT_CHANGE_PROTOCOL.md`
- 旧code / compatibility layer / resource削除 → `CLEANUP_DELETION_PROTOCOL.md`
- 実装途中の障害 → `INCIDENT_RECOVERY_PROTOCOL.md`
- dependency / runtime更新 → `DEPENDENCY_UPDATE_PROTOCOL.md`

Planningは各batchの順序と依存関係を定義しますが、各ProtocolのEvidence・authorization・verification・rollback条件を緩和しません。

## 段階completion

### Planning complete

- Major Changeが必要なEvidenceがconfirmed。
- 保護対象 / 変更対象 / contract impactが整理済み。
- 現実的な移行方式を比較済み。
- 推奨方式とrollback / recovery方針が明示済み。
- 実装batchとrouting先・依存関係が定義済み。
- 必要なuser choice / authorization対象が明示済み。

Planning completeはMajor Change全体のcompleteを意味しません。

### Implementation complete

- required outcomeが達成済み。
- 必要なmigrationが確認済み。
- deployment / public stateが確認済み。
- new / old切替状態が確認済み。
- rollback / recovery状態が整理済み。
- handoff docsが更新済み。

### Cleanup complete

旧系廃止条件を別途確認します。

**new system verified ≠ old system deletion authorized.**

旧code / old resource / compatibility layer等の削除では、参照、external consumer、migration完了条件、rollback必要性、保持期間等を `CLEANUP_DELETION_PROTOCOL.md` で確認します。

## 禁止

- file数、行数、変更量だけでMajor Changeへ昇格する。
- inferred / unknownの必要性を `major-change-planning-required` と断定する。
- Major Change判定をrewrite authorizationとして扱う。
- 方式承認を未列挙Production Mutationへの包括authorizationにする。
- Planning内でData Migration / Environment Change / Cleanup等の安全条件を独自再定義する。
- 新系が動いたことだけで旧系を削除する。
- Planning completeをMajor Change全体completeとみなす。
