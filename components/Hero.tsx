import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";
import { motion } from "motion/react";
import { Signature } from "./Signature";
import { useSiteSounds } from "../hooks/useSiteSounds";
import { HERO_CHROME_REVEAL_DELAY } from "./animationTimings";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, SplitText);
}

const ROTATING = ["Python", "LLMs", "React", "Agents", "RAG"];

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const wordRef = useRef<HTMLSpanElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const sounds = useSiteSounds();

  useGSAP(
    () => {
      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      if (!headingRef.current) return;

      let split: SplitText | undefined;

      if (!reduce) {
        // Headline character reveal.
        split = new SplitText(headingRef.current, {
          type: "chars,lines",
          linesClass: "overflow-hidden",
        });
        gsap.set(contentRef.current, { autoAlpha: 1, pointerEvents: "auto" });
        gsap.from(split.chars, {
          yPercent: 120,
          opacity: 0,
          stagger: 0.025,
          duration: 1,
          ease: "expo.out",
          delay: 0.15,
        });

        // Intro fade/slide for the supporting copy.
        gsap.from(".hero-fade", {
          y: 30,
          opacity: 0,
          duration: 1,
          stagger: 0.12,
          ease: "power3.out",
          delay: 0.5,
        });

        // GSAP-driven rotating word (replaces typed.js).
        const word = wordRef.current;
        if (!word) return;
        const tl = gsap.timeline({ repeat: -1, delay: 1 });
        ROTATING.forEach((w) => {
          tl.set(word, { textContent: w })
            .fromTo(
              word,
              { yPercent: 110, opacity: 0 },
              { yPercent: 0, opacity: 1, duration: 0.6, ease: "expo.out" },
            )
            .to(word, {
              yPercent: -110,
              opacity: 0,
              duration: 0.5,
              ease: "power2.in",
              delay: 1.4,
            });
        });
      } else {
        gsap.set(contentRef.current, { autoAlpha: 1, pointerEvents: "auto" });
        if (wordRef.current) wordRef.current.textContent = ROTATING[0];
      }

      return () => {
        if (split) split.revert();
      };
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="top"
      className="relative min-h-screen w-full overflow-hidden bg-body px-6 pt-32 sm:px-10 lg:px-16"
    >
      <div
        ref={contentRef}
        className="opacity-0 pointer-events-none relative mx-auto flex min-h-[calc(100vh-12rem)] max-w-container flex-col justify-center"
      >

        <h1
          ref={headingRef}
          className="font-display text-fluid-xl font-semibold leading-[0.92] tracking-tightest text-white"
        >
          Aaryan
          <br />
          <span className="text-stroke">Porwal</span>
        </h1>

        <div className="hero-fade mt-8 max-w-2xl font-sans text-lg text-muted sm:text-2xl">
          <p>
            I build software with care, curiosity, and a suspiciously loud
            keyboard. Interfaces, systems, and tools that feel good to use.
          </p>
        </div>

        <div className="hero-fade mt-6 flex flex-wrap items-baseline gap-x-3 gap-y-1 font-display text-2xl text-white sm:text-3xl">
          <span className="text-muted">Building with</span>
          <span className="relative inline-block h-[1.4em] overflow-hidden align-bottom">
            <span
              ref={wordRef}
              className="inline-block whitespace-nowrap font-semibold text-voltage"
            >
              AI Systems
            </span>
          </span>
        </div>

        <div className="hero-fade mt-10 flex flex-wrap items-center gap-5">
          <motion.a
            href="#work"
            onClick={sounds.tap}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="rounded-full bg-voltage px-8 py-3.5 font-display text-base font-semibold text-on-accent"
          >
            View work
          </motion.a>
          <motion.a
            href="#contact"
            onClick={sounds.tap}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="rounded-full border border-line px-8 py-3.5 font-display text-base font-semibold text-white hover:border-white"
          >
            Say hi
          </motion.a>
          <div className="ml-2 text-white">
            <Signature />
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: HERO_CHROME_REVEAL_DELAY, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-xs uppercase tracking-[0.3em] text-muted sm:flex"
      >
        Scroll
        <motion.span
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
          className="block h-8 w-px bg-muted"
        />
      </motion.div>
    </section>
  );
}
