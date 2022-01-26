import Head from "next/head";
import Header from "../components/Header";


export default function Home() {
  return (
    <div className="text-white font-Inter pb-12">
      <Head>
        <title>Welcome to Aaryan&apos;s Personal Website</title>
        <meta name="description" content="Welcome! 😁" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <main>
        {/* <h1 className="text-3xl font-bold underline text-center">
          Hello World!
        </h1> */}
      </main>
    </div>
  );
}
