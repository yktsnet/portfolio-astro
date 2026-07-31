## 英語表記の見直し（Hero文の並列構造・data-policyの訳抜け）

id: 54
branch-slug: english-copy-fixes
github_issue:
status: open
type: fix
対象: src/pages/cat-feed-tracker/index.astro, src/pages/data-policy.astro
内容: サイト全体の英語表記（`lang-en` ブロック）を日本語版と突き合わせてレビューした結果、2箇所に問題を確認した。1つは文法的に不自然な並列構造、もう1つは日本語版にある情報が英語版で欠落している訳抜け。両方とも文言修正のみでロジックには触れない。
確認: 目視確認（コピー変更のみで振る舞いは変わらないため、`npm run typecheck` の通過を確認すれば十分）

---

### 保証
- 新たに宣言する保証: なし（表示文言の変更のみ）
- 維持する保証: なし（テキストコピー変更であり、既存の振る舞い・レイアウト・型に影響しない）

保証: なし（copy-only の修正であり、対象は静的なUIテキストのみ。テストで保証すべき振る舞いの変更がないため）

### 詳細

#### 1. `src/pages/cat-feed-tracker/index.astro:25`

現状:
```
Home IoT system automatically detecting feeding cabinet opening via Pico W reed switches, broadcasting LINE notifications, weight tracking, and status queries to family members.
```
"detecting" (現在分詞) のあとに "broadcasting" (現在分詞) → "weight tracking" (名詞) → "status queries" (名詞) と品詞が揃わず、後半が "to family members" にどうかかるか曖昧になっている。

修正案:
```
A home IoT system that detects when the feeding cabinet opens via a Pico W reed switch, then notifies family members over LINE — with weight tracking and status queries available on demand.
```

#### 2. `src/pages/data-policy.astro`

日本語版にある文が英語版で訳されておらず、情報量が少ない。プライバシーに関わる内容のため補う。

**Logging セクション（41-43行目）**

日本語（37-40行目）:
> 入力内容と生成した応答は、質問傾向の把握や応答品質の改善を目的としてログに記録します。
> IP アドレスと入力内容は個人に関連しうる情報として扱います。

現状の英語（41-43行目）は1文目のみ:
```
User inputs and generated responses are logged to understand query trends and improve quality.
```

2文目（IPアドレス・入力内容を個人関連情報として扱う旨）が抜けている。追記案:
```
User inputs and generated responses are logged to understand query trends and improve quality.
IP addresses and input content are treated as information that may be linked to individuals.
```

**Response Generation セクション（56-58行目）**

日本語（51-55行目）:
> 回答の生成には Gemini API の無料枠を利用しています。無料枠の性質上、入力いただいた内容が
> モデルの学習に利用される可能性があります。回答は本サイトに公開されている情報の範囲内で生成しており、
> 公開情報以外の回答は行いません。

現状の英語（56-58行目）:
```
Responses are generated using Gemini API. Answers are restricted to public information published on this site.
```

「無料枠のため入力内容がモデル学習に利用される可能性がある」という文が抜けている。修正案:
```
Responses are generated using the free tier of the Gemini API. Due to the nature of the free tier, submitted input may be used for model training. Answers are restricted to public information published on this site.
```

---
## Issue作成ルール
### フィールド
- `id` : 2桁の連番。派生Issueは `08a`, `08b` 形式（元Issueをcloseして新規作成）
- `対象` : 変更・新規作成するファイルをすべて列挙する。新規は (新規) を付記
- `内容` : 目的と概要のみ。実装仕様は下のセクションに書く
- `確認` : ClaudeCodeが提出前に行う静的確認。このリポの CLAUDE.md の検証手段を参照して埋める。例: lib変更時は影響callerをすべて列挙・修正済みであること。存在しないなら省略より `目視確認` と明示する
### ライフサイクル
- `status: draft` → 設計中
- `status: open`  → issue() で選択可能。**open は user が保証節を裁可済みであることを含む**
- `status: close` → 完了済み（issue-finish で更新）
検証で問題が出た場合はそのIssueをcloseし、`{id}a` として新しいIssueを作成する。
元のIssueを再openしたりClaudeCodeのセッションに直接プロンプトを送ったりしない。
### 保証節
- 保証は自然言語で書く。テストコードやテストファイル名の指定は補足であり、主体は振る舞いの宣言
- user は draft→open の裁可で保証節を必ず読み、削る・足す・直す（保証節は user 承認済みであることが open の意味に含まれる）
- テストを伴わない変更（ドキュメントのみ・cleanup 等）は `保証: なし（理由）` と明示する。無記載は不可
- リポに保証台帳 `docs/guarantees.md` がある場合、「維持する保証」は台帳から引く。台帳の記載に変更が出る場合（新保証・変更・廃止）は台帳を対象ファイルに含める
### 粒度
- ClaudeCodeが1セッションで完走できる量にする
- 対象ファイルの目安は7本以下
- 確認手段が2種類以上になる場合は分割を検討する
  - 例: hetで実行確認 と ブラウザ目視確認 → 別Issue
### 分割の判断基準
- バックエンドとフロントエンドは原則別PR
- 「バックエンドの結果を見てからフロントを作る」順序依存がある場合は必ず分割
- 同一レイヤーで独立してテスト・確認できるなら1つにまとめてよい
### 詳細セクション
- `内容` に収まらない仕様は `---` 以降に自由に展開する
- ファイルごとに見出しを立てる
- 実装順序が重要な場合は末尾に明記する
