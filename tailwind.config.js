module.exports = {
  content: [
    "./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./hooks/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        body: "rgb(var(--color-body) / <alpha-value>)",
        ink: "rgb(var(--color-ink) / <alpha-value>)",
        surface: "rgb(var(--color-surface) / <alpha-value>)",
        line: "rgb(var(--color-line) / <alpha-value>)",
        muted: "rgb(var(--color-muted) / <alpha-value>)",
        white: "rgb(var(--color-foreground) / <alpha-value>)",
        voltage: "rgb(var(--color-accent) / <alpha-value>)",
        "voltage-hover": "rgb(var(--color-accent-hover) / <alpha-value>)",
        "voltage-subtle": "rgb(var(--color-accent-subtle) / <alpha-value>)",
        "on-accent": "rgb(var(--color-on-accent) / <alpha-value>)",
      },
      fontFamily: {
        display: ["'Clash Display'", "sans-serif"],
        sans: ["'General Sans'", "sans-serif"],
      },
      fontSize: {
        // Fluid display sizes for the AWWWARDS-scale headlines
        "fluid-sm": "clamp(1.5rem, 1rem + 2vw, 2.5rem)",
        "fluid-md": "clamp(2.25rem, 1rem + 5vw, 4.5rem)",
        "fluid-lg": "clamp(3rem, 1rem + 9vw, 8rem)",
        "fluid-xl": "clamp(3.5rem, 0.5rem + 13vw, 12rem)",
      },
      letterSpacing: {
        tightest: "-0.04em",
      },
      maxWidth: {
        container: "1600px",
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        marquee: "marquee 22s linear infinite",
      },
    },
  },
  plugins: [],
};
