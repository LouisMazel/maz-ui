---
title: Theming
description: Modern and performant theme system for Maz-UI built on native CSS features (light-dark(), color-scheme, color-mix(in oklch)) for v5.
---

# {{ $frontmatter.title }}

Modern and performant theme system for Maz-UI built on native CSS features (`light-dark()`, `color-scheme`, `color-mix(in oklch)`) for v5.

<NpmBadge package="@maz-ui/themes"></NpmBadge>

## Features

- **Native `light-dark()` + `color-scheme`** - Modern CSS theming with zero JS overhead for the light/dark switch
- **Native widget theming** - `color-scheme` makes scrollbars, native `<select>`, date pickers and autofill follow the active mode automatically
- **Animated theme switch** - Optional full-page View Transitions via `setColorMode(..., { animate: true })`
- **Anti-FART** - `<meta name="color-scheme">` injected at boot to prevent any Flash of inAccurate coloR Theme (no setup needed)
- **Automatic color scales** - the `-50` to `-950` steps are derived via OKLCh relative color syntax, with an opt-in [`perceptual` mode](#color-scales) that keeps their order and hue with any base color
- **Performance Strategies** - Runtime injection or build-time generation according to your needs
- **Strict TypeScript** - Complete types for perfect DX
- **Zero FOUC** - Pass the preset object up front; the full CSS is injected synchronously on first paint
- **Flexible Presets** - Ready-to-use and customizable configurations

## Theme Editor

Create your own theme with the [Theme Editor](./../theme-editor.md): start from a preset, edit the colors, fonts, type scale, radius, shadows and motion on live components, then copy the code for Vue, Nuxt or a preset file. Only your changes are exported, on top of the preset.

## Quick Usage

### 1. Plugin Configuration with `MazUi` plugin

To avoid FOUC (Flash of Unstyled Content), **you should provide the theme preset**.

```typescript
// main.ts
import { MazUi } from 'maz-ui/plugins/maz-ui'
import { mazUi } from '@maz-ui/themes/presets/mazUi'
import { createApp } from 'vue'

const app = createApp(App)

app.use(MazUi, {
  theme: {
    preset: mazUi, // pristine | ocean | obsidian | nova | folio | macos | windows | linux
    strategy: 'runtime', // 'runtime' | 'buildtime'
    darkModeStrategy: 'class', // 'class' | 'media' (only if mode is `both`)
    mode: 'both', // 'light' | 'dark' | 'both' (supported color modes)
    colorMode: 'auto', // 'auto' | 'light' | 'dark' (initial color mode, only if mode is 'both')
    // Class added to <html> when dark mode is forced (default: 'dark')
    darkClass: 'dark',
    // Class added to <html> when light mode is forced (default: 'light')
    lightClass: 'light',
    persistPreset: true, // remember the active preset name across reloads
  }
})
```

::: tip Alternative: MazUiProvider
You can also initialize the theme via the [`MazUiProvider`](../guide/maz-ui-provider.md) component for lazy-loaded pages or subtree-scoped themes.
:::

### 2. Setup your CSS to support theme foundation and dark mode

```css
html {
  font-size: var(--maz-base-font-size);
  font-family: var(--maz-font-family);
  background-color: var(--maz-surface);
  color: var(--maz-foreground);
}
```

### 3. Using in your components

```vue
<script setup>
import { useTheme } from '@maz-ui/themes'

const { toggleDarkMode, isDark, updateTheme } = useTheme()
</script>

<template>
  <div class="bg-surface text-foreground">
    <button
      class="rounded-md bg-primary text-primary-foreground"
      @click="toggleDarkMode"
    >
      {{ isDark ? '☀️' : '🌙' }} Toggle theme
    </button>
  </div>
</template>
```

## Configuration

- `preset`: The theme preset to use
- `overrides` (optional): Override specific parts of the theme
- `strategy` (optional, default `'runtime'`): The rendering strategy to use — `'runtime' | 'buildtime'`
- `darkModeStrategy` (optional, default `'class'`): The dark mode strategy — `'class' | 'media'`, only if you use mode `both`
- `mode` (optional, default `'both'`): The supported color modes — `'light' | 'dark' | 'both'`
- `colorMode` (optional, default `'auto'`): The initial color mode — `'light' | 'dark' | 'auto'` (only if mode is `'both'`)
- `darkClass` (optional, default `'dark'`): Class added to `<html>` when `colorMode === 'dark'`
- `lightClass` (optional, default `'light'`): Class added to `<html>` when `colorMode === 'light'` — mirror of `darkClass`
- `persistPreset` (optional, default `true`): Persist the active preset name in the `maz-preset` cookie so it is restored on reload.

### Persistence of the user preferences

`@maz-ui/themes` stores the preferences of the user in two cookies (1-year TTL, `SameSite=Lax`), so the server can render them:

| Cookie | Value | Example |
| --- | --- | --- |
| `maz-color-mode` | `<choice>:<system>`, each part optional: the color mode chosen with `setColorMode()` and the last system preference seen by the browser | `dark`, `auto:light`, `:dark` |
| `maz-preset` | `<configured>:<active>`: the preset declared in `options.preset` and the one applied with `updateTheme()` | `folio:ocean` |

- The configured preset always wins over a foreign cookie: a switch is only restored when the `configured` part matches `options.preset`, so a cookie written by another app on the same host (or by a previous config) is ignored. A switch to a preset that no longer exists falls back to the configured one.
- The cookies are only written when their value changes.
- **Reactive**: in the browsers that support the [Cookie Store API](https://developer.mozilla.org/docs/Web/API/Cookie_Store_API), a change of a cookie (another tab, the server, the devtools) is applied without a reload, and a deleted cookie restores the config. The other browsers keep the values read at boot.

Set `persistPreset: false` to never read nor write the `maz-preset` cookie:

```typescript
app.use(MazUi, {
  theme: {
    preset: mazUi,
    persistPreset: false,
  },
})
```

Useful when the active preset is fully driven by the app and no end-user switching is exposed.

## Color modes and class toggling

`darkClass` and `lightClass` interact with `darkModeStrategy` to control how `<html>` is decorated.

### `darkModeStrategy: 'class'` (default)

- `setColorMode('dark')` adds `darkClass` (default `.dark`) to `<html>` → `color-scheme: only dark`.
- `setColorMode('light')` adds `lightClass` (default `.light`) to `<html>` → `color-scheme: only light`.
- `setColorMode('auto')` adds the class of the system preference, and follows its changes.

Forcing the class on the root ensures native widgets (scrollbars, native `<select>`, date pickers, autofill backgrounds, …) match the color mode of the page.

A host that toggles the classes itself (VitePress, a Tailwind toggle, a blocking script) stays in charge: at boot, a class already on `<html>` is kept and becomes the state of `useTheme()`, and a later change of the class updates the state. A host that only toggles `darkClass` gets `lightClass` added back in light mode.

### `darkModeStrategy: 'media'`

- No class is ever added to `<html>`.
- The browser always follows `prefers-color-scheme` via `color-scheme: light dark`.
- `setColorMode()` still updates the persisted cookie but does **not** force a visual override.

## Server rendering (SSR and SSG)

`@maz-ui/nuxt` does it for you. With another server, render the theme of the user in the `<head>` so the first paint has it, then install the plugin as usual:

```typescript
import { getRequestThemeContext, getThemeHead, renderThemeHead } from '@maz-ui/themes'

export async function renderHead(request: Request) {
  const head = await getThemeHead(themeOptions, getRequestThemeContext({
    'cookie': request.headers.get('cookie') ?? undefined,
    'sec-ch-prefers-color-scheme': request.headers.get('sec-ch-prefers-color-scheme') ?? undefined,
  }))

  return {
    htmlClass: head.htmlClass,
    head: renderThemeHead(head),
  }
}
```

- `getThemeHead(options, context)` resolves the preset and the color mode of the user from the cookies and the `Sec-CH-Prefers-Color-Scheme` client hint. It returns the class of `<html>` (undefined when the server cannot know it), the CSS of the preset, the `color-scheme` meta and a blocking script that applies the live system preference before the first paint.
- `renderThemeHead(head)` renders these tags as HTML. `getThemeHeadTags(head)` returns them in the format of unhead (`useHead`).
- `resolveThemeContext(options)` returns the same context without the tags, in the browser or on the server.
- `options.preset` accepts the name of a built-in preset or a preset object. A name loads the preset on demand: pass the object to the client plugin to avoid a flash before it is loaded.

## Animated theme switch

For a full-page animated swap (rather than per-variable color tweens), pass `{ animate: true }` to `setColorMode` or `toggleDarkMode`:

```vue
<script setup>
import { useTheme } from '@maz-ui/themes'

const { toggleDarkMode, setColorMode } = useTheme()

async function onToggle() {
  await toggleDarkMode({ animate: true })
}

async function forceDark() {
  await setColorMode('dark', { animate: true })
}
</script>
```

- Wraps the switch in `document.startViewTransition()` so the browser captures a snapshot of the page before/after and crossfades between them.
- The View Transition glue is **lazy-imported** — when `animate` is not used, it stays out of the boot bundle.
- **Graceful degradation:** in browsers that don't support the API, the change is applied immediately with no animation (no error thrown).

## Interactive Demo

<ComponentDemo title="Real-time theme control">
  <div class="demo-theme-controls">
    <div class="maz:space-y-4">
      <div class="maz:grid maz:grid-cols-1 maz:md:grid-cols-2 maz:gap-4">
        <MazBtn color="primary">Primary Button</MazBtn>
        <MazBtn color="secondary">Secondary Button</MazBtn>
        <MazBtn color="success">Success Button</MazBtn>
        <MazBtn color="warning">Warning Button</MazBtn>
      </div>
      <div class="theme-controls maz:space-y-4">
        <div class="maz:flex maz:flex-col maz:gap-4">
          <label class="maz:text-sm maz:font-medium">Color Mode: {{ colorMode }}</label>
          <div class="maz:flex maz:gap-2">
            <MazBtn
              size="sm"
              :color="colorMode === 'light' ? 'primary' : 'contrast'"
              @click="setColorMode('light')"
            >
              ☀️ Light
            </MazBtn>
            <MazBtn
              size="sm"
              :color="colorMode === 'dark' ? 'primary' : 'contrast'"
              @click="setColorMode('dark')"
            >
              🌙 Dark
            </MazBtn>
            <MazBtn
              size="sm"
              :color="colorMode === 'auto' ? 'primary' : 'contrast'"
              @click="setColorMode('auto')"
            >
              🔄 Auto
            </MazBtn>
          </div>
        </div>
        <div class="maz:space-y-2">
          <label class="maz:text-sm maz:font-medium">Preset:</label>
          <div class="maz:flex maz:gap-2">
            <MazBtn
              size="sm"
              :color="presetName === 'maz-ui' ? 'primary' : 'contrast'"
              @click="updateTheme('maz-ui')"
            >
              Maz-UI
            </MazBtn>
            <MazBtn
              size="sm"
              :color="presetName === 'ocean' ? 'primary' : 'contrast'"
              @click="updateTheme('ocean')"
            >
              Ocean
            </MazBtn>
            <MazBtn
              size="sm"
              :color="presetName === 'pristine' ? 'primary' : 'contrast'"
              @click="updateTheme('pristine')"
            >
              Pristine
            </MazBtn>
            <MazBtn
              size="sm"
              :color="presetName === 'obsidian' ? 'primary' : 'contrast'"
              @click="updateTheme('obsidian')"
            >
              Obsidian
            </MazBtn>
          </div>
        </div>
      </div>
    </div>
  </div>

<template #code>

```vue
<script setup>
import { useTheme } from '@maz-ui/themes'

const { presetName, updateTheme, colorMode, setColorMode } = useTheme()
</script>

<template>
  <div class="demo-theme-controls">
    <div class="space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <MazBtn color="primary">Primary Button</MazBtn>
        <MazBtn color="secondary">Secondary Button</MazBtn>
        <MazBtn color="success">Success Button</MazBtn>
        <MazBtn color="warning">Warning Button</MazBtn>
      </div>
      <div class="theme-controls space-y-4">
        <div class="flex items-center gap-4">
          <label class="text-sm font-medium">Mode:</label>
          <MazBtn
            size="sm"
            :color="colorMode === 'light' ? 'primary' : 'secondary'"
            @click="setColorMode('light')"
          >
            ☀️ Light
          </MazBtn>
          <MazBtn
            size="sm"
            :color="colorMode === 'dark' ? 'primary' : 'secondary'"
            @click="setColorMode('dark')"
          >
            🌙 Dark
          </MazBtn>
          <MazBtn
            size="sm"
            :color="colorMode === 'auto' ? 'primary' : 'secondary'"
            @click="setColorMode('auto')"
          >
            🔄 Auto
          </MazBtn>
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium">Preset:</label>
          <div class="flex gap-2">
            <MazBtn
              size="sm"
              :color="presetName === 'maz-ui' ? 'primary' : 'secondary'"
              @click="updateTheme('mazUi')"
            >
              Maz-UI
            </MazBtn>
            <MazBtn
              size="sm"
              :color="presetName === 'ocean' ? 'primary' : 'secondary'"
              @click="updateTheme('ocean')"
            >
              Ocean
            </MazBtn>
            <MazBtn
              size="sm"
              :color="presetName === 'pristine' ? 'primary' : 'secondary'"
              @click="updateTheme('pristine')"
            >
              Pristine
            </MazBtn>
            <MazBtn
              size="sm"
              :color="presetName === 'obsidian' ? 'primary' : 'secondary'"
              @click="updateTheme('obsidian')"
            >
              Obsidian
            </MazBtn>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
```

  </template>
</ComponentDemo>

## Available Presets

### Maz-UI (Default)

The default theme inspired by Maz-UI identity with vibrant and modern colors.

```typescript
import { mazUi } from '@maz-ui/themes/presets'
```

### Pristine

A minimalist and elegant theme inspired by Apple design with pure black and white aesthetics.

```typescript
import { pristine } from '@maz-ui/themes/presets'
```

### Ocean

A vibrant ocean-inspired theme with deep blues, aquatic greens, and coral accents. Features rounded borders and Poppins font for a fresh, modern look.

```typescript
import { ocean } from '@maz-ui/themes/presets'
```

### Obsidian

A dark and elegant theme with a focus on readability and minimalism.

```typescript
import { obsidian } from '@maz-ui/themes/presets'
```

### Nova

A modern startup / AI / creative preset — electric violet primary, hot coral secondary, cyan accent. Tight 0.5rem `md` radius, Geist + Inter font stack, snappy ease-out spring. Built for product / AI surfaces (think Linear, Vercel, OpenAI energy) where the UI itself should feel alive.

```typescript
import { nova } from '@maz-ui/themes/presets'
```

### Folio

An electric and modern preset made for long reading, and the one of this documentation: an electric blue primary, an electric magenta secondary and a cyan accent that blend into a plasma gradient, on faintly violet surfaces (almost white in light mode, violet-black in dark mode). Fraunces (serif) for the headings, Inter for the text, Geist Mono for the code, soft 0.625rem `md` radius. In dark mode the color roles turn into bright tones carrying dark text, so they stay readable as text on the surface too. Every text pair reaches WCAG AA.

```typescript
import { folio } from '@maz-ui/themes/presets'
```

::: tip Fonts
Like the other presets, Folio only declares font stacks: load Fraunces, Inter and Geist Mono yourself (self-hosted or from a font service), the stacks fall back to system fonts otherwise.
:::

### macOS, Windows and Linux

Three presets imitate the look of a native desktop app, for Tauri, Electron or a web app that wants to feel at home on the user's system. They differ from the other presets on more than colors: system font stacks, the native body size, native radii and motion, the translucent [glass material](#glass-material) and the arrow cursor on controls ([`interactive-cursor`](#interactive-cursor)).

| Preset | Look | Specifics |
| --- | --- | --- |
| `macos` | macOS 26: SF Pro at `13px`, white blocks on a light gray window, translucent sidebars and toolbars | Follows the system accent color, labels and separators through [`systemColors`](#system-colors) (WebKit) |
| `windows` | Windows 11, Fluent 2: Segoe UI Variable at `14px`, Mica window, 4px controls and 8px cards | Acrylic `glass`. The user accent is not exposed to the web: override `primary` and `accent` if your app reads it natively |
| `linux` | GNOME, libadwaita: Adwaita Sans at `14px`, white cards, 6px controls and 12px cards | Opaque `glass` (GNOME draws no blurred material). Override `primary` and `accent` if your app reads the desktop accent |

```typescript
import { linux, macos, windows } from '@maz-ui/themes/presets'
```

Each of them also sets the [`typography`](#typography) of the preset on the scale of its system: the `text-display`, `text-title-1`...`text-caption` utilities follow the text styles of macOS, the Fluent type ramp and the libadwaita style classes, so headings and body text look native without any class change.

| Utility | `macos` | `windows` | `linux` (at `14px`) |
| --- | --- | --- | --- |
| `text-display` | 34px, bold | 68px, semibold | 42px, light |
| `text-title-1` | 26px, bold | 28px, semibold | 25px, extra bold |
| `text-title-2` | 22px, bold | 20px, semibold | 19px, extra bold |
| `text-title-3` | 17px, semibold | 18px, semibold | 19px, bold |
| `text-title-4` | 13px, semibold | 14px, semibold | 17px, bold |
| `text-body` | 13px | 14px | 14px |
| `text-body-sm`, `text-caption` | 12px, 11px | 12px | 11.5px |

Pick the preset from the platform of the user. In a browser, `navigator.userAgentData?.platform` is the modern source (Chromium), `navigator.platform` the fallback. In Tauri or Electron, prefer the OS reported by the shell (`@tauri-apps/plugin-os`, `process.platform`): it is reliable and available before the first render.

```typescript
import type { ThemePreset } from '@maz-ui/themes'
import { linux, macos, mazUi, windows } from '@maz-ui/themes/presets'

function getNativePreset(): ThemePreset {
  const platform = (navigator.userAgentData?.platform ?? navigator.platform).toLowerCase()

  if (platform.includes('mac'))
    return macos
  if (platform.includes('win'))
    return windows
  if (platform.includes('linux') || platform.includes('x11'))
    return linux
  return mazUi
}

app.use(MazUi, { theme: { preset: getNativePreset() } })
```

With Tauri, switch on the value returned by the `platform()` function of the OS plugin (`'macos'`, `'windows'`, `'linux'`) instead of reading the user agent.

::: tip Fonts
These presets only declare system font stacks (`-apple-system`, `Segoe UI Variable`, `Adwaita Sans`...): nothing to load, the platform provides them. On another system, the stacks fall back to `system-ui`.
:::

## Rendering Strategies

### ⚡ Runtime (Recommended)

CSS is generated and injected synchronously on first paint. Pass the preset object directly (`preset: mazUi`) so the full stylesheet is rendered before the first frame — no FOUC.

```typescript
import { mazUi } from '@maz-ui/themes/presets'

app.use(MazUi, {
  theme: {
    preset: mazUi,
    strategy: 'runtime'
  }
})
```

### 🏗️ Buildtime

CSS generated at build-time and included in the bundle.
You have to build your CSS files before running your app.

See [Build-time](#build-time-strategy-complete-guide) for more details.

```typescript
import { mazUi } from '@maz-ui/themes/presets'

app.use(MazUi, {
  theme: {
    preset: mazUi,
    strategy: 'buildtime'
  }
})
```

## Creating Custom Themes

### Basic Theme

<br />

<ComponentDemo title="Create your own theme">
  <MazBtn @click="applyCustomTheme" color="info">
    Apply Custom Theme
  </MazBtn>
  <MazBtn @click="resetTheme" color="secondary" class="maz:ms-2">
    Reset
  </MazBtn>

  <div class="maz:mt-4 maz:p-4 maz:bg-primary/10 maz:rounded-md">
    <p v-if="presetName === 'custom-purple'" class="maz:text-primary maz:font-medium">
      Custom theme applied with purple colors!
    </p>
    <p v-else class="maz:text-primary maz:font-medium">
      Default theme
    </p>
  </div>

<template #code>

```typescript
import { definePreset, MazUiTheme, type ThemePresetOverrides, ocean } from '@maz-ui/themes'

const customTheme = await definePreset({
  base: 'ocean',
  overrides: {
    name: 'custom-purple',
    foundation: {
      'font-family': 'Inter, sans-serif'
    },
    scales: {
      rounded: { md: '1rem' }
    },
    colors: {
      light: {
        primary: 'oklch(0.62 0.24 305)',
        secondary: 'oklch(0.94 0.04 320)',
        accent: 'oklch(0.7 0.22 290)'
      },
      dark: {
        primary: 'oklch(0.72 0.22 305)',
        secondary: 'oklch(0.28 0.06 320)',
        accent: 'oklch(0.78 0.2 290)'
      }
    }
  },
})
/**
 * or with preset object
 * The function is synchronous when using a preset object
 */
const customTheme = definePreset({
  base: ocean,
  overrides,
})

// Usage

// with plugin
app.use(MazUiTheme, {
  preset: customTheme,
})

// or with composable
const { updateTheme } = useTheme()
updateTheme(customTheme)
```

  </template>
</ComponentDemo>

### Advanced Theme with Overrides

```typescript
import { definePreset } from '@maz-ui/themes'

const brandTheme = await definePreset({
  base: 'maz-ui',
  overrides: {
    name: 'brand',
    foundation: {
      'border-width': '2px',
      'font-family': 'Inter, sans-serif'
    },
    scales: {
      rounded: { md: '0.75rem' }
    },
    colors: {
      light: {
        primary: 'oklch(0.6 0.18 254)',
        secondary: 'oklch(0.55 0.2 305)',
        surface: 'oklch(0.99 0.005 254)',
        accent: 'oklch(0.7 0.22 305)'
      },
      dark: {
        primary: 'oklch(0.7 0.18 254)',
        secondary: 'oklch(0.72 0.17 305)',
        surface: 'oklch(0.18 0.02 254)',
        accent: 'oklch(0.78 0.2 305)'
      }
    }
  }
})
```

### Color tokens

Each token has a precise role. Pick the values with that role in mind, not from another design system.

| Token | Role |
| --- | --- |
| `primary` | Main brand color: main actions, links, focus rings, selected states. |
| `secondary` | **Second strong brand color** (violet in `maz-ui`, pink in `folio`). Not a muted surface. Used for `MazBtn color="secondary"`, badges, accents of identity. |
| `accent` | Highlights and tertiary emphasis, a color that stands out from `primary` and `secondary`. |
| `info`, `success`, `warning`, `destructive` | Semantic states: information, success, warning, error and dangerous actions. |
| `contrast` | Neutral high-contrast color (near black in light mode, near white in dark mode). |
| `surface` | Page background. |
| `foreground` | Body text on `surface`. |
| `container` | Background of cards, dialogs, popovers and drawers (preset `components.container`). |
| `input` | Background of inputs, selects and textareas (preset `components.input`). |
| `muted` | Secondary text, placeholders, disabled content. |
| `divider` | Borders and separators. |
| `overlay` | Backdrop behind dialogs and drawers. |
| `shadow` | Tint of the shadows. |

Every brand and state color (`primary`, `secondary`, `accent`, `info`, `success`, `warning`, `destructive`, `contrast`) has a `-foreground` color: the text or icon color to put on top of it (`bg-primary text-primary-foreground`). The token and its `-foreground` are chosen as a pair, in light and dark modes.

For a discreet background, never make `secondary` pale. Use:

- `surface`, `container` or `muted` (for example `bg-muted/10`)
- the light steps of a color (`bg-primary-50`, `bg-secondary-100`)
- `MazBtn` with the `pastel` or `outlined` props (`<MazBtn color="secondary" pastel>`)

```html
<div class="rounded-lg bg-container p-4 text-foreground">
  <span class="rounded-full bg-secondary-100 px-2 text-secondary-700">New</span>
</div>
```

#### Contrast

Check the contrast of every color you set, in light **and** dark modes (WCAG 2):

- Text (a token and its `-foreground`, `foreground` on `surface`, `muted` on `surface`): at least 4.5:1 (AA).
- UI elements and large text: at least 3:1.
- A brand color used as text or border (`text-primary`, `MazBtn outlined`, focus ring) must reach 3:1 against `surface` and `container`. This is why `primary` and `secondary` cannot be pale: lower their lightness in light mode, raise it in dark mode.

The `review_code` tool of the [MCP server](/guide/ai-agents) warns when the `primary` or `secondary` of a `definePreset` is under 3:1 against its surface.

#### Common mistakes

- **A pale `secondary`** (close to `surface`), copied from the shadcn/ui convention where `secondary` is a muted surface: `MazBtn color="secondary" outlined` becomes invisible. Keep it a strong brand color.
- **Hard-coded colors** (`#3b82f6`, `rgb(...)`, `bg-[#fff]`): they ignore the preset and the dark mode. Use theme colors.
- **`dark:` overrides of theme colors** (`bg-surface dark:bg-gray-900`): theme colors already resolve per mode with `light-dark()`. `bg-surface` is enough.
- **The default Tailwind palette** (`bg-blue-500`, `text-gray-600`, `bg-white`): use `bg-primary`, `text-muted`, `bg-surface`.

### Customizing scales

Each `ThemeScales` entry maps to a Tailwind utility — override the keys you care about and the rest stays untouched:

```typescript
const denseTheme = definePreset({
  base: 'maz-ui',
  overrides: {
    name: 'dense',
    foundation: {
      // Tighter spacing — every p-N / gap-N / m-N rescales
      space: '0.2rem',
    },
    scales: {
      // Sharper corners on the whole radius scale
      rounded: {
        'xs': '0.0625rem',
        'sm': '0.125rem',
        'md': '0.375rem',
        'lg': '0.5rem',
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      // Custom elevated-surface shadow
      shadow: {
        elevation: '0 8px 24px rgba(0, 0, 0, 0.15)',
      },
    },
  },
})
```

Foundation gets new optional keys for fonts and disabled-state behaviour:

```typescript
const codeTheme = definePreset({
  base: 'maz-ui',
  overrides: {
    foundation: {
      'font-mono-stack': '"JetBrains Mono", ui-monospace, SFMono-Regular, monospace',
      'font-display-stack': '"Cal Sans", Manrope, sans-serif',
      'disabled-opacity': '0.4',
      'disabled-cursor': 'wait',
    },
  },
})
```

### Color scales

The steps `-50` to `-950` of the brand colors (`primary`, `secondary`, `accent`, `info`, `success`, `warning`, `destructive`) are derived from the base color, which is the `500` step. `scales.color` picks the derivation:

- `relative` (default): a fixed lightness offset per step. With a very dark or very light base, the scale collapses: half of a navy scale is black, half of a gold scale is white.
- `perceptual`: each step travels a share of the way between the base and a light or a dark bound, with a chroma capped near white and black. The steps keep their order and their hue whatever the base, and the classes do not change (`bg-accent-300`, `text-primary-700`...).

```typescript
const brandTheme = definePreset({
  base: 'maz-ui',
  overrides: {
    colors: {
      light: { secondary: '#0E1450', accent: '#FFC93C' },
    },
    scales: {
      color: 'perceptual',
    },
  },
})
```

<ColorScaleComparison />

- The scales stay dynamic: they follow `updateTheme()` and the light and dark values of the base. A step is relative to the base of each mode: `accent-300` gives two colors in light and dark when the two bases differ.
- `surface`, `foreground`, `contrast` and `divider` keep the relative scale: the components use it as "one notch darker or lighter" (`bg-surface-600`).
- The steps are redefined for the maz-ui components (`--maz-color-<role>-<step>`) and for the Tailwind classes of your project (`--color-<role>-<step>`). They take precedence over a step you redefine in your own `@theme`.
- The browsers clip an out-of-gamut color channel by channel, which can shift its hue: the chroma cap keeps this shift under the visible threshold for almost every color, the most saturated blues and yellows excepted.

### Effective colors

The preset only gives the base colors: the steps, `bg-container`, `bg-input` and the `-foreground` pairs are computed by the browser (`oklch(from var(--maz-accent) ...)`), so the devtools never show the final color. Three ways to see the effective theme, every color and step in both modes, with its contrast ratios:

- **The [Theme Editor](./../theme-editor.md)**: the "Contrast" tab of the preview shows every token and step of the preset you edit, in light and dark, with its contrast against the surface and its `-foreground`.
- **The MCP server**: `get_theme_tokens` prints the effective colors of the presets of your project (`definePreset`) and lists what to check: text pairs under AA, a pale `primary` or `secondary`, steps that look the same, steps that change a lot between light and dark. `get_theme_tokens({ colors: ["accent"] })` details the oklch and contrasts of each step, `steps: ["300"]` keeps the output short, `preset: "ocean"` shows a bundled preset.
- **The command line**: `npx @maz-ui/mcp colors` (presets of the project), `npx @maz-ui/mcp colors ocean --colors accent --steps 100,300,500`.

In code, `resolvePreset()` returns the same values. It runs the CSS of the stylesheet (the formulas of `scales.color`, `var()`, `light-dark()` and the relative color syntax), so it matches what the browser renders:

```typescript
import { mazUi } from '@maz-ui/themes/presets/mazUi'
import { getContrastRatio, resolvePreset } from '@maz-ui/themes/utils/resolve-preset'

const { light, dark } = resolvePreset(mazUi)

light.scales.accent?.['300'] // { hex: '#44ac8a', oklch: 'oklch(0.6745 0.1092 168.15)' }
dark.colors.input // { hex: '#2f303c', oklch: '...' }

getContrastRatio(light.colors.primary!.hex, light.colors.surface!.hex) // 4.6
```

| Export | Returns |
| --- | --- |
| `resolvePreset(preset)` | `{ name, colorScale, light, dark }`: each mode has `colors` (every token, `container` and `input`) and `scales` (`50` to `950` of each color with a scale), as `{ hex, oklch }` |
| `evaluateColor(css, { mode, resolve })` | The oklch channels of a CSS color: plain colors, `var()` with fallback, `light-dark()`, `oklch(from ...)` |
| `getContrastRatio(a, b)` | WCAG 2 contrast ratio of two colors, from 1 to 21 |
| `getColorDistance(a, b)` | OKLab distance of two colors: under `0.02` they look the same |
| `getRelativeColorScale(base)`, `getPerceptualColorScale(base)` | The CSS of the steps, from `@maz-ui/themes/utils/css-generator` |

The hex values are sRGB: a wide-gamut color is clipped, as on a sRGB screen. A value that cannot be computed (an unknown variable) is missing from the result.

### Per-component overrides

`components` is a small, validated set of per-component knobs. Every entry is per-mode where appropriate so light and dark can drift independently:

```typescript
const surfaceTheme = definePreset({
  base: 'maz-ui',
  overrides: {
    name: 'cool-surfaces',
    components: {
      btn: {
        // Bias every button text heavier
        'font-weight': '600',
      },
      container: {
        // Cards / dialogs / popovers / drawers — light = page surface, dark = a tier above
        bg: { light: 'var(--maz-surface)', dark: 'var(--maz-surface-300)' },
      },
      input: {
        // All form-control surfaces
        bg: { light: 'var(--maz-surface-100)', dark: 'var(--maz-surface-400)' },
      },
    },
  },
})
```

Components consume these via `bg-container` / `bg-input` Tailwind utilities, so a single override propagates everywhere - no per-component class hunt.

### Dialog sizing

`components.dialog` controls the width of [`MazDialog`](./../components/maz-dialog.md) on tablet and up. The two keys are emitted as `--maz-dialog-max-width` / `--maz-dialog-min-width` and consumed by the component through `var(--maz-dialog-max-width, 38rem)` / `var(--maz-dialog-min-width, 32rem)`:

```typescript
const wideDialogTheme = definePreset({
  base: 'maz-ui',
  overrides: {
    name: 'wide-dialogs',
    components: {
      dialog: {
        'max-width': '48rem',
        'min-width': '36rem',
      },
    },
  },
})
```

Both values are in `rem`, so they scale with the preset's `base-font-size`. Bundled presets anchored on `14px` use `38rem` / `32rem`; `ocean` (`16px`) ships scaled rem values (`33.25rem` / `28rem`) to keep the same rendered pixel width. The `max-width` / `min-width` props on `MazDialog` still override the preset per instance.

### Typography

`typography` sets the levels of the type scale, the `text-display`, `text-title-1`... `text-caption` utilities of `maz-ui/tailwindcss/utilities.css` (see [Type scale](./../guide/typography.md#type-scale)). Each level takes `font`, `size`, `weight`, `leading` and `tracking` (and `color` for `caption`); a key you leave out keeps the default of maz-ui.

```typescript
const brandTheme = definePreset({
  base: 'maz-ui',
  overrides: {
    typography: {
      'display': { size: 'clamp(2.5rem, 2rem + 3vw, 4rem)', weight: '800' },
      'title-1': { size: '2.25rem', tracking: '-0.03em' },
      'caption': { color: 'var(--maz-foreground)' },
    },
  },
})
```

Levels: `display`, `title-1`, `title-2`, `title-3`, `title-4`, `body-lg`, `body`, `body-sm`, `label`, `caption`, `overline`, `code`. Each key becomes a CSS variable, `--maz-typography-<level>-<key>` (`--maz-typography-title-1-size`).

Each preset of maz-ui sets the whole scale, tuned to its identity: `maz-ui` keeps the defaults, `pristine` and `nova` tighten the titles, `obsidian` makes them heavier, `ocean` and `folio` lighten them and give the body text more air. With `base`, your overrides apply on top of the scale of the base preset, level by level. The Type panel of the [theme editor](./../theme-editor.md) edits and exports these values.

The components of maz-ui use the same levels (dialog and card titles, hints of the fields, tabs, list items...): the `typography` block restyles them along with your own text. See [Type scale](./../guide/typography.md#type-scale).

### Color formats

Every color of a preset (`colors.light`, `colors.dark`, `components.*.bg`, `systemColors`) is any CSS color, written as-is in the stylesheet:

| Format | Examples |
| --- | --- |
| Hex | `#0069d9`, `#0069d9cc` |
| Functions | `rgb(0 105 217)`, `hsl(210 100% 43%)`, `hwb(210 0% 15%)`, `oklch(0.55 0.2 254)`, `oklab(...)`, `lab(...)`, `lch(...)`, `color(display-p3 0 0.4 0.85)` |
| Mixing | `color-mix(in oklch, var(--maz-primary) 20%, transparent)`, `light-dark(#fff, #000)` |
| Variables | `var(--maz-primary)`, `var(--brand, #0069d9)` |
| Named keywords | `transparent`, `currentColor`, `rebeccapurple` |
| System keywords | `AccentColor`, `Canvas`, `CanvasText`, `-apple-system-control-accent` |

A value that is none of these (a typo, `"blue 500"`) throws `Invalid color format` when the CSS is generated. The legacy form `"210 100% 43%"` (three channels) is still accepted and wrapped in `hsl()`.

A system keyword is only understood by some browsers: a browser that does not know it ignores the whole declaration. Use the [`systemColors`](#system-colors) key, which guards the keyword with `@supports` and keeps your color as the fallback, rather than writing a system keyword in `colors`.

### System colors

`systemColors` binds a color role to a system color of the platform: the accent color chosen by the user, the label and separator colors... Each keyword is emitted under `@supports (color: <keyword>)` after the colors, so it replaces the color of its role only where the browser supports it. Everywhere else, the color of `colors` stays: it is the fallback, keep it a good color.

```typescript
const myMacPreset = definePreset({
  base: 'macos',
  overrides: {
    name: 'my-mac-app',
    systemColors: {
      primary: '-apple-system-control-accent',
      accent: '-apple-system-control-accent',
      foreground: '-apple-system-label',
      muted: '-apple-system-secondary-label',
      divider: '-apple-system-separator',
    },
  },
})
```

The generated CSS:

```css
@supports (color: -apple-system-control-accent) {
  :root {
    --maz-primary: -apple-system-control-accent;
    --maz-accent: -apple-system-control-accent;
  }
}
```

- The keys are the color roles of [`colors`](#colors) (`primary`, `foreground`, `divider`...). Values are system keywords: `AccentColor`, `AccentColorText`, `Canvas`, `CanvasText`, `LinkText`... or the WebKit keywords of macOS.
- A system color follows the color scheme by itself: one keyword serves the light and the dark mode.
- The `macos` preset uses it for the accent, the labels and the separators. The steps of `primary` (`primary-300`...) and its `-foreground` are computed from the system color, so they follow it.
- Check the contrast of the fallback colors: the system color is chosen by the user and cannot be checked ahead.

### Glass material

`components.glass` is the translucent material of the floating surfaces: sidebars, toolbars, popovers and menus over a blurred background (`MazSidebar variant="floating"` uses it).

```typescript
const frostedTheme = definePreset({
  base: 'maz-ui',
  overrides: {
    name: 'frosted',
    components: {
      glass: {
        bg: { light: 'rgb(246 246 248 / 0.72)', dark: 'rgb(48 48 52 / 0.62)' },
        border: { light: 'rgb(0 0 0 / 0.08)', dark: 'rgb(255 255 255 / 0.1)' },
        blur: '24px',
        saturate: '1.4',
      },
    },
  },
})
```

| Key | CSS variable | Default |
| --- | --- | --- |
| `bg.light` / `.dark` | `--maz-glass-bg` | The container background at 72% opacity |
| `border.light` / `.dark` | `--maz-glass-border` | The divider color |
| `blur` | `--maz-glass-blur` | `24px`. `0px` turns the blur off |
| `saturate` | `--maz-glass-saturate` | `1.4` |

Tailwind side:

```html
<!-- The utility: translucent background, blurred backdrop and hairline edge -->
<nav class="glass rounded-xl p-2">...</nav>

<!-- The two colors, to build your own surface -->
<div class="bg-glass border border-glass backdrop-blur-md">...</div>
```

When the user reduces transparency, the material falls back to an opaque surface (the container background). Two ways trigger it:

- the system setting, through the `prefers-reduced-transparency` media query;
- the `reduce-transparency` class on an ancestor (`<html>` for example): the "opaque" setting of your own app.

The `transparency-reduce:` variant applies your classes in both cases:

```html
<aside class="bg-glass backdrop-blur-xl transparency-reduce:bg-container transparency-reduce:backdrop-blur-none">
  ...
</aside>
```

```typescript
// An in-app "Reduce transparency" switch
document.documentElement.classList.toggle('reduce-transparency', isOpaque)
```

The `windows` preset ships an Acrylic-like glass, `macos` a vibrancy-like one, and `linux` an opaque one (`blur: '0px'`).

### Interactive cursor

`foundation['interactive-cursor']` is the cursor of the interactive controls: buttons, checkboxes, radios, switches, selects, sidebar items... It defaults to `pointer`. Native controls keep the arrow, so the `macos`, `windows` and `linux` presets set `default`. Links keep the pointer. The `cursor-interactive` utility applies it to your own controls.

```typescript
const calmTheme = definePreset({
  base: 'maz-ui',
  overrides: {
    name: 'calm',
    foundation: { 'interactive-cursor': 'default' },
  },
})
```

```html
<div role="button" tabindex="0" class="cursor-interactive">Custom control</div>
```

## useTheme Composable API

```typescript
const {
  // Reactive state
  preset, // ComputedRef<ThemePreset>
  presetName, // ComputedRef<string>
  colorMode, // Ref<'light' | 'dark' | 'auto'> — also accepts assignment (computed setter)
  isDark, // ComputedRef<boolean>
  strategy, // ComputedRef<'runtime' | 'buildtime'>
  mode, // ComputedRef<'light' | 'dark' | 'both'>
  darkModeStrategy, // ComputedRef<'class' | 'media'>

  // Actions
  updateTheme, // (preset: ThemePreset | ThemePresetName | ThemePresetOverrides) => Promise<void>
  setColorMode, // (mode: 'light' | 'dark' | 'auto', options?: { animate?: boolean }) => Promise<void>
  toggleDarkMode, // (options?: { animate?: boolean }) => Promise<void>
} = useTheme()

// Set the color mode imperatively
await setColorMode('dark')

// Or assign to `colorMode` — it's a computed with a setter
colorMode.value = 'dark'

// Animated full-page switch via View Transitions
await toggleDarkMode({ animate: true })
```

`setColorMode` and `toggleDarkMode` are **async** (`Promise<void>`). The promise resolves once the change — and the optional View Transition — has been applied. Callers can ignore the return value when no transition is needed.

### Advanced Usage Examples

```vue
<script setup>
import { useTheme } from '@maz-ui/themes'
import { computed } from 'vue'

const { presetName, isDark, updateTheme, setColorMode } = useTheme()

// Computed for interface
const themeIcon = computed(() => isDark.value ? '☀️' : '🌙')

// Function to apply a temporary custom theme
function previewColor(color: string) {
  updateTheme({
    colors: {
      light: { primary: color },
      dark: { primary: color }
    }
  })
}

// Auto mode with system detection
function enableAutoMode() {
  setColorMode('auto')
}
</script>
```

## Build-time Strategy: Complete Guide

The build-time strategy allows you to generate your theme CSS files at compile time, offering the best performance in production.

### Step-by-step configuration

#### 1. Generate CSS

::: code-group

```typescript [Vue]
import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import {
  // Build all css in one file
  buildThemeCSS,
  // Build multiple themes with one file each
  generateThemeBundle,
  // Build separate css files
  buildSeparateThemeFiles,
  definePreset,
  mazUi,
} from '@maz-ui/themes'

import App from './App.vue'

const _dirname = dirname(fileURLToPath(import.meta.url))

// Custom theme
const customPreset = definePreset({
  base: mazUi,
  overrides: {
    name: 'custom',
    colors: {
      light: { primary: 'oklch(0.6 0.18 254)' },
      dark: { primary: 'oklch(0.7 0.18 254)' },
    },
  },
})

/**
 * Generate complete CSS
 */
const fullCSS = buildThemeCSS({
  preset: customPreset,
  mode: 'both',
})

writeFileSync(join(_dirname, 'public/custom.css'), fullCSS)

/**
 * Or generate per-mode CSS files
 */
const { full, lightOnly, darkOnly } = buildSeparateThemeFiles(customPreset, {
  darkSelector: 'class',
})

writeFileSync(join(_dirname, 'public/custom-full.css'), full)

/**
 * Or generate bundle for multiple themes in one file each
 */
const themeBundle = generateThemeBundle([customPreset, mazUi], {
  mode: 'both',
})

Object.entries(themeBundle).forEach(([name, css]) => {
  writeFileSync(join(_dirname, `public/${name}.css`), css)
})

const app = createApp(App)

app.use(MazUiTheme, {
  preset: customPreset,
  strategy: 'buildtime', // Important!
  darkModeStrategy: 'class',
})

app.mount('#app')
```

```typescript [Vitepress]
import {
  buildThemeCSS,
  generateThemeBundle,
  buildSeparateThemeFiles,
  createThemeStylesheet,
  definePreset,
  mazUi,
  CSS_ID,
} from '@maz-ui/themes'

// Custom theme
const customPreset = definePreset({
  base: mazUi,
  overrides: {
    name: 'custom',
    colors: {
      light: { primary: 'oklch(0.6 0.18 254)' },
      dark: { primary: 'oklch(0.7 0.18 254)' },
    },
  },
})

// Generate complete CSS
const fullCSS = buildThemeCSS({
  preset: customPreset,
  mode: 'both',
})

// Or generate per-mode CSS files
const { full, lightOnly, darkOnly } = buildSeparateThemeFiles(customPreset, {
  darkSelector: 'class',
})

// Or generate bundle for multiple themes
const themeBundle = generateThemeBundle([customPreset, mazUi], {
  mode: 'both',
})

export default defineConfig<DefaultTheme.Config>({
  head: [
    ['style', { id: CSS_ID, type: 'text/css' }, full],
  ] satisfies HeadConfig[],
})
```

```typescript [Nuxt]
/*
 * You dont need to do anything,
 * The module will handle it for you.
 *
 * Just provide a preset to the module
 */

const customPreset = definePreset({
  base: mazUi,
  overrides: {
    name: 'custom',
    colors: {
      light: { primary: 'oklch(0.6 0.18 254)' },
      dark: { primary: 'oklch(0.7 0.18 254)' },
    },
  },
})

export default defineConfig({
  modules: ['@maz-ui/nuxt'],
  mazUi: {
    theme: {
      preset: customPreset,
      mode: 'both',
      colorMode: 'auto',
    },
  },
})
```

:::

#### 2. Include in your HTML (Only for Vue users)

```html
<link rel="stylesheet" href="/themes/custom-full.css">
```

### Utility functions

#### `buildThemeCSS(options)`

Generates complete CSS for a theme.

```typescript
const css = buildThemeCSS({
  preset: customPreset,
  mode: 'both', // 'light' | 'dark' | 'both'
  darkSelector: 'class', // 'class' | 'media'
})
```

#### `generateThemeBundle(presets, options)`

Generates a bundle containing multiple themes.

```typescript
const bundle = generateThemeBundle([theme1, theme2], {
  mode: 'both',
  darkSelector: 'class',
})
// Result: { 'theme1': 'css...', 'theme2': 'css...' }
```

#### `buildSeparateThemeFiles(preset, options)`

Generates separate files for different use cases.

```typescript
const files = buildSeparateThemeFiles(preset)
// Result: { full, lightOnly, darkOnly }
```

#### `createThemeStylesheet(css, options)`

Creates a `<style>
@reference "../../.vitepress/theme/main.css";
` tag with the provided CSS.

```typescript
const styleTag = createThemeStylesheet(css, {
  id: 'my-theme',
  media: 'screen', // optional
})
```

### Build-time strategy advantages

- **Optimal performance** - No client-side CSS generation
- **Efficient caching** - CSS files cached by CDN
- **Reduced bundle** - Generation utilities excluded from client
- **Full compatibility** - Works even with JavaScript disabled

### Recommended use cases

- Production applications with static themes
- Sites with critical performance requirements
- Projects with multiple predefined themes
- Applications requiring fine control over CSS loading

## Token Reference

Every preset emits the same set of CSS variables on `:root`. With `mode: 'both'`, each base color is a single `light-dark(L, D)` declaration that the browser resolves to the active scheme. Use these names directly in your own CSS — `var(--maz-primary)`, `calc(var(--maz-space) * 4)`, etc.

### Foundation

Single-value design tokens. Set via `foundation.<key>` on the preset.

| Preset key | CSS variable | Default | Notes |
| --- | --- | --- | --- |
| `base-font-size` | `--maz-base-font-size` | `14px` | Anchors `rem` for the whole app. Apply on `html { font-size: var(--maz-base-font-size) }`. |
| `border-width` | `--maz-border-width` | `1px` | Default border for components and the global `*::before/::after` reset. |
| `space` | `--maz-space` | `0.25rem` | Base step for every Tailwind spacing utility (`p-1`, `gap-2`, …). |
| `font-family` | `--maz-font-family` | preset-specific | Sans / body font stack. Bridged to Tailwind `--font-sans`. |
| `font-mono-stack` | `--maz-font-mono-stack` | `ui-monospace, …` | Monospace stack — `MazInputCode`, `<code>`, `<kbd>`. Bridged to `--font-mono`. |
| `font-display-stack` | `--maz-font-display-stack` | same as `font-family` | Display / heading stack. Bridged to `--font-display`. |
| `motion-fast` | `--maz-motion-fast` | `100ms` | Bridged to Tailwind `--duration-fast`. |
| `motion-normal` | `--maz-motion-normal` | `200ms` | Default transition duration (`--default-transition-duration`). |
| `motion-slow` | `--maz-motion-slow` | `300ms` | Bridged to `--duration-slow`. |
| `easing-out` | `--maz-easing-out` | `cubic-bezier(0.4, 0, 0.2, 1)` | Default easing (`--ease-out`, also `--default-transition-timing-function`). |
| `easing-in` | `--maz-easing-in` | `cubic-bezier(0.4, 0, 1, 1)` | Bridged to `--ease-in`. |
| `easing-in-out` | `--maz-easing-in-out` | `cubic-bezier(0.4, 0, 0.2, 1)` | Bridged to `--ease-in-out`. |
| `disabled-opacity` | `--maz-disabled-opacity` | `0.5` | Applied to disabled buttons / inputs. |
| `disabled-cursor` | `--maz-disabled-cursor` | `not-allowed` | Cursor for disabled interactive elements. |
| `interactive-cursor` | `--maz-interactive-cursor` | `pointer` | Cursor of the interactive controls, `default` on the platform presets. Utility `cursor-interactive` (see [Interactive cursor](#interactive-cursor)). |

> **Why `font-mono-stack` / `font-display-stack` / `motion-*`?** Under Tailwind v4 `prefix(maz)`, the bridge LHS gets prefixed (`--font-mono` → `--maz-font-mono`), so a same-named source token would self-cycle. The `-stack` and `motion-` suffixes break the collision.

### Colors

Defined per mode under `colors.light` / `colors.dark`. Each base color also gets an automatic 50–950 scale.

| Preset key | CSS variable (base) | Auto scale | Notes |
| --- | --- | --- | --- |
| `surface` | `--maz-surface` | `--maz-surface-50..900` | Page / container background. |
| `foreground` | `--maz-foreground` | `--maz-foreground-50..900` | Default text color. |
| `primary` | `--maz-primary` | `--maz-primary-50..900` | Main brand color. |
| `primary-foreground` | `--maz-primary-foreground` | — | Text on `bg-primary`. |
| `secondary` | `--maz-secondary` | `--maz-secondary-50..900` | Second strong brand color, not a muted surface. |
| `secondary-foreground` | `--maz-secondary-foreground` | — | |
| `accent` | `--maz-accent` | `--maz-accent-50..900` | Highlights. |
| `accent-foreground` | `--maz-accent-foreground` | — | |
| `info` | `--maz-info` | `--maz-info-50..900` | Status — informational. |
| `info-foreground` | `--maz-info-foreground` | — | |
| `success` | `--maz-success` | `--maz-success-50..900` | Status — success. |
| `success-foreground` | `--maz-success-foreground` | — | |
| `warning` | `--maz-warning` | `--maz-warning-50..900` | Status — warning. |
| `warning-foreground` | `--maz-warning-foreground` | — | |
| `destructive` | `--maz-destructive` | `--maz-destructive-50..900` | Status — error / danger. |
| `destructive-foreground` | `--maz-destructive-foreground` | — | |
| `contrast` | `--maz-contrast` | `--maz-contrast-50..900` | High-contrast accent (light = near-black, dark = near-white). |
| `contrast-foreground` | `--maz-contrast-foreground` | — | |
| `divider` | `--maz-divider` | `--maz-divider-50..900` | Default border / separator color. |
| `muted` | `--maz-muted` | `--maz-muted-50..900` | Muted / secondary text. |
| `overlay` | `--maz-overlay` | `--maz-overlay-50..900` | Backdrop / dialog scrim. |
| `shadow` | `--maz-shadow` | `--maz-shadow-50..900` | Tint used by Tailwind `shadow-*` utilities (via `--color-elevation`). |

### Scales

Multi-step scales under `scales.<key>`.

| Preset key | CSS variables | Tailwind utility |
| --- | --- | --- |
| `rounded.xs..3xl` | `--maz-rounded-xs..3xl` | `rounded-{key}` (bridged to `--radius-{key}`) |
| `shadow.{sm, md, lg, xl, elevation}` | `--maz-shadow-style-{key}` | `shadow-{key}` (bridged to `--shadow-{key}`) |
| `color` (`'relative'` \| `'perceptual'`) | `--maz-color-<role>-50..950`, `--color-<role>-50..950` | `bg-primary-300`... (see [Color scales](#color-scales)) |

> Same naming-collision avoidance as foundation: `rounded.*` (instead of `radius.*`) and `shadow-style-*` (instead of plain `shadow-*`) keep the bridge cycle-free under `prefix(maz)`.

### Components

Per-component knobs under `components.<key>`. All optional — omit to fall back to the surface tokens.

| Preset key | CSS variable | Notes |
| --- | --- | --- |
| `btn.font-weight` | `--maz-btn-font-weight` | Font-weight on `.m-btn`. Defaults to `'500'`. |
| `container.bg.light` / `.dark` | `--maz-container-bg` (per mode) | Background of `Card`, `Container`, `Dialog`, `Popover`, `Drawer`, … Defaults to `var(--maz-surface)`. Bridged to `--color-container`. |
| `input.bg.light` / `.dark` | `--maz-input-bg` (per mode) | Background of `Input`, `Textarea`, `Select`, `Checkbox`, … Defaults to `var(--maz-surface)` light, `var(--maz-surface-400)` dark. Bridged to `--color-input`. |
| `glass.bg.light` / `.dark` | `--maz-glass-bg` (per mode) | Translucent material of floating surfaces. Defaults to the container background at 72% opacity. Bridged to `--color-glass` (`bg-glass`). See [Glass material](#glass-material). |
| `glass.border.light` / `.dark` | `--maz-glass-border` (per mode) | Hairline edge of the material. Defaults to the divider color. Bridged to `--color-glass-border` (`border-glass`). |
| `glass.blur` | `--maz-glass-blur` | Backdrop blur. Defaults to `24px`. |
| `glass.saturate` | `--maz-glass-saturate` | Backdrop saturation. Defaults to `1.4`. |
| `dialog.max-width` | `--maz-dialog-max-width` | Max-width of `MazDialog` on tablet and up. Defaults to `38rem` (`33.25rem` on `ocean`). Overridable via the `max-width` prop. |
| `dialog.min-width` | `--maz-dialog-min-width` | Min-width of `MazDialog` on tablet and up. Defaults to `32rem` (`28rem` on `ocean`). Overridable via the `min-width` prop. |

### Typography

Levels of the type scale under `typography.<level>`. All optional: a missing key keeps the default of the `text-<level>` utility.

| Preset key | CSS variable | Notes |
| --- | --- | --- |
| `<level>.font` | `--maz-typography-<level>-font` | Font stack. Titles default to the display font, the others to the sans font, `code` to the mono font. |
| `<level>.size` | `--maz-typography-<level>-size` | Font size, `rem` or fluid (`clamp()`). |
| `<level>.weight` | `--maz-typography-<level>-weight` | Font weight. |
| `<level>.leading` | `--maz-typography-<level>-leading` | Line height. |
| `<level>.tracking` | `--maz-typography-<level>-tracking` | Letter spacing. |
| `caption.color` | `--maz-typography-caption-color` | Defaults to `var(--maz-muted)`. |

### Sample output

Each base color is emitted as a `light-dark()` value; scales `--maz-X-50` through `--maz-X-950` are derived via OKLCh relative color syntax so they automatically follow base color overrides at runtime, preserving chroma at every step.

```css
:root {
  color-scheme: light dark;

  /* Base colors — one declaration each, resolved by the browser */
  --maz-primary: light-dark(oklch(0.65 0.19 254), oklch(0.72 0.18 254));
  --maz-primary-foreground: light-dark(oklch(1 0 0), oklch(0.16 0.01 254));
  --maz-surface: light-dark(oklch(1 0 0), oklch(0.18 0.01 254));
  --maz-foreground: light-dark(oklch(0.26 0.01 254), oklch(0.96 0.005 254));

  /* Auto-generated 50–950 scale — derived via relative color syntax */
  --maz-primary-500: var(--maz-primary);
  --maz-primary-600: oklch(from var(--maz-primary) clamp(0, calc(l - 0.07), 1) c h);
  /* ... */

  /* Foundation */
  --maz-base-font-size: 14px;
  --maz-border-width: 1px;
  --maz-space: 0.25rem;
  --maz-font-family: Manrope, sans-serif, …;
  --maz-motion-normal: 200ms;

  /* Scales */
  --maz-rounded-md: 0.7rem;
  --maz-shadow-style-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), …;
}

/* With darkModeStrategy: 'class' — explicit user choice overrides the system */
.dark  { color-scheme: only dark; }
.light { color-scheme: only light; }
```

For deeper detail on the generated CSS contract, see the [`@maz-ui/themes` README](https://github.com/LouisMazel/maz-ui/tree/master/packages/themes#generated-css-variables).


## Usage with Nuxt

For Nuxt users, check the [dedicated Nuxt documentation](/ecosystem/nuxt) which covers installation and framework-specific configuration.

## Migration from Legacy System

If you're using the legacy theme system with CLI:

::: code-group

```typescript [Before (CLI)]
// maz-ui.config.ts
export default defineConfig({
  theme: {
    colors: {
      primary: 'hsl(210, 100%, 56%)',
      secondary: 'hsl(164, 76%, 46%)'
    }
  }
})
```

```typescript [After (@maz-ui/themes)]
// main.ts
import { definePreset, mazUi } from '@maz-ui/themes'
import { MazUiTheme } from '@maz-ui/themes/plugin'

const myTheme = definePreset({
  base: mazUi,
  overrides: {
    colors: {
      light: {
        primary: 'oklch(0.65 0.19 254)',
        secondary: 'oklch(0.72 0.16 168)'
      }
    }
  }
})

app.use(MazUiTheme, { preset: myTheme })
```

:::

The new system offers much more flexibility and performance!

<script setup>
import ColorScaleComparison from '../../components/ColorScaleComparison.vue'
import { useTheme } from '@maz-ui/themes/composables/useTheme'
import { definePreset } from '@maz-ui/themes'
import { ref } from 'vue'

const {
  isDark,
  colorMode,
  preset,
  setColorMode,
  updateTheme,
  presetName
} = useTheme()

const originalPresetName = ref(null)

const customPreset = await definePreset({
  base: 'pristine',
  overrides: {
    name: 'custom-purple',
    colors: {
      light: {
        'primary': 'oklch(0.62 0.24 305)',
        'secondary': 'oklch(0.94 0.04 320)',
        'accent': 'oklch(0.7 0.22 290)'
      },
      dark: {
        'primary': 'oklch(0.72 0.22 305)',
        'secondary': 'oklch(0.28 0.06 320)',
        'accent': 'oklch(0.78 0.2 290)'
      }
    }
  }
})

function applyCustomTheme() {
  if (!originalPresetName.value) {
    originalPresetName.value = presetName.value
  }

  updateTheme(customPreset)
}

function resetTheme() {
  if (originalPresetName.value) {
    updateTheme(originalPresetName.value)
    originalPresetName.value = null
  }
}
</script>

<style scoped>
@reference "../../.vitepress/theme/main.css";
.demo-theme-controls {
  @apply maz:w-full;
}

.theme-controls {
  @apply maz:border-t maz:border-divider maz:pt-4;
}
</style>
