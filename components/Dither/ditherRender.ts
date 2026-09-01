/** CSS pixels per dither cell. Large enough that the grid reads as moving characters. */
export const HERO_DITHER_PIXEL_SIZE = 12;

export function ditherRenderDpr(pixelSize: number) {
  return 1 / Math.max(1, pixelSize);
}
