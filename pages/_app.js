import "../styles/globals.css";
import SmoothScroll from "../components/SmoothScroll";

function MyApp({ Component, pageProps }) {
  return (
    <SmoothScroll>
      <Component {...pageProps} />
    </SmoothScroll>
  );
}

export default MyApp;
