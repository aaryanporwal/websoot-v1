import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type SectionRevealOptions = {
  trigger?: Element | string | null;
  start?: string;
  stagger?: number;
  y?: number;
  duration?: number;
};

export function sectionReveal(
  targets: gsap.DOMTarget,
  options: SectionRevealOptions = {},
) {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) return;

  const items = gsap.utils.toArray<HTMLElement>(targets);
  if (!items.length) return;

  const trigger = options.trigger ?? items[0];

  gsap.from(items, {
    y: options.y ?? 16,
    opacity: 0,
    duration: options.duration ?? 0.55,
    stagger: options.stagger ?? 0.05,
    ease: "expo.out",
    scrollTrigger: {
      trigger,
      start: options.start ?? "top 88%",
      once: true,
    },
  });
}

export function borderReveal(
  el: HTMLElement | null,
  options: { start?: string } = {},
) {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !el) return;

  gsap.fromTo(
    el,
    { scaleX: 0 },
    {
      scaleX: 1,
      duration: 0.6,
      ease: "expo.out",
      scrollTrigger: {
        trigger: el,
        start: options.start ?? "top 92%",
        once: true,
      },
    },
  );
}
