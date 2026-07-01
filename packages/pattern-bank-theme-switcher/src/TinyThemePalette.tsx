import "./loadStyles.js";

import { useState, type ReactNode } from "react";
import { PaletteIcon, ThemeMenu } from "./ThemeMenu";
import { THEME_STORAGE_KEY, type ThemeId } from "./theme";
import { useTheme } from "./useTheme";

export type ThemeTriggerRenderProps = {
  open: boolean;
  theme: ThemeId;
  toggle: () => void;
  icon: ReactNode;
};

export type TinyThemePaletteProps = {
  storageKey?: string;
  label?: string;
  showLabel?: boolean;
  closeOnSelect?: boolean;
  className?: string;
  buttonClassName?: string;
  menuClassName?: string;
  renderTrigger?: (props: ThemeTriggerRenderProps) => ReactNode;
  onThemeChange?: (theme: ThemeId) => void;
};

function joinClassNames(...classNames: Array<string | undefined>) {
  return classNames.filter(Boolean).join(" ");
}

export function TinyThemePalette({
  storageKey = THEME_STORAGE_KEY,
  label = "Theme",
  showLabel = true,
  closeOnSelect = true,
  className,
  buttonClassName,
  menuClassName,
  renderTrigger,
  onThemeChange,
}: TinyThemePaletteProps) {
  const [open, setOpen] = useState(false);
  const { theme, setTheme } = useTheme({ storageKey });
  const icon = <PaletteIcon />;
  const toggle = () => setOpen((current) => !current);

  const selectTheme = (nextTheme: ThemeId) => {
    setTheme(nextTheme);
    onThemeChange?.(nextTheme);
    if (closeOnSelect) setOpen(false);
  };

  return (
    <span className={joinClassNames("pbts-root", className)}>
      {renderTrigger ? (
        renderTrigger({ open, theme, toggle, icon })
      ) : (
        <button
          type="button"
          aria-label={label}
          aria-haspopup="dialog"
          aria-expanded={open}
          className={joinClassNames("pbts-trigger", buttonClassName)}
          onClick={toggle}
        >
          {icon}
          {showLabel && <span>{label}</span>}
        </button>
      )}

      <ThemeMenu
        className={menuClassName}
        open={open}
        theme={theme}
        onClose={() => setOpen(false)}
        onSelect={selectTheme}
      />
    </span>
  );
}

export const ThemeSwitcher = TinyThemePalette;

export default TinyThemePalette;
