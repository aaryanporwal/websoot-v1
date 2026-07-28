import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { ResolvedPicture } from "../src/lib/resolvePicture";
import type { WorkProjectPicture } from "../src/types/homeImages";
import { useSiteSounds } from "../hooks/useSiteSounds";
import { sectionReveal } from "./animation/sectionReveal";
import ResponsivePicture from "./ResponsivePicture";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger);
}

type Props = {
  projects: WorkProjectPicture[];
};

const WORK_IMAGE_SIZES = "(min-width: 768px) 34rem, 100vw";

function getPreferredSrcSet(picture: ResolvedPicture) {
  return (
    picture.sources.find((source) => source.type === "image/avif")?.srcSet ??
    picture.sources.find((source) => source.type === "image/webp")?.srcSet ??
    picture.fallbackSrc
  );
}

function preloadWorkImages(projects: WorkProjectPicture[]) {
  return Promise.all(
    projects.map(
      (project) =>
        new Promise<void>((resolve) => {
          const img = new Image();
          const srcSet = getPreferredSrcSet(project.picture);

          img.sizes = WORK_IMAGE_SIZES;
          if (srcSet.includes(" ")) {
            img.srcset = srcSet;
            img.src = srcSet.split(",")[0]?.trim().split(/\s+/)[0] ?? project.picture.fallbackSrc;
          } else {
            img.src = srcSet;
          }

          if (img.complete) {
            resolve();
            return;
          }

          img.addEventListener("load", () => resolve(), { once: true });
          img.addEventListener("error", () => resolve(), { once: true });
        }),
    ),
  );
}

function revealWorkImage(img: HTMLImageElement) {
  if (img.dataset.revealed === "true") return;
  img.dataset.revealed = "true";

  gsap.to(img, {
    clipPath: "inset(0 0 0 0)",
    duration: 0.55,
    ease: "expo.out",
    overwrite: true,
  });
}

function bindWorkImageReveal(figure: HTMLElement) {
  const img = figure.querySelector<HTMLImageElement>(".work-card-media__img");
  if (!img) return;

  const runReveal = () => {
    if (img.dataset.revealed === "true") return;
    if (img.complete && img.naturalWidth > 0) {
      revealWorkImage(img);
      return;
    }
    img.addEventListener("load", () => revealWorkImage(img), { once: true });
  };

  ScrollTrigger.create({
    trigger: figure,
    start: "top 88%",
    once: true,
    onEnter: runReveal,
  });
}

function bindHorizontalWorkReveals(figures: HTMLElement[]) {
  const revealVisibleCards = () => {
    for (const figure of figures) {
      const rect = figure.getBoundingClientRect();
      const inView = rect.left < window.innerWidth * 0.98 && rect.right > window.innerWidth * 0.02;
      if (!inView) continue;

      const img = figure.querySelector<HTMLImageElement>(".work-card-media__img");
      if (img) revealWorkImage(img);
    }
  };

  return revealVisibleCards;
}

export default function Work({ projects }: Props) {
  const root = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const sounds = useSiteSounds();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        void preloadWorkImages(projects).then(() => {
          sectionReveal(".work-section-reveal", { trigger: root.current });

          const figures = gsap.utils.toArray<HTMLElement>(".work-card-media");
          figures.forEach(bindWorkImageReveal);
          const revealVisibleCards = bindHorizontalWorkReveals(figures);
          revealVisibleCards();
        });
      });

      mm.add(
        "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
        () => {
          const track = trackRef.current;
          if (!track) return;
          const amount = () => track.scrollWidth - window.innerWidth;
          const figures = gsap.utils.toArray<HTMLElement>(".work-card-media");
          const revealVisibleCards = bindHorizontalWorkReveals(figures);

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
              onUpdate: revealVisibleCards,
            },
          });
        },
      );

      return () => mm.revert();
    },
    { scope: root, dependencies: [projects] },
  );

  return (
    <section
      ref={root}
      id="work"
      className="relative w-full overflow-hidden bg-ink py-24 md:pt-0 md:pb-12"
    >
      <div className="flex items-end justify-between px-6 pb-10 pt-8 sm:px-10 md:pt-20 lg:px-16">
        <h2 className="font-display text-fluid-md font-semibold leading-none tracking-tightest text-white">
          <span className="work-section-reveal block">Featured</span>
          <span className="work-section-reveal block text-stroke">Work</span>
        </h2>
        <span className="work-section-reveal hidden font-sans text-sm uppercase tracking-[0.3em] text-muted md:block">
          Scroll →
        </span>
      </div>

      <div
        ref={trackRef}
        className="flex flex-col gap-6 px-6 pb-8 sm:px-10 md:w-max md:flex-row md:flex-nowrap md:items-stretch md:gap-8 md:px-16"
      >
        {projects.map((p, i) => (
          <article
            key={p.title}
            className="group relative flex w-full flex-col overflow-hidden rounded-3xl border border-line bg-surface transition-[transform,border-color] duration-300 ease-out-strong [@media(hover:hover)_and_(pointer:fine)]:hover:-translate-y-2.5 [@media(hover:hover)_and_(pointer:fine)]:hover:border-white/15 motion-reduce:hover:translate-y-0 md:w-[34rem]"
          >
            <figure className="work-card-media relative h-40 shrink-0 overflow-hidden md:h-56">
              <ResponsivePicture
                picture={p.picture}
                alt={`${p.title} project preview`}
                loading="eager"
                fetchPriority={i === 0 ? "high" : "auto"}
                sizes={WORK_IMAGE_SIZES}
                imgClassName="work-card-media__img h-full w-full object-cover transition-transform duration-300 ease-out-strong [@media(hover:hover)_and_(pointer:fine)]:group-hover:scale-[1.03] motion-reduce:group-hover:scale-100"
                className="block h-full w-full"
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
                <div className="flex items-center gap-4">
                  <img
                    src={p.logo}
                    alt={`${p.title} logo`}
                    width={44}
                    height={44}
                    loading="eager"
                    decoding="async"
                    className="h-11 w-11 shrink-0 rounded-xl object-contain"
                  />
                  <h3 className="font-display text-3xl font-semibold leading-tight text-white md:text-4xl">
                    {p.title}
                  </h3>
                </div>
                <p className="mt-3 max-w-sm font-sans text-sm text-muted md:text-base">
                  {p.desc}
                </p>
                <a
                  href={p.href}
                  target={p.href.startsWith("#") ? undefined : "_blank"}
                  rel={p.href.startsWith("#") ? undefined : "noreferrer"}
                  onClick={sounds.tap}
                  className="mt-6 inline-flex items-center gap-2 font-display text-sm font-semibold text-voltage transition-transform duration-200 ease-out-strong active:scale-[0.97] [@media(hover:hover)_and_(pointer:fine)]:hover:translate-x-1.5"
                >
                  {p.cta}
                  <span>→</span>
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>
      <div aria-hidden="true" className="hidden md:block md:h-16" />
    </section>
  );
}
