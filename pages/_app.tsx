import "../styles/globals.css";
import type { AppProps } from "next/app";
import SmoothScroll from "../components/SmoothScroll";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SmoothScroll>
      <Component {...pageProps} />
    </SmoothScroll>
  );
}

export default MyApp;
