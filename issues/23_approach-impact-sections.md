## APPROACH・IMPACT セクション新設
id: 23
branch-slug: approach-impact-sections
github_issue: 32
status: close
type: feat
対象: |
  src/components/Approach.astro (新規)
  src/components/Impact.astro (新規)
  src/pages/index.astro
  src/components/About.astro
  src/components/HeroDesktop.astro
  src/styles/global.css（必要に応じて）
内容: |
  About と Works の間に APPROACH・IMPACT の2セクションを新設する。
  履歴書（resume.md）を正とし、サイトが表現すべき主軸をセクションとして具体化する。
  Poimandres テーマ（poi-* トークン）はそのまま維持。
確認: |
  npm run typecheck が通ること
  npm run build が通ること

---

## 背景

現状のサイトは About（薄い導入）→ Works の構成で、履歴書の2大差別化要素が欠落している:

1. **AI協調開発基盤 dotfiles-public** — 履歴書の職務要約・自己PR・開発経歴③の筆頭。サイトに項目がない
2. **マンション管理会社 外部CTO** — 履歴書で最も強い実務ストーリー（数値つき）。サイトは NFC を汎用OSSとしてのみ提示

これを「ナラティブ先導・Works従」の構図に転換するため、APPROACH と IMPACT を About と Works の間に挿入する。

## セクション構成（表示順）

```
ABOUT      — 既存（変更は「人間中心に設計する〜」の段落を削除のみ）
APPROACH   — 新設
IMPACT     — 新設
WORKS      — 既存（変更なし）
```

## APPROACH セクション仕様

### ラベル・見出し
- ラベル: `APPROACH`（monospace, uppercase, poi-accent）
- 見出し: 「AIエージェントを、開発プロセスに組み込む基盤。」

### 本文
AIを補助ツールではなく開発プロセスそのものに組み込んでいる。自律実行するエージェントが破壊的操作や機密漏洩を通さないよう、ロールを分離し、環境を Nix Flakes で同一化し、危険な操作は設定で構造的に遮断する。

### Bento Grid（3列）— ロール分離の図解
各カードは背景 `rgba(255,255,255,0.03)` 程度の半透明、ボーダー `poi-border` ベースに `poi-accent` の淡い glow（`border-color` に `poi-accent/20` 程度）。hover で glow をやや強める（CSS transition のみ、JS 不要）。

| カード | アイコン（Lucide） | タイトル | サブテキスト |
|---|---|---|---|
| 1 | message-circle 系 | 設計 | 対話型 AI が仕様策定 |
| 2 | bot 系 | 実装 | 自律型 AI がコード編集 |
| 3 | user-check 系 | 検証 | 人間が確認・マージ |

### フローステップ（3列、矢印つなぎ）
ロール分離 Bento の下に、環境基盤のフローを横並び3ステップで:
1. Nix Flakes で環境統一
2. CI で同一性を継続検証
3. Claude Code / Jules 対応

各ステップは角丸ボックス、間に `→` アイコン。背景はさらに控えめ。

### OSS リンク
`dotfiles-public` へのリンクボタン（GitHub アイコン + 外部リンクアイコン）。poi-accent ボーダーのピル型。

### チーム適性の補足（border-left アクセント）
左ボーダー（poi-accent 系のパープル寄り `#c792ea` 等）つきの控えめなテキストブロック:
「SES 先のチームにもこの基盤を持ち込み、GitHub 統合・CI/CD 構築・AIエージェント運用ルールの整備を推進中。」

※ 社名（ウィジェット等）は出さない。

## IMPACT セクション仕様

### ラベル・見出し
- ラベル: `IMPACT`（monospace, uppercase, poi-blue `#89ddff`）
- 見出し: 「マンション管理会社の外部CTOとして、現場のDXを推進。」

### 本文
現場を長年担ってきたオーナーが経営側に移行したいという課題に対し、勤怠改善を起点に信頼関係を築き、法人化に向けた全面的な DX 支援を担当。

### 数値メトリクスカード（2列 Bento）
背景 `rgba(255,255,255,0.03)`, ボーダー `poi-blue/20` の glow。

| カード | 数値 | ラベル |
|---|---|---|
| 1 | ~5h | 月あたりの集計工数削減 |
| 2 | 3〜4万 | 月あたりの申告差異抑制 |

数値はモノスペース、大きめ（text-xl〜text-2xl）。

### 補足テキスト
NFC 打刻 → スプレッドシート自動同期 → 給与計算自動化。「カードをタッチするだけ」の UX で IT 未経験の現場に定着。既存の Excel・スプレッドシート運用を無理に変えず、自動化を後付けする設計方針。

### フロー図解（3列 Bento、アイコンつき）
勤怠DXのデータフローを3ステップで視覚化:
1. NFC 打刻（id-card アイコン）
2. スプレッドシート同期（table アイコン）
3. 給与計算自動化（calculator アイコン）

各カードは中央揃え、アイコン + ラベルのコンパクト構成。

## About セクション変更

「人間中心に設計する。システムも AI も、既存のワークフローに自然に溶け込ませる。」の段落を削除する。他は変更なし。

## 左ペインナビ（HeroDesktop）変更

HeroDesktop の既存リンク群（GitHub / Posts / Contact）の上に、ページ内アンカーリンクを追加:

```
About
Approach
Impact
Works
---（既存リンク群）
GitHub
Posts
Contact
```

アンカーリンクは `#about`, `#approach`, `#impact`, `#works`。各セクションに対応する `id` を付与する。
スタイルは既存の外部リンクと同じ `text-sm text-zinc-500 dark:text-poi-muted` + hover で poi-accent。

## デザイン原則

- Poimandres テーマのカラートークン（`poi-*`）を使う。新しいカラーを Tailwind config に追加しない
- Bento カードの glow は `border-color` の transition のみ。box-shadow / filter / backdrop-filter は使わない
- CSS のみで実現（JS アニメーションは入れない）
- 重くならないこと。Astro コンポーネントとして静的レンダリング
- Lucide アイコンは `src/lib/lucide.ts` に必要なエントリを追加して使う（npm 追加不要）
- セクション間の余白・区切り線は既存の About / Works と統一（`mb-20 pb-16 border-b` 等）

## 守秘

- 社名（株式会社ウィジェット等）は出さない → 「SES 先のチーム」
- マンション管理会社の社名は出さない（「マンション管理会社」で十分）
- 固有接続情報は `~/dotfiles/secrets-agents/` の辞書に従いマスク
