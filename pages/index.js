import Head from "next/head";

export default function Home() {
  return (
    <div>
      <Head>
        <title>Next-tailwind starter by Aaryan</title>
        <meta name="description" content="Welcome! 😁" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1 className="text-3xl font-bold underline text-center">Hello World!</h1>
    </div>
  );
}
