import { useEffect, useMemo, useRef, useState } from "react";

export type CommandItem = {
  title: string;
  href: string;
  section: "Navigation" | "Writing" | "Social";
  description?: string;
  external?: boolean;
};

type Props = {
  commands: CommandItem[];
};

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;

  return (
    target.tagName === "INPUT" ||
    target.tagName === "TEXTAREA" ||
    target.tagName === "SELECT" ||
    target.isContentEditable
  );
}

function normalize(value: string) {
  return value.trim().toLowerCase();
}

function commandText(command: CommandItem) {
  return normalize(
    [command.title, command.section, command.description, command.href]
      .filter(Boolean)
      .join(" "),
  );
}

export default function CommandSwitcher({ commands }: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const dialogRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  const filteredCommands = useMemo(() => {
    const needle = normalize(query);
    if (!needle) return commands;

    return commands.filter((command) => commandText(command).includes(needle));
  }, [commands, query]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query, open]);

  useEffect(() => {
    if (!open) return;

    const id = window.setTimeout(() => inputRef.current?.focus(), 0);
    return () => window.clearTimeout(id);
  }, [open]);

  function openSwitcher() {
    if (!open) {
      returnFocusRef.current =
        document.activeElement instanceof HTMLElement
          ? document.activeElement
          : null;
    }
    setOpen(true);
  }

  useEffect(() => {
    const onOpen = () => openSwitcher();

    const onKeyDown = (event: KeyboardEvent) => {
      const usesCommandKey = event.metaKey || event.ctrlKey;

      if (usesCommandKey && event.key.toLowerCase() === "k") {
        if (!open && isTypingTarget(event.target)) return;

        event.preventDefault();
        if (open) setOpen(false);
        else openSwitcher();
        return;
      }

      if (!open) return;

      if (event.key === "Tab") {
        const dialog = dialogRef.current;
        if (!dialog) return;

        const focusable = Array.from(
          dialog.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
          ),
        ).filter((element) => element.getClientRects().length > 0);

        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (!first || !last) return;

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
          return;
        }

        if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
        return;
      }

      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        return;
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();
        setActiveIndex((index) =>
          filteredCommands.length === 0
            ? 0
            : (index + 1) % filteredCommands.length,
        );
        return;
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        setActiveIndex((index) =>
          filteredCommands.length === 0
            ? 0
            : (index - 1 + filteredCommands.length) % filteredCommands.length,
        );
        return;
      }

      if (event.key === "Enter") {
        const command = filteredCommands[activeIndex];
        if (!command) return;

        event.preventDefault();
        openCommand(command);
      }
    };

    window.addEventListener("command-switcher:open", onOpen);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("command-switcher:open", onOpen);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeIndex, filteredCommands, open]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }

    returnFocusRef.current?.focus();
    returnFocusRef.current = null;
  }, [open]);

  function openCommand(command: CommandItem) {
    setOpen(false);
    window.location.href = command.href;
  }

  return (
    open && (
      <div
        className="fixed inset-0 z-[100] flex items-start justify-center bg-body/75 px-4 py-20 backdrop-blur-md sm:px-6"
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) setOpen(false);
        }}
      >
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label="Command switcher"
          className="w-full max-w-2xl overflow-hidden rounded-lg border border-line bg-ink"
        >
          <div className="flex items-center gap-3 border-b border-line bg-surface/70 px-4 py-3 sm:px-5">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-voltage" />
            <input
              ref={inputRef}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search"
              role="combobox"
              aria-autocomplete="list"
              aria-expanded="true"
              className="min-w-0 flex-1 bg-transparent font-sans text-base text-white outline-none placeholder:text-muted"
              aria-controls="command-switcher-results"
              aria-activedescendant={
                filteredCommands[activeIndex]
                  ? `command-switcher-result-${activeIndex}`
                  : undefined
              }
            />
            <kbd className="rounded border border-line bg-body px-2 py-1 font-sans text-[11px] font-medium text-muted">
              Esc
            </kbd>
          </div>

          <div
            id="command-switcher-results"
            role="listbox"
            className="max-h-[min(60vh,28rem)] overflow-y-auto p-2"
          >
            {filteredCommands.length > 0 ? (
              filteredCommands.map((command, index) => {
                const active = index === activeIndex;

                return (
                  <button
                    id={`command-switcher-result-${index}`}
                    key={`${command.section}-${command.href}`}
                    type="button"
                    role="option"
                    aria-selected={active}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => openCommand(command)}
                    className={`flex w-full items-center justify-between gap-4 rounded-md px-3 py-3 text-left transition-colors sm:px-4 ${
                      active
                        ? "bg-voltage text-body"
                        : "text-white hover:bg-surface"
                    }`}
                  >
                    <span className="min-w-0">
                      <span className="block truncate font-display text-lg font-semibold leading-tight">
                        {command.title}
                      </span>
                      <span
                        className={`mt-1 block truncate font-sans text-sm ${
                          active ? "text-body/70" : "text-muted"
                        }`}
                      >
                        {command.description || command.href}
                      </span>
                    </span>
                    <span
                      className={`shrink-0 rounded-full border px-2.5 py-1 font-sans text-[11px] font-semibold ${
                        active
                          ? "border-body/25 text-body"
                          : "border-line text-muted"
                      }`}
                    >
                      {command.section}
                    </span>
                  </button>
                );
              })
            ) : (
              <div className="px-4 py-10 text-center font-sans text-sm text-muted">
                No results
              </div>
            )}
          </div>
        </div>
      </div>
    )
  );
}
