---
title: Maz-UI v5.0.0 Migration Guide
description: What changes for you when upgrading from Maz-UI v4 to v5
---

# {{ $frontmatter.title }}

Maz-UI v5 is a major release. For **most consumers** the migration is short — you keep installing the package, importing its styles, using the components. Below is what actually changes for you.

::: warning Solo maintainer notice
Maz-UI is maintained by a single developer. After the v5 stable release, **v4 will no longer receive any support** — no security fixes, no backports. Please plan your upgrade.
:::

## TL;DR

1. Bump **Node to ≥ 20** and confirm your audience has modern browsers (see below).
2. If your **custom CSS** uses `hsl(var(--maz-<color>))`, simplify to `var(--maz-<color>)`.
3. Rename `import 'maz-ui/styles'` to `import 'maz-ui/style.css'` (and `maz-ui/aos-styles` → `maz-ui/aos.css`).
4. If you imported anything via `maz-ui/src/...`, switch to the public subpath (e.g. `maz-ui/components/MazBtn`).
5. Replace any `roundedSize="base"` with `roundedSize="md"` (or drop the prop — the new default is visually identical).
6. Replace any **numeric `MazBadge` size** (`size="0.8rem"`, `size="1.2em"`, …) with one of the standardized keywords (`'mini' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'`).
7. **`MazIcon` API simplified** — drop `name`, `path` and `src` props; use a single `icon` prop that accepts a Vue component, a URL/`data:` URI, or a raw SVG string.
8. Rename **`leftIcon` / `rightIcon`** to **`startIcon` / `endIcon`** (and the matching slots / `--has-*-icon` classes) on `MazBtn`, `MazInput`, `MazLink`, `MazContainer`, `MazSelect`. Same idea for `MazCard`'s `footerAlign` and `MazDrawer`'s `variant` — `'left' | 'right'` becomes `'start' | 'end'`.
9. **`MazChart`** drops `vue-chartjs` (lighter bundle, no eager registration of unused chart types). The `updateMode` prop now defaults to `'none'` — pass `update-mode="default"` if you want animated data updates.
10. That's it for most apps. Everything else is opt-in.

## Prerequisites

### Node

```bash
node -v   # must be >= 20
```

### Browser support

v5 requires native support for a few modern CSS features (`color-mix()`, `@property`, native CSS nesting). Minimum versions:

| Browser | Minimum |
| --- | --- |
| Chromium (Chrome, Edge, Opera, Brave, Arc) | 111 (March 2023) |
| Safari | 16.4 (March 2023) |
| Firefox | 128 (July 2024) |
| Samsung Internet | 22 |

There is no polyfill path. If your audience still relies on older browsers, stay on v4. See the dedicated [Browser Support](./browser-support.md) page for the rationale.

## Required changes

### 1. `hsl(var(--maz-<color>))` → `var(--maz-<color>)` in your CSS

The biggest — and usually only — change to chase down in your codebase.

**In v4** the CSS variables injected by `@maz-ui/themes` held raw HSL channels (`210 100% 56%`), so you had to wrap them yourself:

```css
.brand {
  background-color: hsl(var(--maz-primary));
  border-color: hsl(var(--maz-primary) / 0.5);
}
```

**In v5** the same variables hold complete CSS colors (`hsl(210 100% 56%)`). Wrapping in `hsl(...)` again produces `hsl(hsl(...))`, which is invalid. Update your own CSS:

```css
.brand {
  background-color: var(--maz-primary);
  border-color: color-mix(in srgb, var(--maz-primary) 50%, transparent);
}
```

For the alpha case, use `color-mix()`. The old `/ <alpha>` syntax no longer applies to already-wrapped values.

Quick search-and-fix:

```bash
# Find the patterns to update
rg "hsl\(\s*var\(--maz-" src/
```

### 2. CSS subpath renames

The two CSS entry points have been renamed to include their real file extension, so TypeScript treats them as plain side-effect CSS imports (no more `.d.ts` stubs required):

| v4 | v5 |
| --- | --- |
| `import 'maz-ui/styles'` | `import 'maz-ui/style.css'` |
| `import 'maz-ui/aos-styles'` | `import 'maz-ui/aos.css'` |

