import { useCallback, useState } from "react";
import {
  getStoredTheme,
  setDocumentTheme,
  THEME_STORAGE_KEY,
  type ThemeId,
} from "./theme";

export type UseThemeOptions = {
  storageKey?: string;
};

export function useTheme({
  storageKey = THEME_STORAGE_KEY,
}: UseThemeOptions = {}) {
  const [theme, setThemeState] = useState<ThemeId>(() =>
    getStoredTheme(storageKey),
  );

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
