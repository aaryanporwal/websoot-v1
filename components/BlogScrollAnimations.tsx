import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger);
}

export default function BlogScrollAnimations() {
  useGSAP(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const posts = gsap.utils.toArray<HTMLElement>(".blog-post-item");
    if (!posts.length) return;

    gsap.from(posts, {
      y: 12,
      opacity: 0,
      duration: 0.45,
      stagger: 0.05,
      ease: "expo.out",
      scrollTrigger: {
        trigger: posts[0],
        start: "top 92%",
        once: true,
      },
    });
  });

  return null;
}
