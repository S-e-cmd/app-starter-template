# Data Flow Map

Build: `YYYYMMDD-NN`

この文書は、AIや保守担当者が「この表示・入力・操作はどこから来て、どこへ保存されるか」を短時間で特定するための探索索引です。

`ARCHITECTURE.md` は責務配置、`DATA_CONTRACT.md` は保存形式・API契約、この文書は **実際の値・状態・操作がUIから正本までどう流れるか** を記録します。

## 記載原則

- 実装、設定、runtime、外部resourceを実際に確認して記載する。推測で埋めない。
- 未確認は `unknown`、存在しないものは `not-applicable` とする。
- 画面名やfunction名だけで終わらせず、可能な範囲で具体的なfile / route / function / storage key / table / sheet / external sourceまで辿る。
- Secret、credential、private identifier、個人情報、internal-only URLなど公開不適切な実値は書かない。
- 同じ値でもread経路とwrite経路が異なる場合は分けて記載する。
- derived valueは「どこから取得したか」だけでなく、主要な加工・集計・filter・fallbackも記載する。
- code変更で経路、正本、加工、更新契機、fallback、cacheが変わった場合はcodeと同じ変更単位で更新する。
- 表が巨大になる場合はfeature / screen単位で分割してよい。その場合この文書を索引として分割先を列挙する。

## Source of Truth Map

アプリで扱う主要data / stateの正本を先に記載する。

| Data / State | Source of truth | Read path | Write path | Notes |
|---|---|---|---|---|
| 例: app settings | `unknown` | `unknown` | `unknown` | 実装確認後に置換 |

## UI Read Flow Map

ユーザーに見える値・状態について、UIから正本まで逆引きできる形で記載する。

| Screen / Feature | Display / State | UI implementation | Fetch / State layer | API / Function | Processing | Source of truth | Refresh trigger | Cache / Fallback |
|---|---|---|---|---|---|---|---|---|
| 例: dashboard | current status | `unknown` | `unknown` | `unknown` | `unknown` | `unknown` | `unknown` | `unknown` |

### 記載対象

少なくとも、修正時に取得元を誤認すると不具合につながるものを対象にします。

- dashboard / summary / badge / count / status表示
- user設定・feature flag・権限・mode表示
- 一覧・詳細・検索・filter・sort結果
- date / time / weather / external API等の外部data
- build / version / deployment状態などの運用表示
- local stateとserver stateが混在する表示
- 複数sourceから合成されるderived value

固定文言、純粋な装飾、単純なCSS値など、data flowを持たないものまで網羅する必要はありません。

## UI Write / Action Flow Map

保存、更新、削除、実行、切替など、ユーザー操作がどこへ到達するかを記載する。

| Screen / Feature | User action | UI handler | Validation / Transform | API / Function | Service / Repository | Write target | Post-write refresh / side effect |
|---|---|---|---|---|---|---|---|
| 例: settings | save | `unknown` | `unknown` | `unknown` | `unknown` | `unknown` | `unknown` |

## End-to-End Flow Details

複雑・重要・誤修正されやすい経路だけ、表に加えて流れを記載します。

### `<flow name>`

```text
<source of truth>
  ↓ read
<repository / adapter>
  ↓
<service / domain processing>
  ↓
<API / function>
  ↓
<client fetch / state>
  ↓
<UI component / display>
```

Writeがある場合:

```text
<UI action>
  ↓
<validation / transform>
  ↓
<API / function>
  ↓
<service / repository>
  ↓ write
<source of truth>
  ↓
<refresh / invalidation / response>
```

## Derived Values

複数dataの合成、集計、判定、status変換など、表示値そのものが保存されていない場合に記載する。

| Derived value | Inputs | Calculation / Rule | Implementation | Output consumer |
|---|---|---|---|---|
| 例: daily total | `unknown` | `unknown` | `unknown` | `unknown` |

## Refresh / Cache / Fallback

値が「いつ変わるか」を誤認しやすい箇所を記載する。

| Data / Feature | Initial load | Refresh trigger | Cache | TTL / invalidation | Fallback / stale behavior |
|---|---|---|---|---|---|
| 例 | `unknown` | `unknown` | `unknown` | `unknown` | `unknown` |

silent fallbackは禁止です。既存fallbackがある場合は、発動条件と代替sourceを明記します。

## External Boundaries

repository外のsource / consumerがdata flowに関与する場合、公開可能な範囲で境界だけ記載する。

| Boundary | Direction | Contract / Purpose | Local entry point | Verification source |
|---|---|---|---|---|
| 例: external API | inbound | `unknown` | `unknown` | `unknown` |

Secret値やprivate resource identifierそのものは記載しません。

## Unknown / Mismatch

文書と実装、実装とruntime、複数source間で食い違いがある場合は、都合よくどちらかへ寄せずここへ残します。

| Item | Documentation says | Implementation / Runtime says | Evidence state | Impact / Next verification |
|---|---|---|---|---|

## Maintenance Gate

次の変更では、この文書への影響を確認します。

- UIが参照するAPI / function / state sourceの変更
- API route / response mappingの変更
- storage / sheet / table / key / external sourceの変更
- service / repository境界の変更
- derived valueの計算・filter・sort・aggregation変更
- refresh、cache、TTL、invalidation変更
- fallback追加・変更・削除
- user actionの保存先やside effect変更

影響がなければ更新不要です。影響があるのにcodeだけ変更してこの文書を古いまま残した状態は、handoff更新が必要な作業では完了扱いにしません。
