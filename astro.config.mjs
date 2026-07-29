import { defineConfig } from "astro/config";
import react from "@astrojs/react";

export default defineConfig({
  site: "https://aaryanporwal.com",
  integrations: [react()],
  image: {
    layout: "constrained",
  },
  vite: {
    build: {
      target: "es2022",
    },
  },
});
