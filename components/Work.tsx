import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "motion/react";
import { useSiteSounds } from "../hooks/useSiteSounds";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger);
}

const PROJECTS = [
  {
    tag: "Full Stack",
    title: "Fused",
    desc: "Architected an AI-assisted inline diff review with CodeMirror 6, built full-stack Git version control, and redesigned File Explorer for 10K+ file trees.",
    cta: "fused.io",
    href: "https://fused.io",
    image: "/works/fused.png",
  },
  {
    tag: "Open Source",
    title: "Canonical",
    desc: "Built React components for ubuntu.com's design system (Vanilla Framework), a browser-based debugging environment for Anbox Cloud, and real-time Android Automotive sensor simulation.",
    cta: "ubuntu.com",
    href: "https://ubuntu.com",
    image: "/works/canonical.png",
  },
  {
    tag: "Open Source",
    title: "GSoC",
    desc: "Implemented visual regression testing for Ceph Dashboard using Applitools Eyes and Cypress, catching 15+ UI defects monthly and accelerating feature releases.",
    cta: "View on GitHub",
    href: "https://github.com/ceph/ceph",
    image: "/works/gsoc.png",
  },
  {
    tag: "Community",
    title: "Hack Club",
    desc: "Published 3 technical workshops on Node.js, DevOps, and HTML5 Canvas. Delivered a live workshop at Figma HQ on building CLI applications with Node.js.",
    cta: "hackclub.com",
    href: "https://hackclub.com",
    image: "/works/hackclub.png",
  },
  {
    tag: "Event",
    title: "Ubuntu Summit",
    desc: "Built the official Ubuntu Summit 2024 website using Flask, supporting event infrastructure for 5,000+ attendees across a 3-day conference in The Hague.",
    cta: "Read more",
    href: "https://ubuntu.com/blog/tag/ubuntu-summit-2024",
    image: "/works/ubuntu-summit.png",
  },
];

export default function Work() {
  const root = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const sounds = useSiteSounds();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
        () => {
          const track = trackRef.current;
          if (!track) return;
          const amount = () => track.scrollWidth - window.innerWidth;

          gsap.to(track, {
            x: () => -amount(),
            ease: "none",
            scrollTrigger: {
              trigger: root.current,
              start: "top top",
              end: () => "+=" + amount(),
              pin: true,
              scrub: 1,
              invalidateOnRefresh: true,
            },
          });
        }
      );

      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      id="work"
      className="relative w-full overflow-hidden bg-ink py-24 md:py-0"
    >
      <div className="flex items-end justify-between px-6 pb-12 pt-8 sm:px-10 md:pt-28 lg:px-16">
        <h2 className="font-display text-fluid-md font-semibold leading-none tracking-tightest text-white">
          Selected
          <br />
          <span className="text-stroke">Work</span>
        </h2>
        <span className="hidden font-sans text-sm uppercase tracking-[0.3em] text-muted md:block">
          Scroll →
        </span>
      </div>

      <div
        ref={trackRef}
        className="flex flex-col gap-6 px-6 pb-8 sm:px-10 md:w-max md:flex-row md:flex-nowrap md:items-stretch md:gap-8 md:px-16"
      >
        {PROJECTS.map((p, i) => (
          <motion.a
            key={p.title}
            href={p.href}
            target={p.href.startsWith("#") ? undefined : "_blank"}
            rel={p.href.startsWith("#") ? undefined : "noreferrer"}
            onClick={sounds.tap}
            whileHover={{ y: -10 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
            className="group relative flex w-full flex-col overflow-hidden rounded-3xl border border-line bg-surface md:w-[34rem]"
          >
            <div className="relative h-48 shrink-0 overflow-hidden md:h-56">
              <img
                src={p.image}
                alt={p.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            <div className="flex flex-1 flex-col justify-between p-8 md:p-10">
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm text-muted">
                  0{i + 1}
                </span>
                <span className="rounded-full border border-line px-4 py-1.5 font-sans text-xs uppercase tracking-widest text-white">
                  {p.tag}
                </span>
              </div>

              <div className="relative mt-6">
                <h3 className="font-display text-4xl font-semibold leading-tight text-white md:text-5xl">
                  {p.title}
                </h3>
                <p className="mt-5 max-w-sm font-sans text-base text-muted md:text-lg">
                  {p.desc}
                </p>
                <div className="mt-8 inline-flex items-center gap-2 font-display text-base font-semibold text-voltage">
                  {p.cta}
                  <span className="transition-transform duration-300 group-hover:translate-x-1.5">
                    →
                  </span>
                </div>
              </div>
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
}
