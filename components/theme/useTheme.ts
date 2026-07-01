import { useCallback, useState } from "react";
import {
  applyTheme,
  DEFAULT_THEME,
  normalizeTheme,
  THEME_STORAGE_KEY,
  type ThemeId,
} from "./theme";

export function useTheme(storageKey = THEME_STORAGE_KEY) {
  const [theme, setThemeState] = useState<ThemeId>(() => {
    if (typeof window === "undefined") return DEFAULT_THEME;

    try {
      return normalizeTheme(window.localStorage.getItem(storageKey));
    } catch {
      return DEFAULT_THEME;
    }
  });

  const setTheme = useCallback(
    (nextTheme: ThemeId) => {
      setThemeState(nextTheme);
      applyTheme(nextTheme);
      try {
        window.localStorage.setItem(storageKey, nextTheme);
      } catch {
        // The visual theme should still update when storage is unavailable.
      }
    },
    [storageKey],
  );

  return { theme, setTheme };
}
