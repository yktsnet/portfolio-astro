import { type CollectionEntry, getCollection } from "astro:content";

/** filter out draft posts based on the environment */
export async function getAllPosts(): Promise<CollectionEntry<"post">[]> {
  return await getCollection("post", ({ data }) => {
    return import.meta.env.PROD ? !data.draft : true;
  });
}

/** Get tag metadata by tag name */
export async function getTagMeta(tag: string): Promise<CollectionEntry<"tag"> | undefined> {
  const tagEntries = await getCollection("tag", (entry) => {
    return entry.id === tag;
  });
  return tagEntries[0];
}

/** groups posts by year */
export function groupPostsByYear(posts: CollectionEntry<"post">[]) {
  const grouped: Record<string, typeof posts> = {};
  for (const post of posts) {
    const year = post.data.publishDate.getFullYear().toString();
    (grouped[year] ??= []).push(post);
  }
  return grouped;
}

/** returns all tags created from posts (inc duplicate tags) */
export function getAllTags(posts: CollectionEntry<"post">[]) {
  return posts.flatMap((post) => [...post.data.tags]);
}

/** returns all unique tags created from posts */
export function getUniqueTags(posts: CollectionEntry<"post">[]) {
  return [...new Set(getAllTags(posts))];
}

/** returns a count of each unique tag - [[tagName, count], ...] */
export function getUniqueTagsWithCount(posts: CollectionEntry<"post">[]): [string, number][] {
  return [
    ...getAllTags(posts).reduce(
      (acc, t) => acc.set(t, (acc.get(t) ?? 0) + 1),
      new Map<string, number>(),
    ),
  ].sort((a, b) => b[1] - a[1]);
}
