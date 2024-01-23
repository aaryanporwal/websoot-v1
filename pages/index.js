import React from "react";
import Head from "next/head";
import NavBar from "../components/NavBar";
import Typed from 'typed.js';

import { Signature } from "../components/Signature";
import { Footer } from "../components/Footer";

export default function Home() {

  // typed.js https://github.com/mattboldt/typed.js/?tab=readme-ov-file#reactjs-usage
  // Create reference to store the DOM element containing the animation
  const el = React.useRef(null);
  React.useEffect(() => {
    const typed = new Typed(el.current, {
      strings: ['Web Development.', 'Node.js.', 'DevOps.'],
      typeSpeed: 70,
      backSpeed: 70,
      loop: true,
      loopCount: Infinity,
    });

    return () => {
      // Destroy Typed instance during cleanup to stop animation
      typed.destroy();
    };
  }, []);
  // end of typed.js

  return (
    <div className="text-white pb-12">
      <Head>
        <title>Welcome to Aaryan&apos;s Personal Website</title>
        <meta name="description" content="Welcome! 😁" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <NavBar />

      <div className="bg-dark-100 px-4 sm:px-8 font-Walsheim">
        <div className="mx-auto flex w-full max-w-prose flex-col justify-center py-16">
          <section className="mt-16 w-full self-start text-dark-900 dark:text-gray-50">
            <h1 className="text-4xl font-bold">Hi I&apos;m Aaryan 👋.</h1>
            <br />
            <p className="text-2xl font-semibold">
              A Computer Science student and a passionate developer who&apos;s always
              exploring the unexplored.
            </p>
            <br />
            <h3 className="text-2xl">
              Interested in:{" "}
              <span ref={el}></span>
            </h3>
            <Signature />
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}