Both resolve to the same compiled CSS they did in v4, only the subpath key changes.

```bash
# Find the patterns to update
rg "['\"]maz-ui/(styles|aos-styles)['\"]" src/
```

### 3. `roundedSize="base"` removed

The `'base'` value of the `roundedSize` prop has been removed across the affected components. The default radius is now `'md'` (which maps to the same visual radius v4 used for `'base'`).

| Component | Old default | New default |
| --- | --- | --- |
| `MazAlert` | `'base'` | `'md'` |
| `MazAvatar` | `'base'` | `'md'` |
| `MazBtn` | `'base'` | `'md'` |
| `MazContainer` | `'base'` | `'md'` |
| `MazInput` | `'base'` | `'md'` |
| `MazSkeleton` | `'base'` | `'md'` |
| `MazTable` | `'lg'` | `'md'` |
| `MazTextarea` | (none) | `'md'` |
| `MazTimeline` | `'base'` | `'md'` |

Search for explicit usages and replace them:

```bash
rg "rounded-?size\s*=\s*['\"]base['\"]" src/
```

```vue
<!-- v4 -->
<MazBtn rounded-size="base" />

<!-- v5 -->
<MazBtn rounded-size="md" />
<!-- or just drop the prop, the new default is identical visually -->
<MazBtn />
```

### 4. `MazIcon` API simplified

`MazIcon` v4 had four ways to specify an icon (`icon`, `src`, `path`+`name`, `name`). v5 collapses everything into a single `icon` prop that accepts:

- A **Vue component** (lazy or static, from `@maz-ui/icons`)
- A **URL** or `data:` URI to a `.svg` file
- A **raw SVG string** (`'<svg>…</svg>'`)

```vue
<!-- v4 -->
<MazIcon name="home" />
<MazIcon name="home" path="/icons" />
<MazIcon src="/assets/star.svg" />
<MazIcon :icon="MazStar" />

<!-- v5 -->
<MazIcon icon="/home.svg" />            <!-- relative URL — `mazIconPath` is prepended in SSR -->
<MazIcon icon="/icons/home.svg" />      <!-- absolute path -->
<MazIcon icon="/assets/star.svg" />
<MazIcon :icon="MazStar" />              <!-- unchanged -->
```

