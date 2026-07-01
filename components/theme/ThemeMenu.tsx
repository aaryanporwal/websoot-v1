import { useEffect } from "react";
import { THEME_OPTIONS, type ThemeId } from "./theme";

type ThemeMenuProps = {
  open: boolean;
  theme: ThemeId;
  onSelect: (theme: ThemeId) => void;
  onClose: () => void;
};

function CheckIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4">
      <path
        d="M16.7 5.3 8.4 13.6 3.8 9"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

export function PaletteIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    >
      <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
      <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
      <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
      <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
      <path d="M12 22a10 10 0 1 1 10-10 4.5 4.5 0 0 1-4.5 4.5h-1.6a1.9 1.9 0 0 0-1.4 3.2l.4.4A1.2 1.2 0 0 1 14 22Z" />
    </svg>
  );
}

export default function ThemeMenu({
  open,
  theme,
  onSelect,
  onClose,
}: ThemeMenuProps) {
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[110] flex items-start justify-center bg-body/75 px-4 py-20 backdrop-blur-md sm:px-6"
      onKeyDown={(event) => {
        if (event.key === "Escape") onClose();
      }}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="theme-menu-title"
        className="w-full max-w-md overflow-hidden rounded-lg border border-line bg-ink shadow-2xl shadow-black/40"
      >
        <div className="flex items-center justify-between border-b border-line bg-surface/70 px-5 py-4">
          <h2
            id="theme-menu-title"
            className="font-display text-xl font-semibold text-white"
          >
            Theme
          </h2>
          <button
            type="button"
            aria-label="Close theme menu"
            autoFocus
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-md border border-line text-muted transition-colors hover:border-voltage hover:text-voltage focus-visible:border-voltage focus-visible:text-voltage focus-visible:outline-none"
          >
            <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4">
              <path
                d="m5 5 10 10M15 5 5 15"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="2"
              />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3 p-4">
          {THEME_OPTIONS.map((option) => {
            const selected = option.id === theme;

            return (
              <button
                key={option.id}
                type="button"
                aria-pressed={selected}
                onClick={() => onSelect(option.id)}
                className="group rounded-md border border-line bg-surface/35 p-2 text-left transition-colors hover:border-voltage focus-visible:border-voltage focus-visible:outline-none"
              >
                <span className="grid h-16 overflow-hidden rounded grid-cols-2 border border-line/70">
                  {option.swatches.map((color) => (
                    <span key={color} style={{ backgroundColor: color }} />
                  ))}
                </span>
                <span className="mt-2 flex min-w-0 items-center justify-between gap-2">
                  <span className="truncate font-sans text-xs font-semibold text-white">
                    {option.label}
                  </span>
                  <span
                    className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border ${
                      selected
                        ? "border-voltage bg-voltage text-on-accent"
                        : "border-line text-transparent"
                    }`}
                  >
                    {selected && <CheckIcon />}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
