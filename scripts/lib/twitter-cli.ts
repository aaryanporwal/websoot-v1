export const DEFAULT_USERNAME = "aaryan7476";

export type CliAuthor = {
  id: string;
  screenName: string;
};

export type CliMedia = {
  type: string;
  url: string;
};

export type CliTweet = {
  id: string;
  text: string;
  author: CliAuthor;
  createdAtISO: string;
  media?: CliMedia[];
  isRetweet: boolean;
  metrics?: {
    likes?: number;
    replies?: number;
    views?: number;
  };
};

export type CliResponse = {
  ok: boolean;
  data: CliTweet[];
};

export function getUsername() {
  return (process.env.X_USERNAME ?? DEFAULT_USERNAME).replace(/^@/, "");
}

export async function runTwitter(args: string[]): Promise<CliResponse> {
  const bin = process.env.TWITTER_CLI ?? "twitter";
  const proc = Bun.spawn([bin, ...args, "--json"], {
    stdout: "pipe",
    stderr: "pipe",
    env: process.env,
  });

  const [stdout, stderr, exitCode] = await Promise.all([
    new Response(proc.stdout).text(),
    new Response(proc.stderr).text(),
    proc.exited,
  ]);

  if (exitCode !== 0) {
    throw new Error(
      `twitter ${args.join(" ")} failed (exit ${exitCode}): ${stderr.trim() || stdout.trim()}`,
    );
  }

  const jsonStart = stdout.indexOf("{");
  if (jsonStart === -1) {
    throw new Error(`twitter ${args.join(" ")} returned no JSON output`);
  }

  const parsed = JSON.parse(stdout.slice(jsonStart)) as CliResponse;
  if (!parsed.ok || !Array.isArray(parsed.data)) {
    throw new Error(`twitter ${args.join(" ")} returned an unexpected response`);
  }

  if (stderr.trim()) {
    console.warn(stderr.trim());
  }

  return parsed;
}

export function isOwnTweet(tweet: CliTweet, username = getUsername()) {
  return (
    tweet.author.screenName.toLowerCase() === username.toLowerCase() &&
    !tweet.isRetweet
  );
}

export function isReplyTweet(tweet: CliTweet) {
  return /^@\w/.test(tweet.text.trim());
}

export function tweetUrl(id: string, username = getUsername()) {
  return `https://x.com/${username}/status/${id}`;
}
