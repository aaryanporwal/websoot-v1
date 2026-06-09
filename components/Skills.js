import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger);
}

const ROW_A = [
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "GSAP",
];
const ROW_B = [
  "Tailwind CSS",
  "Docker",
  "AWS",
  "CI/CD",
  "PostgreSQL",
  "GraphQL",
];

function Row({ items, rowRef, separator = "✺" }) {
  // Duplicate the content so the -50% loop is seamless.
  const content = (
    <div className="flex shrink-0 items-center">
      {items.map((s) => (
        <span key={s} className="flex items-center">
          <span className="px-8 font-display text-5xl font-medium text-white sm:text-7xl">
            {s}
          </span>
          <span className="text-2xl text-voltage sm:text-4xl">{separator}</span>
        </span>
      ))}
    </div>
  );

  return (
    <div className="flex w-full overflow-hidden">
      <div ref={rowRef} className="flex w-max flex-nowrap">
        {content}
        {content}
      </div>
    </div>
  );
}

export default function Skills() {
  const root = useRef(null);
  const rowA = useRef(null);
  const rowB = useRef(null);

  useGSAP(
    () => {
      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (reduce) return;

      const tweenA = gsap.fromTo(
        rowA.current,
        { xPercent: 0 },
        { xPercent: -50, duration: 24, ease: "none", repeat: -1 }
      );
      const tweenB = gsap.fromTo(
        rowB.current,
        { xPercent: -50 },
        { xPercent: 0, duration: 24, ease: "none", repeat: -1 }
      );

      // Scroll velocity nudges the marquee speed for that reactive feel.
      const st = ScrollTrigger.create({
        trigger: root.current,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          const boost = 1 + Math.min(Math.abs(self.getVelocity()) / 400, 5);
          gsap.to([tweenA, tweenB], {
            timeScale: boost,
            duration: 0.3,
            overwrite: true,
            onComplete: () => {
              tweenA.timeScale(1);
              tweenB.timeScale(1);
            },
          });
        },
      });

      return () => {
        st.kill();
        tweenA.kill();
        tweenB.kill();
      };
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      className="relative w-full border-y border-line bg-body py-20"
    >
      <div className="flex flex-col gap-4">
        <Row items={ROW_A} rowRef={rowA} separator="✺" />
        <Row items={ROW_B} rowRef={rowB} separator="◆" />
      </div>
    </section>
  );
}
