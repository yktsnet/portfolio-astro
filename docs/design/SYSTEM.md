# SYSTEM.md — Layer 1–3: デザインシステム

タイポグラフィ・カラー・コンポーネントの定義。
ページタイプとの対応は PAGES.md を参照。

---

## Layer 1 — 文字サイズスケール

| トークン | Tailwind | 用途 |
|---|---|---|
| `display` | `text-2xl sm:text-3xl font-semibold tracking-tight` | ページ h1 |
| `heading` | `text-xl font-semibold` | セクション h2 |
| `subhead` | `text-base font-semibold` | アイテム h3・小見出し |
| `body-lg` | `text-base leading-8` | 記事本文（article タイプのみ） |
| `body` | `text-sm leading-7` | 通常本文・説明文 |
| `small` | `text-xs` | meta・ラベル・font-mono 系 |

### フォントファミリー

| 用途 | クラス |
|---|---|
| 説明文・本文 | `font-sans` |
| ラベル・コード・UI数値 | `font-mono` |

### ページタイプ別スケール適用

| タイプ | h1 | h2 | body | meta |
|---|---|---|---|---|
| `landing` | `display` | `subhead` | `body` | `small` |
| `list` | `heading` | `subhead` | `body` | `small` |
| `article` | `display` | `heading` | `body-lg` | `small` |
| `demo` | `display` | `heading` | `body` | `small` |
| `contact` | `heading` | `subhead` | `body` | `small` |
| `utility` | `heading` | `subhead` | `body` | `small` |

### 例外

- `landing` の tagline（blockquote）は `text-base italic leading-8` を許容。
  スキャン用途ではなくサイトの哲学を表す要素として意図的に大きい。
- `article` の prose は `prose`（= text-base）を使用。`prose-sm` は不可。

---

## Layer 2 — 文字色

| トークン | light | dark | 用途 |
|---|---|---|---|
| `primary` | `text-zinc-900` | `dark:text-poi-focus` | タイトル・強調テキスト |
| `secondary` | `text-zinc-600` | `dark:text-poi-muted` | 本文・説明文 |
| `muted` | `text-zinc-500` | `dark:text-zinc-400` | 日付・補足・meta |
| `accent` | `text-light-accent` | `dark:text-poi-accent` | リンク・ラベル・アクセント |
| `work-color` | `style={color: work.color}` | 同左 | Works固有カラー（動的） |

### ボーダー・背景

| 用途 | light | dark |
|---|---|---|
| ページ背景 | `bg-zinc-50` | `dark:bg-poi-base` |
| パネル背景 | `bg-white` | `dark:bg-poi-panel` |
| ボーダー | `border-zinc-200` | `dark:border-poi-border` |
| divider | `divide-zinc-100` | `dark:divide-poi-border/60` |

---

## Layer 3 — コンポーネント

### card
Works一覧ページで使用。枠線・背景あり。

```
rounded-xl border border-zinc-200 border-l-2 bg-white p-5
dark:border-poi-border dark:bg-poi-panel
```

左ボーダーカラーは `work.color` で動的に指定。

### divider-list
トップページの Works セクションで使用。枠線なし・区切り線のみ。

```
divide-y divide-zinc-100 dark:divide-poi-border/60
```

### badge
タグラベル。Works カード内で使用。

```
inline-flex items-center rounded-full px-2 py-0.5
text-xs font-mono
background: work.color + "15"
color: work.color
```

### icon-badge
Works アイテム先頭のアイコン枠。

```
shrink-0 flex items-center justify-center w-8 h-8 rounded-lg
background: work.color + "18"
```

### panel
Stack情報・Architecture など情報ブロック。

```
rounded-lg border border-zinc-200 dark:border-poi-border
bg-white dark:bg-poi-panel p-4
```

### stack-tag
hero スタック行の各アイテム。

```
inline-flex items-center gap-1 font-mono text-xs
text-zinc-400 dark:text-zinc-500
```

アイコンは `simple-icons`（brand）または `lucide`（汎用）。
管理は `src/lib/brand-icons.ts` と `src/lib/lucide.ts`。

---

## 変更履歴

| 日付 | 内容 |
|---|---|
| 2026-03 | 初版作成。docs/design/README.md を分割・統合 |
| 2026-03 | トップページリデザイン（antfu参考）。固有名詞列・スタック行・Likes追加 |
| 2026-03 | Works・Posts・Contact の文字サイズを list タイプ基準に統一 |
| 2026-03 | article タイプの prose を prose-sm → prose に修正。例外ルール明記 |
