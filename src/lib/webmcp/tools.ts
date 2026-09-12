import {
  filterCommands,
  normalizeCommandText,
  type CommandItem,
} from "../commands";
import { THEME_OPTIONS, type ThemeId } from "../../../components/theme/theme";
import type { SiteCatalog } from "./catalog";
import type { SiteToolActions } from "./actions";

export type ToolAnnotations = {
  readOnlyHint?: boolean;
  untrustedContentHint?: boolean;
  consequentialHint?: boolean;
};

export type SiteTool = {
  name: string;
  title: string;
  description: string;
  inputSchema: Record<string, unknown>;
  annotations: ToolAnnotations;
  execute: (
    input: Record<string, unknown>,
    options: { signal: AbortSignal },
  ) => unknown | Promise<unknown>;
};

const EMPTY_OBJECT_SCHEMA = {
  type: "object",
  properties: {},
  additionalProperties: false,
} as const;

const THEME_IDS = THEME_OPTIONS.map((theme) => theme.id);

export function resolveDestination(
  destinations: CommandItem[],
  query: string,
):
  | { ok: true; destination: CommandItem }
  | {
      ok: false;
      reason: "empty" | "ambiguous" | "missing";
      matches: CommandItem[];
    } {
  const needle = normalizeCommandText(query);
  if (!needle) {
    return { ok: false, reason: "empty", matches: [] };
  }

  const exactHref = destinations.find(
    (destination) => normalizeCommandText(destination.href) === needle,
  );
  if (exactHref) return { ok: true, destination: exactHref };

  const exactTitle = destinations.filter(
    (destination) => normalizeCommandText(destination.title) === needle,
  );
  if (exactTitle.length === 1 && exactTitle[0]) {
    return { ok: true, destination: exactTitle[0] };
  }
  if (exactTitle.length > 1) {
    return { ok: false, reason: "ambiguous", matches: exactTitle };
  }

  const partial = destinations.filter((destination) => {
    return (
      normalizeCommandText(destination.title).includes(needle) ||
      normalizeCommandText(destination.href).includes(needle)
    );
  });

  if (partial.length === 1 && partial[0]) {
    return { ok: true, destination: partial[0] };
  }
  if (partial.length > 1) {
    return { ok: false, reason: "ambiguous", matches: partial };
  }

  return { ok: false, reason: "missing", matches: [] };
}

function destinationSummary(destination: CommandItem) {
  return {
    title: destination.title,
    href: destination.href,
    section: destination.section,
    description: destination.description ?? null,
    external: destination.external === true,
  };
}

function pageLabel(page: SiteCatalog["page"]) {
  switch (page.kind) {
    case "home":
      return "Home";
    case "blog-index":
      return "Blog index";
    case "blog-tag":
      return `Blog tag: ${page.tag}`;
    case "blog-post":
      return page.title;
    case "other":
      return page.path;
  }
}

export function createSiteTools(
  catalog: SiteCatalog,
  actions: SiteToolActions,
): SiteTool[] {
  const tools: SiteTool[] = [
    {
      name: "get_site_context",
      title: "Get site context",
      description:
        "Return who Aaryan is, the current page, published writing, work, skills, public contact channels, destinations, and the active theme. Use this to answer questions about the site or decide what to open next.",
      inputSchema: EMPTY_OBJECT_SCHEMA,
      annotations: { readOnlyHint: true },
      execute() {
        return {
          profile: catalog.profile,
          page: catalog.page,
          pageLabel: pageLabel(catalog.page),
          theme: actions.getTheme(),
          themes: catalog.themes,
          contact: catalog.contact,
          skills: catalog.skills,
          work: catalog.work,
          writing: catalog.writing,
          destinations: catalog.destinations.map(destinationSummary),
        };
      },
    },
    {
      name: "search_site",
      title: "Search the site",
      description:
        "Search navigation, writing, and social destinations using the same matching as the command switcher. Use this when looking for a specific page, post, or profile link.",
      inputSchema: {
        type: "object",
        properties: {
          query: {
            type: "string",
            minLength: 1,
            description:
              "Text to match against titles, descriptions, sections, and URLs.",
          },
        },
        required: ["query"],
        additionalProperties: false,
      },
      annotations: { readOnlyHint: true },
      execute({ query }) {
        if (typeof query !== "string" || query.trim() === "") {
          throw new Error("query must be a non-empty string.");
        }

        const matches = filterCommands(catalog.destinations, query).map(
          destinationSummary,
        );
        return { query, count: matches.length, matches };
      },
    },
    {
      name: "open_destination",
      title: "Open a destination",
      description:
        "Navigate this tab to a destination from get_site_context or search_site. Accepts a title or URL such as Blog, Contact, /#work, or a writing slug.",
      inputSchema: {
        type: "object",
        properties: {
          destination: {
            type: "string",
            minLength: 1,
            description: "Destination title or href to open.",
          },
        },
        required: ["destination"],
        additionalProperties: false,
      },
      annotations: { readOnlyHint: false },
      execute({ destination }) {
        if (typeof destination !== "string") {
          throw new Error("destination must be a string.");
        }

        const resolved = resolveDestination(catalog.destinations, destination);
        if (resolved.ok) {
          actions.openDestination(resolved.destination.href);
          return {
            opened: true,
            destination: destinationSummary(resolved.destination),
          };
        }

        if (resolved.reason === "empty") {
          throw new Error("destination must be a non-empty string.");
        }

        if (resolved.reason === "ambiguous") {
          throw new Error(
            `Multiple destinations match "${destination}". Be more specific: ${resolved.matches
              .map((match) => `${match.title} (${match.href})`)
              .join(", ")}.`,
          );
        }

        throw new Error(
          `No destination matches "${destination}". Call search_site or get_site_context first.`,
        );
      },
    },
    {
      name: "set_theme",
      title: "Set theme",
      description:
        "Change the visible color theme for this visit. Available ids: default, light, gruvbox, everforest, nature, rose-pine.",
      inputSchema: {
        type: "object",
        properties: {
          theme: {
            type: "string",
            enum: THEME_IDS,
            description: "Theme id to apply.",
          },
        },
        required: ["theme"],
        additionalProperties: false,
      },
      annotations: { readOnlyHint: false },
      execute({ theme }) {
        if (typeof theme !== "string" || !THEME_IDS.includes(theme as ThemeId)) {
          throw new Error(
            `theme must be one of: ${THEME_IDS.join(", ")}.`,
          );
        }

        const next = theme as ThemeId;
        actions.setTheme(next);
        return {
          theme: next,
          label:
            catalog.themes.find((option) => option.id === next)?.label ?? next,
        };
      },
    },
  ];

  if (catalog.page.kind === "home") {
    tools.push({
      name: "unlock_contact",
      title: "Unlock contact",
      description:
        "Play the on-page contact moment: bribe Anya the cat so the human-visible contact channels appear. Public email, LinkedIn, and calendar links are also available from get_site_context without unlocking.",
      inputSchema: EMPTY_OBJECT_SCHEMA,
      annotations: { readOnlyHint: false },
      execute() {
        const result = actions.unlockContact();
        return {
          unlocked: true,
          alreadyOnHome: result.alreadyOnHome,
          contact: catalog.contact,
        };
      },
    });
  }

  return tools;
}
