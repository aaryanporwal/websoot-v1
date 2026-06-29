import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import type { APIRoute } from "astro";
import { postHref, postSummary, sortPosts } from "../lib/posts";

export const GET: APIRoute = async (context) => {
  const posts = sortPosts(
    await getCollection("blog", ({ data }) => data.draft !== true),
  );

  return rss({
    title: "Aaryan Porwal",
    description:
      "Aaryan Porwal writes about frontend performance, open source, JavaScript, systems, and software craft.",
    site: context.site ?? "https://aaryanporwal.com",
    items: posts.map((post) => ({
      title: post.data.title,
      description: postSummary(post),
      pubDate: post.data.date,
      link: postHref(post),
      categories: post.data.tags,
    })),
  });
};
