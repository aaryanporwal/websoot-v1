import { useCallback, useEffect, useState, type ComponentType } from "react";
import type { DitherProps } from "./Dither/Dither";
import { HERO_DITHER_PIXEL_SIZE } from "./Dither/ditherRender";
import { scheduleDitherLoad } from "./Dither/scheduleDitherLoad";
import { useTheme } from "./theme/useTheme";

type HeroDitherProps = {
  active: boolean;
  pair: {
    start: { x: number; y: number } | null;
    end: { x: number; y: number } | null;
    token: number;
  };
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

export default function HeroDither({ active, pair }: HeroDitherProps) {
  const { theme } = useTheme();
  const [Dither, setDither] = useState<ComponentType<DitherProps> | null>(null);
  const [canvasReady, setCanvasReady] = useState(false);
  const [waveColor, setWaveColor] = useState<[number, number, number]>([
    0.35, 0.45, 0.12,
  ]);
  const [maxFps, setMaxFps] = useState(30);
  const handleReady = useCallback(() => setCanvasReady(true), []);

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
    const cancelLoad = scheduleDitherLoad(load);

    return () => {
      cancelled = true;
      cancelLoad();
    };
  }, [active, Dither]);

  useEffect(() => {
    if (!active) setCanvasReady(false);
  }, [active]);

  useEffect(() => {
    setWaveColor(accentWaveColor());
  }, [theme]);

  return (
    <>
      <div
        aria-hidden
        className={`absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_30%_40%,rgb(var(--color-accent)/0.18),transparent_65%)] transition-opacity duration-700 ease-out motion-reduce:transition-none ${
          canvasReady ? "opacity-50" : "opacity-100"
        }`}
      />
      {active && Dither ? (
        <div
          aria-hidden
          className={`absolute inset-0 z-0 h-full w-full transition-opacity duration-700 ease-out motion-reduce:transition-none ${
            canvasReady ? "opacity-[0.88]" : "opacity-0"
          }`}
        >
          <Dither
            active={active}
            waveColor={waveColor}
            disableAnimation={false}
            enableMouseInteraction={false}
            interactionToken={pair.token}
            pathStart={pair.start ? [pair.start.x, pair.start.y] : null}
            pathEnd={pair.end ? [pair.end.x, pair.end.y] : null}
            mouseRadius={0.18}
            colorNum={4}
            waveAmplitude={0.22}
            waveFrequency={3}
            waveSpeed={0.05}
            maxFps={maxFps}
            pixelSize={HERO_DITHER_PIXEL_SIZE}
            onReady={handleReady}
          />
        </div>
      ) : null}
    </>
  );
}
