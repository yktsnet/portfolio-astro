## 記事機構（posts / tags / RSS）の撤去
id: 56
branch-slug: remove-posts-machinery
github_issue: 124
status: close
type: cleanup
対象:
- src/pages/posts/、src/pages/tags/、src/pages/rss.xml.ts（ディレクトリごと削除）
- src/content/post/、src/content/tag/（ディレクトリごと削除）
- src/components/blog/、src/components/Researches.astro、src/components/SocialList.astro（削除）
- src/data/post.ts（削除）
- src/content.config.ts（post・tag コレクション定義を削除）
- src/data/works.ts（`postSlug` フィールドと `getPostVisualMeta` を削除）
内容: 記事はすべて Zenn へ移したため、サイト内の記事機構を撤去する。あわせて参照元の無いコンポーネント2件も削除する。ファイル数は多いが、実質は1つの変更（記事機構の撤去）であり、大半は同一ディレクトリの一括削除である。
確認: `npm run typecheck`、`npm run build`、`npm run test`、import・caller 整合性をコードを読んで確認（削除した export の参照が残っていないこと）

---

### 保証
- 新たに宣言する保証:
  - なし（削除のみで、新たな振る舞いを追加しない）
- 維持する保証:
  - `docs/guarantees.md` に記載された `src/lib/api.ts` の全保証（`/api/hello`・`/api/status`・`/api/contact`・`/api/chat`）は本Issueの影響を受けない。

削除対象は `src/lib/api.ts` およびそのテストに一切依存しないため、台帳の改訂は不要で、対象ファイルにも含めない。

---

### 背景

`src/content/post/` の4本はすべて frontmatter に `hidden: true` を持つ（Issue 53 で付与）。`getAllPosts()` は hidden を除外するため（`src/data/post.ts:4`）、これに依存する面はすべて空を出力している。

| 面 | 現状の出力 |
|---|---|
| `/posts/[...page]` 一覧 | 0件 |
| `/tags/`・`/tags/[tag]` | 0件 |
| `/rss.xml` | 0件のフィードを配信 |

Issue 53 は「URL は維持する」方針で個別ページを残したが、記事を Zenn に集約する方針が確定したため、その前提は失効した。Issue 55 の完了により `/posts/` 配下への内部リンクも消える。

### src/pages/posts/、src/pages/tags/、src/pages/rss.xml.ts

一括削除する。`/posts/[slug]` は `getAllPosts()` ではなく生の `getCollection("post")` を使うため hidden な4本も生成されていたが（`src/pages/posts/[slug].astro:7`）、これも含めて削除する。

`ProfileLayout` は `index.astro`・`about.astro`・`impact.astro`・`approach.astro` でも使われているため**削除しない**。

### src/content/post/、src/content/tag/

`post` 4本と `tag` メタ6本を削除する。`src/content.config.ts` から `post`・`tag` のコレクション定義と、それらのみが使う `removeDupsAndLowerCase` を削除すること。両コレクションが消えると `collections` が空になるが、その場合のファイルの扱い（空の export を残すか、ファイルごと削除するか）は Astro が警告を出さない形を選ぶこと。

### src/data/post.ts、src/components/blog/

`src/data/post.ts` の export（`getAllPosts`・`getTagMeta`・`groupPostsByYear`・`getAllTags`・`getUniqueTags`・`getUniqueTagsWithCount`）と `src/components/blog/`（`Masthead.astro`・`PostPreview.astro`）は、いずれも上記削除対象からのみ参照されている。参照が残っていないことを確認したうえで削除する。

### src/data/works.ts

`postSlug` は一方通行のフィールドで、消費しているのは `getPostVisualMeta()`（`src/data/works.ts:419`）のみ。そしてその関数は記事機構側からしか呼ばれない。型定義の `postSlug?: string`（`:77`）、`nfc-attendance-system`・`cat-feed-tracker` の2つの値（`:95`・`:127`）、`getPostVisualMeta` 本体をすべて削除する。

`works.ts` の他のフィールド（`links`・`stack`・`metrics` 等）と Works の表示には影響を与えないこと。

### src/components/Researches.astro、src/components/SocialList.astro

どちらも import 元が存在しない。記事機構とは独立だが、同じ「未使用の撤去」であり確認手段も同一のため本Issueに含める。

### 実装順序

Issue 55 の完了後に着手する。先行しない場合、`cat-feed-tracker/index.astro:237`・`nfc-attendance/index.astro:214`・`StatusPage.astro:103` が存在しない URL を指すことになる。
