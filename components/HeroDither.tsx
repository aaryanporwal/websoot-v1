import { useEffect, useState, type ComponentType } from "react";
import type { DitherProps } from "./Dither/Dither";
import { useTheme } from "./theme/useTheme";

type HeroDitherProps = {
  active: boolean;
  blast: { x: number; y: number; token: number };
  pixelArtVisible: boolean;
};

function readCssRgbTriplet(variable: string): [number, number, number] {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue(variable)
    .trim();
  const [r, g, b] = raw.split(/\s+/).map(Number);
  return [r / 255, g / 255, b / 255];
}

function accentWaveColor(): [number, number, number] {
  const [r, g, b] = readCssRgbTriplet("--color-accent");
  return [r * 0.7, g * 0.7, b * 0.7];
}

function prefersCoarsePointer() {
  return window.matchMedia("(hover: none) and (pointer: coarse)").matches;
}

function scheduleNonCriticalWork(fn: () => void, delayMs: number, idleTimeout: number) {
  const run = () => {
    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(fn, { timeout: idleTimeout });
    } else {
      setTimeout(fn, idleTimeout);
    }
  };

  if (document.readyState === "complete") {
    setTimeout(run, delayMs);
    return;
  }

  window.addEventListener("load", () => setTimeout(run, delayMs), { once: true });
}

export default function HeroDither({
  active,
  blast,
  pixelArtVisible,
}: HeroDitherProps) {
  const { theme } = useTheme();
  const [Dither, setDither] = useState<ComponentType<DitherProps> | null>(null);
  const [waveColor, setWaveColor] = useState<[number, number, number]>([
    0.35, 0.45, 0.12,
  ]);
  const [maxFps, setMaxFps] = useState(30);

  useEffect(() => {
    if (!active || Dither) return;

    let cancelled = false;
    const load = () => {
      import("./Dither/Dither").then((mod) => {
        if (!cancelled) setDither(() => mod.default);
      });
    };

    const coarse = prefersCoarsePointer();
    setMaxFps(coarse ? 20 : 30);
    scheduleNonCriticalWork(load, coarse ? 3500 : 2000, coarse ? 8000 : 5000);

    return () => {
      cancelled = true;
    };
  }, [active, Dither]);

  useEffect(() => {
    setWaveColor(accentWaveColor());
  }, [theme]);

  return (
    <>
      <div
        aria-hidden
        className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_30%_40%,rgb(var(--color-accent)/0.18),transparent_65%)]"
      />
      {active && Dither ? (
        <div aria-hidden className="absolute inset-0 z-0 h-full w-full opacity-[0.85]">
          <Dither
            active={active}
            waveColor={waveColor}
            disableAnimation={false}
            enableMouseInteraction={false}
            clickToken={blast.token}
            blastOrigin={[blast.x, blast.y]}
            catVisible={pixelArtVisible}
            mouseRadius={0.18}
            colorNum={4}
            waveAmplitude={0.22}
            waveFrequency={3}
            waveSpeed={0.05}
            maxFps={maxFps}
          />
        </div>
      ) : null}
    </>
  );
}