The `mazIconPath` `provide` (and Nuxt's `mazUi.general.defaultMazIconPath`) is still honored — it now acts as a **base URL prefix** for relative URL icons, mainly useful in SSR where `fetch('/icons/home.svg')` cannot resolve without a host.

New props:

- `fallback` — same shape as `icon`. Used when `icon` is missing or fails to load. Defaults to `MazQuestionMarkCircle`.
- `svgAttributes` — extra attributes injected onto the rendered `<svg>`.
- `flipIconForRtl` — mirror the icon horizontally when the document direction is RTL (useful for chevrons/arrows).

Removed:

- `loaded` and `unloaded` events (only `error` remains, useful for telemetry/fallback wiring).

The `<MazIcon>` rendering also got a small a11y polish — it sets `aria-hidden="true"` by default and switches to `role="img"` (without `aria-hidden`) automatically when an `aria-label` is provided.

### 5. New raw icon import path — `@maz-ui/icons/raw/*`

Each bundled icon is now also exported as a **raw SVG string** under the `raw/` subpath. Pass it to `<MazIcon :icon="…" />` to inline the SVG without paying the cost of a Vue component or an async chunk.

```vue
<script setup>
import MazIcon from 'maz-ui/components/MazIcon'
import { MazStar } from '@maz-ui/icons/raw/MazStar'
</script>

<template>
  <MazIcon :icon="MazStar" />
</template>
```

The existing `static/` (eager Vue component) and `lazy/` (async Vue component) entries are still available — pick what fits the situation. See the [icon set guide](./icon-set.md) for the full decision matrix.

### 6. Logical direction props — `leftIcon`/`rightIcon` → `startIcon`/`endIcon`

To make components RTL-correct out of the box, every prop / slot / class that names a *visual* edge has been renamed to a *logical* edge:

- **`left` / `right`** describe a physical position; they don't flip when `dir="rtl"`.
- **`start` / `end`** follow the inline direction — `start` is the side where reading begins (left in LTR, right in RTL).

This is consistent with native CSS (`margin-inline-start`, `padding-inline-end`, `text-align: start`) and with how design systems like Radix UI and MUI handle direction.

#### Components

| Component | v4 | v5 |
| --- | --- | --- |
| `MazBtn` | `leftIcon` / `rightIcon` props, `#left-icon` / `#right-icon` slots | `startIcon` / `endIcon` props, `#start-icon` / `#end-icon` slots |
| `MazInput` | `leftIcon` / `rightIcon` props, `#left-icon` / `#right-icon` slots | `startIcon` / `endIcon` props, `#start-icon` / `#end-icon` slots |
| `MazLink` | `leftIcon` / `rightIcon` props, `#left-icon` / `#right-icon` slots | `startIcon` / `endIcon` props, `#start-icon` / `#end-icon` slots |
| `MazContainer` | `leftIcon` / `rightIcon` props, `#icon-left` / `#icon-right` slots | `startIcon` / `endIcon` props, `#icon-start` / `#icon-end` slots |
| `MazSelect` | `#left-icon` / `#right-icon` slots | `#start-icon` / `#end-icon` slots |
| `MazCard` | `footerAlign: 'left' \| 'right'` | `footerAlign: 'start' \| 'end'` |
| `MazDrawer` | `variant: 'left' \| 'right' \| 'top' \| 'bottom'` | `variant: 'start' \| 'end' \| 'top' \| 'bottom'` (`top` / `bottom` unchanged — physical) |

`top` and `bottom` are intentionally kept (block-axis edges that don't flip in RTL).

#### Internal CSS hooks

If you target maz-ui's internal selectors from your own CSS, also rename:

| v4 | v5 |
| --- | --- |
| `.--has-left-icon` / `.--has-right-icon` | `.--has-start-icon` / `.--has-end-icon` (on `MazBtn`, `MazInput`) |
| `.m-input-wrapper-left` / `.m-input-wrapper-right` | `.m-input-wrapper-start` / `.m-input-wrapper-end` |
| `drawer-anim-left` / `drawer-anim-right` transitions | `drawer-anim-start` / `drawer-anim-end` (auto-mirrored under `[dir="rtl"]`) |

#### Migration

```vue
<!-- v4 -->
<MazBtn left-icon="user" right-icon="arrow-right">Save</MazBtn>
<MazInput :left-icon="MazSearch" />
<MazContainer title="Settings" left-icon="cog-6-tooth" />
<MazCard footer-align="right" />
<MazDrawer variant="right" />

<!-- v5 -->
<MazBtn start-icon="user" end-icon="arrow-right">Save</MazBtn>
<MazInput :start-icon="MazSearch" />
<MazContainer title="Settings" start-icon="cog-6-tooth" />
<MazCard footer-align="end" />
<MazDrawer variant="end" />
```

```bash
# Quick search to chase down the renames
rg "(left|right)-icon|(left|right)Icon|footer-align=\"(left|right)\"|variant=\"(left|right)\"" src/
```

### 7. Icon-consuming components accept the full `MazIconProps` object

`MazBtn`, `MazInput`, `MazLink`, `MazContainer` and `MazDropdown` all forward their `startIcon` / `endIcon` / `icon` / `dropdownIcon` to an internal `<MazIcon>`. In v5 these props now accept either:

1. **A bare value** — Vue component, URL/`data:` URI, or raw SVG string (the same shape `MazIcon`'s `icon` prop accepts). This is the existing common case.
2. **A full `MazIconProps` object** — `{ icon, size, title, svgAttributes, fallback, flipIconForRtl }`. Useful when you need to override the inherited size, set a `<title>` for screen readers, or pass per-icon SVG attributes.

```vue
<!-- v4 only accepted a bare value -->
<MazBtn :left-icon="MazStar" />

<!-- v5 — bare value still works -->
<MazBtn :start-icon="MazStar" />
<MazBtn start-icon="/icons/star.svg" />

<!-- v5 — full props object for fine-grained control -->
<MazBtn
  size="sm"
  :start-icon="{
    icon: MazStar,
    size: 'lg',           // override the size derived from `size='sm'`
    title: 'Favorite',    // adds <title> for screen readers
    flipIconForRtl: true,
  }"
/>
```

Falling back to passing `undefined` (or just omitting the prop) opts the icon out, as before.

### 8. `MazChart` no longer depends on `vue-chartjs`

`MazChart` v4 wrapped `vue-chartjs`, eagerly registered every Chart.js controller / element / scale at import time, and updated the chart with the default animation mode on every reactive change. v5 talks to `chart.js` directly, lazy-loads the engine on mount, and only registers the modules required by the chart `type` you requested.

What this means for you:

- The peer dependency on `vue-chartjs` is gone. If you were importing anything from it directly, switch to `chart.js`.
- The `updateMode` prop now **defaults to `'none'`** (previously `'default'`). Subsequent data / options changes no longer animate by default — this is what makes large dashboards stop freezing on prop updates. The initial render still animates per the chart's `options`. Pass `update-mode="default"` to restore the v4 behavior.
- The re-exported types (`MazChartData`, `MazChartType`, `MazChartUpdateMode`, `MazChartPlugin`, `MazChartDefaultDataPoint`) are unchanged — they now come from `chart.js` instead of `vue-chartjs` but are otherwise the same. The `ChartProps` link in the v4 docs (which pointed to `vue-chartjs/src/types.ts`) is replaced by the `MazChartProps` interface documented on the [MazChart page](../components/maz-chart.md).

```vue
<!-- v4 — animated update on every data change -->
<MazChart :type :data :options />

<!-- v5 — same call, but data updates skip animations by default -->
<MazChart :type :data :options />

<!-- v5 — restore v4 animated updates -->
<MazChart :type :data :options update-mode="default" />
```

If you weren't using `vue-chartjs` directly and were happy with the default animation behavior on every update, you can ignore this — only add `update-mode="default"` where the animation matters.

### 9. `MazBadge` `size` prop now uses `MazSize`

`MazBadge`'s `size` prop used to accept any CSS length string (e.g. `"0.8rem"`, `"1.2em"`). It now follows the same `MazSize` contract as the rest of the library (`MazBtn`, `MazInput`, …): one of `'mini' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'`. The default is `'md'`.

Padding, line-height and dimensions still scale relative to the chosen font-size via `em` units, so a single keyword controls the whole footprint.

```vue
<!-- v4 -->
<MazBadge size="0.8rem" />
<MazBadge size="1.2em" />

<!-- v5 -->
<MazBadge size="sm" />
<MazBadge size="md" />
```

Approximate mapping if you want to preserve your previous footprint:

| v4 (font-size) | v5 |
| --- | --- |
| ≤ 0.65rem (~10px) | `'mini'` |
| 0.7rem (~11px) | `'xs'` |
| 0.75–0.8rem (12px) | `'sm'` |
| 0.85–0.9rem (~14px) | `'md'` (default) |
| 1rem (16px) | `'lg'` |
| ≥ 1.125rem (18px) | `'xl'` |

```bash
# Find badges still using a numeric size
rg "MazBadge[^/]*size=\"[0-9]" src/
```

If you really need a custom size, wrap or override via your own class — pass `size="md"` (or omit it) and apply a Tailwind text utility:

```vue
<MazBadge size="md" class="maz:text-[0.7rem]" />
```

### 10. Theme preset rename — `background` → `surface`, `border` → `divider`

Preset keys now use the same names that components and Tailwind utilities have used all along. There is no compatibility alias — rename the keys in your custom preset.

```ts
// v4
{
  colors: {
    light: { background: '0 0% 100%', border: '220 13% 91%', /* ... */ },
    dark:  { background: '235 16% 15%', border: '238 17% 25%', /* ... */ },
  },
}

// v5
{
  colors: {
    light: { surface: '0 0% 100%', divider: '220 13% 91%', /* ... */ },
    dark:  { surface: '235 16% 15%', divider: '238 17% 25%', /* ... */ },
  },
}
```

The runtime CSS variables follow:

| v4 | v5 |
| --- | --- |
| `--maz-background[-N]` | `--maz-surface[-N]` |
| `--maz-border[-N]` | `--maz-divider[-N]` |

Tailwind utilities `maz:bg-surface`, `maz:text-surface-700`, `maz:border-divider` are stable — they pointed at these renamed vars even in v4 and continue to work.

```bash
# Find leftovers
rg "(--maz-background|--maz-border\b|colors\.(light|dark)\.(background|border))" src/
```

### 11. Theme preset: `foundation.radius` → `scales.radius.md`

The single foundation radius is replaced by a full radius scale. Move your value to `scales.radius.md` and pick the rest of the scale (or spread the bundled defaults).

```ts
// v4
{
  foundation: {
    'base-font-size': '14px',
    'border-width': '1px',
    'radius': '0.7rem',
  },
}

// v5
{
  foundation: {
    'base-font-size': '14px',
    'border-width': '1px',
    'space': '0.25rem',
  },
  scales: {
    rounded: {
      'xs': '0.125rem',
      'sm': '0.25rem',
      'md': '0.7rem',
      'lg': '1rem',
      'xl': '1.5rem',
      '2xl': '2rem',
      '3xl': '3rem',
    },
    shadow: { /* ... */ },
  },
}
```

The bridge maps every `--maz-rounded-{key}` to its matching Tailwind `--radius-{key}`, so `maz:rounded-md`, `maz:rounded-lg`, etc. all move with your preset.

### 12. New optional preset blocks: `scales` and `components`

`@maz-ui/themes` now lets you drive the rounded / shadow scales (and `space` via `foundation`) plus a small set of per-component tokens:

```ts
{
  foundation: {
    space: '0.25rem',
  },
  scales: {
    rounded: { /* xs..3xl */ },
    shadow: { sm, md, lg, xl, elevation },
  },
  components: {
    btn: { 'font-weight': '500' },
    container: { bg: { light: 'var(--maz-surface)', dark: 'var(--maz-surface)' } },
    input: { bg: { light: 'var(--maz-surface)', dark: 'var(--maz-surface-400)' } },
  },
}
```

Both blocks are optional; the bundled presets ship with sensible defaults. New `foundation` keys also landed and are all optional: `font-mono`, `font-display`, `disabled-opacity`, `disabled-cursor`. See the [themes guide](./themes.md) for the full surface.

### 13. Theme strategy: `'hybrid'` removed, no more critical CSS

The `@maz-ui/themes` rendering pipeline collapsed back to a single path: the full CSS is generated and injected synchronously on first paint. The two-stage critical-CSS / async-full-CSS dance is gone.

What changed:

- `Strategy` is now `'runtime' | 'buildtime'` — `'hybrid'` no longer exists. The runtime default is `'runtime'`.
- `MazUiTheme` plugin options no longer accept `injectCriticalCSS` / `injectFullCSS`.
- `@maz-ui/nuxt`'s `theme` config no longer accepts `injectAllCSSOnServer`.
- `generateCSS` / `buildThemeCSS` / `buildSeparateThemeFiles` no longer accept `onlyCritical`, `criticalColors`, `criticalFoundation`, or `includeColorScales`. `buildSeparateThemeFiles` now returns `{ full, lightOnly, darkOnly }` only — no more `critical`.

What you need to do:

```diff
 app.use(MazUiTheme, {
   preset: mazUi,
-  strategy: 'hybrid',
+  strategy: 'runtime',
-  injectCriticalCSS: true,
-  injectFullCSS: true,
 })
```

```diff
 export default defineNuxtConfig({
   mazUi: {
     theme: {
-      strategy: 'hybrid',
+      strategy: 'runtime',
-      injectAllCSSOnServer: true,
     },
   },
 })
```

To keep first-paint clean, **pass the preset object** (not just a string name) so the full CSS is rendered before the first frame.

### 14. `color="background"` → `color="surface"` on components

The components that exposed `color="background"` in their public prop now use `color="surface"`. The visual result is identical — only the literal changes.

| Component | v4 | v5 |
| --- | --- | --- |
| `MazBtn` | `color="background"` | `color="surface"` |
| `MazBadge` | `color="background"` | `color="surface"` |
| `MazLink` | `color="background"` | `color="surface"` |
| `MazPopover` | `color="background"` (default) | `color="surface"` (default) |
| `MazPagination` | `activeColor="background"` (default) | `activeColor="surface"` (default) |
| `MazRadioButtons` | `color="background"` | `color="surface"` |

```bash
# Find prop usages to update
rg "color\s*=\s*['\"]background['\"]" src/
```

## Informational changes (probably no action needed)

### Theme colors are now emitted as OKLCh

`@maz-ui/themes` now ships its bundled presets (`mazUi`, `ocean`, `pristine`, `obsidian`) in `oklch()` form, and the dynamic color scale generator (`generateColorScale`, `adjustColorLightness`, `getContrastColor`) steps in OKLCh space and emits `oklch(L C H)` strings. The runtime CSS variables (`--maz-primary`, `--maz-primary-100`, …) therefore hold OKLCh colors.

This is **transparent for consumers**:

- Components keep working unchanged.
- Custom CSS using `var(--maz-<color>)` keeps working — `oklch()` is a regular CSS color.
- `color-mix(in srgb, var(--maz-primary) 50%, transparent)` still works; `color-mix(in oklab, …)` will give you slightly better blending if you care.
- Custom presets written in `hsl()`, `rgb()`, `#hex` or the legacy `'210 100% 56%'` form still parse — they get converted to OKLCh on the fly.

You only need to do something if you were:

- **Reading the channel format** of a color from `--maz-*` in JS — the value used to be an `hsl(...)` string, it's now an `oklch(...)` string. Use `getComputedStyle(...).getPropertyValue(...)` and a CSS color parser if you need channels.
- **Calling `adjustColorLightness`** directly — the `adjustment` parameter is now in OKLCh L units (`0..1`) instead of HSL L percentage (`0..100`). Divide your existing values by 100.

```ts
// v4: HSL L percentage
adjustColorLightness('hsl(210 50% 40%)', 20)  // → 'hsl(210 50% 60%)'

// v5: OKLCh L (0..1)
adjustColorLightness('hsl(210 50% 40%)', 0.2) // → 'oklch(0.65 0.108 232.62)'
```

Why the switch: OKLCh is perceptually uniform, so generated scales (`primary-50` → `primary-950`) ramp consistently across hues — yellow-700 won't look muddy compared to blue-700 anymore. It also unlocks Display P3 colors when you author a vivid preset.

### Preset type: `HSL` → `CSSColor`

If you authored a custom preset via `@maz-ui/themes`, the color field type is now the looser `CSSColor = string` instead of the template literal `HSL`.

- Your existing raw values (`'210 100% 56%'`) keep working — they are auto-wrapped in `hsl(...)` at runtime by `normalizeColor`.
- You can now use any CSS color form: `'hsl(210 100% 56%)'`, `'#22c55e'`, `'oklch(0.7 0.15 30)'`, `'rgb(22 194 211)'`.
- Type checking on custom colors is now permissive. If you want strict validation, keep using the raw HSL form or validate at your boundary.

No action required for existing presets.

### Default border color

Tailwind v4 changed the default `border` color from the configured gray to `currentColor`. **Inside maz-ui components** we restore the v3 behavior so shadows, dividers and outlines keep their neutral tint; your own styles are unaffected (you get the Tailwind v4 default). If you also want the v3 default in your own code, see the [official Tailwind upgrade guide](https://tailwindcss.com/docs/upgrade-guide#default-border-color).

### Visual parity

Most visual regressions were caught during the migration, but keep an eye on:

- Shadows, radius and blur scales — Tailwind v4 shifted a few names (`shadow` → `shadow-sm`, `blur` → `blur-sm`, etc.). Maz-ui components have been updated internally; your own code is affected only if you used these classes directly.
- `outline-none` → `outline-hidden` (same story).

### `nova` preset added, bundled palettes refreshed

Four bundled presets remain (`mazUi`, `pristine`, `ocean`, `obsidian`) plus a new `nova` startup / AI / creative preset (electric violet primary, cyan accent, hot coral secondary, Geist font stack). Each existing preset's palette has been retuned so the `secondary` / `accent` voices actually pop in `MazCardSpotlight`, secondary `MazBtn` variants and badges:

| Preset | Identity |
| --- | --- |
| `pristine` | Sober Apple — near-black primary, system blue accent, system purple secondary, SF system font, Apple spring easing. |
| `ocean` | Calm water — teal primary, deep navy secondary, sandy ochre accent. |
| `obsidian` | Dark luxe — indigo primary, gold accent, fuchsia secondary, snappy expo easing. |
| `nova` | Modern AI — electric violet primary, cyan accent, hot coral secondary. |

Switching to one of the bundled presets does not require any code change beyond the preset name. If you depended on the previous (washed-out gray) `secondary` color in a custom theme, override it back via `colors.{light,dark}.secondary` in your preset.

### Preset name persistence (new — opt-out, no breaking change)

`@maz-ui/themes` now persists the active preset name in a `maz-preset` cookie (1-year TTL, `SameSite=Lax`) — same shape as the existing `maz-color-mode` cookie:

- The cookie is read at boot and **takes priority over `options.preset`** — even when `options.preset` is a preset object. `options.preset` (string or object) is the default the app boots with; the cookie carries the user's last explicit choice and wins.
- It is written after every successful preset resolution and after every `useTheme().updateTheme()` call.
- If the saved name no longer resolves, the cookie is cleared and the runtime falls back to `options.preset` (or default).

Persistence is enabled by default. To opt out (privacy, no end-user switching, …), set `persistPreset: false`:

```ts
app.use(MazUiTheme, {
  preset: mazUi,
  persistPreset: false,
})
```

The same option is exposed in the Nuxt module config under `mazUi.theme.persistPreset`.

## What you can ignore

Unless you had your own Tailwind v3 setup alongside maz-ui, none of the following apply to you:

- Tailwind CSS config migration (CSS-first)
- Class prefix changes (`maz-flex` → `maz:flex`) — these are internal to maz-ui's compiled CSS
- `@apply X !important` → `@apply X!` syntax
- Utility renames en masse
- `defineMazTailwindConfig` removal
- CSS variable shorthand (`bg-[var(--x)]` → `bg-(--x)`)

If you DO have your own Tailwind v4 setup and want to expose maz-ui's theme tokens to your own utilities, read the [Tailwind integration](./tailwind.md) page. That's where all the Tailwind-specific migration lives.

## Troubleshooting

**Colors look wrong in devtools — I see `hsl(hsl(...))` somewhere.**
You still have `hsl(var(--maz-<color>))` in your CSS. See the required change above.

**A maz-ui component's border is a weird color.**
Expected if you were overriding `--maz-divider` (renamed from `--maz-border` in v5) with a non-color value. Confirm it's a valid CSS color.

**My custom preset's colors are ignored.**
Check the preset's type — if you imported `HSL` explicitly, switch to `CSSColor` (or just remove the type annotation). Raw HSL strings still work at runtime.

## Advanced: you had your own Tailwind setup

If you were already running Tailwind v3 in your app, shipping classes like `maz-flex` yourself, you need the same migration as any Tailwind v3 → v4 upgrade:

1. Run the official Tailwind upgrade tool: `npx @tailwindcss/upgrade` — it handles 95% of the work (utility renames, `@apply !important` syntax, `tailwind.config` → CSS-first, …).
2. Replace any `hsl(var(--maz-<color>))` in your own CSS (see above).
3. Read the [Tailwind integration](./tailwind.md) page to learn how to import maz-ui's bridge and expose your theme tokens to your own Tailwind config.

This is a niche path — most consumers never wrote maz-prefixed classes in their own code.

## See also

- [Tailwind CSS integration](./tailwind.md) — optional, for consumers who have their own Tailwind setup
- [Theming](./themes.md) — preset authoring and runtime theme switching
- [Browser Support](./browser-support.md) — exact minimum versions and the features they enable
