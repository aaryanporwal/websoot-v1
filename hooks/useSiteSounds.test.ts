import { describe, expect, test, beforeEach } from "bun:test";
import {
  getSiteSoundPlayersForTests,
  playSiteSound,
  resetSiteSoundsForTests,
} from "./useSiteSounds";

function createFactory() {
  const created: Array<{ src: string; volume: number; play: () => void }> = [];
  const factory = (src: string, volume: number) => {
    const player = {
      src,
      volume,
      play() {
        player.plays += 1;
      },
      plays: 0,
    };
    created.push(player);
    return player;
  };
  return { factory, created };
}

describe("site sounds singleton", () => {
  beforeEach(() => {
    const { factory } = createFactory();
    resetSiteSoundsForTests(factory);
  });

  test("creates each Howl once across play calls", () => {
    const { factory, created } = createFactory();
    resetSiteSoundsForTests(factory);

    playSiteSound("tap", 1_000);
    playSiteSound("tick", 1_000);
    playSiteSound("tap", 2_000);

    expect(created).toHaveLength(5);
    expect(created.filter((player) => player.src === "/sounds/pop-up-on.mp3")).toHaveLength(1);
    expect(
      created.find((player) => player.src === "/sounds/pop-up-on.mp3")?.plays,
    ).toBe(2);
  });

  test("shares the same players object", () => {
    playSiteSound("tick", 1_000);
    const first = getSiteSoundPlayersForTests();
    playSiteSound("chime", 2_000);
    expect(getSiteSoundPlayersForTests()).toBe(first);
  });

  test("respects per-sound cooldown", () => {
    expect(playSiteSound("tap", 1_000)).toBe(true);
    expect(playSiteSound("tap", 1_050)).toBe(false);
    expect(playSiteSound("tap", 1_090)).toBe(true);
  });
});
