import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const frontmatterDate = z.coerce.date();

const blog = defineCollection({
  loader: glob({ base: "./src/content/blog", pattern: "**/*.{md,mdx}" }),
  schema: z
    .object({
      title: z.string(),
      date: frontmatterDate.optional(),
      publishDate: frontmatterDate.optional(),
      pubDate: frontmatterDate.optional(),
      publishedAt: frontmatterDate.optional(),
      postedAt: frontmatterDate.optional(),
      createdAt: frontmatterDate.optional(),
      created: frontmatterDate.optional(),
      lastmod: frontmatterDate.optional(),
      updatedAt: frontmatterDate.optional(),
      modifiedAt: frontmatterDate.optional(),
      draft: z.boolean().optional().default(false),
      slug: z.string().optional(),
      author: z.string().optional(),
      tags: z.array(z.string()).optional().default([]),
      description: z.string().optional(),
      summary: z.string().optional(),
    })
    .transform((data, context) => {
      const publishedDate =
        data.date ??
        data.publishDate ??
        data.pubDate ??
        data.publishedAt ??
        data.postedAt ??
        data.createdAt ??
        data.created;

      if (!publishedDate) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "Blog posts need a published date. Use date, publishDate, postedAt, or createdAt in front matter.",
        });
        return z.NEVER;
      }

      return {
        ...data,
        date: publishedDate,
        updatedDate: data.lastmod ?? data.updatedAt ?? data.modifiedAt,
      };
    }),
});

export const collections = { blog };
