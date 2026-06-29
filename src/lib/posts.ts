import type { CollectionEntry } from "astro:content";

export type BlogPost = CollectionEntry<"blog">;

export function postSlug(post: BlogPost) {
  return post.id
    .replace(/\.(md|mdx)$/i, "")
    .trim()
    .replace(/\s+/g, "-")
    .toLowerCase();
}

export function postHref(post: BlogPost) {
  return `/blog/${postSlug(post)}/`;
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function readingTime(body: string) {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 220));
}

export function postSummary(post: BlogPost) {
  if (post.data.description) return post.data.description;
  if (post.data.summary) return post.data.summary;

  const plain = post.body
    .replace(/```[\s\S]*?```/g, "")
    .replace(/!\[[^\]]*\]\([^)]+\)/g, "")
    .replace(/\[[^\]]+\]\([^)]+\)/g, (match) => {
      const label = match.match(/\[([^\]]+)\]/);
      return label?.[1] || "";
    })
    .replace(/[#>*_`~<>{}\[\]()-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return plain.length > 220 ? `${plain.slice(0, 217).trim()}...` : plain;
}

export function sortPosts(posts: BlogPost[]) {
  return [...posts].sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime(),
  );
}

export function tagSlug(tag: string) {
  return tag.trim().toLowerCase().replace(/\s+/g, "-");
}

export function uniqueTags(posts: BlogPost[]) {
  return Array.from(new Set(posts.flatMap((post) => post.data.tags))).sort(
    (a, b) => a.localeCompare(b),
  );
}
