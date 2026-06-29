import Image from "next/image";
import type { KeyboardEvent, PointerEvent } from "react";
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
  const chaseModeRef = useRef(false);
  const difficultyRef = useRef(4);
  const [phase, setPhase] = useState<Phase>(STATE.IDLE);
  const [chaseMode, setChaseMode] = useState(false);
  const [difficulty, setDifficulty] = useState(4);
  const phaseRef = useRef<Phase>(STATE.IDLE);
  const { tick, tap, off, shake, chime } = useSiteSounds();

  useEffect(() => {
    chaseModeRef.current = chaseMode;
  }, [chaseMode]);

  useEffect(() => {
    difficultyRef.current = difficulty;
  }, [difficulty]);

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

  const resetCatPosition = useCallback((duration = 0.45) => {
    if (!catTargetRef.current) return;
    gsap.to(catTargetRef.current, {
      x: 0,
      y: 0,
      duration,
      ease: "expo.out",
      overwrite: "auto",
    });
  }, []);

  const triggerApproval = useCallback(() => {
    if (phaseRef.current === STATE.APPROVED) return;
    chime();
    setPhase(STATE.APPROVED);
    setHeadFrame(STATE.APPROVED);
    resetCatPosition();

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
  }, [chime, resetCatPosition, setHeadFrame]);

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

  const moveTreatToAnya = useCallback(() => {
    if (!bagRef.current || !catTargetRef.current) return;
    if (phaseRef.current === STATE.APPROVED) return;
    if (chaseModeRef.current) {
      setPhase(STATE.ALERT);
      setHeadFrame(STATE.ALERT);
      shake();
      return;
    }

    const bag = bagRef.current.getBoundingClientRect();
    const target = catTargetRef.current.getBoundingClientRect();
    const bagCenterX = bag.left + bag.width / 2;
    const bagCenterY = bag.top + bag.height / 2;
    const targetCenterX = target.left + target.width / 2;
    const targetCenterY = target.top + target.height / 2;
    const currentX = Number(gsap.getProperty(bagRef.current, "x"));
    const currentY = Number(gsap.getProperty(bagRef.current, "y"));

    setPhase(STATE.ALERT);
    setHeadFrame(STATE.ALERT);

    gsap.to(bagRef.current, {
      x: currentX + targetCenterX - bagCenterX,
      y: currentY + targetCenterY - bagCenterY,
      rotation: 8,
      duration: 0.55,
      ease: "expo.out",
      onComplete: () => {
        if (hasTreatReachedAnya()) {
          triggerApproval();
        }
      },
    });
  }, [hasTreatReachedAnya, setHeadFrame, shake, triggerApproval]);

  const resetToIdle = useCallback(() => {
    setPhase(STATE.IDLE);
    setHeadFrame(STATE.IDLE);
    resetCatPosition();
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
  }, [off, resetCatPosition, setHeadFrame]);

  const onChaseModeChange = (checked: boolean) => {
    tap();
    chaseModeRef.current = checked;
    setChaseMode(checked);
    resetToIdle();
  };

  const onDifficultyChange = (value: number) => {
    difficultyRef.current = value;
    setDifficulty(value);
  };

  const dodgeAnyaFromPoint = useCallback((clientX: number, clientY: number) => {
    if (!chaseModeRef.current || phaseRef.current === STATE.APPROVED) return;
    if (!stage.current || !catTargetRef.current) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const stageBounds = stage.current.getBoundingClientRect();
    const catBounds = catTargetRef.current.getBoundingClientRect();
    const catCenterX = catBounds.left + catBounds.width / 2;
    const catCenterY = catBounds.top + catBounds.height / 2;
    const deltaX = catCenterX - clientX;
    const deltaY = catCenterY - clientY;
    const distance = Math.hypot(deltaX, deltaY);
    const difficultyLevel = difficultyRef.current;
    const dangerZone = Math.min(
      stageBounds.width * (0.34 + difficultyLevel * 0.035),
      210 + difficultyLevel * 22,
    );

    if (distance > dangerZone || distance === 0) return;

    const currentX = Number(gsap.getProperty(catTargetRef.current, "x"));
    const currentY = Number(gsap.getProperty(catTargetRef.current, "y"));
    const push = (dangerZone - distance) * (0.22 + difficultyLevel * 0.055);
    const maxLeft = stageBounds.width * -(0.12 + difficultyLevel * 0.025);
    const maxRight = stageBounds.width * (0.04 + difficultyLevel * 0.014);
    const maxUp = stageBounds.height * -(0.09 + difficultyLevel * 0.018);
    const maxDown = stageBounds.height * (0.04 + difficultyLevel * 0.012);

    gsap.to(catTargetRef.current, {
      x: gsap.utils.clamp(
        maxLeft,
        maxRight,
        currentX + (deltaX / distance) * push,
      ),
      y: gsap.utils.clamp(
        maxUp,
        maxDown,
        currentY + (deltaY / distance) * push,
      ),
      duration: Math.max(0.1, 0.28 - difficultyLevel * 0.034),
      ease: "power2.out",
      overwrite: "auto",
    });
  }, []);

  const getEventPoint = (event: Event | undefined) => {
    if (!event) return null;

    const mouseEvent = event as MouseEvent;
    if (
      typeof mouseEvent.clientX === "number" &&
      typeof mouseEvent.clientY === "number"
    ) {
      return { x: mouseEvent.clientX, y: mouseEvent.clientY };
    }

    const touchEvent = event as TouchEvent;
    const touch = touchEvent.touches?.[0] || touchEvent.changedTouches?.[0];
    if (!touch) return null;

    return { x: touch.clientX, y: touch.clientY };
  };

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
        if (phaseRef.current === STATE.APPROVED) return true;
        if (!hasTreatReachedAnya()) return false;
        triggerApproval();
        if (shouldEndDrag) {
          draggable.endDrag(draggable.pointerEvent);
        }
        return true;
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
          if (approveIfTreatReachedAnya(this, true)) return;
          const point = getEventPoint(this.pointerEvent);
          if (point) {
            dodgeAnyaFromPoint(point.x, point.y);
          }
        },
        onRelease() {
          if (phaseRef.current === STATE.APPROVED) return;
          if (!didDrag) {
            moveTreatToAnya();
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
      dependencies: [
        hasTreatReachedAnya,
        dodgeAnyaFromPoint,
        moveTreatToAnya,
        setHeadFrame,
        shake,
        triggerApproval,
      ],
    },
  );

  const onBagKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      tap();
      moveTreatToAnya();
    } else if (e.key === "Escape") {
      e.preventDefault();
      resetToIdle();
    }
  };

  const onStagePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    dodgeAnyaFromPoint(e.clientX, e.clientY);
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
          <h2 className="contact-stagger mt-6 font-display text-[clamp(2.5rem,1rem+5.5vw,5.5rem)] font-semibold leading-[0.95] tracking-tightest text-white text-balance">
            Anya screens my inbox.
          </h2>

          <p className="contact-stagger mt-8 max-w-md font-sans text-lg text-muted sm:text-xl">
            Bribe her with a treat and the channels appear.
          </p>
          <p className="contact-stagger mt-8 max-w-md font-sans text-lg text-muted/70 sm:text-xl">
            Serious project, quick hello, odd idea: all welcome. She just likes
            to feel involved.
          </p>
        </div>

        {/* Interactive shell */}
        <div
          ref={stage}
          onPointerMove={onStagePointerMove}
          className="contact-stagger relative min-h-[430px] w-full select-none overflow-hidden rounded-2xl border border-line bg-surface/40 sm:min-h-[520px] lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:min-h-[620px]"
        >
          <p
            className={`pointer-events-none absolute left-5 top-5 z-20 max-w-[13rem] font-sans text-sm transition-opacity duration-300 sm:left-6 sm:top-6 ${
              phase === STATE.IDLE ? "text-muted opacity-100" : "opacity-0"
            }`}
          >
            <span className="motion-reduce:hidden">
              {chaseMode ? "Catch Anya with the treat." : "Drag the treat to Anya."}
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
            {chaseMode ? "she noticed." : "shaking..."}
          </p>
          <div
            className={`absolute right-5 top-5 z-40 w-[min(13rem,calc(100%-2.5rem))] rounded-2xl border border-line bg-ink/75 p-3 font-sans text-xs text-muted backdrop-blur transition-opacity duration-300 sm:right-6 sm:top-6 ${
              phase === STATE.APPROVED
                ? "pointer-events-none opacity-0"
                : "opacity-100"
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <label className="flex items-center gap-2 transition-colors hover:text-white">
                <input
                  type="checkbox"
                  checked={chaseMode}
                  onChange={(e) => onChaseModeChange(e.currentTarget.checked)}
                  className="h-3.5 w-3.5 accent-voltage"
                />
                chase mode
              </label>
            </div>
            {chaseMode ? (
              <label className="mt-3 block">
                <span className="mb-2 flex items-center justify-between gap-3">
                  <span>difficulty</span>
                  <span className="font-mono text-voltage">{difficulty}</span>
                </span>
                <input
                  type="range"
                  min={1}
                  max={5}
                  value={difficulty}
                  aria-label="Chase difficulty"
                  onChange={(e) =>
                    onDifficultyChange(Number(e.currentTarget.value))
                  }
                  onMouseEnter={tick}
                  className="h-1.5 w-full cursor-pointer accent-voltage"
                />
              </label>
            ) : null}
          </div>
          <p
            className={`pointer-events-none absolute left-5 top-5 z-20 font-sans text-sm text-voltage transition-opacity duration-300 sm:left-6 sm:top-6 ${
              phase === STATE.APPROVED ? "opacity-100" : "opacity-0"
            }`}
          >
            she approved.
          </p>

          <div
            ref={catTargetRef}
            className="absolute bottom-4 right-0 h-[54%] w-[64%] max-w-[430px] sm:bottom-6 sm:right-4 lg:h-[60%] lg:w-[56%]"
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
              moveTreatToAnya();
            }}
            onMouseEnter={tick}
            className="absolute bottom-8 left-6 z-30 cursor-grab touch-none rounded-xl outline-none ring-voltage/70 focus-visible:ring-2 active:cursor-grabbing motion-reduce:cursor-pointer sm:bottom-10 sm:left-10"
          >
            <Image
              src="/cat-treat.out.png"
              alt=""
              aria-hidden
              width={1448}
              height={1086}
              sizes="(min-width: 640px) 176px, 144px"
              className="h-36 w-36 object-contain drop-shadow-[0_18px_36px_rgba(0,0,0,0.35)] sm:h-44 sm:w-44"
              draggable={false}
              priority={false}
            />
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
