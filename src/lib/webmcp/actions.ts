import {
  applyTheme,
  normalizeTheme,
  THEME_STORAGE_KEY,
  type ThemeId,
} from "../../../components/theme/theme";
import {
  CONTACT_UNLOCK_EVENT,
  CONTACT_UNLOCK_STORAGE_KEY,
  THEME_CHANGE_EVENT,
} from "../siteEvents";

export type SiteToolActions = {
  getTheme: () => ThemeId;
  setTheme: (theme: ThemeId) => void;
  openDestination: (href: string) => void;
  unlockContact: () => { alreadyOnHome: boolean };
};

function persistTheme(theme: ThemeId) {
  applyTheme(theme);
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Theme should still apply when storage is unavailable.
  }
  window.dispatchEvent(
    new CustomEvent(THEME_CHANGE_EVENT, { detail: { theme } }),
  );
}

function currentTheme(): ThemeId {
  if (typeof document === "undefined") return normalizeTheme(null);
  return normalizeTheme(document.documentElement.dataset.theme);
}

function isHomePath(pathname: string) {
  return pathname === "/" || pathname === "/index.html";
}

export function createBrowserActions(): SiteToolActions {
  return {
    getTheme: currentTheme,
    setTheme: persistTheme,
    openDestination(href) {
      window.location.assign(href);
    },
    unlockContact() {
      const alreadyOnHome = isHomePath(window.location.pathname);
      if (alreadyOnHome) {
        window.dispatchEvent(new CustomEvent(CONTACT_UNLOCK_EVENT));
        if (!window.location.hash || window.location.hash === "#") {
          window.location.hash = "contact";
        }
        return { alreadyOnHome: true };
      }

      try {
        window.sessionStorage.setItem(CONTACT_UNLOCK_STORAGE_KEY, "1");
      } catch {
        // Navigation still reaches the contact section.
      }
      window.location.assign("/#contact");
      return { alreadyOnHome: false };
    },
  };
}
