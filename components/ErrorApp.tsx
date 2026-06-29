import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { useSiteSounds } from "../hooks/useSiteSounds";

type ErrorStatus = 400 | 401 | 403 | 404 | 418 | 500 | 502 | 503 | 504;

type ErrorAppProps = {
  status: ErrorStatus;
};

type StatusConfig = {
  eyebrow: string;
  title: string;
  detail: string;
};

const STATUS_CONFIG: Record<ErrorStatus, StatusConfig> = {
  400: {
    eyebrow: "Bad request",
    title: "The browser sent a scrambled packet.",
    detail:
      "Something in the URL or request shape looks off, so the site refused to guess.",
  },
  401: {
    eyebrow: "Unauthorized",
    title: "This hatch wants credentials.",
    detail:
      "The page exists behind a lock, but the current request did not bring a key.",
  },
  403: {
    eyebrow: "Forbidden",
    title: "The route guard shook its head.",
    detail:
      "The server understood the request and still decided this corridor is closed.",
  },
  404: {
    eyebrow: "Not found",
    title: "This route slipped into another timeline.",
    detail:
      "The link is either old, mistyped, or still hiding in a branch I have not merged.",
  },
  418: {
    eyebrow: "I am a teapot",
    title: "The server is steeping, not serving.",
    detail:
      "This one is mostly here for people who inspect status codes for sport.",
  },
  500: {
    eyebrow: "Server error",
    title: "A stack trace tripped over its own shoelaces.",
    detail:
      "The server hit something unexpected. The fastest path is usually back home or into the writing archive.",
  },
  502: {
    eyebrow: "Bad gateway",
    title: "Two servers disagreed mid-handshake.",
    detail:
      "The edge asked upstream for a page and received something it could not use.",
  },
  503: {
    eyebrow: "Unavailable",
    title: "The workshop lights are on, but the bench is busy.",
    detail:
      "This usually means maintenance, deploy churn, or a service taking a short breath.",
  },
  504: {
    eyebrow: "Gateway timeout",
    title: "The upstream call took the scenic route.",
    detail: "The page did not answer before the gateway gave up waiting.",
  },
};

const FALLBACK_ZEN = [
  "Design for failure, then make failure delightful.",
  "Fast paths are nice. Clear exits are better.",
  "Every missing route still deserves a good interface.",
];

export default function ErrorApp({ status }: ErrorAppProps) {
  const config = STATUS_CONFIG[status];
  const [pointer, setPointer] = useState({ x: 50, y: 42 });
  const [zen, setZen] = useState(FALLBACK_ZEN[0]);
  const [zenState, setZenState] = useState<"idle" | "loading" | "error">(
    "idle",
  );
  const sounds = useSiteSounds();

  const routeName = useMemo(() => `ERR_${status}_ROUTE`, [status]);

  const fetchZen = useCallback(async () => {
    setZenState("loading");
    try {
      const response = await fetch("https://api.github.com/zen", {
        headers: { Accept: "application/vnd.github+json" },
      });
      if (!response.ok) throw new Error("Zen endpoint unavailable");
      const text = await response.text();
      setZen(text || FALLBACK_ZEN[status % FALLBACK_ZEN.length]);
      setZenState("idle");
    } catch {
      setZen(FALLBACK_ZEN[status % FALLBACK_ZEN.length]);
      setZenState("error");
    }
  }, [status]);

  useEffect(() => {
    void fetchZen();
  }, [fetchZen]);

  return (
    <div
      className="grain relative min-h-screen overflow-hidden bg-body px-6 py-6 text-white sm:px-10 lg:px-16"
      style={
        {
          "--mx": `${pointer.x}%`,
          "--my": `${pointer.y}%`,
        } as React.CSSProperties
      }
      onPointerMove={(event) => {
        const bounds = event.currentTarget.getBoundingClientRect();
        setPointer({
          x: ((event.clientX - bounds.left) / bounds.width) * 100,
          y: ((event.clientY - bounds.top) / bounds.height) * 100,
        });
      }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_var(--mx)_var(--my),rgba(198,255,61,0.18),transparent_28rem)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-voltage/80" />

      <header className="relative z-10 mx-auto flex max-w-container items-center justify-between gap-4">
        <a
          href="/"
          onClick={sounds.tap}
          className="font-display text-2xl font-semibold text-white sm:text-3xl"
        >
          Aaryan Porwal
        </a>
        <button
          type="button"
          data-command-switcher-trigger
          onClick={sounds.tap}
          className="rounded-md border border-line bg-surface/50 px-3 py-2 font-sans text-xs font-semibold text-muted transition-colors hover:border-voltage hover:text-voltage focus-visible:border-voltage focus-visible:text-voltage focus-visible:outline-none"
        >
          Command menu
        </button>
      </header>

      <main className="relative z-10 mx-auto grid min-h-[calc(100vh-6.5rem)] max-w-container items-center gap-10 py-16 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.7fr)]">
        <section>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-sans text-sm font-semibold uppercase text-voltage"
          >
            {config.eyebrow} / {routeName}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="mt-5 max-w-5xl font-display text-6xl font-semibold leading-none text-white sm:text-7xl lg:text-8xl"
          >
            <span className="block text-voltage">{status}</span>
            {config.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16 }}
            className="mt-8 max-w-2xl font-sans text-lg leading-8 text-muted sm:text-xl"
          >
            {config.detail}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.24 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <motion.a
              href="/"
              onClick={sounds.tap}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="rounded-full bg-voltage px-7 py-3.5 font-display text-base font-semibold text-body"
            >
              Back home
            </motion.a>
            <motion.a
              href="/blog/"
              onClick={sounds.tap}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="rounded-full border border-line px-7 py-3.5 font-display text-base font-semibold text-white transition-colors hover:border-white"
            >
              Read instead
            </motion.a>
          </motion.div>
        </section>

        <motion.aside
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="border border-line bg-surface/60 p-5 backdrop-blur-xl sm:p-6"
        >
          <div className="border border-line bg-body/70 p-4">
            <div className="flex items-center justify-between gap-4">
              <p className="font-sans text-xs font-semibold uppercase text-muted">
                GitHub Zen
              </p>
              <button
                type="button"
                onClick={() => {
                  sounds.tap();
                  void fetchZen();
                }}
                className="font-sans text-xs font-semibold text-voltage underline decoration-voltage/40 underline-offset-4 hover:decoration-voltage"
              >
                Refresh
              </button>
            </div>
            <p className="mt-3 min-h-12 font-sans text-base leading-7 text-white">
              {zenState === "loading"
                ? "Listening for a tiny API omen..."
                : zen}
            </p>
            {zenState === "error" && (
              <p className="mt-2 font-sans text-xs text-muted">
                Live API missed. Local fallback loaded.
              </p>
            )}
          </div>
        </motion.aside>
      </main>
    </div>
  );
}
