import { getCollection } from "astro:content";
import type { APIRoute, GetStaticPaths } from "astro";
import { renderOgImage } from "../../../lib/og";
import {
  formatDate,
  postSlug,
  postSummary,
  readingTime,
  type BlogPost,
} from "../../../lib/posts";

export const prerender = true;

export const getStaticPaths = (async () => {
  const posts = await getCollection("blog", ({ data }) => data.draft !== true);

  return posts.map((post) => ({
    params: { slug: postSlug(post) },
    props: { post },
  }));
}) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) => {
  const { post } = props as { post: BlogPost };
  const png = await renderOgImage({
    title: post.data.title,
    description: postSummary(post),
    meta: `${formatDate(post.data.date)} · ${readingTime(post.body)} min read`,
  });

  return new Response(new Uint8Array(png), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};
