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
const EMAIL = "aaryanporwal2233@gmail.com";

const SOCIALS = [
  { label: "Twitter", href: TWITTER_URL },
  { label: "LinkedIn", href: LINKEDIN_URL },
  { label: "GitHub", href: GITHUB_URL },
  { label: "E-mail", href: `mailto:${EMAIL}` },
];

export function Footer() {
  const root = useRef(null);

  useGSAP(
    () => {
      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
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
    { scope: root }
  );

  return (
    <footer
      ref={root}
      id="contact"
      className="relative w-full overflow-hidden bg-body px-6 pb-12 pt-32 sm:px-10 lg:px-16"
    >
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-[40rem] w-[40rem] -translate-x-1/2 rounded-full bg-electric/15 blur-[150px]" />
      <LottieAccent className="pointer-events-none absolute right-8 top-16 h-24 w-24 opacity-80 sm:right-20 sm:h-36 sm:w-36" />

      <div className="relative mx-auto max-w-container">
        <p className="contact-reveal mb-8 flex items-center gap-4 font-sans text-xs uppercase tracking-[0.3em] text-muted sm:text-sm">
          <span className="inline-block h-px w-10 bg-acid" />
          Got a project?
        </p>

        <h2 className="contact-reveal font-display text-fluid-lg font-semibold leading-[0.9] tracking-tightest text-white">
          Let&apos;s build
          <br />
          <span className="animated-gradient">something bold.</span>
        </h2>

        <div className="contact-reveal mt-12">
          <motion.a
            href={`mailto:${EMAIL}`}
            whileHover={{ x: 8 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="inline-flex items-center gap-4 font-display text-2xl font-medium text-white underline decoration-acid decoration-2 underline-offset-8 sm:text-4xl"
          >
            {EMAIL}
            <span aria-hidden>↗</span>
          </motion.a>
        </div>

        <div className="contact-reveal mt-20 flex flex-col gap-8 border-t border-line pt-10 sm:flex-row sm:items-center sm:justify-between">
          <ul className="flex flex-wrap gap-x-8 gap-y-3 font-sans text-base">
            {SOCIALS.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target={s.href.startsWith("mailto") ? undefined : "_blank"}
                  rel={s.href.startsWith("mailto") ? undefined : "noreferrer"}
                  className="text-muted transition-colors hover:text-acid"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
          <p className="font-sans text-sm text-muted">
            © {new Date().getFullYear()} Aaryan Porwal — Built with Next.js, GSAP
            & Bun.
          </p>
        </div>
      </div>
    </footer>
  );
}
