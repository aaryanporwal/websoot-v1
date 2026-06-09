import { useCallback, useRef } from "react";
import useSound from "use-sound";

const SOUND_OPTIONS = {
  interrupt: true,
  preload: true,
};

export function useSiteSounds() {
  const lastPlayed = useRef({});
  const [playTick] = useSound("/sounds/pop-down.mp3", {
    ...SOUND_OPTIONS,
    volume: 0.12,
  });
  const [playTap] = useSound("/sounds/pop-up-on.mp3", {
    ...SOUND_OPTIONS,
    volume: 0.16,
  });
  const [playOff] = useSound("/sounds/pop-up-off.mp3", {
    ...SOUND_OPTIONS,
    volume: 0.16,
  });
  const [playShake] = useSound("/sounds/rising-pops.mp3", {
    ...SOUND_OPTIONS,
    volume: 0.22,
  });
  const [playChime] = useSound("/sounds/glug-a.mp3", {
    ...SOUND_OPTIONS,
    volume: 0.24,
  });

  const play = useCallback((name, player, cooldown = 90) => {
    const now = Date.now();
    if (now - (lastPlayed.current[name] || 0) < cooldown) return;
    lastPlayed.current[name] = now;
    player();
  }, []);

  return {
    tick: useCallback(() => play("tick", playTick, 80), [play, playTick]),
    tap: useCallback(() => play("tap", playTap, 90), [play, playTap]),
    off: useCallback(() => play("off", playOff, 120), [play, playOff]),
    shake: useCallback(() => play("shake", playShake, 180), [play, playShake]),
    chime: useCallback(() => play("chime", playChime, 300), [play, playChime]),
  };
}
