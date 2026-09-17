import { describe, expect, test } from "bun:test";
import { buildSiteCommands } from "../commands";
import { SITE_PROFILE, SITE_SKILLS } from "../siteIdentity";
import { buildSiteCatalog, pageFromPath } from "./catalog";

describe("pageFromPath", () => {
  test("classifies known routes", () => {
    expect(pageFromPath("/")).toEqual({ kind: "home" });
    expect(pageFromPath("/blog/")).toEqual({ kind: "blog-index" });
    expect(pageFromPath("/blog")).toEqual({ kind: "blog-index" });
    expect(pageFromPath("/blog/tags/react/")).toEqual({
      kind: "blog-tag",
      tag: "react",
    });
    expect(pageFromPath("/blog/thinking-in-react/")).toEqual({
      kind: "blog-post",
      href: "/blog/thinking-in-react/",
      title: "thinking-in-react",
      date: "",
      tags: [],
      summary: "",
    });
    expect(pageFromPath("/418")).toEqual({ kind: "other", path: "/418/" });
  });
});

describe("buildSiteCatalog", () => {
  test("embeds public site facts without work images", () => {
    const destinations = buildSiteCommands([]);
    const catalog = buildSiteCatalog({
      destinations,
      writing: [],
      work: [
        {
          title: "Fused",
          tag: "Full Stack",
          description: "Inline diff review.",
          href: "https://example.com",
        },
      ],
      page: { kind: "home" },
    });

    expect(catalog.profile).toEqual(SITE_PROFILE);
    expect(catalog.skills).toEqual(SITE_SKILLS);
    expect(catalog.work[0]?.title).toBe("Fused");
    expect(catalog.destinations.some((item) => item.title === "Contact")).toBe(
      true,
    );
  });
});
