import { PostHog } from "posthog-node";

const posthogKey = import.meta.env.POSTHOG_KEY;
const posthogHost = import.meta.env.POSTHOG_HOST || "https://eu.i.posthog.com";

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
