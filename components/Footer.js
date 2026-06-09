import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "motion/react";
import LottieAccent from "./LottieAccent";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger);
}

const GITHUB_URL = "https://github.com/aaryanporwal";
const LINKEDIN_URL = "https://www.linkedin.com/in/aaryan-porwal/";
const TWITTER_URL = "https://twitter.com/aaryan7476";

const SOCIALS = [
  { label: "LinkedIn", href: LINKEDIN_URL },
  { label: "Twitter", href: TWITTER_URL },
  { label: "GitHub", href: GITHUB_URL },
];

export function Footer() {
  const root = useRef(null);

  useGSAP(
    () => {
      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      if (reduce) return;

      gsap.from(".contact-reveal", {
        y: 60,
        opacity: 0,
        duration: 1,
        stagger: 0.12,
        ease: "expo.out",
        scrollTrigger: {
          trigger: root.current,
          start: "top 75%",
        },
      });
    },
    { scope: root },
  );

  return (
    <footer
      ref={root}
      id="contact"
      className="relative w-full overflow-hidden bg-body px-6 pb-12 pt-32 sm:px-10 lg:px-16"
    >
      <LottieAccent className="pointer-events-none absolute right-8 top-16 h-24 w-24 opacity-80 sm:right-20 sm:h-36 sm:w-36" />

      <div className="relative mx-auto max-w-container">
        <h2 className="contact-reveal font-display text-fluid-lg font-semibold leading-[0.9] tracking-tightest text-white">
          Let&apos;s build
          <br />
          <span className="text-white">something bold.</span>
        </h2>

        <div className="contact-reveal mt-12">
          <motion.a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noreferrer"
            whileHover={{ x: 8 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="inline-flex items-center gap-4 font-display text-2xl font-medium text-white underline decoration-voltage decoration-2 underline-offset-8 sm:text-4xl"
          >
            Connect on LinkedIn
            <span aria-hidden>↗</span>
          </motion.a>
        </div>

        <div className="contact-reveal mt-20 flex flex-col gap-8 border-t border-line pt-10 sm:flex-row sm:items-center sm:justify-between">
          <ul className="flex flex-wrap gap-x-8 gap-y-3 font-sans text-base">
            {SOCIALS.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-muted transition-colors hover:text-voltage"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
          <p className="font-sans text-sm text-muted">
            &copy; {new Date().getFullYear()} Aaryan Porwal. Built with
            Next.js, GSAP, and Bun.
          </p>
        </div>
      </div>
    </footer>
  );
}
