import { useEffect, useRef } from "react";
import { THEME_OPTIONS, type ThemeId } from "./theme";

export type ThemeMenuProps = {
  open: boolean;
  theme: ThemeId;
  onSelect: (theme: ThemeId) => void;
  onClose: () => void;
  className?: string;
};

function CheckIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="pbts-icon">
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

export function PaletteIcon({ className = "pbts-icon" }: { className?: string }) {
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

export function ThemeMenu({
  open,
  theme,
  onSelect,
  onClose,
  className = "",
}: ThemeMenuProps) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose, open]);

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
      className={`pbts-overlay ${className}`.trim()}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div role="dialog" aria-modal="true" aria-labelledby="pbts-title" className="pbts-panel">
        <div className="pbts-header">
          <h2 id="pbts-title">Theme</h2>
          <button ref={closeRef} type="button" aria-label="Close theme menu" onClick={onClose}>
            <svg aria-hidden="true" viewBox="0 0 20 20" className="pbts-icon">
              <path d="m5 5 10 10M15 5 5 15" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
            </svg>
          </button>
        </div>

        <div className="pbts-grid">
          {THEME_OPTIONS.map((option) => {
            const selected = option.id === theme;

            return (
              <button
                key={option.id}
                type="button"
                aria-pressed={selected}
                onClick={() => onSelect(option.id)}
                className="pbts-swatch-button"
              >
                <span className="pbts-swatches">
                  {option.swatches.map((color) => (
                    <span key={color} style={{ backgroundColor: color }} />
                  ))}
                </span>
                <span className="pbts-label-row">
                  <span>{option.label}</span>
                  <span className={`pbts-check ${selected ? "is-selected" : ""}`}>
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
