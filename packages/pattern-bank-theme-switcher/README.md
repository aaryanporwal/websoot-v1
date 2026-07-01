# Tiny Theme Palette

A cute reusable React theme switcher with one drop-in component and six bundled
themes: `default`, `light`, `gruvbox`, `everforest`, `nature`, and `rose-pine`.

## Install

```sh
npm install @aaryanporwal/tiny-theme-palette
```

## Use it

```tsx
import TinyThemePalette from "@aaryanporwal/tiny-theme-palette";

export function AppHeader() {
  return <TinyThemePalette />;
}
```

That renders a theme button, opens the palette dialog, persists the selected
theme to `localStorage`, and writes the active theme to
`document.documentElement.dataset.theme`. The component imports its bundled CSS
for you.

## Props

```tsx
<TinyThemePalette
  storageKey="my-site-theme"
  label="Theme"
  showLabel
  closeOnSelect
  onThemeChange={(theme) => console.log(theme)}
/>
```

Use `buttonClassName`, `menuClassName`, and `className` for styling hooks. For a
fully custom trigger, pass `renderTrigger`:

```tsx
import TinyThemePalette from "@aaryanporwal/tiny-theme-palette";

export function IconOnlyThemeButton() {
  return (
    <TinyThemePalette
      showLabel={false}
      renderTrigger={({ toggle, open, icon }) => (
        <button type="button" aria-expanded={open} onClick={toggle}>
          {icon}
        </button>
      )}
    />
  );
}
```

## Avoid theme flash

For no-flash startup, run the bootstrap script in your document head. This step
is optional, but recommended for server-rendered apps.

```tsx
import { createThemeBootstrapScript } from "@aaryanporwal/tiny-theme-palette";

<script
  dangerouslySetInnerHTML={{
    __html: createThemeBootstrapScript("my-site-theme"),
  }}
/>
```

## Advanced API

If you want to wire your own UI, these exports are also available:

```tsx
import {
  PaletteIcon,
  ThemeMenu,
  ThemeSwitcher,
  useTheme,
} from "@aaryanporwal/tiny-theme-palette";
```

`ThemeSwitcher` is an alias for `TinyThemePalette`. Older stored `dark` values
normalize to the `default` theme.
