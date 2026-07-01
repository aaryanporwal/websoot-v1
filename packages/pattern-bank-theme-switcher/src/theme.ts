export type ThemeId =
  | "default"
  | "light"
  | "gruvbox"
  | "everforest"
  | "nature"
  | "rose-pine";

export type ThemeOption = {
  id: ThemeId;
  label: string;
  swatches: [string, string, string, string];
};

export const THEME_STORAGE_KEY = "tiny-theme-palette-theme";
export const DEFAULT_THEME: ThemeId = "default";

export const THEME_OPTIONS: ThemeOption[] = [
  {
    id: "default",
    label: "Default",
    swatches: ["#08080b", "#121219", "#c6ff3d", "#f5f5f7"],
  },
  {
    id: "light",
    label: "Light",
    swatches: ["#f7f3e8", "#ffffff", "#2563eb", "#1f2937"],
  },
  {
    id: "gruvbox",
    label: "Gruvbox",
    swatches: ["#282828", "#3c3836", "#fabd2f", "#ebdbb2"],
  },
  {
    id: "everforest",
    label: "Everforest",
    swatches: ["#2f383e", "#3a464c", "#a7c080", "#d3c6aa"],
  },
  {
    id: "nature",
    label: "Nature",
    swatches: ["#10231b", "#183528", "#8bc34a", "#f1f8e9"],
  },
  {
    id: "rose-pine",
    label: "Rosé Pine",
    swatches: ["#191724", "#1f1d2e", "#ebbcba", "#e0def4"],
  },
];

export function normalizeTheme(value: string | null | undefined): ThemeId {
  if (value === "dark") return DEFAULT_THEME;
  return THEME_OPTIONS.some((theme) => theme.id === value)
    ? (value as ThemeId)
    : DEFAULT_THEME;
}

export function getStoredTheme(storageKey = THEME_STORAGE_KEY): ThemeId {
  if (typeof window === "undefined") return DEFAULT_THEME;

  try {
    return normalizeTheme(window.localStorage.getItem(storageKey));
  } catch {
    return DEFAULT_THEME;
  }
}

export function setDocumentTheme(theme: ThemeId, root?: HTMLElement) {
  const target =
    root ?? (typeof document === "undefined" ? undefined : document.documentElement);

  if (target) target.dataset.theme = theme;
}

export function createThemeBootstrapScript(storageKey = THEME_STORAGE_KEY) {
  const ids = THEME_OPTIONS.map((theme) => theme.id);
  return `(()=>{try{const fallback="default";const themes=new Set(${JSON.stringify(
    ids,
  )});const saved=localStorage.getItem(${JSON.stringify(
    storageKey,
  )});const theme=saved==="dark"?fallback:themes.has(saved)?saved:fallback;document.documentElement.dataset.theme=theme;}catch{document.documentElement.dataset.theme="default";}})();`;
}
