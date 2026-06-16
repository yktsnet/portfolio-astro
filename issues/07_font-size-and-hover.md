## フォントサイズ調整・ホバースタイル統一
id: 07
branch-slug: font-size-and-hover
github_issue:
status: open
type: feat
対象: |
  src/pages/index.astro
  src/components/Search.astro
  src/components/ThemeToggle.astro
内容: |
  フォントサイズの底上げと、ホバースタイルを poi-accent に統一する。
  1. Builder ラベル: text-xs → text-sm
  2. bio テキスト: text-xs → text-sm
  3. Works h3 タイトル: text-base → text-lg
  4. Works 説明文: text-xs → text-sm
  5. Works リンク: text-xs → text-sm
  6. Hero メタ情報（Osaka / ykts.net / GitHub / 2025〜 / Post / Contact）: text-xs → text-sm
  7. Hero メタ情報リンクに hover:text-poi-accent を追加
  8. Search ボタン: hover:bg-* を削除し hover:text-poi-accent に変更
  9. ThemeToggle ボタン: hover:bg-* を削除し hover:text-poi-accent に変更
確認: |
  - 全対象要素のフォントサイズが変更されていること
  - Search ホバー時に背景ブロックが出ず、アイコンがグリーンになること
  - ThemeToggle ホバー時に背景ブロックが出ず、アイコンがグリーンになること
  - Hero メタ情報リンクのホバーでグリーンになること
  - 他のナビアイコンのホバーと見た目が統一されていること
  - npm run typecheck が通ること

---

## 設計メモ

### Search.astro ボタン変更

```diff
- class="... hover:bg-zinc-100 dark:text-poi-text dark:hover:bg-poi-panel"
+ class="... hover:text-poi-accent dark:text-poi-text dark:hover:text-poi-accent"
```

### ThemeToggle.astro ボタン変更

```diff
- class="... hover:bg-zinc-100 dark:text-poi-text dark:hover:bg-poi-panel"
+ class="... hover:text-poi-accent dark:text-poi-text dark:hover:text-poi-accent"
```

### Hero メタ情報リンクのホバー統一

index.astro のメタ情報リスト内の `<a>` タグに
`hover:text-poi-accent dark:hover:text-poi-accent transition-colors` を追加。
