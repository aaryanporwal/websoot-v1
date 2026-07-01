import { useCallback, useEffect, useState } from "react";
import {
  DEFAULT_THEME,
  getStoredTheme,
  setDocumentTheme,
  THEME_STORAGE_KEY,
  type ThemeId,
} from "./theme";

export type UseThemeOptions = {
  storageKey?: string;
};

export function useTheme({ storageKey = THEME_STORAGE_KEY }: UseThemeOptions = {}) {
  const [theme, setThemeState] = useState<ThemeId>(DEFAULT_THEME);

  useEffect(() => {
    const savedTheme = getStoredTheme(storageKey);
    setThemeState(savedTheme);
    setDocumentTheme(savedTheme);
  }, [storageKey]);

  const setTheme = useCallback(
    (nextTheme: ThemeId) => {
      setThemeState(nextTheme);
      setDocumentTheme(nextTheme);

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
