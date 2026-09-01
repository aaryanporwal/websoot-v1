import { useMemo } from "react";
import { Howl } from "howler";

export type SiteSoundName = "tick" | "tap" | "off" | "shake" | "chime";

export const SITE_SOUNDS: Record<
  SiteSoundName,
  { src: string; volume: number; cooldown: number }
> = {
  tick: { src: "/sounds/pop-down.mp3", volume: 0.12, cooldown: 80 },
  tap: { src: "/sounds/pop-up-on.mp3", volume: 0.16, cooldown: 90 },
  off: { src: "/sounds/pop-up-off.mp3", volume: 0.16, cooldown: 120 },
  shake: { src: "/sounds/rising-pops.mp3", volume: 0.22, cooldown: 180 },
  chime: { src: "/sounds/glug-a.mp3", volume: 0.24, cooldown: 300 },
};

export type SoundPlayer = { play: () => unknown };
export type SoundPlayerFactory = (src: string, volume: number) => SoundPlayer;

const defaultPlayerFactory: SoundPlayerFactory = (src, volume) =>
  new Howl({ src: [src], volume, preload: true });

let playerFactory: SoundPlayerFactory = defaultPlayerFactory;
let players: Record<SiteSoundName, SoundPlayer> | null = null;
const lastPlayed: Record<string, number> = {};

function getPlayers() {
  if (!players) {
    if (typeof window === "undefined" && playerFactory === defaultPlayerFactory) {
      return null;
    }
    players = {
      tick: playerFactory(SITE_SOUNDS.tick.src, SITE_SOUNDS.tick.volume),
      tap: playerFactory(SITE_SOUNDS.tap.src, SITE_SOUNDS.tap.volume),
      off: playerFactory(SITE_SOUNDS.off.src, SITE_SOUNDS.off.volume),
      shake: playerFactory(SITE_SOUNDS.shake.src, SITE_SOUNDS.shake.volume),
      chime: playerFactory(SITE_SOUNDS.chime.src, SITE_SOUNDS.chime.volume),
    };
  }
  return players;
}

export function playSiteSound(name: SiteSoundName, now = Date.now()) {
  const spec = SITE_SOUNDS[name];
  if (now - (lastPlayed[name] || 0) < spec.cooldown) return false;
  lastPlayed[name] = now;
  getPlayers()?.[name].play();
  return true;
}

export function useSiteSounds() {
  return useMemo(
    () => ({
      tick: () => playSiteSound("tick"),
      tap: () => playSiteSound("tap"),
      off: () => playSiteSound("off"),
      shake: () => playSiteSound("shake"),
      chime: () => playSiteSound("chime"),
    }),
    [],
  );
}

export function resetSiteSoundsForTests(factory?: SoundPlayerFactory) {
  players = null;
  for (const key of Object.keys(lastPlayed)) delete lastPlayed[key];
  playerFactory = factory ?? defaultPlayerFactory;
}

export function getSiteSoundPlayersForTests() {
  return players;
}
