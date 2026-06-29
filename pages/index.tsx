import Head from "next/head";
import NavBar from "../components/NavBar";
import Hero from "../components/Hero";
import About from "../components/About";
import Work from "../components/Work";
import Skills from "../components/Skills";
import Contact from "../components/Contact";
import { Footer } from "../components/Footer";

export default function Home() {
  return (
    <div className="grain relative min-h-screen bg-body text-white">
      <Head>
        <title>Aaryan Porwal · Software Engineer</title>
        <meta
          name="description"
          content="Personal site of Aaryan Porwal, a software engineer who cares about sharp interfaces, reliable systems, the craft of building well, and a cat named Anya."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

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
  );
}
