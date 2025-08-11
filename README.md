<div align="center">
  <img src="https://maz-ui.com/img/logo.svg" alt="Maz UI Logo" width="100">

  <h1>Maz UI</h1>
  <p>
    <strong>
      Lightweight and efficient library for Vue & Nuxt
    </strong>
  </p>
</div>

<p align="center">
  <a href="https://vuejs.org"><img src="https://img.shields.io/badge/vue-3-42b983.svg" alt="vue badge"></a>
  <a href="https://v3.nuxtjs.org"><img src="https://img.shields.io/badge/nuxt-3-42b983.svg" alt="nuxt badge"></a>
  <a href="https://www.npmjs.com/package/maz-ui"><img src="https://img.shields.io/npm/v/maz-ui/latest.svg" alt="npm"></a>
  <a href="https://www.npmjs.com/package/maz-ui"><img src="https://badgen.net/npm/types/maz-ui" alt="types"></a>
  <a href="https://npm-stat.com/charts.html?package=maz-ui"><img src="https://badgen.net/npm/dm/maz-ui" alt="Downloads"></a>
</p>

<p align="center">
  <a href="https://app.codecov.io/gh/LouisMazel/maz-ui/branch/master?flags=lib">
    <img src="https://codecov.io/gh/LouisMazel/maz-ui/branch/master/graph/badge.svg?flag=lib" alt="Coverage lib" />
  </a>

  <img src="https://github.com/LouisMazel/maz-ui/actions/workflows/lib-test-unit.yml/badge.svg" alt="github actions test unit">
</p>

<h3 align="center">
  <a href="https://maz-ui.com">Documentation</a>
  <span> · </span>
  <a href="https://maz-ui.com/guide/getting-started">Getting Started</a>
  <span> · </span>
  <a href="https://maz-ui.com/made-with-maz-ui">Showcase</a>
</h3>

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./resources/dashboard-dark.png">
    <img src="./resources/dashboard-light.png" alt="Maz UI Demo Dashboard" width="100%" style="border-radius: 1rem;">
  </picture>
  <br>
  <sub><i>Example of a dashboard built with Maz UI components</i></sub>
</p>

## ✨ Features

- 🎯 **Cherry-pick components** - Use only what you need
- 🌙 **Dark mode** - Built-in dark mode support
- 🎨 **Themeable** - Easy to customize with CSS variables
- 📱 **Responsive** - Mobile-first design approach
- 🔧 **TypeScript** - Full type support included
- ⚡️ **Lightweight** - Tree-shakeable, no bloat
- 🔍 **SSR** - Server-side rendering ready

## Documentation

Check the [Documentation](https://maz-ui.com) for more information.

## 🚀 Quick Start

```bash
npm install maz-ui
```

### Vue

```ts
import { mazUi } from '@maz-ui/themes/presets'
import { fr } from '@maz-ui/translations'
import { MazUi } from 'maz-ui/plugins/maz-ui'
// main.ts
import 'maz-ui/styles'

const app = createApp(App)

app.use(MazUi, {
  theme: {
    preset: mazUi,
  },
  translations: {
    messages: {
      fr,
    },
  },
})
```

#### 💡 Usage

Then, import and use only the components, composables, and more you need:

```vue
<script setup lang="ts">
import MazBtn from 'maz-ui/components/MazBtn'
</script>

<template>
  <MazBtn>Click me!</MazBtn>
</template>
```

Use provided resolvers to enjoy auto-imports and TypeScript support: [Resolvers documentation](https://maz-ui.com/guide/getting-started#recommendations)

### Nuxt

The Nuxt module automatically:

- Imports all components, plugins, composables and directives on-demand (auto-imports)
- Includes required styles
- Provides TypeScript support out of the box

[See options and more in the documentation](https://maz-ui.com/guide/nuxt)

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@maz-ui/nuxt'],
})
```

#### 💡 Usage

No need to import components, plugins, composables or directives, they are all auto-imported.

```vue
<script setup lang="ts">
const toast = useToast()
</script>

<template>
  <MazBtn @click="toast.success('Hello Maz UI!')">
    Click me!
  </MazBtn>
</template>
```

## 🧰 What's included?

### Modules

- [Components](https://maz-ui.com/components/maz-btn) - Beautiful, accessible UI components
- [Plugins](https://maz-ui.com/plugins/dialog) - Powerful plugins for common use cases
- [Composables](https://maz-ui.com/composables/use-form-validator) - Reusable composition functions
- [Directives](https://maz-ui.com/directives/fullscreen-img) - Useful Vue directives
- [Helpers](https://maz-ui.com/helpers/currency) - Useful utilities for common tasks

### Packages

- [Themes](https://maz-ui.com/guide/themes) - Easy to customize with CSS variables
- [Translations](https://maz-ui.com/guide/translations) - Internationalization
- [Icons](https://maz-ui.com/guide/icons) - Beautiful icons ready-to-use for Vue applications
- [Utils](https://maz-ui.com/helpers/capitalize) - Useful utilities for common tasks
- [Node](https://www.npmjs.com/package/@maz-ui/node) - Useful utilities for node
- [MCP](https://maz-ui.com/guide/mcp) - AI assistant for documentation

## 🤝 Contributing

We're always looking for contributors! Check out our [contribution guide](./CONTRIBUTING.md) to get started.

## 📄 License

[MIT](./LICENSE)

<div align="center">
  <sub>Built with ❤️ by <a href="https://github.com/LouisMazel">Louis Mazel</a></sub>
</div>
