import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";
import { motion } from "motion/react";
import { Signature } from "./Signature";
import LottieAccent from "./LottieAccent";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, SplitText);
}

const ROTATING = ["Next.js", "Node.js", "Postgres", "Docker", "CI/CD"];

export default function Hero() {
  const root = useRef(null);
  const headingRef = useRef(null);
  const wordRef = useRef(null);

  useGSAP(
    () => {
      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      let split;

      if (!reduce) {
        // Headline character reveal.
        split = new SplitText(headingRef.current, {
          type: "chars,lines",
          linesClass: "overflow-hidden",
        });
        gsap.set(headingRef.current, { autoAlpha: 1 });
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
        gsap.set(headingRef.current, { autoAlpha: 1 });
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
      {/* Lottie ring accent */}
      <LottieAccent className="pointer-events-none absolute right-6 top-28 h-28 w-28 opacity-90 sm:right-16 sm:top-32 sm:h-40 sm:w-40 lg:h-52 lg:w-52" />

      <div className="relative mx-auto flex min-h-[calc(100vh-12rem)] max-w-container flex-col justify-center">
        {/* <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="hero-fade mb-6 flex items-center gap-3 font-sans text-xs uppercase tracking-[0.3em] text-muted sm:text-sm"
        >
          <span className="inline-block h-px w-10 bg-voltage" />
          Personal Site — Web Engineer
        </motion.p> */}

        <h1
          ref={headingRef}
          className="invisible font-display text-fluid-xl font-semibold leading-[0.92] tracking-tightest text-white"
        >
          Aaryan
          <br />
          <span className="text-stroke">Porwal</span>
        </h1>

        <div className="hero-fade mt-8 max-w-2xl font-sans text-lg text-muted sm:text-2xl">
          <p>
            I build web products that load fast and hold up under load.
            Interfaces, the APIs behind them, and the boring infra in between.
            My cat Anya runs my schedule.
          </p>
        </div>

        <div className="hero-fade mt-6 flex flex-wrap items-baseline gap-x-3 gap-y-1 font-display text-2xl text-white sm:text-3xl">
          <span className="text-muted">Building with</span>
          <span className="relative inline-block h-[1.4em] overflow-hidden align-bottom">
            <span
              ref={wordRef}
              className="inline-block whitespace-nowrap font-semibold text-voltage"
            >
              Web Development
            </span>
          </span>
        </div>

        <div className="hero-fade mt-10 flex flex-wrap items-center gap-5">
          <motion.a
            href="#work"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="rounded-full bg-voltage px-8 py-3.5 font-display text-base font-semibold text-body"
          >
            View work
          </motion.a>
          <motion.a
            href="#contact"
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
        transition={{ delay: 1.4, duration: 0.8 }}
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
