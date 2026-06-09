import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "motion/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger);
}

const PROJECTS = [
  {
    tag: "Open Source",
    title: "GitHub Repositories",
    desc: "A growing collection of libraries, tools, and experiments — built in the open.",
    href: "https://github.com/aaryanporwal?tab=repositories",
  },
  {
    tag: "Writing",
    title: "The Blog",
    desc: "Long-form thoughts on web engineering, Node.js, and shipping resilient systems.",
    href: "https://blog.aaryanporwal.com/",
  },
  {
    tag: "Tinkering",
    title: "Scrapbook",
    desc: "A daily log of what I'm hacking on — small wins, big experiments, and everything between.",
    href: "https://scrapbook.hackclub.com/aaryan",
  },
  {
    tag: "Infra / DevOps",
    title: "Cloud & Pipelines",
    desc: "CI/CD, containers, and infrastructure that lets products scale without drama.",
    href: "https://github.com/aaryanporwal?tab=repositories",
  },
  {
    tag: "Let's talk",
    title: "Work With Me",
    desc: "Have something ambitious in mind? Let's build something award-worthy together.",
    href: "#contact",
  },
];

export default function Work() {
  const root = useRef(null);
  const trackRef = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
        () => {
          const track = trackRef.current;
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
            whileHover={{ y: -10 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
            className="group relative flex w-full flex-col justify-between overflow-hidden rounded-3xl border border-line bg-surface p-8 md:h-[60vh] md:w-[34rem] md:p-10"
          >
            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-electric/0 blur-3xl transition-all duration-500 group-hover:bg-electric/30" />
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm text-muted">
                0{i + 1}
              </span>
              <span className="rounded-full border border-line px-4 py-1.5 font-sans text-xs uppercase tracking-widest text-muted">
                {p.tag}
              </span>
            </div>

            <div className="relative mt-10">
              <h3 className="font-display text-4xl font-semibold leading-tight text-white md:text-5xl">
                {p.title}
              </h3>
              <p className="mt-5 max-w-sm font-sans text-base text-muted md:text-lg">
                {p.desc}
              </p>
              <div className="mt-8 inline-flex items-center gap-2 font-display text-base font-semibold text-acid">
                Explore
                <span className="transition-transform duration-300 group-hover:translate-x-1.5">
                  →
                </span>
              </div>
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
}
