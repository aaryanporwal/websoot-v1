import { useCallback, useEffect, useState } from "react";
import {
  applyTheme,
  DEFAULT_THEME,
  normalizeTheme,
  THEME_STORAGE_KEY,
  type ThemeId,
} from "./theme";

export function useTheme(storageKey = THEME_STORAGE_KEY) {
  const [theme, setThemeState] = useState<ThemeId>(DEFAULT_THEME);

  useEffect(() => {
    const savedTheme = normalizeTheme(window.localStorage.getItem(storageKey));
    setThemeState(savedTheme);
    applyTheme(savedTheme);
  }, [storageKey]);

  const setTheme = useCallback(
    (nextTheme: ThemeId) => {
      setThemeState(nextTheme);
      applyTheme(nextTheme);
      window.localStorage.setItem(storageKey, nextTheme);
    },
    [storageKey],
  );

  return { theme, setTheme };
}
