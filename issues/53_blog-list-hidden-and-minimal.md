## 既存記事の一覧非表示化とBlog一覧のミニマル化
id: 53
branch-slug: blog-list-hidden-and-minimal
github_issue:
status: draft
type: feat
対象:
- src/content.config.ts
- src/content/post/cat-feed-tracker.md
- src/content/post/live-demo.md
- src/content/post/nfc-attendance-system.md
- src/content/post/trading-lab.md
- src/data/post.ts
- src/pages/rss.xml.ts
- src/pages/tags/index.astro
- src/pages/tags/[tag]/[...page].astro
- src/components/blog/PostPreview.astro
内容: 既存記事4本を frontmatter フラグで一覧・タグ一覧・RSS から除外しつつ URL は維持する。あわせて Blog 一覧のUIをカード式から日付＋タイトルのミニマルな箇条書きに変更する。ファイル数は多いが、frontmatter への1行追加が4本と、それを一貫して除外する参照側の修正のみで、実質は1つの変更（除外フラグの導入）である。
確認: `npm run typecheck`、目視確認（`/posts/` 一覧が箇条書き表示になっている・既存4記事が一覧/タグ一覧/RSSに出ない・`/posts/{既存slug}/` へ直接アクセスすると記事が表示される）

---

### 保証
- 新たに宣言する保証:
  - frontmatter に `hidden: true` を持つ記事は `/posts/` 一覧・ページネーション・タグ一覧・RSS のいずれにも含まれない
  - `hidden: true` を持つ記事であっても `/posts/{slug}/` への直接アクセスでは記事本文が表示される（URL・個別ページ生成は変更しない）
  - `cat-feed-tracker` / `live-demo` / `nfc-attendance-system` / `trading-lab` の4記事に `hidden: true` が付与されている
  - `/posts/` 一覧は日付とタイトルの1行を基本としたリスト形式で表示され、画像・説明文などのカード的要素は表示しない
- 維持する保証:
  - `hidden` を指定していない記事（新規記事を含む）は追加設定なしで一覧・タグ一覧・RSSに表示される
  - 既存記事の URL（`/posts/{slug}/`）・本文コンテンツは変更しない

## 詳細

### src/content.config.ts
`post` コレクションの schema に `hidden: z.boolean().default(false)` を追加する。

### src/content/post/*.md（4ファイル）
`cat-feed-tracker.md` / `live-demo.md` / `nfc-attendance-system.md` / `trading-lab.md` の frontmatter に `hidden: true` を追加する。本文・他のfrontmatterフィールドは変更しない。

### src/data/post.ts
`getAllPosts` を、一覧・タグ集計向けの取得では `hidden` な記事を除外するように変更する。個別記事ページ（`[slug].astro` の `getStaticPaths`）は `getCollection("post")` を直接使っており `hidden` に関わらず全件生成される想定のため、そちら側は変更不要（要現状確認）。`getAllPosts` の呼び出し元すべて（一覧・タグページ・RSS）で除外が効くことを確認する。

### src/pages/rss.xml.ts
`hidden: true` の記事が RSS フィードに含まれないことを確認する（`getAllPosts` 経由であれば自動的に反映される）。

### src/pages/tags/index.astro, src/pages/tags/[tag]/[...page].astro
タグ一覧・タグ別記事一覧も `hidden` な記事を除外する。タグの記事数カウントからも除外する。

### src/components/blog/PostPreview.astro
カード式のプレビュー（画像・説明文・タグ表示など）を、日付＋タイトルの1行リスト形式に変更する。`pinned` 記事の扱い（強調表示の有無）は既存の意図を踏襲するか、廃止するならその旨をPRの説明に明記する。
