import rss from "@astrojs/rss";
import { getAllPosts } from "../data/post";
import { siteConfig } from "../site.config";
import { collectionDateSort } from "../utils/date";
import type { APIContext } from "astro";

export async function GET(context: APIContext) {
  const posts = await getAllPosts();
  const sortedPosts = posts.sort(collectionDateSort);

  return rss({
    title: siteConfig.title,
    description: siteConfig.description,
    site: context.site ?? siteConfig.url,
    items: sortedPosts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.publishDate,
      link: `posts/${post.id}/`,
    })),
  });
}
