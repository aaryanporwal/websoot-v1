import type { HomeImages } from "../src/types/homeImages";
import SmoothScroll from "./SmoothScroll";
import NavBar from "./NavBar";
import Hero from "./Hero";
import About from "./About";
import Work from "./Work";
import Skills from "./Skills";
import Contact from "./Contact";
import { Footer } from "./Footer";
import ThemeMenu from "./theme/ThemeMenu";
import { useTheme } from "./theme/useTheme";
import { useState } from "react";

export default function HomeApp({ images }: { images: HomeImages }) {
  const [themeOpen, setThemeOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  return (
    <SmoothScroll>
      <div className="relative min-h-screen bg-body text-white">
        <NavBar onOpenTheme={() => setThemeOpen(true)} />
        <main className="relative z-10">
          <Hero />
          <About />
          <Work projects={images.work} />
          <Skills />
          <Contact images={images.contact} />
        </main>
        <Footer />
      </div>
      <ThemeMenu
        open={themeOpen}
        theme={theme}
        onClose={() => setThemeOpen(false)}
        onSelect={setTheme}
      />
    </SmoothScroll>
  );
}
