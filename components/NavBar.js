export default function Header() {
  const handleClick = () => {
    const menu = document.querySelector(".mobile-menu");
    menu.classList.toggle("hidden");
  };

  const BLOG_URL = "https://blog.aaryanporwal.com/";
  const GITHUB_URL = "https://github.com/aaryanporwal";
  const LINKEDIN_URL = "https://www.linkedin.com/in/aaryan-porwal/";
  const TWITTER_URL = "https://twitter.com/aaryan7476";
  const RESUME_URL =
    "https://drive.google.com/file/d/1ARuthi5F4SXO4m0ZnyOK2aj95SVf7Ehc/view";
  const SCRAPBOOK_URL = "https://scrapbook.hackclub.com/aaryan";
  const PROJECTS_URL = "https://github.com/aaryanporwal?tab=repositories";

  return (
    <>
      <header className="py-6">
        <div className="font-Inter container flex justify-between items-center mx-auto px-8 md:px-10 lg:px-24 w-full">
          <div className="text-4xl sm:text-4xl font-extrabold md:text-3xl lg:text-4xl">
            <span className="animated-gradient tracking-tighter">
              Aaryan Porwal
            </span>
          </div>

          {/* nav links start from here: */}
          <div className="font-Walsheim links hidden md:flex space-x-12 items-center">
            <a
              href={PROJECTS_URL}
              className="hover:text-selected-text hover:scale-125 ease-in-out duration-300"
              target="_blank"
            >
              Projects
            </a>
            <a
              href={SCRAPBOOK_URL}
              className="hover:text-selected-text hover:scale-125 ease-in-out duration-300"
              target="_blank"
            >
              Scrapbook
            </a>
            <a
              href={BLOG_URL}
              className="hover:text-selected-text duration-300 hover:scale-125 ease-in-out"
              target="_blank"
            >
              Blog
            </a>
            <a href={RESUME_URL} className="" target="_blank">
              <button className="rounded-md px-6 py-2 bg-theme font-bold hover:scale-125 ease-in-out duration-300 ">
                Resume
              </button>
            </a>
          </div>

          {/* mobile hamburger menu */}
          <div className="md:hidden" onClick={handleClick}>
            <button className="mobile-menu-button">
              <svg
                className="stroke-cyan-500 hover:fill-cyan-500 duration-300"
                width="40"
                height="40"
                viewBox="0 0 26 18"
                xmlns="http://www.w3.org/2000/svg"
                fill="white"
              >
                <path d="M13 17.5H0.25V14.6667H13V17.5ZM25.75 10.4167H0.25V7.58333H25.75V10.4167ZM25.75 3.33333H13V0.5H25.75V3.33333Z" />
              </svg>
            </button>
          </div>
        </div>
        {/* container flex end*/}

        {/* mobile dropdown links here */}
        <div className="bg-gray-500 mt-3 text-right float-right mr-10 py-4 px-4 rounded-md mobile-menu hidden md:hidden">
          <a
            href={PROJECTS_URL}
            className="block hover:text-selected-text duration-300 py-2 px-3"
            target="_blank"
          >
            Projects
          </a>
          <a
            href={SCRAPBOOK_URL}
            className="block hover:text-selected-text duration-300 py-2 px-3"
            target="_blank"
          >
            Scrapbook
          </a>
          <a
            href={BLOG_URL}
            className="block hover:text-selected-text duration-300 py-2 px-3"
            target="_blank"
          >
            Blog
          </a>
          <a
            href={RESUME_URL}
            className="rounded-md inline-block bg-theme font-bold hover:scale-110 ease-in-out duration-300 py-2 px-3"
            target="_blank"
          >
            Resume
          </a>
        </div>
      </header>
    </>
  );
}
