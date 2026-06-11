import type { ReactNode } from "react";
import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type SmoothScrollProps = {
  children: ReactNode;
};

export default function SmoothScroll({ children }: SmoothScrollProps) {
  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Respect users who don't want motion: skip smooth scroll entirely.
    if (prefersReduced) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    // Keep ScrollTrigger in sync with Lenis' virtual scroll position.
    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    const refreshScrollTrigger = () => ScrollTrigger.refresh();
    const refreshFrame = window.requestAnimationFrame(refreshScrollTrigger);
    window.addEventListener("load", refreshScrollTrigger);

    // Anchor links should hand off to Lenis for smooth in-page navigation.
    const onAnchorClick = (e: MouseEvent) => {
      if (!(e.target instanceof Element)) return;
      const link = e.target.closest<HTMLAnchorElement>('a[href^="#"]');
      if (!link) return;
      const id = link.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector<HTMLElement>(id);
      if (!target) return;
      e.preventDefault();
      const targetY =
        target.getBoundingClientRect().top + window.scrollY - 40;

      const pinnedScrollTriggers = ScrollTrigger.getAll().filter((t) => t.pin);
      if (pinnedScrollTriggers.length > 0) {
        const pinnedEnd = Math.max(
          ...pinnedScrollTriggers.map((t) => t.end)
        );
        // Jump past the pinned section first to avoid the jarring zip
        // through its horizontal scroll, then smooth-scroll the rest.
        if (targetY > pinnedEnd && lenis.scroll < pinnedEnd) {
          lenis.scrollTo(pinnedEnd + 80, { immediate: true });
          requestAnimationFrame(() => {
            lenis.scrollTo(target, { offset: -40 });
          });
          return;
        }
      }

      lenis.scrollTo(target, { offset: -40 });
    };
    document.addEventListener("click", onAnchorClick);

    return () => {
      window.cancelAnimationFrame(refreshFrame);
      window.removeEventListener("load", refreshScrollTrigger);
      document.removeEventListener("click", onAnchorClick);
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  return children;
}
