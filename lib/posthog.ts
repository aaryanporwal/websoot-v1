import { PostHog } from "posthog-node";

const posthogKey = process.env.POSTHOG_KEY;
const posthogHost = process.env.POSTHOG_HOST || "https://eu.i.posthog.com";

let posthogClient: PostHog | null = null;

export function getPostHogClient() {
  if (!posthogKey) {
    return null;
  }

  if (!posthogClient) {
    posthogClient = new PostHog(posthogKey, {
      host: posthogHost,
    });
  }

  return posthogClient;
}
