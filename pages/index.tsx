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
        <title>Aaryan Porwal · Web Engineer</title>
        <meta
          name="description"
          content="Personal site of Aaryan Porwal, a web engineer who builds fast, resilient web products. Work, writing, and a cat named Anya who screens the inbox."
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
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
