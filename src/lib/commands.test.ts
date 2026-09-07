import { describe, expect, test } from "bun:test";
import {
  buildSiteCommands,
  filterCommands,
  type CommandItem,
} from "./commands";

const commands: CommandItem[] = buildSiteCommands([
  {
    title: "Thinking in React",
    href: "/blog/thinking-in-react/",
    description: "A walk through React's mental model.",
  },
  {
    title: "English SEO is a losing battle",
    href: "/blog/english-seo-is-a-losing-battle/",
    description: "Search in a language the web already speaks.",
  },
]);

describe("filterCommands", () => {
  test("returns every command for an empty query", () => {
    expect(filterCommands(commands, "   ")).toEqual(commands);
  });

  test("matches titles, descriptions, sections, and hrefs", () => {
    expect(filterCommands(commands, "linkedin").map((item) => item.title)).toEqual([
      "LinkedIn",
    ]);
    expect(filterCommands(commands, "writing").some((item) => item.title === "Thinking in React")).toBe(
      true,
    );
    expect(filterCommands(commands, "/#work").map((item) => item.title)).toEqual([
      "Work",
    ]);
  });

  test("is case-insensitive", () => {
    expect(filterCommands(commands, "REACT").map((item) => item.title)).toEqual([
      "Thinking in React",
    ]);
  });
});
