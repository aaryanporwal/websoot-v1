#!/usr/bin/env bun

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  getUsername,
  isOwnTweet,
  runTwitter,
  tweetUrl,
  type CliTweet,
} from "./lib/twitter-cli";

const ROOT = path.resolve(import.meta.dir, "..");
const BLOG_DIR = path.join(ROOT, "src/content/blog/tweets");
const STATE_PATH = path.join(import.meta.dir, ".tweet-state.json");

const USERNAME = getUsername();
const MAX_TWEETS = Number(process.env.MAX_TWEETS ?? "20");
const MAX_THREAD_GAP_MS = 2 * 60 * 60 * 1000;
const DRY_RUN = process.argv.includes("--dry-run");

type TweetState = {
  importedRootTweetIds: string[];
  importedTweetIds: string[];
};

async function loadState(): Promise<TweetState> {
  try {
    const raw = await readFile(STATE_PATH, "utf8");
    const parsed = JSON.parse(raw) as Partial<TweetState> & {
      importedConversationIds?: string[];
      sinceId?: string;
    };

    return {
      importedRootTweetIds:
        parsed.importedRootTweetIds ?? parsed.importedConversationIds ?? [],
      importedTweetIds: parsed.importedTweetIds ?? [],
    };
  } catch {
    return { importedRootTweetIds: [], importedTweetIds: [] };
  }
}

async function saveState(state: TweetState) {
  if (DRY_RUN) {
    console.log("[dry-run] Would save state:", state);
    return;
  }
  await writeFile(STATE_PATH, `${JSON.stringify(state, null, 2)}\n`, "utf8");
}

function yamlString(value: string) {
  return JSON.stringify(value);
}

function tweetTitle(text: string) {
  const firstLine = text.split("\n")[0]?.trim() ?? "Tweet";
  const cleaned = firstLine.replace(/\s+/g, " ");
  if (cleaned.length <= 80) return cleaned;
  return `${cleaned.slice(0, 77).trim()}...`;
}

function selectOwnThreadTweets(thread: CliTweet[], rootId: string) {
  const ownTweets = thread
    .filter((tweet) => isOwnTweet(tweet, USERNAME))
    .sort(
      (a, b) =>
        new Date(a.createdAtISO).getTime() - new Date(b.createdAtISO).getTime(),
    );

  const rootIndex = ownTweets.findIndex((tweet) => tweet.id === rootId);
  if (rootIndex === -1) {
    return ownTweets.slice(0, 1);
  }

  const selected = [ownTweets[rootIndex]];
  for (let index = rootIndex + 1; index < ownTweets.length; index += 1) {
    const previous = selected[selected.length - 1];
    const current = ownTweets[index];
    const gap =
      new Date(current.createdAtISO).getTime() -
      new Date(previous.createdAtISO).getTime();

    if (gap > MAX_THREAD_GAP_MS) {
      break;
    }

    selected.push(current);
  }

  return selected;
}

async function fetchThreadTweets(tweet: CliTweet) {
  if ((tweet.metrics?.replies ?? 0) === 0) {
    return [tweet];
  }

  const thread = await runTwitter(["tweet", tweet.id]);
  return selectOwnThreadTweets(thread.data, thread.data[0]?.id ?? tweet.id);
}

function renderTweetMarkdown(tweet: CliTweet) {
  const lines = [tweet.text];

  for (const media of tweet.media ?? []) {
    if (media.type === "photo" || media.type === "animated_gif") {
      lines.push("", `![Tweet media](${media.url})`);
    }
  }

  return lines.join("\n");
}

function renderThreadMarkdown(tweets: CliTweet[]) {
  return tweets
    .map((tweet, index) => {
      const block = renderTweetMarkdown(tweet);
      if (index === 0) return block;
      return `## Part ${index + 1}\n\n${block}`;
    })
    .join("\n\n");
}

async function writeDraft(tweets: CliTweet[]) {
  const sorted = [...tweets].sort(
    (a, b) =>
      new Date(a.createdAtISO).getTime() - new Date(b.createdAtISO).getTime(),
  );
  const root = sorted[0];
  const sourceUrl = tweetUrl(root.id, USERNAME);
  const title = tweetTitle(root.text);
  const filename = `tweet-${root.id}.md`;
  const filePath = path.join(BLOG_DIR, filename);

  const body = [
    "---",
    `title: ${yamlString(title)}`,
    `date: ${new Date(root.createdAtISO).toISOString()}`,
    "draft: true",
    "tags:",
    '  - "tweet"',
    `description: ${yamlString(`Imported from @${USERNAME}`)}`,
    `tweet_id: ${yamlString(root.id)}`,
    `source_url: ${yamlString(sourceUrl)}`,
    "---",
    "",
    renderThreadMarkdown(sorted),
    "",
    "---",
    "",
    `Originally posted on [X](${sourceUrl}).`,
    "",
  ].join("\n");

  if (DRY_RUN) {
    console.log(`[dry-run] Would write ${filePath}`);
    console.log(body);
    return root.id;
  }

  await mkdir(BLOG_DIR, { recursive: true });
  await writeFile(filePath, body, "utf8");
  console.log(`Wrote draft: ${path.relative(ROOT, filePath)}`);
  return root.id;
}

function markImported(state: TweetState, rootId: string, tweetIds: string[]) {
  if (!state.importedRootTweetIds.includes(rootId)) {
    state.importedRootTweetIds.push(rootId);
  }

  for (const tweetId of tweetIds) {
    if (!state.importedTweetIds.includes(tweetId)) {
      state.importedTweetIds.push(tweetId);
    }
  }
}

async function main() {
  const state = await loadState();
  const timeline = await runTwitter([
    "user-posts",
    USERNAME,
    "-n",
    String(MAX_TWEETS),
  ]);

  const candidates = timeline.data.filter((tweet) => isOwnTweet(tweet, USERNAME));
  if (candidates.length === 0) {
    console.log("No tweets found to import.");
    return;
  }

  let importedCount = 0;

  for (const candidate of candidates) {
    if (state.importedTweetIds.includes(candidate.id)) {
      continue;
    }

    const ownThreadTweets = await fetchThreadTweets(candidate);
    if (ownThreadTweets.length === 0) {
      continue;
    }

    const rootId = ownThreadTweets[0].id;
    if (state.importedRootTweetIds.includes(rootId)) {
      markImported(
        state,
        rootId,
        ownThreadTweets.map((tweet) => tweet.id),
      );
      continue;
    }

    await writeDraft(ownThreadTweets);
    markImported(
      state,
      rootId,
      ownThreadTweets.map((tweet) => tweet.id),
    );
    importedCount += 1;
  }

  await saveState(state);

  if (importedCount === 0) {
    console.log("No new tweet drafts to import.");
  } else {
    console.log(
      `Imported ${importedCount} draft(s). Review them in src/content/blog/tweets/, then set draft: false to publish.`,
    );
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(message);
  process.exit(1);
});
