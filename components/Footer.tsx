const GITHUB_URL = "https://github.com/aaryanporwal";
const LINKEDIN_URL = "https://www.linkedin.com/in/aaryan-porwal/";
const TWITTER_URL = "https://twitter.com/aaryan7476";

const SOCIALS = [
  { label: "LinkedIn", href: LINKEDIN_URL },
  { label: "Twitter", href: TWITTER_URL },
  { label: "GitHub", href: GITHUB_URL },
];

export function Footer() {
  return (
    <footer className="relative w-full bg-body px-6 pb-10 pt-16 sm:px-10 lg:px-16">
      <div className="mx-auto flex max-w-container flex-col gap-6 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
        <ul className="flex flex-wrap gap-x-8 gap-y-3 font-sans text-base">
          {SOCIALS.map((s) => (
            <li key={s.label}>
              <a
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className="text-muted outline-none transition-colors hover:text-voltage focus-visible:text-voltage"
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
        <p className="font-sans text-sm text-muted">
          &copy; {new Date().getFullYear()} Aaryan Porwal. Built with Astro,
          GSAP, and Bun.
        </p>
      </div>
    </footer>
  );
}
