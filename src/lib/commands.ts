export type CommandSection = "Navigation" | "Writing" | "Social";

export type CommandItem = {
  title: string;
  href: string;
  section: CommandSection;
  description?: string;
  external?: boolean;
};

export const SITE_NAVIGATION: CommandItem[] = [
  {
    title: "Home",
    href: "/",
    section: "Navigation",
    description: "Back to the top",
  },
  {
    title: "Work",
    href: "/#work",
    section: "Navigation",
    description: "Work experience",
  },
  {
    title: "Skills",
    href: "/#skills",
    section: "Navigation",
    description: "Tools and technologies",
  },
  {
    title: "Blog",
    href: "/blog/",
    section: "Navigation",
    description: "Writing archive",
  },
  {
    title: "Contact",
    href: "/#contact",
    section: "Navigation",
    description: "Get in touch",
  },
];

export const SITE_SOCIAL: CommandItem[] = [
  {
    title: "GitHub",
    href: "https://github.com/aaryanporwal?tab=repositories",
    section: "Social",
    description: "Projects and repositories",
    external: true,
  },
  {
    title: "LinkedIn",
    href: "https://www.linkedin.com/in/aaryan-porwal/",
    section: "Social",
    description: "Professional profile",
    external: true,
  },
  {
    title: "Scrapbook",
    href: "https://scrapbook.hackclub.com/aaryan",
    section: "Social",
    description: "Build notes and updates",
    external: true,
  },
];

export function normalizeCommandText(value: string) {
  return value.trim().toLowerCase();
}

export function commandText(command: CommandItem) {
  return normalizeCommandText(
    [command.title, command.section, command.description, command.href]
      .filter(Boolean)
      .join(" "),
  );
}

export function filterCommands(commands: CommandItem[], query: string) {
  const needle = normalizeCommandText(query);
  if (!needle) return commands;

  return commands.filter((command) => commandText(command).includes(needle));
}

export function buildSiteCommands(
  writing: Array<Pick<CommandItem, "title" | "href" | "description">>,
): CommandItem[] {
  return [
    ...SITE_NAVIGATION,
    ...SITE_SOCIAL,
    ...writing.map((post) => ({
      title: post.title,
      href: post.href,
      section: "Writing" as const,
      description: post.description,
    })),
  ];
}
