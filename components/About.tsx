import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);
}

const STATEMENT =
  "I am a software engineer who loves the craft. Optimized systems, clean interfaces, thoughtful details, and the quiet rhythm of building them well.";

export default function About() {
  const root = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (!textRef.current) return;
      const foreground = getComputedStyle(document.documentElement)
        .getPropertyValue("--color-foreground")
        .trim();
      const foregroundColor = `rgb(${foreground})`;
      const theme = document.documentElement.dataset.theme;
      const startOpacity = theme === "light" ? 0.55 : 0.42;
      const mutedColor = `rgb(${foreground} / ${startOpacity})`;

      const stats = gsap.utils.toArray<HTMLElement>(".about-stat");

      if (reduce) {
        gsap.set(textRef.current, { color: foregroundColor });
        gsap.set(stats, { clearProps: "opacity,transform" });
        return;
      }

      const split = new SplitText(textRef.current, { type: "words" });
      gsap.set(split.words, { color: mutedColor });

      gsap.to(split.words, {
        color: foregroundColor,
        stagger: 1,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top 75%",
          end: "bottom 65%",
          scrub: true,
        },
      });

      gsap.from(stats, {
        y: 20,
        opacity: 0,
        duration: 0.7,
        stagger: 0.08,
        ease: "expo.out",
        scrollTrigger: {
          trigger: stats[0],
          start: "top 88%",
          once: true,
        },
      });

      return () => split.revert();
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      id="about"
      className="relative w-full bg-body px-6 py-32 sm:px-10 lg:px-16"
    >
      <div className="mx-auto max-w-container">
        <p
          ref={textRef}
          className="max-w-5xl font-display text-fluid-md font-medium leading-[1.15] tracking-tight text-white"
        >
          {STATEMENT}
        </p>

        <div className="mt-20 grid grid-cols-2 gap-8 border-t border-line pt-10 sm:grid-cols-4">
          {[
            { n: "5+", l: "Years at the keyboard" },
            { n: "30+", l: "Projects shipped" },
            { n: "1", l: "Cat (my chief architect)" },
            { n: "inf", l: "Passion" },
          ].map((s) => (
            <div key={s.l} className="about-stat">
              <div className="font-display text-4xl font-semibold text-white sm:text-6xl">
                {s.n}
              </div>
              <div className="mt-2 font-sans text-sm text-muted">{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
