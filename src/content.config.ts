import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const blog = defineCollection({
  loader: glob({ base: "./src/content/blog", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    draft: z.boolean().optional().default(false),
    slug: z.string().optional(),
    author: z.string().optional(),
    tags: z.array(z.string()).optional().default([]),
    description: z.string().optional(),
    summary: z.string().optional(),
  }),
});

export const collections = { blog };
