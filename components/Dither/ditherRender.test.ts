import { describe, expect, test } from "bun:test";
import { ditherRenderDpr } from "./ditherRender";

describe("ditherRenderDpr", () => {
  test("renders one WebGL pixel per dither cell", () => {
    expect(ditherRenderDpr(12)).toBe(1 / 12);
    expect(ditherRenderDpr(10)).toBe(0.1);
    expect(ditherRenderDpr(8)).toBe(0.125);
  });

  test("never uses a zero or inverted scale", () => {
    expect(ditherRenderDpr(0)).toBe(1);
    expect(ditherRenderDpr(-4)).toBe(1);
  });
});
