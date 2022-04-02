export function Footer({}) {
  const GITHUB_URL = "https://github.com/aaryanporwal";
  const LINKEDIN_URL = "https://www.linkedin.com/in/aaryan-porwal/";
  const TWITTER_URL = "https://twitter.com/aaryan7476";

  return (
    <footer className="fixed inset-x-0 bottom-0">
      {/* Social Links */}
      <ul className="bg-slate-900 flex space-x-10 justify-center py-5">
        <li>
          <a className="underline" href={TWITTER_URL}>
            Twitter
          </a>
        </li>
        <li>
          <a className="underline" href={LINKEDIN_URL}>
            LinkedIn
          </a>
        </li>
        <li>
          <a className="underline" href={GITHUB_URL}>
            GitHub
          </a>
        </li>
        <li>
          <a className="underline" href="mailto:aaryanporwal2233@gmail.com">
            E-mail
          </a>
        </li>
      </ul>
    </footer>
  );
}
