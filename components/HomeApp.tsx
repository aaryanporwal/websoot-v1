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

export default function HomeApp() {
  const [themeOpen, setThemeOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  return (
    <SmoothScroll>
      <div className="grain relative min-h-screen bg-body text-white">
        <NavBar onOpenTheme={() => setThemeOpen(true)} />
        <main>
          <Hero />
          <About />
          <Work />
          <Skills />
          <Contact />
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
