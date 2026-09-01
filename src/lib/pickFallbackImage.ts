/** Prefer an already-generated WebP source as the <img> fallback. */
export function pickFallbackImage<T>(
  formats: Array<"avif" | "webp">,
  optimized: T[],
): T | undefined {
  const webpIndex = formats.indexOf("webp");
  return webpIndex >= 0 ? optimized[webpIndex] : undefined;
}
