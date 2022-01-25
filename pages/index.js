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
          <div className="text-4xl sm:text-5xl font-extrabold">
            <span className="animated-gradient tracking-tighter">
              Aaryan Porwal
            </span>
          </div>

          {/* nav links start from here: */}
          <div className="links hidden md:flex space-x-12 items-center">
            <a href="#" className="hover:text-selected-text duration-300">
              Projects
            </a>
            <a href="#" className="hover:text-selected-text duration-300">
              Scrapbook
            </a>
            <a href="#" className="hover:text-selected-text duration-300">
              Blog
            </a>
            <a href="#resume" className="">
              <button className="rounded-md px-6 py-2 bg-theme font-bold hover:scale-110 ease-in-out duration-300 ">
                Resume
              </button>
            </a>
          </div>

          <div className="md:hidden">
            <svg
              className="stroke-cyan-500 "
              width="34"
              height="34"
              viewBox="0 0 26 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                className="hover:fill-cyan-500 duration-300"
                d="M13 17.5H0.25V14.6667H13V17.5ZM25.75 10.4167H0.25V7.58333H25.75V10.4167ZM25.75 3.33333H13V0.5H25.75V3.33333Z"
                fill="white"
              />
            </svg>
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
