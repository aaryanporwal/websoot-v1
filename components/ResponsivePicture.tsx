import type { ImgHTMLAttributes, Ref } from "react";
import type { ResolvedPicture } from "../src/lib/resolvePicture";

type Props = {
  picture: ResolvedPicture;
  alt: string;
  className?: string;
  imgRef?: Ref<HTMLImageElement>;
  imgClassName?: string;
  "aria-hidden"?: boolean;
} & Pick<
  ImgHTMLAttributes<HTMLImageElement>,
  "loading" | "decoding" | "sizes" | "draggable" | "fetchPriority"
>;

export default function ResponsivePicture({
  picture,
  alt,
  className,
  imgRef,
  imgClassName,
  loading,
  decoding = "async",
  sizes,
  draggable,
  fetchPriority,
  "aria-hidden": ariaHidden,
}: Props) {
  return (
    <picture className={className}>
      {picture.sources.map((source) => (
        <source key={source.type} srcSet={source.srcSet} type={source.type} sizes={sizes} />
      ))}
      <img
        ref={imgRef}
        src={picture.fallbackSrc}
        alt={alt}
        width={picture.width}
        height={picture.height}
        loading={loading}
        decoding={decoding}
        fetchPriority={fetchPriority}
        draggable={draggable}
        aria-hidden={ariaHidden}
        className={imgClassName}
      />
    </picture>
  );
}
