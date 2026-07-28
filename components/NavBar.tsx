import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { useSiteSounds } from "../hooks/useSiteSounds";
import { HERO_CHROME_REVEAL_DELAY } from "./animationTimings";
import { PaletteIcon } from "./theme/ThemeMenu";

const BLOG_URL = "/blog/";
const LINKEDIN_URL = "https://www.linkedin.com/in/aaryan-porwal/";
const SCRAPBOOK_URL = "https://scrapbook.hackclub.com/aaryan";
const PROJECTS_URL = "https://github.com/aaryanporwal?tab=repositories";

const LINKS = [
  { label: "Work", href: "#work", sectionId: "work" },
  { label: "GitHub", href: PROJECTS_URL, external: true },
  { label: "Scrapbook", href: SCRAPBOOK_URL, external: true },
  { label: "Blog", href: BLOG_URL },
];

type Props = {
  onOpenTheme: () => void;
};

function openCommandSwitcher() {
  window.dispatchEvent(new CustomEvent("command-switcher:open"));
}

export default function NavBar({ onOpenTheme }: Props) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [heroVisible, setHeroVisible] = useState(true);
  const [activeSection, setActiveSection] = useState("");
  const sounds = useSiteSounds();
  const prefersReducedMotion = useReducedMotion();

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

  useEffect(() => {
    const sectionIds = ["about", "work", "skills", "contact"];
    const onScroll = () => {
      const marker = window.innerHeight * 0.35;
      let current = "";

      for (const id of sectionIds) {
        const section = document.getElementById(id);
        if (section && section.getBoundingClientRect().top <= marker) {
          current = id;
        }
      }

      setActiveSection(current);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={prefersReducedMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={
        prefersReducedMotion
          ? { duration: 0 }
          : { delay: HERO_CHROME_REVEAL_DELAY, duration: 0.5 }
      }
      className="fixed inset-x-0 top-0 z-50"
    >
      <div
        className={`transition-[border-color,background-color,backdrop-filter] duration-300 ease-out-strong ${
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
            className={`font-display text-2xl font-bold tracking-tightest text-white transition-opacity duration-200 ease-out-strong sm:text-3xl ${
              heroVisible
                ? "pointer-events-none opacity-0"
                : "pointer-events-auto opacity-100"
            }`}
          >
            <span className="font-semibold text-white">Aaryan Porwal</span>
          </a>

          <nav className="hidden items-center gap-9 font-sans text-sm font-medium md:flex">
            {LINKS.map((l) => {
              const isActive =
                "sectionId" in l && l.sectionId === activeSection;

              return (
              <a
                key={l.label}
                href={l.href}
                target={l.external ? "_blank" : undefined}
                rel={l.external ? "noreferrer" : undefined}
                onClick={sounds.tap}
                aria-current={isActive ? "page" : undefined}
                className={`group relative transition-colors duration-200 ease-out-strong ${
                  isActive ? "text-white" : "text-muted hover:text-white"
                }`}
              >
                {l.label}
                <span
                  className={`absolute -bottom-1 left-0 h-px bg-voltage transition-[width] duration-200 ease-out-strong ${
                    isActive
                      ? "w-full"
                      : "w-0 [@media(hover:hover)_and_(pointer:fine)]:group-hover:w-full"
                  }`}
                />
              </a>
            );
            })}
            <button
              type="button"
              aria-label="Open theme menu"
              onClick={() => {
                sounds.tap();
                onOpenTheme();
              }}
              className="grid h-8 w-8 place-items-center rounded-md border border-line bg-surface/30 text-muted transition-[transform,border-color,color] duration-press ease-out-strong active:scale-[0.97] hover:border-voltage hover:text-voltage focus-visible:border-voltage focus-visible:text-voltage focus-visible:outline-none"
            >
              <PaletteIcon />
            </button>
            <button
              type="button"
              aria-label="Open command switcher"
              onClick={() => {
                sounds.tap();
                openCommandSwitcher();
              }}
              className="rounded-md border border-line bg-surface/30 px-2.5 py-1 font-sans text-[11px] font-semibold text-muted transition-[transform,border-color,color] duration-press ease-out-strong active:scale-[0.97] hover:border-voltage hover:text-voltage focus-visible:border-voltage focus-visible:text-voltage"
            >
              ⌘K
            </button>
            <a
              href="#contact"
              onClick={sounds.tap}
              aria-current={activeSection === "contact" ? "page" : undefined}
              className={`rounded-full px-6 py-2.5 font-display font-semibold transition-[transform,box-shadow] duration-press ease-out-strong active:scale-[0.97] [@media(hover:hover)_and_(pointer:fine)]:hover:scale-[1.02] ${
                activeSection === "contact"
                  ? "bg-voltage text-on-accent shadow-[0_0_0_2px_rgb(var(--color-accent)/0.35)]"
                  : "bg-white text-body"
              }`}
            >
              Contact
            </a>
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
              transition={prefersReducedMotion ? { duration: 0 } : undefined}
              className="block h-0.5 w-7 bg-white"
            />
            <motion.span
              animate={open ? { opacity: 0 } : { opacity: 1 }}
              transition={prefersReducedMotion ? { duration: 0 } : undefined}
              className="block h-0.5 w-7 bg-white"
            />
            <motion.span
              animate={open ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
              transition={prefersReducedMotion ? { duration: 0 } : undefined}
              className="block h-0.5 w-7 bg-white"
            />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={
              prefersReducedMotion
                ? { duration: 0 }
                : { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
            }
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
                  initial={
                    prefersReducedMotion ? false : { opacity: 0, x: -20 }
                  }
                  animate={{ opacity: 1, x: 0 }}
                  transition={
                    prefersReducedMotion ? { duration: 0 } : { delay: 0.06 * i }
                  }
                  className="border-b border-line/60 py-4 font-display text-3xl font-medium text-white"
                >
                  {l.label}
                </motion.a>
              ))}
              <button
                type="button"
                onClick={() => {
                  sounds.tap();
                  setOpen(false);
                  onOpenTheme();
                }}
                className="flex items-center justify-between border-b border-line/60 py-4 text-left font-display text-3xl font-medium text-white"
              >
                Theme
                <PaletteIcon className="h-6 w-6" />
              </button>
              <a
                href="#contact"
                onClick={() => {
                  sounds.tap();
                  setOpen(false);
                }}
                className="mt-5 rounded-full bg-voltage px-6 py-3 text-center font-display text-lg font-semibold text-on-accent transition-transform duration-press ease-out-strong active:scale-[0.97]"
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
