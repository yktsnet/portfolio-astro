## Works カードに公開年月を表示
id: 20
branch-slug: works-published-date
github_issue: 26
status: open
type: feat
対象: |
  src/data/works.ts
  src/pages/index.astro
内容: |
  各 Works カードに公開年月（例: 2024.08）を表示する。
  タイトル直下・説明文の上にサブタイトル形式で配置し、
  既存のダーク/ミニマルデザインを崩さない。
確認: |
  npm run typecheck

---

### データ

`Work` 型に `publishedAt?: string` を追加。
表記は `"2024.08"` のようなドット区切り。省略可（optional）。

### 表示

- 配置: タイトル（h3）直下、説明文の上
- スタイル: `font-mono text-[11px] text-zinc-400 dark:text-zinc-500` 程度の控えめなサイズ・色
- `publishedAt` が未設定のカードでは何も表示しない

### 各 Work の公開年月

| Work | publishedAt |
|---|---|
| NFC Attendance System | 2026.01 |
| Cat Feed Tracker | 2026.03 |
| Training Scheduler | 2026.05 |
| Order System | 2026.05 |
| Attendance System | 2026.05 |
| Trading Lab | 2026.04 |
