#!/usr/bin/env bun

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  getUsername,
  isOwnTweet,
  isReplyTweet,
  runTwitter,
  tweetUrl,
  type CliTweet,
} from "./lib/twitter-cli";

const ROOT = path.resolve(import.meta.dir, "..");
const OUTPUT_PATH = path.join(ROOT, "src/data/recent-tweets.json");
const DISPLAY_COUNT = Number(process.env.TWEET_DISPLAY_COUNT ?? "5");
const FETCH_COUNT = Number(process.env.TWEET_FETCH_COUNT ?? "20");
const MAX_THREAD_GAP_MS = 2 * 60 * 60 * 1000;

export type RecentTweet = {
  id: string;
  text: string;
  createdAt: string;
  url: string;
  media: Array<{ type: string; url: string }>;
  metrics: {
    likes: number;
    replies: number;
    views: number;
  };
};

export type RecentTweetsFile = {
  username: string;
  fetchedAt: string;
  tweets: RecentTweet[];
};

function toRecentTweet(tweet: CliTweet, username: string): RecentTweet {
  return {
    id: tweet.id,
    text: tweet.text.trim(),
    createdAt: tweet.createdAtISO,
    url: tweetUrl(tweet.id, username),
    media: (tweet.media ?? [])
      .filter((item) => item.type === "photo" || item.type === "animated_gif")
      .map((item) => ({ type: item.type, url: item.url })),
    metrics: {
      likes: tweet.metrics?.likes ?? 0,
      replies: tweet.metrics?.replies ?? 0,
      views: tweet.metrics?.views ?? 0,
    },
  };
}

function isThreadRoot(tweet: CliTweet, candidates: CliTweet[]) {
  const time = new Date(tweet.createdAtISO).getTime();

  return !candidates.some((other) => {
    if (other.id === tweet.id) {
      return false;
    }

    const otherTime = new Date(other.createdAtISO).getTime();
    return otherTime < time && time - otherTime <= MAX_THREAD_GAP_MS;
  });
}

function selectDisplayTweets(tweets: CliTweet[], username: string) {
  const candidates = tweets
    .filter((tweet) => isOwnTweet(tweet, username))
    .filter((tweet) => !isReplyTweet(tweet))
    .sort(
      (a, b) =>
        new Date(b.createdAtISO).getTime() - new Date(a.createdAtISO).getTime(),
    );

  const selected: CliTweet[] = [];

  for (const tweet of candidates) {
    if (!isThreadRoot(tweet, candidates)) {
      continue;
    }

    selected.push(tweet);
    if (selected.length >= DISPLAY_COUNT) {
      break;
    }
  }

  return selected.map((tweet) => toRecentTweet(tweet, username));
}

async function readExisting(): Promise<RecentTweetsFile | null> {
  try {
    const raw = await readFile(OUTPUT_PATH, "utf8");
    return JSON.parse(raw) as RecentTweetsFile;
  } catch {
    return null;
  }
}

async function writeTweets(payload: RecentTweetsFile) {
  await mkdir(path.dirname(OUTPUT_PATH), { recursive: true });
  await writeFile(OUTPUT_PATH, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
}

function stableSnapshot(payload: RecentTweetsFile) {
  return JSON.stringify({
    username: payload.username,
    tweets: payload.tweets.map(({ id, text, createdAt, url, media }) => ({
      id,
      text,
      createdAt,
      url,
      media,
    })),
  });
}

function hasMeaningfulChanges(
  existing: RecentTweetsFile | null,
  next: RecentTweetsFile,
) {
  if (!existing) return true;
  return stableSnapshot(existing) !== stableSnapshot(next);
}

async function main() {
  const force = process.argv.includes("--force");
  const username = getUsername();
  const existing = await readExisting();

  try {
    const timeline = await runTwitter([
      "user-posts",
      username,
      "-n",
      String(FETCH_COUNT),
    ]);

    const payload: RecentTweetsFile = {
      username,
      fetchedAt: new Date().toISOString(),
      tweets: selectDisplayTweets(timeline.data, username),
    };

    if (!force && !hasMeaningfulChanges(existing, payload)) {
      console.log(
        `No tweet changes detected; keeping ${path.relative(ROOT, OUTPUT_PATH)}`,
      );
      return;
    }

    await writeTweets(payload);
    console.log(
      `Wrote ${payload.tweets.length} tweet(s) to ${path.relative(ROOT, OUTPUT_PATH)}`,
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`Could not fetch tweets: ${message}`);

    if (existing) {
      console.warn("Keeping existing recent-tweets.json");
      return;
    }

    await writeTweets({
      username,
      fetchedAt: new Date().toISOString(),
      tweets: [],
    });
    console.warn("Wrote empty recent-tweets.json fallback");
  }
}

main();
