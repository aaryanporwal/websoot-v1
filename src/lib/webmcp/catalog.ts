import type { CommandItem } from "../commands";
import { SITE_CONTACT, SITE_PROFILE, SITE_SKILLS } from "../siteIdentity";
import { THEME_OPTIONS, type ThemeId } from "../../../components/theme/theme";

export type WritingEntry = {
  title: string;
  href: string;
  date: string;
  tags: string[];
  summary: string;
};

export type WorkEntry = {
  title: string;
  tag: string;
  description: string;
  href: string;
};

export type SitePage =
  | { kind: "home" }
  | { kind: "blog-index" }
  | { kind: "blog-tag"; tag: string }
  | {
      kind: "blog-post";
      title: string;
      date: string;
      tags: string[];
      summary: string;
      href: string;
    }
  | { kind: "other"; path: string };

export type SiteCatalog = {
  profile: typeof SITE_PROFILE;
  contact: typeof SITE_CONTACT;
  skills: readonly string[];
  themes: Array<{ id: ThemeId; label: string }>;
  destinations: CommandItem[];
  writing: WritingEntry[];
  work: WorkEntry[];
  page: SitePage;
};

export function pageFromPath(path: string): SitePage {
  const normalized = path.endsWith("/") && path !== "/" ? path : `${path.replace(/\/$/, "")}/`;

  if (path === "/" || path === "") return { kind: "home" };
  if (normalized === "/blog/") return { kind: "blog-index" };

  const tagMatch = normalized.match(/^\/blog\/tags\/([^/]+)\/$/);
  if (tagMatch?.[1]) return { kind: "blog-tag", tag: tagMatch[1] };

  const postMatch = normalized.match(/^\/blog\/([^/]+)\/$/);
  if (postMatch?.[1]) {
    return {
      kind: "blog-post",
      href: normalized,
      title: postMatch[1],
      date: "",
      tags: [],
      summary: "",
    };
  }

  return { kind: "other", path: normalized === "//" ? "/" : normalized };
}

export function buildSiteCatalog(input: {
  destinations: CommandItem[];
  writing: WritingEntry[];
  work: WorkEntry[];
  page: SitePage;
}): SiteCatalog {
  return {
    profile: SITE_PROFILE,
    contact: SITE_CONTACT,
    skills: SITE_SKILLS,
    themes: THEME_OPTIONS.map((theme) => ({ id: theme.id, label: theme.label })),
    destinations: input.destinations,
    writing: input.writing,
    work: input.work,
    page: input.page,
  };
}
