import Image from "next/image";
import type { KeyboardEvent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import { CustomWiggle } from "gsap/CustomWiggle";
import { CustomEase } from "gsap/CustomEase";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useSiteSounds } from "../hooks/useSiteSounds";

if (typeof window !== "undefined") {
  gsap.registerPlugin(
    useGSAP,
    Draggable,
    InertiaPlugin,
    CustomWiggle,
    CustomEase,
    ScrollTrigger,
  );
  if (!CustomEase.get("treatShake")) {
    CustomWiggle.create("treatShake", { wiggles: 8, type: "easeOut" });
  }
}

const LINKEDIN_URL = "https://www.linkedin.com/in/aaryan-porwal/";
const CAL_URL = "https://cal.com/aaryan";
const EMAIL = "aaryan@aaryanporwal.com";

const STATE = {
  IDLE: "idle",
  ALERT: "alert",
  APPROVED: "approved",
} as const;

type Phase = (typeof STATE)[keyof typeof STATE];

type TreatBagSVGProps = {
  className?: string;
};

function TreatBagSVG({ className }: TreatBagSVGProps) {
  return (
    <svg
      viewBox="0 0 140 170"
      className={className}
      aria-hidden
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="bagBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1A1A22" />
          <stop offset="100%" stopColor="#0E0E14" />
        </linearGradient>
      </defs>
      {/* Drawstring tied ears */}
      <path
        d="M44 28 Q 50 8 70 16 Q 90 8 96 28"
        stroke="#C6FF3D"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      <circle cx="70" cy="22" r="4" fill="#C6FF3D" />
      {/* Bag body */}
      <path
        d="M30 36 Q 70 28 110 36 L 122 150 Q 70 162 18 150 Z"
        fill="url(#bagBody)"
        stroke="#23232E"
        strokeWidth="1.5"
      />
      {/* Cinch */}
      <path
        d="M30 38 Q 70 46 110 38"
        stroke="#23232E"
        strokeWidth="1.5"
        fill="none"
      />
      {/* Fish glyph */}
      <g transform="translate(70 96)">
        <path
          d="M -22 0 Q -10 -14 6 -10 L 14 -16 L 14 16 L 6 10 Q -10 14 -22 0 Z"
          fill="#C6FF3D"
        />
        <circle cx="-6" cy="-3" r="1.6" fill="#08080B" />
      </g>
      {/* Label */}
      <text
        x="70"
        y="134"
        textAnchor="middle"
        fontFamily="'Clash Display', Inter, sans-serif"
        fontWeight="600"
        fontSize="11"
        letterSpacing="0.2em"
        fill="#9A9AB0"
      >
        TREATS
      </text>
    </svg>
  );
}

