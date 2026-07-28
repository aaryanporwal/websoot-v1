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
  return [r * 0.4, g * 0.4, b * 0.4];
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

  useEffect(() => {
    if (!active || Dither) return;

    let cancelled = false;
    const load = () => {
      import("./Dither/Dither").then((mod) => {
        if (!cancelled) setDither(() => mod.default);
      });
    };

    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(load, { timeout: 1500 });
      return () => {
        cancelled = true;
        window.cancelIdleCallback(id);
      };
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [active, Dither]);

  useEffect(() => {
    setWaveColor(accentWaveColor());
  }, [theme]);

  if (!active || !Dither) return null;

  return (
    <div aria-hidden className="absolute inset-0 z-0 h-full w-full">
      <div className="absolute inset-0 opacity-60">
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
        />
      </div>

    </div>
  );
}
