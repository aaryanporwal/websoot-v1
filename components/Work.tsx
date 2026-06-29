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
    desc: "Shaped an AI-assisted inline diff review in CodeMirror 6, built full-stack Git version control, and made 10K+ file trees easier to navigate.",
    cta: "fused.io",
    href: "https://fused.io",
    image: "/works/fused.png",
  },
  {
    tag: "Open Source",
    title: "Canonical",
    desc: "Built React components for ubuntu.com's Vanilla Framework, a browser debugging environment for Anbox Cloud, and real-time Android Automotive sensor simulation.",
    cta: "ubuntu.com",
    href: "https://ubuntu.com",
    image: "/works/canonical.png",
  },
  {
    tag: "Open Source",
    title: "GSoC",
    desc: "Added visual regression testing to Ceph Dashboard with Applitools Eyes and Cypress, catching 15+ UI defects a month before they reached users.",
    cta: "View on GitHub",
    href: "https://github.com/ceph/ceph",
    image: "/works/gsoc.png",
  },
  {
    tag: "Community",
    title: "Hack Club",
    desc: "Published 3 technical workshops on Node.js, DevOps, and HTML5 Canvas, then taught CLI application building live at Figma HQ.",
    cta: "hackclub.com",
    href: "https://hackclub.com",
    image: "/works/hackclub.png",
  },
  {
    tag: "Event",
    title: "Ubuntu Summit",
    desc: "Built the official Ubuntu Summit 2024 site in Flask for a 5,000+ attendee, 3-day conference in The Hague.",
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
        },
      );

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="work"
      className="relative w-full overflow-hidden bg-ink py-24 md:pt-0 md:pb-12"
    >
      <div className="flex items-end justify-between px-6 pb-10 pt-8 sm:px-10 md:pt-20 lg:px-16">
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
          <motion.article
            key={p.title}
            whileHover={{ y: -10 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
            className="group relative flex w-full flex-col overflow-hidden rounded-3xl border border-line bg-surface md:w-[34rem]"
          >
            <figure className="relative h-40 shrink-0 overflow-hidden md:h-56">
              <img
                src={p.image}
                alt={p.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </figure>

            <div className="flex flex-col justify-between p-6 md:p-8">
              <header className="flex items-center justify-between">
                <span className="font-mono text-sm text-muted">0{i + 1}</span>
                <span className="rounded-full border border-line px-4 py-1.5 font-sans text-xs uppercase tracking-widest text-white">
                  {p.tag}
                </span>
              </header>

              <div className="relative mt-4">
                <h3 className="font-display text-3xl font-semibold leading-tight text-white md:text-4xl">
                  {p.title}
                </h3>
                <p className="mt-3 max-w-sm font-sans text-sm text-muted md:text-base">
                  {p.desc}
                </p>
                <a
                  href={p.href}
                  target={p.href.startsWith("#") ? undefined : "_blank"}
                  rel={p.href.startsWith("#") ? undefined : "noreferrer"}
                  onClick={sounds.tap}
                  className="mt-6 inline-flex items-center gap-2 font-display text-sm font-semibold text-voltage transition-transform duration-300 hover:translate-x-1.5"
                >
                  {p.cta}
                  <span>→</span>
                </a>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
      <div aria-hidden="true" className="hidden md:block md:h-16" />
    </section>
  );
}
