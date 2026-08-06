import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { borderReveal } from "./animation/sectionReveal";
import { WebringEmbed } from "./WebringEmbed";

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
  const root = useRef<HTMLElement>(null);
  const borderRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      borderReveal(borderRef.current, { start: "top 95%" });
    },
    { scope: root },
  );

  return (
    <footer
      ref={root}
      className="relative w-full bg-body px-6 pb-10 pt-6 sm:px-10 lg:px-16"
    >
      <div className="relative mx-auto max-w-container pt-8">
        <div
          ref={borderRef}
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-px origin-left bg-line"
        />
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <ul className="flex flex-wrap gap-x-8 gap-y-3 font-sans text-base">
            {SOCIALS.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block text-muted outline-none transition-[transform,color] duration-200 ease-out-strong active:scale-[0.97] hover:text-voltage focus-visible:text-voltage"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="flex flex-col items-start gap-4 sm:items-end">
            <WebringEmbed />
            <p className="font-sans text-sm text-muted">
              &copy; {new Date().getFullYear()} Aaryan Porwal. Built with Astro,
              GSAP, and Bun.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
