import { describe, expect, test } from "bun:test";
import { buildSiteCommands } from "../commands";
import { SITE_CONTACT } from "../siteIdentity";
import { buildSiteCatalog } from "./catalog";
import { createSiteTools, resolveDestination } from "./tools";
import type { SiteToolActions } from "./actions";
import type { ThemeId } from "../../../components/theme/theme";

function catalog(page: "home" | "blog-index" = "home") {
  return buildSiteCatalog({
    destinations: buildSiteCommands([
      {
        title: "Thinking in React",
        href: "/blog/thinking-in-react/",
        description: "React mental model",
      },
    ]),
    writing: [
      {
        title: "Thinking in React",
        href: "/blog/thinking-in-react/",
        date: "2024-01-01T00:00:00.000Z",
        tags: ["react"],
        summary: "React mental model",
      },
    ],
    work: [
      {
        title: "Fused",
        tag: "Full Stack",
        description: "Inline diff review.",
        href: "https://example.com/fused",
      },
    ],
    page: page === "home" ? { kind: "home" } : { kind: "blog-index" },
  });
}

function actions(): SiteToolActions & {
  opened: string[];
  themes: string[];
  unlocks: number;
} {
  const record = {
    opened: [] as string[],
    themes: [] as string[],
    unlocks: 0,
    getTheme: () => "default" as const,
    setTheme(theme: ThemeId) {
      record.themes.push(theme);
    },
    openDestination(href: string) {
      record.opened.push(href);
    },
    unlockContact() {
      record.unlocks += 1;
      return { alreadyOnHome: true };
    },
  };
  return record;
}

const unusedSignal = { aborted: false } as AbortSignal;

describe("resolveDestination", () => {
  const destinations = catalog().destinations;

  test("matches exact href or unique title", () => {
    expect(resolveDestination(destinations, "/#contact")).toMatchObject({
      ok: true,
      destination: { title: "Contact" },
    });
    expect(resolveDestination(destinations, "blog")).toMatchObject({
      ok: true,
      destination: { href: "/blog/" },
    });
  });

  test("rejects empty, missing, and ambiguous queries", () => {
    expect(resolveDestination(destinations, "  ").reason).toBe("empty");
    expect(resolveDestination(destinations, "not-a-page").reason).toBe("missing");
    expect(resolveDestination(destinations, "/blog").reason).toBe("ambiguous");
  });
});

describe("createSiteTools", () => {
  test("exposes a narrow site-wide catalog and scopes unlock_contact to home", () => {
    const homeNames = createSiteTools(catalog("home"), actions()).map(
      (tool) => tool.name,
    );
    const blogNames = createSiteTools(catalog("blog-index"), actions()).map(
      (tool) => tool.name,
    );

    expect(homeNames).toEqual([
      "get_site_context",
      "search_site",
      "open_destination",
      "set_theme",
      "unlock_contact",
    ]);
    expect(blogNames).toEqual([
      "get_site_context",
      "search_site",
      "open_destination",
      "set_theme",
    ]);
  });

  test("get_site_context returns public facts without requiring a browser", async () => {
    const [contextTool] = createSiteTools(catalog(), actions());
    const result = (await contextTool?.execute({}, { signal: unusedSignal })) as {
      profile: { name: string };
      contact: typeof SITE_CONTACT;
      writing: Array<{ title: string }>;
    };

    expect(result.profile.name).toBe("Aaryan Porwal");
    expect(result.contact).toEqual(SITE_CONTACT);
    expect(result.writing[0]?.title).toBe("Thinking in React");
  });

  test("search_site reuses command-switcher matching", async () => {
    const search = createSiteTools(catalog(), actions()).find(
      (tool) => tool.name === "search_site",
    );
    const result = (await search?.execute(
      { query: "react" },
      { signal: unusedSignal },
    )) as { count: number; matches: Array<{ title: string }> };

    expect(result.count).toBe(1);
    expect(result.matches[0]?.title).toBe("Thinking in React");
  });

  test("open_destination navigates exact matches and rejects bad input", async () => {
    const recorded = actions();
    const open = createSiteTools(catalog(), recorded).find(
      (tool) => tool.name === "open_destination",
    );

    await open?.execute({ destination: "Contact" }, { signal: unusedSignal });
    expect(recorded.opened).toEqual(["/#contact"]);

    expect(() =>
      open?.execute({ destination: "not-a-page" }, { signal: unusedSignal }),
    ).toThrow(/No destination matches/);
    expect(() =>
      open?.execute({ destination: "/blog" }, { signal: unusedSignal }),
    ).toThrow(/Multiple destinations/);
  });

  test("set_theme validates the enum before applying", async () => {
    const recorded = actions();
    const setTheme = createSiteTools(catalog(), recorded).find(
      (tool) => tool.name === "set_theme",
    );

    await setTheme?.execute({ theme: "gruvbox" }, { signal: unusedSignal });
    expect(recorded.themes).toEqual(["gruvbox"]);

    expect(() =>
      setTheme?.execute({ theme: "neon" }, { signal: unusedSignal }),
    ).toThrow(/theme must be one of/);
  });

  test("unlock_contact reuses the contact action and returns public channels", async () => {
    const recorded = actions();
    const unlock = createSiteTools(catalog("home"), recorded).find(
      (tool) => tool.name === "unlock_contact",
    );

    const result = (await unlock?.execute({}, { signal: unusedSignal })) as {
      unlocked: boolean;
      contact: typeof SITE_CONTACT;
    };
    expect(result.unlocked).toBe(true);
    expect(result.contact.email).toBe(SITE_CONTACT.email);
    expect(recorded.unlocks).toBe(1);
  });
});
