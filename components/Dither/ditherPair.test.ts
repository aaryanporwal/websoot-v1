import { describe, expect, test } from "bun:test";
import {
  clickDitherPair,
  EMPTY_DITHER_PAIR,
  forgetFinishedDitherPair,
  shouldStartDitherInteraction,
} from "./ditherPair";

describe("dither pair", () => {
  test("second click completes the pair", () => {
    const afterStart = clickDitherPair(EMPTY_DITHER_PAIR, { x: 0.2, y: 0.3 });
    const afterEnd = clickDitherPair(afterStart, { x: 0.8, y: 0.7 });

    expect(afterEnd).toEqual({
      start: { x: 0.2, y: 0.3 },
      end: { x: 0.8, y: 0.7 },
      token: 2,
    });
  });

  test("forgets a finished pair so a remount cannot replay it", () => {
    const finished = {
      start: { x: 0.2, y: 0.3 },
      end: { x: 0.8, y: 0.7 },
      token: 2,
    };

    expect(forgetFinishedDitherPair(finished)).toEqual({
      start: null,
      end: null,
      token: 2,
    });
    expect(
      shouldStartDitherInteraction(2, -1, false, 1440, 900),
    ).toBeFalse();
  });

  test("does not restart the same token on resize", () => {
    expect(shouldStartDitherInteraction(2, 2, true, 800, 600)).toBeFalse();
  });

  test("starts only for a new click with a start point and a real size", () => {
    expect(shouldStartDitherInteraction(2, -1, true, 1440, 900)).toBeTrue();
    expect(shouldStartDitherInteraction(0, -1, true, 1440, 900)).toBeFalse();
    expect(shouldStartDitherInteraction(1, 0, true, 0, 900)).toBeFalse();
  });
});
