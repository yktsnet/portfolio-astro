import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

function removeDupsAndLowerCase(array: string[]) {
  return [...new Set(array.map((str) => str.toLowerCase()))];
}

const post = defineCollection({
  loader: glob({ base: "./src/content/post", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    title: z.string().max(60),
    description: z.string(),
    draft: z.boolean().default(false),
    tags: z.array(z.string()).default([]).transform(removeDupsAndLowerCase),
    publishDate: z
      .string()
      .or(z.date())
      .transform((val) => new Date(val)),
    updatedDate: z
      .string()
      .optional()
      .transform((str) => (str ? new Date(str) : undefined)),
    pinned: z.boolean().default(false),
  }),
});

const tag = defineCollection({
  loader: glob({ base: "./src/content/tag", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    title: z.string().max(60).optional(),
    description: z.string().optional(),
  }),
});

export const collections = { post, tag };
