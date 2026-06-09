import Head from "next/head";
import NavBar from "../components/NavBar";
import Hero from "../components/Hero";
import About from "../components/About";
import Work from "../components/Work";
import Skills from "../components/Skills";
import { Footer } from "../components/Footer";

export default function Home() {
  return (
    <div className="grain relative min-h-screen bg-body text-white">
      <Head>
        <title>Aaryan Porwal — Web Engineer</title>
        <meta
          name="description"
          content="Aaryan Porwal — Web Engineer crafting fast, resilient, award-worthy web products. Web Development, Node.js, DevOps & Cloud."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <NavBar />
      <main>
        <Hero />
        <About />
        <Work />
        <Skills />
        <Footer />
      </main>
    </div>
  );
}
