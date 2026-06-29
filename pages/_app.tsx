import "../styles/globals.css";
import type { AppProps } from "next/app";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import SmoothScroll from "../components/SmoothScroll";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <PostHogProvider client={posthog}>
      <SmoothScroll>
        <Component {...pageProps} />
      </SmoothScroll>
    </PostHogProvider>
  );
}

export default MyApp;
