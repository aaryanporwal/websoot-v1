module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        body: "#08080B",
        ink: "#0B0B10",
        surface: "#121219",
        line: "#23232E",
        muted: "#9A9AB0", // contrast 5.3:1 against body; do not lighten further
        voltage: "#C6FF3D",
      },
      fontFamily: {
        display: ["'Clash Display'", "Inter", "sans-serif"],
        sans: ["'General Sans'", "Inter", "sans-serif"],
        Inter: ["Inter", "sans-serif"],
        Walsheim: ["'GT Walsheim Pro'", "sans-serif"],
      },
      fontSize: {
        // Fluid display sizes for the AWWWARDS-scale headlines
        "fluid-sm": "clamp(1.5rem, 1rem + 2vw, 2.5rem)",
        "fluid-md": "clamp(2.25rem, 1rem + 5vw, 4.5rem)",
        "fluid-lg": "clamp(3rem, 1rem + 9vw, 8rem)",
        "fluid-xl": "clamp(3.5rem, 0.5rem + 13vw, 12rem)",
      },
      letterSpacing: {
        tightest: "-0.05em",
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
