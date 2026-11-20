---
title: '@maz-ui/icons'
description: The @maz-ui/icons package provides 860+ SVG icons (interface icons, brand logos, country flags), usable by name in the maz-ui components, or as tree-shakable Vue components, lazy components, raw SVG strings and SVG files
---

# @maz-ui/icons

**860+ SVG icons** for Vue: the [Heroicons](https://heroicons.com/) set, brand logos and country flags. Find them in the [icon set](./icon-set.md).

<NpmBadge package="@maz-ui/icons" />

`maz-ui` depends on it: install it only to import icons in your own code (`npm install @maz-ui/icons`).

## By name

Every icon prop of maz-ui takes a name: `icon`, `start-icon`, `end-icon`...

<ComponentDemo>
  <div class="maz:flex maz:flex-wrap maz:items-center maz:gap-4">
    <MazIcon icon="star" class="maz:text-2xl maz:text-warning" />
    <MazIcon :icon="isOn ? 'bell-alert' : 'bell-slash'" class="maz:text-2xl" />
    <MazBtn start-icon="arrow-path" @click="isOn = !isOn">
      Toggle
    </MazBtn>
    <MazSvg icon="flag-fr" width="32" />
    <MazSvg icon="logo-vue" width="28" />
  </div>

  <template #code>

```vue
<script setup lang="ts">
const isOn = ref(true)
</script>

<template>
  <MazIcon icon="star" class="text-2xl text-warning" />
  <MazIcon :icon="isOn ? 'bell-alert' : 'bell-slash'" class="text-2xl" />
  <MazBtn start-icon="arrow-path" @click="isOn = !isOn">
    Toggle
  </MazBtn>
  <MazSvg icon="flag-fr" width="32" />
  <MazSvg icon="logo-vue" width="28" />
</template>
```

  </template>
</ComponentDemo>

The names come from [`MazUi()`](../vite-plugin.md#icons-by-name) of `@maz-ui/vite-plugin`. With [`@maz-ui/nuxt`](../nuxt.md#icons), nothing to install.

```ts
// vite.config.ts
import { MazUi } from '@maz-ui/vite-plugin'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [vue(), MazUi()],
})
```

- **Light**: only the icons of each page are bundled, and they are in the HTML of the server.
- **Typed**: the names autocomplete in the icon props, a typo is caught by [`review_code`](../../guide/ai-agents.md) (and by TypeScript with `strict`).
- **Your SVG**: the files of `src/icons` are names too (`src/icons/hero.svg` is `hero`), see [SVG of the project](../vite-plugin.md#svg-of-the-project).
- **Without maz-ui**: in any Vue app or library, with `MazUiIcons()` and `MazIconPrimitive`, see [Icons by name, without maz-ui](./by-name.md).

::: details Without the plugin
Register the names yourself (tests, other build tools), with the raw SVG strings:

```ts
import { registerIcons } from '@maz-ui/icons/registry'
import { MazStar } from '@maz-ui/icons/raw/MazStar'

registerIcons({ star: MazStar })
```

:::

## Imports

Each icon also has four imports. The [icon set](./icon-set.md) gives them for each icon.

| Import | Example | Use it for |
| --- | --- | --- |
| Raw SVG string | `@maz-ui/icons/raw/MazStar` | The icon props without the plugin (`:start-icon="MazStar"`): the lightest, no component |
| Component | `@maz-ui/icons/static/MazStar` | Directly in a template: `<MazStar class="size-5" />` |
| Lazy component | `@maz-ui/icons/lazy/MazStar` | Icons not visible at first render (`v-if`, menus, dialogs): a separate request |
| SVG file | `@maz-ui/icons/svg/star.svg` | `<img>` or CSS, for the interface icons. The flags and the logos keep their colors with the other imports: `<MazFlagFR class="h-5 w-auto" />` |

<ComponentDemo>
  <div class="maz:flex maz:flex-wrap maz:items-center maz:gap-4">
    <MazBtn :start-icon="MazStarRaw" color="warning" pastel>
      Favorite
    </MazBtn>
    <MazHeart class="maz:size-6 maz:text-destructive" />
    <MazBtn color="contrast" outlined @click="showSettings = !showSettings">
      Settings
    </MazBtn>
    <LazyMazCog6Tooth v-if="showSettings" class="maz:size-6 maz:animate-spin" />
    <MazFlagFR class="maz:h-5 maz:w-auto" />
  </div>

  <template #code>

```vue
<script setup lang="ts">
import { MazCog6Tooth } from '@maz-ui/icons/lazy/MazCog6Tooth'
import { MazStar } from '@maz-ui/icons/raw/MazStar'
import { MazFlagFR } from '@maz-ui/icons/static/MazFlagFR'
import { MazHeart } from '@maz-ui/icons/static/MazHeart'

const showSettings = ref(false)
</script>

<template>
  <MazBtn :start-icon="MazStar" color="warning" pastel>
    Favorite
  </MazBtn>
  <MazHeart class="size-6 text-destructive" />
  <MazBtn color="contrast" outlined @click="showSettings = !showSettings">
    Settings
  </MazBtn>
  <MazCog6Tooth v-if="showSettings" class="size-6 animate-spin" />
  <MazFlagFR class="h-5 w-auto" />
</template>
```

  </template>
</ComponentDemo>

The root of `@maz-ui/icons` exports every component, and the lazy ones with a `Lazy` prefix: `import { MazStar, LazyMazHome } from '@maz-ui/icons'`. `MazUi()` rewrites these imports to the module of each icon, without the plugin prefer the sub-paths, faster to build and to serve in dev.

To import any SVG as a component (`logo.svg?component`), use [@maz-ui/vite-svg-loader](../vite-svg-loader.md).

## Auto-import

With [unplugin-vue-components](https://github.com/unplugin/unplugin-vue-components), a component is imported when a template uses it: `MazStar` is the component, `LazyMazStar` the lazy one.

```ts
// vite.config.ts
import { MazIconsResolver } from '@maz-ui/icons/resolvers'
import Components from 'unplugin-vue-components/vite'

export default defineConfig({
  plugins: [
    Components({
      resolvers: [MazIconsResolver()],
    }),
  ],
})
```

With [`MazComponentsResolver`](../../guide/resolvers.md#mazcomponentsresolver), place `MazIconsResolver` before it.

## Styling

An icon is `1em` (the size of the text), takes the color of the text (`currentColor`) and is aligned with it.

<ComponentDemo>
  <div class="maz:flex maz:flex-wrap maz:items-center maz:gap-4">
    <p class="maz:text-lg">
      <MazIcon icon="check-circle" class="maz:text-success" /> Saved
    </p>
    <MazIcon icon="star" size="xl" class="maz:text-primary" />
    <MazIcon icon="heart" class="maz:text-3xl maz:text-destructive maz:transition-transform maz:hover:scale-125" />
    <MazIcon icon="arrow-path" class="maz:text-3xl maz:animate-spin" />
  </div>

  <template #code>

```vue
<template>
  <p class="text-lg">
    <MazIcon icon="check-circle" class="text-success" /> Saved
  </p>
  <MazIcon icon="star" size="xl" class="text-primary" />
  <MazIcon icon="heart" class="text-3xl text-destructive transition-transform hover:scale-125" />
  <MazIcon icon="arrow-path" class="text-3xl animate-spin" />
</template>
```

  </template>
</ComponentDemo>

## Troubleshooting

- **An icon by name renders a question mark**: the name is unknown (a warning in the console tells it), or built at runtime (`` `flag-${code}` ``): add it to the [`safelist`](../vite-plugin.md#options).
- **No autocompletion of the names**: check that `src/maz-icons.d.ts` is in the `include` of your `tsconfig.json` (with Nuxt, run `nuxi prepare`).
- **An auto-imported icon is not found**: `MazIconsResolver` goes before `MazComponentsResolver` in the `resolvers`.

<script setup>
import { ref } from 'vue'
import { MazCog6Tooth as LazyMazCog6Tooth } from '@maz-ui/icons/lazy/MazCog6Tooth'
import { MazStar as MazStarRaw } from '@maz-ui/icons/raw/MazStar'
import { MazFlagFR } from '@maz-ui/icons/static/MazFlagFR'
import { MazHeart } from '@maz-ui/icons/static/MazHeart'

const isOn = ref(true)
const showSettings = ref(false)
</script>
