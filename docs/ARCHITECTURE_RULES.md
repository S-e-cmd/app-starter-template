# Architecture Rules

## 適用前提

以下のdirectory / file構成は**新規アプリの標準例**です。既存アプリをこの構成へ変更する要求ではありません。

既存アプリでは、具体的なdirectory名ではなく責務境界・依存方向・保守性の考え方だけを参照します。ユーザー依頼、障害対応、今回の変更目的に必要でない限り、既存directory・file名・entrypointを標準例へ合わせるために変更しません。

## 新規アプリの標準責務

- `src/main.js`: 起動と依存の組み立てのみ。
- `src/config/`: 定数、環境依存設定、build情報。
- `src/core/`: 初期化、状態管理、共通error処理。
- `src/ui/`: 汎用UI部品と表示制御。
- `src/features/`: 機能単位のUI・controller・service。
- `src/api/`: HTTP/API通信。
- `src/storage/`: LocalStorage等のclient保存。
- `src/utils/`: 副作用の少ない共通関数。
- `worker/routes/`: HTTP routing。
- `worker/services/`: 業務処理。
- `worker/repositories/`: DB・外部保存先access。

## 分割判断

新規実装、またはユーザー依頼の直接変更・必須波及に該当する範囲で、次のいずれかに該当したら分割を検討します。

- 1fileが複数の責務を持つ。
- UI処理と通信・保存・変換処理が混在する。
- 新機能追加で既存責務とは別の処理が増える。
- 同じ処理が複数箇所へ複製される。
- 修正時に関係のない機能まで読み解く必要がある。

ただし、上記に該当することだけで既存アプリの自動refactorを許可しません。`docs/PROTOCOL_ROUTING_RULES.md` のscope policyに従い、今回の直接変更またはrequired-propagationに含まれる場合だけ実施します。

行数だけを基準にはしません。fileが長いこと、一般的なbest practiceと違うこと、templateと違うことだけを分割理由にしません。

## 継続保守

- 機能追加後も既存の責務境界を不必要に悪化させない。
- 構成変更時は各アプリの `docs/ARCHITECTURE.md` を同じ変更単位で更新する。
- READMEまたは `ai-context.json` から現在構成へ辿れる状態を維持する。
- generated / derived fileではなくsourceが正本ならsource側を変更する。
- 別Chat・別作業者がrepositoryだけ受け取っても、対象機能の場所と保護対象を判断できる状態を目標とする。