export default function Contact() {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const bagRef = useRef<HTMLDivElement>(null);
  const catTargetRef = useRef<HTMLDivElement>(null);
  const sleepyRef = useRef<HTMLImageElement>(null);
  const alertRef = useRef<HTMLImageElement>(null);
  const neutralRef = useRef<HTMLImageElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);
  const dragInstance = useRef<Draggable | null>(null);
  const [phase, setPhase] = useState<Phase>(STATE.IDLE);
  const phaseRef = useRef<Phase>(STATE.IDLE);
  const { tick, tap, off, shake, chime } = useSiteSounds();

  useEffect(() => {
    phaseRef.current = phase;
    if (!revealRef.current) return;
    if (phase === STATE.APPROVED) {
      gsap.to(revealRef.current, {
        autoAlpha: 1,
        y: 0,
        duration: 0.6,
        ease: "expo.out",
        overwrite: "auto",
      });
    } else {
      gsap.to(revealRef.current, {
        autoAlpha: 0,
        y: 8,
        duration: 0.35,
        ease: "power2.out",
        overwrite: "auto",
      });
    }
  }, [phase]);

  const setHeadFrame = useCallback((target: Phase) => {
    const map = {
      [STATE.IDLE]: sleepyRef.current,
      [STATE.ALERT]: alertRef.current,
      [STATE.APPROVED]: neutralRef.current,
    };
    [sleepyRef.current, alertRef.current, neutralRef.current].forEach((el) => {
      if (!el) return;
      gsap.to(el, {
        autoAlpha: el === map[target] ? 1 : 0,
        duration: 0.45,
        ease: "power2.out",
        overwrite: "auto",
      });
    });
  }, []);

  const triggerApproval = useCallback(() => {
    if (phaseRef.current === STATE.APPROVED) return;
    chime();
    setPhase(STATE.APPROVED);
    setHeadFrame(STATE.APPROVED);

    if (bagRef.current) {
      gsap.to(bagRef.current, {
        rotation: 18,
        duration: 0.9,
        ease: "treatShake",
        transformOrigin: "50% 18%",
        onComplete: () => {
          gsap.to(bagRef.current, {
            x: 0,
            y: 0,
            rotation: 0,
            duration: 0.8,
            ease: "expo.out",
          });
        },
      });
    }
  }, [chime, setHeadFrame]);

  const hasTreatReachedAnya = useCallback(() => {
    if (!bagRef.current || !catTargetRef.current) return false;

    const bag = bagRef.current.getBoundingClientRect();
    const target = catTargetRef.current.getBoundingClientRect();
    const bagCenterX = bag.left + bag.width / 2;
    const bagCenterY = bag.top + bag.height / 2;
    const targetInsetX = target.width * 0.12;
    const targetInsetY = target.height * 0.1;

    return (
      bagCenterX >= target.left + targetInsetX &&
      bagCenterX <= target.right - targetInsetX &&
      bagCenterY >= target.top + targetInsetY &&
      bagCenterY <= target.bottom - targetInsetY
    );
  }, []);

  const resetToIdle = useCallback(() => {
    setPhase(STATE.IDLE);
    setHeadFrame(STATE.IDLE);
    if (bagRef.current) {
      off();
      gsap.to(bagRef.current, {
        x: 0,
        y: 0,
        rotation: 0,
        duration: 0.6,
        ease: "expo.out",
      });
    }
  }, [off, setHeadFrame]);

  useGSAP(
    () => {
      if (!sleepyRef.current) return;

      gsap.set(alertRef.current, { autoAlpha: 0 });
      gsap.set(neutralRef.current, { autoAlpha: 0 });
      gsap.set(sleepyRef.current, { autoAlpha: 1 });

      // Section reveal (intentional, single staged entrance — not the uniform reflex).
      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      if (!reduce) {
        const contactItems = gsap.utils.toArray<HTMLElement>(
          ".contact-stagger",
        );
        gsap.set(contactItems, { clearProps: "opacity,transform" });
        ScrollTrigger.create({
          trigger: root.current,
          start: "top 78%",
          invalidateOnRefresh: true,
          once: true,
          onEnter: () => {
            gsap.fromTo(
              contactItems,
              { y: 28, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.9,
                stagger: 0.08,
                ease: "expo.out",
                overwrite: "auto",
              },
            );
          },
        });
        // Idle breathing on the sleepy frame.
        gsap.to(sleepyRef.current, {
          y: -6,
          duration: 2.6,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }

      if (reduce || !bagRef.current || !stage.current) return;

      let didDrag = false;
      const approveIfTreatReachedAnya = (
        draggable: Draggable,
        shouldEndDrag = false,
      ) => {
        if (phaseRef.current === STATE.APPROVED) return;
        if (!hasTreatReachedAnya()) return;
        triggerApproval();
        if (shouldEndDrag) {
          draggable.endDrag(draggable.pointerEvent);
        }
      };

      dragInstance.current = Draggable.create(bagRef.current, {
        type: "x,y",
        inertia: true,
        bounds: stage.current,
        edgeResistance: 0.65,
        dragResistance: 0.05,
        cursor: "grab",
        activeCursor: "grabbing",
        onPress() {
          didDrag = false;
          if (phaseRef.current === STATE.APPROVED) return;
          shake();
          setPhase(STATE.ALERT);
          setHeadFrame(STATE.ALERT);
        },
        onDragStart() {
          didDrag = true;
        },
        onDrag(this: Draggable) {
          approveIfTreatReachedAnya(this, true);
        },
        onRelease() {
          if (phaseRef.current === STATE.APPROVED) return;
          if (!didDrag) {
            // Treat a press-without-drag as the same approval as click/keyboard.
            triggerApproval();
            return;
          }
          setHeadFrame(STATE.IDLE);
          setPhase(STATE.IDLE);
        },
        onThrowUpdate(this: Draggable) {
          approveIfTreatReachedAnya(this);
        },
      })[0];

      return () => {
        dragInstance.current?.kill();
      };
    },
    {
      scope: root,
      dependencies: [hasTreatReachedAnya, setHeadFrame, shake, triggerApproval],
    },
  );

  const onBagKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      triggerApproval();
    } else if (e.key === "Escape") {
      e.preventDefault();
      resetToIdle();
    }
  };

  return (
    <section
      ref={root}
      id="contact"
      className="relative w-full overflow-hidden bg-body px-6 py-32 sm:px-10 sm:py-40 lg:px-16"
    >
      <div className="relative mx-auto grid max-w-container gap-12 lg:grid-cols-[minmax(320px,0.82fr)_minmax(0,1.18fr)] lg:items-center lg:gap-16">
        {/* Copy */}
        <div className="relative">
          <p className="contact-stagger inline-flex items-center gap-3 font-sans text-sm tracking-[0.18em] text-voltage">
            <span className="inline-block h-px w-8 bg-voltage" />
            gatekeeper
          </p>

          <h2 className="contact-stagger mt-6 font-display text-[clamp(2.5rem,1rem+5.5vw,5.5rem)] font-semibold leading-[0.95] tracking-tightest text-white text-balance">
            Anya screens my inbox.
          </h2>

          <p className="contact-stagger mt-6 max-w-md font-sans text-lg text-muted sm:text-xl">
            Bribe her with a treat. She decides what reaches me.
          </p>
        </div>

        {/* Interactive shell */}
        <div
          ref={stage}
          className="contact-stagger relative min-h-[430px] w-full select-none overflow-hidden rounded-2xl border border-line bg-surface/40 sm:min-h-[520px] lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:min-h-[620px]"
        >
          <p
            className={`pointer-events-none absolute left-5 top-5 z-20 max-w-[13rem] font-sans text-sm transition-opacity duration-300 sm:left-6 sm:top-6 ${
              phase === STATE.IDLE ? "text-muted opacity-100" : "opacity-0"
            }`}
          >
            <span className="motion-reduce:hidden">
              Drag the treat to Anya.
            </span>
            <span className="hidden motion-reduce:inline">
              Tap the treat to wake her.
            </span>
          </p>
          <p
            className={`pointer-events-none absolute left-5 top-5 z-20 font-sans text-sm text-voltage transition-opacity duration-300 sm:left-6 sm:top-6 ${
              phase === STATE.ALERT ? "opacity-100" : "opacity-0"
            }`}
          >
            shaking…
          </p>
          <p
            className={`pointer-events-none absolute left-5 top-5 z-20 font-sans text-sm text-voltage transition-opacity duration-300 sm:left-6 sm:top-6 ${
              phase === STATE.APPROVED ? "opacity-100" : "opacity-0"
            }`}
          >
            she approved.
          </p>

          <div
            ref={catTargetRef}
            className="absolute bottom-4 right-0 h-[68%] w-[78%] max-w-[560px] sm:bottom-6 sm:right-4 lg:h-[76%] lg:w-[70%]"
          >
            <div className="relative h-full w-full">
              <Image
                ref={sleepyRef}
                src="/anya/head-sleepy.png"
                alt="Anya, sleeping, sole gatekeeper of the inbox."
                fill
                priority={false}
                sizes="(min-width: 1024px) 560px, 80vw"
                className="object-contain object-bottom"
              />
              <Image
                ref={alertRef}
                src="/anya/head-alert.png"
                alt=""
                aria-hidden
                fill
                sizes="(min-width: 1024px) 560px, 80vw"
                className="object-contain object-bottom"
              />
              <Image
                ref={neutralRef}
                src="/anya/head-neutral.png"
                alt=""
                aria-hidden
                fill
                sizes="(min-width: 1024px) 560px, 80vw"
                className="object-contain object-bottom"
              />
            </div>
          </div>

          <div
            ref={bagRef}
            role="button"
            tabIndex={0}
            aria-label="Drag the treat to Anya, press Space, or click to bribe Anya with a treat."
            onKeyDown={onBagKeyDown}
            onClick={() => {
              // Click without drag (Draggable suppresses native click after a real drag).
              tap();
              triggerApproval();
            }}
            onMouseEnter={tick}
            className="absolute bottom-8 left-6 z-30 cursor-grab touch-none rounded-xl outline-none ring-voltage/70 focus-visible:ring-2 active:cursor-grabbing motion-reduce:cursor-pointer sm:bottom-10 sm:left-10"
          >
            <TreatBagSVG className="h-36 w-28 sm:h-44 sm:w-36" />
          </div>
        </div>

        {/* Reveal panel — after Anya on mobile; below copy on desktop */}
        <div
          ref={revealRef}
          aria-live="polite"
          style={{
            opacity: 0,
            transform: "translateY(8px)",
            visibility: "hidden",
          }}
          className={`lg:col-start-1 lg:row-start-2 ${phase === STATE.APPROVED ? "" : "pointer-events-none"}`}
        >
          <ul className="flex flex-col divide-y divide-line border-y border-line">
            <li>
              <a
                href={CAL_URL}
                target="_blank"
                rel="noreferrer"
                onClick={tap}
                onMouseEnter={tick}
                className="group flex items-center justify-between gap-6 py-5 outline-none focus-visible:bg-surface/60"
              >
                <span>
                  <span className="block font-display text-2xl font-semibold text-white sm:text-3xl">
                    Book a 20-minute call
                  </span>
                  <span className="font-sans text-sm text-muted">
                    for the actual conversation
                  </span>
                </span>
                <span
                  aria-hidden
                  className="font-display text-2xl text-voltage transition-transform duration-300 group-hover:translate-x-1"
                >
                  ↗
                </span>
              </a>
            </li>
            <li>
              <a
                href={LINKEDIN_URL}
                target="_blank"
                rel="noreferrer"
                onClick={tap}
                onMouseEnter={tick}
                className="group flex items-center justify-between gap-6 py-5 outline-none focus-visible:bg-surface/60"
              >
                <span>
                  <span className="block font-display text-2xl font-semibold text-white sm:text-3xl">
                    LinkedIn
                  </span>
                  <span className="font-sans text-sm text-muted">
                    for the formal first hello
                  </span>
                </span>
                <span
                  aria-hidden
                  className="font-display text-2xl text-voltage transition-transform duration-300 group-hover:translate-x-1"
                >
                  ↗
                </span>
              </a>
            </li>
            <li>
              <a
                href={`mailto:${EMAIL}`}
                onClick={tap}
                onMouseEnter={tick}
                className="group flex items-center justify-between gap-6 py-5 outline-none focus-visible:bg-surface/60"
              >
                <span>
                  <span className="block font-display text-2xl font-semibold text-white sm:text-3xl">
                    Email
                  </span>
                  <span className="font-sans text-sm text-muted">
                    {EMAIL}
                  </span>
                </span>
                <span
                  aria-hidden
                  className="font-display text-2xl text-voltage transition-transform duration-300 group-hover:translate-x-1"
                >
                  ↗
                </span>
              </a>
            </li>
          </ul>
          <button
            type="button"
            onClick={resetToIdle}
            onMouseEnter={tick}
            className="mt-6 font-sans text-sm text-muted underline decoration-line decoration-1 underline-offset-4 transition-colors hover:text-voltage hover:decoration-voltage"
          >
            put her back to sleep
          </button>
        </div>
      </div>
    </section>
  );
}
