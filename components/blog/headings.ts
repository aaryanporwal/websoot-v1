export type BlogHeading = {
  depth: number;
  slug: string;
  text: string;
};

export type HeadingThread = {
  id: string;
  status: "regular";
  title: string;
  custom: { depth: number };
};

export const BLOG_HEADING_SCROLL_OFFSET_PX = 112;

export function blogTocHeadings(headings: readonly BlogHeading[]): BlogHeading[] {
  return headings.filter(
    (heading) =>
      heading.depth >= 1 &&
      heading.depth <= 4 &&
      heading.slug.length > 0 &&
      heading.text.trim().length > 0,
  );
}

export function headingsToThreads(
  headings: readonly BlogHeading[],
): HeadingThread[] {
  return blogTocHeadings(headings).map((heading) => ({
    id: heading.slug,
    status: "regular",
    title: heading.text.trim(),
    custom: { depth: heading.depth },
  }));
}

export function headingDepth(
  custom: Record<string, unknown> | undefined,
): number {
  return typeof custom?.depth === "number" ? custom.depth : 2;
}

export function headingIndentClass(depth: number): string {
  if (depth >= 4) return "ps-8";
  if (depth === 3) return "ps-5";
  return "ps-2.5";
}

export function initialHeadingId(
  headings: readonly BlogHeading[],
  hash: string,
): string | undefined {
  const toc = blogTocHeadings(headings);
  const fromHash = hash.replace(/^#/, "");
  if (fromHash && toc.some((heading) => heading.slug === fromHash)) {
    return fromHash;
  }
  return toc[0]?.slug;
}

export function activeHeadingId(
  headings: readonly BlogHeading[],
  tops: readonly number[],
  viewportOffset: number,
): string | undefined {
  const toc = blogTocHeadings(headings);
  let active: string | undefined;

  for (let index = 0; index < toc.length; index += 1) {
    const top = tops[index];
    if (top === undefined) continue;
    if (top <= viewportOffset) {
      active = toc[index]?.slug;
    }
  }

  return active ?? toc[0]?.slug;
}
