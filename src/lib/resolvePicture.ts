import { getImage, type ImageMetadata } from "astro:assets";
import { pickFallbackImage } from "./pickFallbackImage";

export type ResolvedPicture = {
  sources: Array<{ type: string; srcSet: string }>;
  fallbackSrc: string;
  width: number;
  height: number;
};

type ResolvePictureOptions = {
  src: ImageMetadata;
  width?: number;
  widths?: number[];
  formats?: Array<"avif" | "webp">;
};

/** Mirrors Astro's <Picture formats={['avif','webp']} /> output for use in React islands. */
export async function resolvePicture({
  src,
  width,
  widths,
  formats = ["avif", "webp"],
}: ResolvePictureOptions): Promise<ResolvedPicture> {
  const transform = { src, width, widths };

  const optimized = await Promise.all(
    formats.map((format) => getImage({ ...transform, format })),
  );

  const fallback =
    pickFallbackImage(formats, optimized) ??
    (await getImage({ ...transform, format: "webp" }));

  return {
    sources: optimized.map((image, index) => ({
      type: `image/${formats[index]}`,
      srcSet:
        image.srcSet.values.length > 0
          ? image.srcSet.attribute
          : image.src,
    })),
    fallbackSrc: fallback.src,
    width: Number(fallback.attributes.width),
    height: Number(fallback.attributes.height),
  };
}
