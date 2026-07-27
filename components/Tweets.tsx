import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useSiteSounds } from "../hooks/useSiteSounds";
import { sectionReveal } from "./animation/sectionReveal";
import type { RecentTweetsFile } from "../src/types/tweets";
import tweetsData from "../src/data/recent-tweets.json";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger);
}

const PROFILE_URL = "https://x.com/aaryan7476";

function formatTweetText(text: string) {
  return text.replace(/\s*https:\/\/t\.co\/\w+/g, "").trim();
}

function formatMetric(value: number) {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
  }
  return String(value);
}

function formatWhen(date: string) {
  const then = new Date(date).getTime();
  const now = Date.now();
  const diffMs = Math.max(0, now - then);
  const minutes = Math.floor(diffMs / 60_000);

  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

export default function Tweets() {
  const root = useRef<HTMLElement>(null);
  const sounds = useSiteSounds();
  const data = tweetsData as RecentTweetsFile;

  useGSAP(
    () => {
      sectionReveal(".tweets-section-reveal", { trigger: root.current });
      sectionReveal(".tweet-card-reveal", {
        trigger: root.current,
        stagger: 0.08,
        y: 24,
      });
    },
    { scope: root },
  );

  if (!data.tweets.length) {
    return null;
  }

  return (
    <section
      ref={root}
      id="tweets"
      className="relative w-full bg-body px-6 py-28 sm:px-10 lg:px-16"
    >
      <div className="mx-auto max-w-container">
        <div className="flex flex-col gap-6 border-b border-line pb-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="tweets-section-reveal font-mono text-xs uppercase tracking-[0.35em] text-muted">
              @{data.username}
            </p>
            <h2 className="mt-4 font-display text-fluid-md font-semibold leading-none tracking-tightest text-white">
              <span className="tweets-section-reveal block">Recent</span>
              <span className="tweets-section-reveal block text-stroke">Posts</span>
            </h2>
          </div>
          <a
            href={PROFILE_URL}
            target="_blank"
            rel="noreferrer"
            onClick={sounds.tap}
            onMouseEnter={sounds.tick}
            className="tweets-section-reveal inline-flex items-center gap-2 self-start font-display text-sm font-semibold text-voltage transition-transform duration-200 ease-out-strong active:scale-[0.97] [@media(hover:hover)_and_(pointer:fine)]:hover:translate-x-1"
          >
            Follow on X
            <span aria-hidden>→</span>
          </a>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          {data.tweets.map((tweet) => {
            const text = formatTweetText(tweet.text);
            const image = tweet.media[0];

            return (
              <article
                key={tweet.id}
                className="tweet-card-reveal group flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-surface/50 transition-[transform,border-color] duration-300 ease-out-strong [@media(hover:hover)_and_(pointer:fine)]:hover:-translate-y-1 [@media(hover:hover)_and_(pointer:fine)]:hover:border-white/15 motion-reduce:hover:translate-y-0"
              >
                {image ? (
                  <a
                    href={tweet.url}
                    target="_blank"
                    rel="noreferrer"
                    onClick={sounds.tap}
                    className="block overflow-hidden"
                  >
                    <img
                      src={image.url}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="h-44 w-full object-cover transition-transform duration-300 ease-out-strong [@media(hover:hover)_and_(pointer:fine)]:group-hover:scale-[1.02] motion-reduce:group-hover:scale-100 sm:h-52"
                    />
                  </a>
                ) : null}

                <div className="flex flex-1 flex-col p-6 sm:p-7">
                  <div className="flex items-center justify-between gap-4">
                    <time
                      dateTime={tweet.createdAt}
                      className="font-mono text-xs uppercase tracking-[0.2em] text-muted"
                    >
                      {formatWhen(tweet.createdAt)}
                    </time>
                    <div className="flex items-center gap-3 font-mono text-xs text-muted">
                      <span>{formatMetric(tweet.metrics.likes)} likes</span>
                      <span>{formatMetric(tweet.metrics.replies)} replies</span>
                    </div>
                  </div>

                  <p className="mt-4 flex-1 whitespace-pre-line font-sans text-base leading-relaxed text-white/90">
                    {text}
                  </p>

                  <a
                    href={tweet.url}
                    target="_blank"
                    rel="noreferrer"
                    onClick={sounds.tap}
                    onMouseEnter={sounds.tick}
                    className="mt-6 inline-flex items-center gap-2 font-display text-sm font-semibold text-voltage transition-transform duration-200 ease-out-strong active:scale-[0.97] [@media(hover:hover)_and_(pointer:fine)]:hover:translate-x-1"
                  >
                    View on X
                    <span aria-hidden>↗</span>
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
