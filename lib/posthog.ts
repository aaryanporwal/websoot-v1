import { PostHog } from "posthog-node";

const posthogKey =
  import.meta.env.POSTHOG_KEY ||
  "phc_BzBUGcL3QBQozyrN8TmwpMZm3aSo9rppD6vtbLDQ5ajN";
const posthogHost =
  import.meta.env.POSTHOG_HOST || "https://hogxd.aaryanporwal.com";

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
