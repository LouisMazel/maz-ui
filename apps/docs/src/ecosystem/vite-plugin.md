---
title: Vite plugin
description: "@maz-ui/vite-plugin brings icons by name (<MazIcon icon=\"x-mark\" />, only the icons of each page bundled), removes the unused CSS of maz-ui at build time and keeps only the theme presets your app loads."
head:
  - - meta
    - name: keywords
      content: vite, vite plugin, icons, svg, icon names, purge css, unused css, css size, bundle size, tree shaking css, theme presets, maz-ui
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<NpmBadge package="@maz-ui/vite-plugin" />

`MazUi()` holds the plugins of maz-ui:

- **Icons by name**: `icon="x-mark"` without an import, with the SVG of your project and the types of the names.
- **CSS purge**: removes from the CSS of maz-ui what your app does not use.
- **Theme presets**: keeps in the build only the theme presets your app loads by name.

::: tip Nuxt
With `@maz-ui/nuxt`, you do not install anything: the module adds them, see [`icons`](./nuxt.md#icons), [`css.purge`](./nuxt.md#css-configuration) and [`theme.presets`](./nuxt.md#theme-system).
:::

## Installation

For Vue apps built with Vite (`vite >=6 <9`):

::: code-group

```bash [pnpm]
pnpm add -D @maz-ui/vite-plugin
```

```bash [npm]
npm install -D @maz-ui/vite-plugin
```

```bash [yarn]
yarn add -D @maz-ui/vite-plugin
```

:::

It requires `maz-ui >= 5.7.0`. Keep both on the same version.

## Usage

```ts
// vite.config.ts
import { MazUi } from '@maz-ui/vite-plugin'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    vue(),
    MazUi(),
  ],
})
```

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `icons` | `boolean \| object` | `true` | [Icons by name](#icons-by-name) |
| `purge` | `boolean \| object` | `true` | [CSS purge](#css-purge) |
| `presets` | `string[]` | every preset | [Theme presets](#theme-presets) |

## Icons by name

```vue
<template>
  <MazIcon icon="x-mark" />
  <MazIcon :icon="isDark ? 'moon' : 'sun'" />
  <MazBtn start-icon="arrow-right">
    Next
  </MazBtn>
  <MazSvg icon="flag-fr" width="32" />
  <MazSvg icon="hero" /> <!-- src/icons/hero.svg -->
</template>
```

Every icon of [@maz-ui/icons](./icons/index.md) (`x-mark`, `logo-vue`, `flag-fr`) and every SVG of `src/icons` is available by name, in every prop that takes an icon (`icon`, `start-icon`, `end-icon`...).

- **Only the icons of each page are bundled**: the plugin finds the names a file uses and adds them to the chunk of this file. An icon of a single route is not in the entry chunk.
- **SSR**: the icon is in the HTML of the server.
- **Typed**: the plugin writes `src/maz-icons.d.ts`, for the autocompletion of the names.
- **No reload in dev** when a page uses a new icon.
- **Imports from the root**: `import { MazStar, LazyMazHome } from '@maz-ui/icons'` is rewritten to the module of each icon (`@maz-ui/icons/static/MazStar`), the dev server does not load the 860+ icons.

### Which names are found

The plugin reads the strings of the keys, variables and attributes whose name contains `icon` (and the ones of `scan.keys`), and the strings with your `prefix`:

```ts
const items = [{ label: 'Home', icon: 'home' }] // found
const icon = computed(() => isDark.value ? 'moon' : 'sun') // found
h(MazIcon, { icon: 'bell' }) // found
const names = ['home', 'user'] // not found: no icon context
```

A name built at runtime (from an API, `` `flag-${code}` ``) is not found: add it to `safelist`. An unknown name renders the `fallback` of MazIcon, with a warning in the console.

### SVG of the project

`src/icons/hero.svg` is `hero`, `src/icons/brand/logo.svg` is `brand-logo`. They are optimized with the [default svgo config](./vite-svg-loader.md#default-svgo-config). A file with the name of an icon of maz-ui replaces it, with a warning. Set a `prefix` to keep them apart:

```ts
MazUi({
  icons: { dir: 'src/assets/svg', prefix: 'app' },
})
```

```vue
<MazSvg icon="app:hero" />
```

### Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `dir` | `IconDir \| IconDir[]` | `'src/icons'` | Folders of the SVG of the project: a path, or `{ path, prefix?, svgo?, lazy?, import? }`, see [Folders](./icons/by-name.md#folders) and [Load on demand](./icons/by-name.md#load-on-demand) |
| `prefix` | `string` | | Prefix of the names of the folders given by their path: `app` gives `app:hero` |
| `defaultIcons` | `boolean \| IconSet[]` | `true` | The icons of `@maz-ui/icons` by name: every set, some of them (`['icons', 'logos']`), or none, see [Sets of maz-ui](./icons/by-name.md#sets-of-maz-ui) |
| `safelist` | `string[]` | `[]` | Names the plugin can not find (built at runtime): registered wherever icons are used |
| `dts` | `string \| boolean` | `'src/maz-icons.d.ts'` | File of the types of the names, `false` to not write it |
| `strict` | `boolean` | `false` | `icon` only accepts the known names, URLs and raw SVG: a typo is a type error, see [Catch typos](./icons/by-name.md#catch-typos) |
| `svgoConfig` | `Config \| (defaults) => Config` | | svgo config of the folders given by their path |
| `scan.keys` | `string[]` | `[]` | Props and keys whose values are names, besides the ones whose name contains `icon`, see [Your own icon component](./icons/by-name.md#your-own-icon-component) |
| `lib` | `boolean` | `true` with `build.lib` | Build of a library: the icons of an external `@maz-ui/icons` stay imports, see [Libraries](./icons/by-name.md#libraries) |

The types augment `@maz-ui/icons` (`maz-ui` when the project does not resolve it): keep `src/maz-icons.d.ts` in the `include` of your `tsconfig.json` (it is under `src`). Vite writes it when it starts: run `maz-ui-icons types` before `vue-tsc` in the CI, see [Before the typecheck](./icons/by-name.md#before-the-typecheck). It only changes when you add an SVG or upgrade maz-ui.

::: details Your own components with an icon prop
Type the prop with `MazIconString` (a string, from `maz-ui`) or `MazIconValue` (a string or a component, from `maz-ui/components/MazIcon`), through a generic:

```vue
<script setup lang="ts" generic="T extends MazIconValue">
import type { MazIconValue } from 'maz-ui/components/MazIcon'

const { icon = 'home' } = defineProps<{ icon?: T }>()
</script>
```

Without the generic, a component that destructures its props, uses `withDefaults` or is assigned to the `Component` type fails with `TS2590: Expression produces a union type that is too complex to represent`, caused by the `LooseRequired` type of Vue ([vuejs/core#10514](https://github.com/vuejs/core/issues/10514)). Type the template refs of a generic component with [`GenericInstanceType`](./utils/types/generic-instance-type.md), `InstanceType` does not work with it.
:::

## CSS purge

`maz-ui/style.css` holds the styles of every component. Most apps use a few of them: the plugin keeps the rules of what your code uses and removes the rest, in the CSS of your production build.

```ts
MazUi({
  purge: { safelist: ['text-title-1'] },
})

// or alone
import { MazUiPurgeCss } from '@maz-ui/vite-plugin'

MazUiPurgeCss()
```

Keep importing `maz-ui/style.css` as usual. The build prints a report:

```txt
[maz-ui:purge-css] 86.9 kB -> 32.8 kB of maz-ui CSS (-62%, 412 unused classes removed)
```

### How it works

1. At the build of maz-ui, `dist/css/purge-manifest.json` lists every class of `style.css`, the public utilities, and for each entry (`components/MazBtn`, `plugins/toast`, `directives/vTooltip`...) the classes it renders, with the entries it imports.
2. In your build, the plugin scans the source files of the project and finds the entries you use by their names: `MazBtn`, `<maz-btn>`, `LazyMazBtn`, `useToast`, `v-tooltip`, `ToastPlugin`... A namespace import of a barrel (`import * as components from 'maz-ui/components'`) keeps every component. It also finds the public utilities used (`text-title-1`, `padded-container`...).
3. When Vite transforms a CSS file, the plugin removes the rules of the unused entries and utilities, before the hash of the asset is computed, so the cache stays correct. It also removes the classes of `main.css` that no component renders.
4. At the end of the build, it checks the final JS and HTML: a purged class found there prints a warning, see [Bundle check](#bundle-check).

The plugin only touches the CSS of maz-ui. The CSS of your own app is never modified.

### Gains

Measured with `vite build`, the maz-ui preset, on the CSS assets of the app. Every Vue app imports `maz-ui/style.css`.

| App | Without purge | With purge | Saved |
| --- | --- | --- | --- |
| Landing (MazBtn, MazCard, MazBadge, MazAvatar, MazAccordion) | 103.2 kB (15.6 kB gzip) | 49.1 kB (8.8 kB gzip) | -52% |
| Sign in (MazInput, MazCheckbox, MazBtn, MazCard, MazLink, toast plugin) | 108.3 kB (16.0 kB gzip) | 64.7 kB (10.1 kB gzip) | -40% |
| Dashboard (MazTable, MazSelect, MazDatePicker, MazDialog, MazSidebar, MazTabs, MazDropdown, MazSwitch, toast, dialog, vTooltip...) | 156.1 kB (24.2 kB gzip) | 119.5 kB (19.4 kB gzip) | -23% |
| No Tailwind, with `maz-ui/utilities.css` (padded-container, text-display, rich-text, MazBtn, MazCard) | 118.8 kB (16.9 kB gzip) | 50.9 kB (8.4 kB gzip) | -57% |
| Every component | 212.0 kB (29.8 kB gzip) | 195.7 kB (28.0 kB gzip) | -8% |

The `style.css` of maz-ui alone goes from 86.9 kB to 32.8 kB (landing), 43.8 kB (sign in) and 50.3 kB (dashboard).

With Nuxt (2 pages using MazBtn, MazCard, MazBadge, LazyMazAccordion, MazInput, MazCheckbox, the toast plugin and vTooltip, `nuxi generate`), the CSS files go from 122.3 kB (21.0 kB gzip) to 78.6 kB (14.8 kB gzip) with the default `css.purge: true`, which is -36%.

::: warning The numbers depend on your app
They come from the demo apps above and this setup (preset, Tailwind or not, components used). The more components you use, the smaller the gain.
:::

### Purge options

All options are optional.

| Option | Type | Description |
| --- | --- | --- |
| `content` | `string[]` | Globs of the files that use maz-ui, relative to the root of the project. Added to the defaults |
| `entries` | `string[]` | Entries of maz-ui to keep even if the plugin does not find them in the code: a component (`MazBtn`), a directive (`vTooltip`), a plugin (`plugins/toast`) |
| `safelist` | `(string \| RegExp)[]` | Classes to keep: `maz:` classes of the components or public utilities (`text-title-1`, `/^rich-text/`) |
| `report` | `boolean` | Print the CSS saved by the purge (default: `true`) |

By default, the plugin scans every source file of the project (`vue`, `js`, `jsx`, `ts`, `tsx`, `html`, `md`, `mdx`, `astro`, `svelte`...), and ignores `node_modules`, `dist`, `.output`, `.nuxt`, `coverage` and `.d.ts` files.

#### Monorepo

When your app uses components written in another package of the monorepo, add its sources:

```ts
MazUiPurgeCss({
  content: ['../../packages/ui/src/**/*.vue'],
})
```

#### Dependency built on maz-ui

The default scan ignores `node_modules`, the globs of `content` do not: add the files of a dependency that renders maz-ui components (a design system of your company), or list the entries it uses with `entries`:

```ts
MazUiPurgeCss({
  content: ['node_modules/@acme/ui/dist/**/*.js'],
  // or
  entries: ['MazBtn', 'MazDialog', 'plugins/toast', 'vTooltip'],
})
```

#### Names built at runtime

A component resolved from a dynamic name, or a class that only appears in HTML loaded at runtime (a CMS, an API), is not found in the source. Keep it explicitly:

```ts
MazUiPurgeCss({
  entries: ['MazBtn', 'MazCard'],
  safelist: ['text-title-1', /^rich-text/],
})
```

### Bundle check

At the end of the build, the plugin looks for the purged classes in the final JS and HTML. If one is found, a component of maz-ui is used by a file the plugin does not scan (a dependency, a package of your monorepo), and the build warns:

```txt
[maz-ui:purge-css] 3 purged classes are in the bundle: maz:rounded-lg, maz:flex, maz:p-4
A component of maz-ui is probably used by a file the plugin does not scan (a dependency, a package of your monorepo).
Add its files to the `content` option, or the component to `entries`.
```

Fix it with `content` (the files that use the component) or `entries`, then rebuild.

### Projects without Tailwind

`maz-ui/utilities.css` contains the public utilities of maz-ui without prefix: the `text-*` and `type-*` type scale, `rich-text`, `padded-container`, `flex-center`, `glass`, `scrollbar-themed`, `disabled-*`, `cursor-interactive`, `cap-f` and `z-default-backdrop`. It weighs 19.7 kB (2.6 kB gzip) and the plugin purges it like `style.css`.

```ts
import 'maz-ui/style.css'
import 'maz-ui/utilities.css'
```

::: warning With Tailwind CSS
Keep `@import 'maz-ui/tailwindcss/utilities.css'` in your Tailwind entry and do not import `maz-ui/utilities.css`: you would get duplicates, and no variants (`hover:`, `tab-m:`...). See [Tailwind CSS](./../guide/tailwind.md).
:::

### Limitations

- Vite only for now (no webpack, Rollup alone or other bundlers).
- Build only: the dev server keeps the whole CSS.
- Entries are found by name in the files of the project: names built at runtime need `entries` or `safelist`.
- Only the CSS of maz-ui is purged, not the CSS of your app.

## Theme presets

`getPreset` of `@maz-ui/themes` (used by the theme plugin, `useTheme` and `definePreset`) imports each named preset on demand: every preset is a chunk of your build, even the ones your app never loads. They are only downloaded when loaded, but a service worker that precaches every JS file (PWA) downloads all of them. `presets` keeps only the presets you list:

```ts
MazUi({
  presets: ['maz-ui', 'ocean'],
})
```

`presets` lists the presets your app loads by name: `theme.preset`, `updateTheme('ocean')`, `definePreset({ base: 'ocean' })`. `[]` keeps none, for an app that only uses preset objects. Without `presets`, every preset stays in the build. The plugin alone is `MazUiThemePresets({ presets })`.

The plugin also applies to the dev server, so a missing preset fails in dev as in production: `updateTheme('nova')` rejects with an error naming the option, and a `maz-preset` cookie with a removed preset falls back to the configured one with a warning. See [Presets in the build](./themes.md#presets-in-the-build).
