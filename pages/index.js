import Head from "next/head";
import NavBar from "../components/NavBar";
import Typical from "react-typical";

import { Signature } from "../components/Signature";
import { Footer } from "../components/Footer";

export default function Home() {
  return (
    <div className="text-white pb-12">
      <Head>
        <title>Welcome to Aaryan&apos;s Personal Website</title>
        <meta name="description" content="Welcome! 😁" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <NavBar />

      <div className={"bg-dark-100 px-4 sm:px-8 font-Walsheim"}>
        <div
          className={
            "mx-auto flex w-full max-w-prose flex-col justify-center py-16"
          }
        >
          <section
            className={
              "mt-16 w-full self-start text-dark-900 dark:text-gray-50"
            }
          >
            <h1 className={"text-4xl font-bold"}>Hi I'm Aaryan 👋.</h1>
            <br />
            <p className={"text-2xl font-semibold"}>
              A Computer Science student, passionate developer and always
              exploring the unexplored.
            </p>
            <br />
            <h3 className={"text-2xl"}>
              Interested in:{" "}
              <Typical
                steps={[
                  "Web Development",
                  1200,
                  "Node.js",
                  1200,
                  "Sys admin",
                  1200,
                ]}
                loop={Infinity}
                wrapper="span"
              />
            </h3>
            <Signature />
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}
