import Head from "next/head";

export default function Home() {
  return (
    <div className="text-white font-Inter pb-12">
      <Head>
        <title>Welcome to Aaryan&apos;s Personal Website</title>
        <meta name="description" content="Welcome! 😁" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="py-6">
        <div className="container flex justify-between items-center mx-auto px-8 md:px-14 lg:px-24 w-full">
          <div className="text-4xl wei sm:text-5xl font-extrabold">
            <span className="animated-gradient">Aaryan Porwal</span>
          </div>
          <div className="links hidden md:flex space-x-12 items-center">
            <a href="#" className="text-selected-text">
              Projects
            </a>
            <a href="#">Scrapbook</a>
            <a href="#">Blog</a>
            <a href="#resume">
              <button className="px-6 py-2 bg-theme font-bold">Resume</button>
            </a>
          </div>
        </div>
      </header>

      <main>
        {/* <h1 className="text-3xl font-bold underline text-center">
          Hello World!
        </h1> */}
      </main>
    </div>
  );
}
