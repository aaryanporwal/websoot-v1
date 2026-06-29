import SmoothScroll from "./SmoothScroll";
import NavBar from "./NavBar";
import Hero from "./Hero";
import About from "./About";
import Work from "./Work";
import Skills from "./Skills";
import Contact from "./Contact";
import { Footer } from "./Footer";

export default function HomeApp() {
  return (
    <SmoothScroll>
      <div className="grain relative min-h-screen bg-body text-white">
        <NavBar />
        <main>
          <Hero />
          <About />
          <Work />
          <Skills />
          <Contact />
        </main>
        <Footer />
      </div>
    </SmoothScroll>
  );
}
