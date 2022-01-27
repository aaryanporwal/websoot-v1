import Head from "next/head";
import NavBar from "../components/NavBar";
import Typical from "react-typical";

export default function Home() {
  return (
    <div className="text-white font-Inter pb-12">
      <Head>
        <title>Welcome to Aaryan&apos;s Personal Website</title>
        <meta name="description" content="Welcome! 😁" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NavBar />

      <div className={"bg-dark-100 px-4 sm:px-8"}>
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
            <h1 className={"text-4xl font-semibold"}>Hi I'm Aaryan 👋.</h1>
            <br />
            <p className={"text-2xl font-semibold"}>
              I'm a pre-final year Computer Science student, passionate
              developer and I can't stop myself from exploring the unexplored.
              Ever.
            </p>
            <br />
            <h3 className={"text-2xl"}>
              Interested in: <br />
              <Typical
                steps={[
                  "Web Development",
                  1200,
                  "Node.js",
                  1200,
                  "System Administration",
                  1200,
                ]}
                loop={Infinity}
                wrapper="p"
              />
            </h3>
          </section>
        </div>
      </div>
    </div>
  );
}
