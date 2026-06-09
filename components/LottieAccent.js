import dynamic from "next/dynamic";
import ringData from "./lottie/ringData";

// lottie-web touches `document`, so load the player client-side only.
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export default function LottieAccent({
  data = ringData,
  loop = true,
  className = "",
  ariaHidden = true,
}) {
  return (
    <div className={className} aria-hidden={ariaHidden}>
      <Lottie animationData={data} loop={loop} autoplay style={{ width: "100%", height: "100%" }} />
    </div>
  );
}
