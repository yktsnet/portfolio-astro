## Works・ヘッダーからZennリンクを削除
id: 52
branch-slug: remove-zenn-links
github_issue: 114
status: close
type: cleanup
対象:
- src/data/works.ts
- src/components/WorkCard.astro
- src/lib/brand-icons.ts
- src/components/RightNav.astro
内容: Works カードとヘッダーから Zenn への外部リンク・アイコンを削除し、GitHub リンクを基本の導線とする。未使用になった Zenn 関連コードも削除する。
確認: `npm run typecheck`、`grep -rn "siZenn\|isZenn\|zenn" src/` で意図しない残存参照が無いことを確認

---

### 保証
- 新たに宣言する保証:
  - NFC Attendance Kit・Cat Feed Tracker の Works カードに Zenn へのリンクは表示されない。GitHub・Demo リンクは従来通り表示される
  - ヘッダー右上のアイコン群（RightNav）に Zenn へのリンクは表示されない
- 維持する保証:
  - 既存の GitHub・Demo リンクの遷移先・ラベル・表示順は変更しない
  - zenn.dev 上の既存記事自体は変更・削除しない（このIssueはサイト内の導線削除のみが対象）

## 詳細

### src/data/works.ts
NFC Attendance Kit・Cat Feed Tracker それぞれの `links` から `{ label: "Zenn", href: ... }` エントリを削除する。`postSlug` フィールドは `getPostVisualMeta` が内部で使うため残置する。

### src/components/WorkCard.astro
`isZenn` 判定とそれに紐づく分岐（Zennアイコン描画）を削除する。`isGithub` 側の分岐・描画は変更しない。

### src/lib/brand-icons.ts
`siZenn` の re-export・`"zenn"` エントリを、他に使用箇所が無いことを確認した上で削除する（削除前に `grep -rn "getBrandIcon('zenn')\|brand-icons.*zenn" src/` で再確認する）。

### src/components/RightNav.astro
Zenn へのリンク（`<a href="https://zenn.dev/yktsnet" ...>`）を丸ごと削除する。GitHub・Photos・Contact・ThemeToggle の並び・間隔は残りの要素で自然になるよう調整する。
