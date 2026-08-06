import { useEffect, useRef } from "react";

const EMBED_SCRIPT =
  "https://cdn.jsdelivr.net/gh/hackclub/webring/public/embed.js";

export function WebringEmbed() {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper?.querySelector("script")) {
      const script = document.createElement("script");
      script.src = EMBED_SCRIPT;
      wrapper.appendChild(script);
    }
  }, []);

  return (
    <div
      ref={wrapperRef}
      id="webring-wrapper"
      className="flex items-center gap-1"
    >
      <a
        href="https://webring.hackclub.com/"
        id="previousBtn"
        className="webring-anchor"
        title="Previous"
      >
        ‹
      </a>
      <a
        href="https://webring.hackclub.com/"
        className="webring-logo"
        title="Hack Club Webring"
      />
      <a
        href="https://webring.hackclub.com/"
        id="nextBtn"
        className="webring-anchor"
        title="Next"
      >
        ›
      </a>
    </div>
  );
}
