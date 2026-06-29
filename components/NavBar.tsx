import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useSiteSounds } from "../hooks/useSiteSounds";
import { HERO_CHROME_REVEAL_DELAY } from "./animationTimings";

const BLOG_URL = "/blog/";
const LINKEDIN_URL = "https://www.linkedin.com/in/aaryan-porwal/";
const SCRAPBOOK_URL = "https://scrapbook.hackclub.com/aaryan";
const PROJECTS_URL = "https://github.com/aaryanporwal?tab=repositories";

const LINKS = [
  { label: "Work", href: "#work" },
  { label: "GitHub", href: PROJECTS_URL, external: true },
  { label: "Scrapbook", href: SCRAPBOOK_URL, external: true },
  { label: "Blog", href: BLOG_URL },
];

function openCommandSwitcher() {
  window.dispatchEvent(new CustomEvent("command-switcher:open"));
}

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [heroVisible, setHeroVisible] = useState(true);
  const sounds = useSiteSounds();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const hero = document.getElementById("top");
    if (!hero) return;

    const observer = new IntersectionObserver(
      ([entry]) => setHeroVisible(entry.isIntersecting),
      { rootMargin: "-72px 0px -55% 0px", threshold: 0 },
    );

    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: HERO_CHROME_REVEAL_DELAY, duration: 0.5 }}
      className="fixed inset-x-0 top-0 z-50"
    >
      <div
        className={`transition-all duration-500 ${
          scrolled
            ? "border-b border-line/80 bg-body/70 backdrop-blur-xl"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-container items-center justify-between px-6 py-5 sm:px-10 lg:px-16">
          <a
            href="#top"
            onClick={sounds.tap}
            aria-hidden={heroVisible}
            tabIndex={heroVisible ? -1 : undefined}
            className={`font-display text-2xl font-bold tracking-tightest text-white transition-all duration-300 sm:text-3xl ${
              heroVisible
                ? "pointer-events-none opacity-0"
                : "pointer-events-auto opacity-100"
            }`}
          >
            <span className="font-semibold text-white">Aaryan Porwal</span>
          </a>

          <nav className="hidden items-center gap-9 font-sans text-sm font-medium md:flex">
            {LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                target={l.external ? "_blank" : undefined}
                rel={l.external ? "noreferrer" : undefined}
                onClick={sounds.tap}
                className="group relative text-muted transition-colors hover:text-white"
              >
                {l.label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-voltage transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
            <button
              type="button"
              aria-label="Open command switcher"
              onClick={() => {
                sounds.tap();
                openCommandSwitcher();
              }}
              className="rounded-md border border-line bg-surface/30 px-2.5 py-1 font-sans text-[11px] font-semibold text-muted transition-colors hover:border-voltage hover:text-voltage focus-visible:border-voltage focus-visible:text-voltage focus-visible:outline-none"
            >
              ⌘K
            </button>
            <motion.a
              href="#contact"
              onClick={sounds.tap}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="rounded-full bg-white px-6 py-2.5 font-display font-semibold text-body"
            >
              Contact
            </motion.a>
          </nav>

          {/* Mobile toggle */}
          <button
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => {
              sounds.tap();
              setOpen((v) => !v);
            }}
            className="relative z-50 flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
          >
            <motion.span
              animate={open ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
              className="block h-0.5 w-7 bg-white"
            />
            <motion.span
              animate={open ? { opacity: 0 } : { opacity: 1 }}
              className="block h-0.5 w-7 bg-white"
            />
            <motion.span
              animate={open ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
              className="block h-0.5 w-7 bg-white"
            />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-b border-line bg-body/95 backdrop-blur-xl md:hidden"
          >
            <nav className="flex flex-col gap-1 px-6 py-6">
              {LINKS.map((l, i) => (
                <motion.a
                  key={l.label}
                  href={l.href}
                  target={l.external ? "_blank" : undefined}
                  rel={l.external ? "noreferrer" : undefined}
                  onClick={() => {
                    sounds.tap();
                    setOpen(false);
                  }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.06 * i }}
                  className="border-b border-line/60 py-4 font-display text-3xl font-medium text-white"
                >
                  {l.label}
                </motion.a>
              ))}
              <a
                href="#contact"
                onClick={() => {
                  sounds.tap();
                  setOpen(false);
                }}
                className="mt-5 rounded-full bg-voltage px-6 py-3 text-center font-display text-lg font-semibold text-body"
              >
                Contact
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
