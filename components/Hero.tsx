import { useRef, useState, useCallback, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";
import { motion, useReducedMotion } from "motion/react";
import { Signature } from "./Signature";
import HeroDither from "./HeroDither";
import { useSiteSounds } from "../hooks/useSiteSounds";
import { useDitherActive } from "../hooks/useDitherActive";
import { HERO_CHROME_REVEAL_DELAY } from "./animationTimings";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, SplitText);
}

const ROTATING = ["Python", "LLMs", "React", "Agents", "RAG"];
type DitherBlast = { x: number; y: number; token: number };

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const wordRef = useRef<HTMLSpanElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const sounds = useSiteSounds();
  const prefersReducedMotion = useReducedMotion();
  const { shouldRun: ditherActive } = useDitherActive(root);
  const [ditherBlast, setDitherBlast] = useState<DitherBlast>({
    x: 0.5,
    y: 0.5,
    token: 0,
  });
  const [blastCount, setBlastCount] = useState(0);
  const [pixelArtVisible, setPixelArtVisible] = useState(false);

  useEffect(() => {
    if (blastCount < 5) return;

    const reveal = window.setTimeout(() => setPixelArtVisible(true), 520);
    const hide = window.setTimeout(() => {
      setPixelArtVisible(false);
      setBlastCount(0);
    }, 2520);

    return () => {
      window.clearTimeout(reveal);
      window.clearTimeout(hide);
    };
  }, [blastCount]);

  const handleDitherPointerDown = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      if (!ditherActive || pixelArtVisible || blastCount >= 5) return;

      const bounds = event.currentTarget.getBoundingClientRect();
      setBlastCount((count) => count + 1);
      setDitherBlast((blast) => ({
        x: (event.clientX - bounds.left) / bounds.width,
        y: (event.clientY - bounds.top) / bounds.height,
        token: blast.token + 1,
      }));
    },
    [blastCount, ditherActive, pixelArtVisible],
  );

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
        gsap.set(contentRef.current, { autoAlpha: 1 });
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
              ease: "expo.out",
              delay: 1.4,
            });
        });
      } else {
        gsap.set(contentRef.current, { autoAlpha: 1 });
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
      className="relative min-h-screen w-full overflow-hidden px-6 pt-32 sm:px-10 lg:px-16"
      onPointerDown={handleDitherPointerDown}
    >
      <HeroDither
        active={ditherActive}
        blast={ditherBlast}
        pixelArtVisible={pixelArtVisible}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_28%_42%,rgb(var(--color-body)/0.92),rgb(var(--color-body)/0.55)_55%,transparent_78%)]"
      />
      <div
        ref={contentRef}
        className="opacity-0 pointer-events-none relative z-10 mx-auto flex min-h-[calc(100vh-12rem)] max-w-container flex-col justify-center"
      >
        <h1
          ref={headingRef}
          className="hero-title font-display text-fluid-xl font-semibold leading-[0.92] tracking-tightest text-white drop-shadow-[0_2px_20px_rgb(var(--color-body)/0.85)]"
        >
          Aaryan
          <br />
          <span className="text-stroke">Porwal</span>
        </h1>

        <div className="hero-fade mt-8 max-w-2xl font-sans text-lg text-muted sm:text-2xl">
          <p>
            I build software with care and curiosity. Interfaces, systems, and
            tools that feel good to use.
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
          <a
            href="#work"
            onClick={sounds.tap}
            className="pointer-events-auto rounded-full bg-voltage px-8 py-3.5 font-display text-base font-semibold text-on-accent transition-transform duration-press ease-out-strong active:scale-[0.97] [@media(hover:hover)_and_(pointer:fine)]:hover:scale-[1.02] motion-reduce:hover:scale-100"
          >
            View work
          </a>
          <a
            href="#contact"
            onClick={sounds.tap}
            className="pointer-events-auto rounded-full border border-line px-8 py-3.5 font-display text-base font-semibold text-white transition-[transform,border-color] duration-press ease-out-strong active:scale-[0.97] hover:border-white [@media(hover:hover)_and_(pointer:fine)]:hover:scale-[1.02] motion-reduce:hover:scale-100"
          >
            Say hi
          </a>
          <div className="hero-signature pointer-events-none ml-2">
            <Signature />
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={
          prefersReducedMotion
            ? { duration: 0 }
            : { delay: HERO_CHROME_REVEAL_DELAY, duration: 0.8 }
        }
        className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 text-xs uppercase tracking-[0.3em] text-muted sm:flex"
      >
        Scroll
        <motion.span
          animate={prefersReducedMotion ? undefined : { y: [0, 8, 0] }}
          transition={
            prefersReducedMotion
              ? undefined
              : { repeat: Infinity, duration: 1.6, ease: "easeInOut" }
          }
          className="block h-8 w-px bg-muted"
        />
      </motion.div>
    </section>
  );
}
