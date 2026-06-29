import { useEffect, useState } from "react";
import type { ComponentType } from "react";
import ringData from "./lottie/ringData";

type LottieAccentProps = {
  data?: typeof ringData;
  loop?: boolean;
  className?: string;
  ariaHidden?: boolean;
};

type LottiePlayer = ComponentType<{
  animationData: typeof ringData;
  loop: boolean;
  autoplay: boolean;
  style: { width: string; height: string };
}>;

export default function LottieAccent({
  data = ringData,
  loop = true,
  className = "",
  ariaHidden = true,
}: LottieAccentProps) {
  const [Lottie, setLottie] = useState<LottiePlayer | null>(null);

  useEffect(() => {
    let mounted = true;

    import("lottie-react")
      .then((mod) => {
        const player =
          "default" in mod.default ? mod.default.default : mod.default;
        if (mounted) setLottie(() => player as LottiePlayer);
      })
      .catch(() => {
        if (mounted) setLottie(null);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className={className} aria-hidden={ariaHidden}>
      {Lottie ? (
        <Lottie
          animationData={data}
          loop={loop}
          autoplay
          style={{ width: "100%", height: "100%" }}
        />
      ) : null}
    </div>
  );
}
