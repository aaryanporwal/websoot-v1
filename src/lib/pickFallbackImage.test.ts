import { describe, expect, test } from "bun:test";
import { pickFallbackImage } from "./pickFallbackImage";

describe("pickFallbackImage", () => {
  test("reuses the generated WebP source", () => {
    expect(pickFallbackImage(["avif", "webp"], ["avif-src", "webp-src"])).toBe(
      "webp-src",
    );
  });

  test("returns undefined when WebP was not generated", () => {
    expect(pickFallbackImage(["avif"], ["avif-src"])).toBeUndefined();
  });
});
