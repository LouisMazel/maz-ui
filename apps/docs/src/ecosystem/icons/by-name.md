---
title: Icons by name, without maz-ui
description: Use your own SVG files by name in any Vue or Nuxt app or library, optimized with svgo and split by page, with MazUiIcons() and MazIconPrimitive of @maz-ui/icons, without maz-ui
---

# {{ $frontmatter.title }}

Your SVG files become names: `src/icons/logo.svg` is `<MazIconPrimitive icon="logo" />`. It works in any Vue 3 app or library, without maz-ui. The 860+ icons of `@maz-ui/icons` are a bonus.

<NpmBadge package="@maz-ui/icons" />

- **Split by page**: an icon is in the chunk of the file that uses it, not in a global bundle.
- **Optimized**: your SVG go through svgo at build time.
- **Found in your props**: the plugin reads the compiled code, so `<AppBtn start-icon="logo">` registers `logo` too.
- **Rendered on the server**: the `<svg>` is inline, in the HTML. No runtime other than Vue, no request.
- **Typed**: the names autocomplete, and `strict` makes a typo a type error.
- **Libraries**: a published library ships its own icons (see [Libraries](#libraries)).

::: tip With maz-ui
`MazUi()` of [`@maz-ui/vite-plugin`](../vite-plugin.md#icons-by-name) and [`@maz-ui/nuxt`](../nuxt.md#icons) already include this plugin, and `MazIcon` and `MazSvg` render the names. This page is for apps and libraries without maz-ui, and for the wrapper of your own icon component.
:::

## Setup

```bash
npm install @maz-ui/icons @maz-ui/vite-svg-loader
```

`@maz-ui/vite-svg-loader` runs svgo on your SVG. Without it, they are used as they are, with a warning.

```ts
// vite.config.ts
import { MazUiIcons } from '@maz-ui/icons/vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [vue(), MazUiIcons()],
})
```

With Nuxt, add it to `vite.plugins` of `nuxt.config.ts`.

Put your SVG files in `src/icons`, then use their names:

```vue
<script setup lang="ts">
import { MazIconPrimitive } from '@maz-ui/icons/vue'
</script>

<template>
  <!-- src/icons/logo.svg -->
  <MazIconPrimitive icon="logo" class="size-8" />
  <!-- src/icons/brand/mark.svg -->
  <MazIconPrimitive icon="brand-mark" />
  <!-- an icon of @maz-ui/icons -->
  <MazIconPrimitive icon="x-mark" class="text-2xl text-primary" />
</template>
```

<ComponentDemo>
  <div class="maz:flex maz:flex-wrap maz:items-center maz:gap-4">
    <MazIconPrimitive icon="star" class="maz:text-2xl maz:text-warning" />
    <MazIconPrimitive icon="heart" class="maz:size-8 maz:text-destructive" />
    <MazIconPrimitive icon="flag-fr" width="32" />
  </div>

  <template #code>

```vue
<script setup lang="ts">
import { MazIconPrimitive } from '@maz-ui/icons/vue'
</script>

<template>
  <MazIconPrimitive icon="star" class="text-2xl text-warning" />
  <MazIconPrimitive icon="heart" class="size-8 text-destructive" />
  <MazIconPrimitive icon="flag-fr" width="32" />
</template>
```

  </template>
</ComponentDemo>

A file name becomes a name in kebab case, with its folders: `src/icons/brand/LogoDark.svg` is `brand-logo-dark`.

## MazIconPrimitive

It renders the `<svg>` of a name, and nothing else: no style, no wrapper. Your classes and attributes go on the `<svg>`. An icon is `1em` by default (the size of the text), `:width="false" :height="false"` keeps the size of the SVG file, and the icons of `@maz-ui/icons` take the color of the text (`currentColor`).

`@maz-ui/nuxt` auto-imports it. In Vue, `MazIconsResolver()` of `@maz-ui/icons/resolvers` resolves it for `unplugin-vue-components`.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `icon` | `string` | | The name of the icon (required) |
| `title` | `string` | | The name of the icon for screen readers, see [Accessibility](#accessibility) |
| `width` | `string \| number \| false` | `'1em'` | Width of the `<svg>`. Alone, the height follows the ratio of the SVG |
| `height` | `string \| number \| false` | `'1em'` | Height of the `<svg>`. Alone, the width follows the ratio of the SVG |
| `svgAttributes` | `Record<string, string \| number>` | | Attributes added to the `<svg>` |

- **Unknown name in dev**: a dashed square, with the name in its tooltip, and a warning in the console.
- **Unknown name in production**: nothing is rendered.
- `hasIcon(name)` of `@maz-ui/icons/vue` tells if a name is registered, to render your own fallback.

### Your own icon component

Wrap it to add your style, your fallback or other formats. Its prop can have any name:

```vue
<!-- AppIcon.vue -->
<script setup lang="ts" generic="_T">
import type { MazIconPrimitiveName } from '@maz-ui/icons/vue'
import { MazIconPrimitive } from '@maz-ui/icons/vue'

defineProps<{ name: MazIconPrimitiveName, title?: string }>()
</script>

<template>
  <MazIconPrimitive :icon="name" :title="title" class="app-icon" />
</template>
```

A prop whose name contains `icon` (`icon`, `startIcon`) works as it is. For another name, add it to `scan.keys`:

```ts
MazUiIcons({
  scan: { keys: ['name'] },
})
```

```vue
<AppIcon name="logo" />
```

### A component of your own

Your component can also read the registry, without `MazIconPrimitive`: for a component that already renders other formats (URLs, sprites) and adds the names. The plugin registers the names it finds in the props, whatever the component.

```vue
<script setup lang="ts">
import { getRegisteredIcon } from '@maz-ui/icons/registry'
import { computed } from 'vue'

const { icon } = defineProps<{ icon: string }>()

const svg = computed(() => getRegisteredIcon(icon))
</script>

<template>
  <span v-if="svg" class="app-icon" aria-hidden="true" v-html="svg" />
</template>
```

- `getRegisteredIcon(name)` returns the SVG string, or `undefined` for an unknown name.
- `prepareSvgString` (dimensions, title, attributes) and `parseSvg` (the attributes and the content of the `<svg>`, to render it as the root) of `@maz-ui/icons/vue` prepare it.
- The accessibility, the size and the unknown names are up to your component.
- The registry is not reactive: a name registered after the render is not displayed.

## Which names are found

The plugin reads the compiled code of your files. It finds the strings of the keys, attributes and variables whose name contains `icon`, and of the ones of `scan.keys`:

```ts
h(MazIconPrimitive, { icon: 'home' }) // found
const items = [{ label: 'Home', icon: 'home' }] // found
const icon = computed(() => isDark.value ? 'moon' : 'sun') // found
const names = ['home', 'user'] // not found: no icon context
```

`scan.keys` takes exact names, in camelCase or kebab-case (`startSvg` also reads `start-svg`). A generic key like `name` also reads the values that are not icons: a known name among them is bundled for nothing (a route named `home` adds the icon `home` to its chunk).

A name built at runtime (from an API, `` `flag-${code}` ``) is not found. Put its folder in [lazy](#load-on-demand), add it to `safelist`, or register it yourself:

```ts
import { registerIcon } from '@maz-ui/icons/registry'

registerIcon('promo', '<svg viewBox="0 0 24 24">...</svg>')
```

A SVG registered at runtime does not go through svgo.

## Folders

`dir` takes one folder or several. A folder can be in `node_modules`, for the SVG of a package.

```ts
MazUiIcons({
  dir: [
    'src/icons',
    { path: 'node_modules/@acme/icons/svg', prefix: 'acme' },
    { path: 'src/illustrations', prefix: 'illu', svgo: false },
  ],
})
```

```vue
<MazIconPrimitive icon="acme:eye" />
```

- A folder given by its path takes the global `prefix` and `svgoConfig`. A folder given as an object keeps its own.
- A name of a folder replaces the icon of `@maz-ui/icons` with the same name, or the one of a previous folder, with a warning. Set a `prefix` to keep them apart.
- `defaultIcons: false` keeps only the icons of your folders.

### Sets of maz-ui

`@maz-ui/icons` has 4 sets, all enabled by default. Keep the ones you use: fewer names to autocomplete and to typecheck.

```ts
MazUiIcons({ defaultIcons: ['icons', 'logos'] })
```

| Set | Names | Example |
| --- | --- | --- |
| `icons` | 336 | `x-mark` |
| `flags` | 256 | `flag-fr` |
| `flags-square` | 256 | `flag-square-fr` |
| `logos` | 29 | `logo-vue` |

The bundle does not change: only the names you use are in it.

### svgo

Every SVG of the folders goes through svgo, with the [default config](../vite-svg-loader.md#default-svgo-config) of `@maz-ui/vite-svg-loader`. It also prefixes the ids, so two inline SVG with the same `id` do not break each other's `url(#id)`. The icons of `@maz-ui/icons` are already optimized.

When the default config breaks a folder (animations, ids used by your CSS), give it its own config or `svgo: false`.

## Load on demand

Write `~` before a name: its SVG is downloaded the first time it is displayed, not with the page.

```vue
<MazIcon v-if="showDetails" icon="~rocket-launch" />
<MazIconPrimitive icon="~app:hero" />
```

- **For a big SVG** (an illustration) or an icon rarely displayed. A small icon is faster in the page: 0.3 kB in gzip, less than a request.
- **Typed**: `~` works with every known name, a typo is still an error with `strict`.
- **A name built at runtime** (`` `~flag-${code}` ``) is not found: use a `lazy` folder.

### A lazy folder

A folder of names built at runtime (the amenities of a hotel, from an API) can be `lazy`: each SVG is a chunk, downloaded when the icon is displayed.

```ts
MazUiIcons({
  dir: [
    'src/icons',
    { path: 'src/icons/amenities', prefix: 'amenity', lazy: true },
  ],
})
```

```vue
<MazIconPrimitive v-for="code in hotel.amenities" :key="code" :icon="`amenity:${code}`" />
```

- **Nothing changes in the template.** `MazIcon` and `MazSvg` load these names too.
- **The bundle has a table of loaders**, one entry per name of the folder. It is in the chunk of the files that contain the prefix (`amenity:`), not in the entry. A `lazy` folder without a prefix: in the files with an icon prop.
- **A name written in the code** (`icon="amenity:wifi"`) is bundled as usual, without a request.
- **While it loads** (also with `~`), an empty `<svg>` of its size keeps its place: the text does not move.
- **On the server**, the SVG is loaded before the render: it is in the HTML. The hydration waits for it, without a mismatch.
- **A load that fails** renders nothing, with a warning in the console.

What it costs, measured on a folder of 222 SVG (Vite 8, minified):

| What | Where | Size (gzip) |
| --- | --- | --- |
| The table | The chunk of the files that contain the prefix | 86 bytes per name (17 bytes): 19 kB (3.8 kB) for 222 names |
| One SVG (median) | Its own chunk, one request when it is displayed | 0.44 kB (0.27 kB) |

A name costs its name twice (the key and the file of its chunk), plus about 40 bytes.

Which one to choose:

| | Names known at build time | A big SVG, or rarely displayed | Names built at runtime, a few | Names built at runtime, many |
| --- | --- | --- | --- | --- |
| Use | Nothing: they are found | `~name` | `safelist` | `lazy` |
| Bundle | The chunk of the page | Its loader in the chunk of the page | The entry chunk | A table in the chunk of the page |
| Request | None | One when it is displayed | None | One per icon displayed |

`registerIconLoader(name, () => import('...'))` of `@maz-ui/icons/registry` does the same for a SVG the plugin does not know.

## Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `dir` | `IconDir \| IconDir[]` | `'src/icons'` | Folders of SVG: a path, or `{ path, prefix?, svgo?, lazy? }` |
| `prefix` | `string` | | Prefix of the names of the folders given by their path: `app` gives `app:logo` |
| `svgoConfig` | `Config \| (defaults) => Config` | | svgo config of the folders given by their path (an object replaces the default config) |
| `defaultIcons` | `boolean \| IconSet[]` | `true` | The icons of `@maz-ui/icons` by name: every [set](#sets-of-maz-ui), some of them, or none |
| `safelist` | `string[]` | `[]` | Names the plugin can not find (built at runtime) |
| `dts` | `string \| boolean` | `'src/maz-icons.d.ts'` | File of the types of the names, `false` to not write it |
| `strict` | `boolean` | `false` | Only the known names, URLs and raw SVG are accepted: a typo is a type error, see [Catch typos](#catch-typos) |
| `lib` | `boolean` | `true` with `build.lib` | Build of a library, see [Libraries](#libraries) |
| `scan.keys` | `string[]` | `[]` | Props and keys whose values are names, besides the ones whose name contains `icon`: `['name']` for `<AppIcon name="logo" />` |

## Types

The plugin writes `src/maz-icons.d.ts`, with every name. Keep it in the `include` of your `tsconfig.json`. It only changes when you add a SVG or upgrade `@maz-ui/icons`.

### Before the typecheck

Vite writes the types when it starts. To write them without Vite, before `vue-tsc`:

```json
{
  "scripts": {
    "typecheck": "maz-ui-icons types && vue-tsc --build"
  }
}
```

`maz-ui-icons` comes with `maz-ui` and `@maz-ui/icons`: in a terminal, `npx maz-ui-icons types` (or `pnpm maz-ui-icons types`). It reads your Vite config (`--config <file>` for another one). With Nuxt, nothing to run: `nuxi typecheck` writes them.

### Catch typos

By default an icon prop accepts any string, for the names registered at runtime. With `strict`, it only accepts the known names, the URLs and the raw SVG: a typo is a type error.

```ts
MazUiIcons({ strict: true }) // or MazUi({ icons: { strict: true } }), or mazUi.icons.strict with Nuxt
```

- **The error comes from `vue-tsc`**, not from `vite build`, which does not typecheck: run `vue-tsc` in your build or your CI.
- **A name in your data** is a `string` unless you type it:

```ts
import type { IconName } from '@maz-ui/icons'

const items = [
  { label: 'Home', icon: 'home' },
] satisfies { label: string, icon: IconName }[]
```

- **The imports of `@maz-ui/icons` are accepted**: `@maz-ui/icons/raw/*`, `@maz-ui/icons/svg/*.svg?raw` and `?url`, the components.
- **Your own SVG imports**: `?raw` and `?url` are a `string` for TypeScript. Use [`?svg` and `?uri`](../vite-svg-loader.md#usage) of `@maz-ui/vite-svg-loader` instead, typed for `strict`.

Type the icon props of your components with `IconString` of `@maz-ui/icons`: the known names with autocompletion, the URLs and the raw SVG, and any string unless `strict` (names registered at runtime). A prop passed to `MazIconPrimitive` only takes names: `MazIconPrimitiveName` of `@maz-ui/icons/vue`. `IconName` is the union of the known names only.

```ts
import type { IconString } from '@maz-ui/icons'

defineProps<{ startIcon?: IconString }>()
```

::: details TS2590: Expression produces a union type that is too complex to represent
A `<script setup>` component with an optional prop typed with the names fails with `TS2590` when it destructures its props, uses `withDefaults`, or is assigned to the `Component` type (`const c: Component = AppIcon`).

- **The fix**: type the prop with a generic.

```vue
<script setup lang="ts" generic="T extends IconString">
import type { IconString } from '@maz-ui/icons'

const { icon = 'home' } = defineProps<{ icon?: T }>()
</script>
```

- **Below about 150 names** (`defaultIcons: false` and a few SVG), it does not happen. The `icons` set alone has 336.
- **The cause** is the `LooseRequired` type of Vue: see [vuejs/core#10514](https://github.com/vuejs/core/issues/10514).
:::

## Bundle size

Measured with Vite 8 and minified, on an app with two pages.

| What | Where | Size (gzip) |
| --- | --- | --- |
| `MazIconPrimitive`, the registry and the runtime | A shared chunk, loaded with the first icon | 2.1 kB (1.1 kB) |
| One interface icon of `@maz-ui/icons` (median) | The chunk of the file that uses it | 0.55 kB (0.34 kB) |
| One flag (median) | The chunk of the file that uses it | 0.6 kB (0.35 kB) |
| One SVG of your folders | The chunk of the file that uses it | Its size after svgo |
| A name of `safelist` | The entry chunk, on every page | Its size |

- An icon used by a single page is not in the entry chunk. An icon used by several chunks is in a chunk they share.
- `safelist` costs on every page: keep it for the names you can not write in the code.
- Nothing is fetched at runtime, except the icons of a [lazy](#load-on-demand) folder.

Check your bundle with [rollup-plugin-visualizer](https://github.com/btd/rollup-plugin-visualizer), or search the name of an icon in `dist/assets`.

## Libraries

A library built with the plugin ships its icons: its `dist` has the runtime and the SVG of its folders, and does not need the plugin in the app.

With `build.lib`, or `lib: true` for a library built without it, an icon of `@maz-ui/icons` stays an import (`@maz-ui/icons/raw/MazXMark`) when `@maz-ui/icons` is external. The app and the library share it, it is not copied. Declare `@maz-ui/icons` in the `dependencies` of the library.

The plugin of the app does not scan `node_modules`: the icons of a built library are not registered twice.

## Accessibility

An icon is either decorative (hidden) or an image with a name, never in between.

- **Decorative by default**: `aria-hidden="true"`. This is the right choice next to a text, or in a button or a link that has its own name.
- **With a name**: `title` gives `role="img"`, the `aria-label` and a `<title>` (the tooltip). An `aria-label` or an `aria-labelledby` you pass wins over `title`.
- **The parent decides**: an `aria-hidden` you pass wins, and `null` removes an attribute (for a wrapper that is the accessible element).

```vue
<template>
  <!-- A button with only an icon: the name on the button, the icon is decorative -->
  <button type="button" aria-label="Close">
    <MazIconPrimitive icon="x-mark" />
  </button>

  <!-- An icon that means something on its own -->
  <MazIconPrimitive icon="check-circle" title="Paid" class="text-success" />
</template>
```

In forced colors mode (high contrast), the icons in `currentColor` follow the color of the text. A SVG with hard-coded colors does not: use `currentColor` in your interface icons.

## Compared to @nuxt/icon

[`@nuxt/icon`](https://github.com/nuxt/icon) (Iconify) stays the right choice for a catalog of 200,000+ icons without installing anything, names unknown at build time fetched at runtime, or the CSS mode.

`MazUiIcons()` is made for the projects that own their SVG (a design system, brands, business pictograms) and care about the weight:

- Each icon is in the chunk of the page that uses it. `@nuxt/icon` puts the scanned icons, and by default the whole custom collections, in a single client bundle.
- The scan finds the names in every prop whose name contains `icon`, not only in an icon component.
- A built library ships its icons, and shares the ones of `@maz-ui/icons` with the app.
- svgo runs on your SVG, with a config per folder.
- The icons are inline and synchronous on the server, with no runtime other than Vue.

<script setup>
import { MazIconPrimitive } from '@maz-ui/icons/vue'
</script>
