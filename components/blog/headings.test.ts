import { describe, expect, test } from "bun:test";
import {
  activeHeadingId,
  blogTocHeadings,
  headingDepth,
  headingIndentClass,
  headingsToThreads,
  initialHeadingId,
} from "./headings";

const headings = [
  { depth: 2, slug: "one", text: " One " },
  { depth: 3, slug: "two", text: "Two" },
  { depth: 4, slug: "three", text: "Three" },
  { depth: 5, slug: "skip-me", text: "Too deep" },
  { depth: 2, slug: "", text: "Missing slug" },
  { depth: 2, slug: "blank", text: "   " },
];

describe("blogTocHeadings", () => {
  test("keeps h1-h4 headings that have a slug and title", () => {
    expect(blogTocHeadings(headings).map((heading) => heading.slug)).toEqual([
      "one",
      "two",
      "three",
    ]);
  });
});

describe("headingsToThreads", () => {
  test("maps headings onto assistant-ui thread list items", () => {
    expect(headingsToThreads(headings)).toEqual([
      {
        id: "one",
        status: "regular",
        title: "One",
        custom: { depth: 2 },
      },
      {
        id: "two",
        status: "regular",
        title: "Two",
        custom: { depth: 3 },
      },
      {
        id: "three",
        status: "regular",
        title: "Three",
        custom: { depth: 4 },
      },
    ]);
  });
});

describe("headingDepth", () => {
  test("reads a numeric depth and falls back to 2", () => {
    expect(headingDepth({ depth: 3 })).toBe(3);
    expect(headingDepth({ depth: "3" })).toBe(2);
    expect(headingDepth(undefined)).toBe(2);
  });
});

describe("headingIndentClass", () => {
  test("indents nested headings", () => {
    expect(headingIndentClass(2)).toBe("ps-2.5");
    expect(headingIndentClass(3)).toBe("ps-5");
    expect(headingIndentClass(4)).toBe("ps-8");
  });
});

describe("initialHeadingId", () => {
  test("uses a matching hash, otherwise the first heading", () => {
    expect(initialHeadingId(headings, "#two")).toBe("two");
    expect(initialHeadingId(headings, "#missing")).toBe("one");
    expect(initialHeadingId(headings, "")).toBe("one");
    expect(initialHeadingId([], "#two")).toBeUndefined();
  });
});

describe("activeHeadingId", () => {
  test("picks the last heading that has crossed the offset", () => {
    expect(activeHeadingId(headings, [80, 200, 400], 112)).toBe("one");
    expect(activeHeadingId(headings, [-20, 40, 400], 112)).toBe("two");
    expect(activeHeadingId(headings, [-200, -80, 10], 112)).toBe("three");
  });

  test("falls back to the first heading before any have crossed", () => {
    expect(activeHeadingId(headings, [200, 300, 400], 112)).toBe("one");
  });
});
