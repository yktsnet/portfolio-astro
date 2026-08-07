## PR記録: cleanup: 記事機構（posts / tags / RSS）の撤去
issue: 56 (56_remove-posts-machinery.md)
PR: https://github.com/yktsnet/portfolio-astro/pull/123
Merged: 4d2a6d75fa2443773d17f76358407eb95eb2a7e7

## 変更内容
記事はすべて Zenn へ移したため、サイト内の記事機構を撤去した。

- src/pages/posts/、src/pages/tags/、src/pages/rss.xml.ts を削除
- src/content/post/、src/content/tag/ を削除し、src/content.config.ts の post・tag コレクション定義（および removeDupsAndLowerCase）を削除。collections は空の export のみ残す
- src/data/post.ts（getAllPosts・getTagMeta・groupPostsByYear・getAllTags・getUniqueTags・getUniqueTagsWithCount）を削除
- src/components/blog/（Masthead.astro・PostPreview.astro）を削除
- src/data/works.ts から postSlug フィールド（型定義・nfc-attendance-system・cat-feed-tracker の値）と getPostVisualMeta・DEFAULT_POST_COLOR を削除。works・researches の他フィールドは無変更
- 参照元の無かった src/components/Researches.astro・src/components/SocialList.astro を削除

## 保証
- 新たに宣言する保証: なし（削除のみで、新たな振る舞いを追加しない）
- 維持する保証: docs/guarantees.md 記載の src/lib/api.ts の全保証（/api/hello・/api/status・/api/contact・/api/chat）は本変更の影響を受けない。削除対象は api.ts およびそのテストに一切依存しないため、台帳の改訂は対象外（Issueの指定どおり）。

## 静的確認結果
- `npm run typecheck`: 0 errors / 0 warnings（既存の RightNav.astro・contact.astro の警告2件は本変更と無関係）
- `npm run build`: astro build 自体は成功（server entrypoints まで完了）。folio-agent-ingest 前段の wrangler remote proxy 起動で Cloudflare 認証情報が無く失敗するが、これは実行環境側の制約でありコード変更とは無関係
- `npm run test`: 14 tests passed
- import・caller整合性: getAllPosts・getTagMeta・groupPostsByYear・getAllTags・getUniqueTags・getUniqueTagsWithCount・Masthead・PostPreview・Researches.astro・SocialList.astro・getPostVisualMeta・postSlug の参照を grep で確認し、削除対象外に残存参照が無いことを確認済み
- git diff --name-only --cached:
  src/components/Researches.astro
  src/components/SocialList.astro
  src/components/blog/Masthead.astro
  src/components/blog/PostPreview.astro
  src/content.config.ts
  src/content/post/cat-feed-tracker.md
  src/content/post/live-demo.md
  src/content/post/nfc-attendance-system.md
  src/content/post/trading-lab.md
  src/content/tag/astro.md
  src/content/tag/cloudflare.md
  src/content/tag/dashboard.md
  src/content/tag/design.md
  src/content/tag/line-api.md
  src/content/tag/tailwind.md
  src/data/post.ts
  src/data/works.ts
  src/pages/posts/[...page].astro
  src/pages/posts/[slug].astro
  src/pages/rss.xml.ts
  src/pages/tags/[tag]/[...page].astro
  src/pages/tags/index.astro

## 検証手順
デプロイ後、以下を目視確認:
- `/posts/`・`/tags/`・`/rss.xml` が 404 になること
- `/` (Works)・`/about/`・`/approach/`・`/impact/` が従来どおり表示されること（postSlug 削除の影響が無いこと）
