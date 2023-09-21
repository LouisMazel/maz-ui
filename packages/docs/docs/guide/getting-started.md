---
title: Getting Started
description: Documentation to help you install the maz-ui library
---

# {{ $frontmatter.title }}

## Prerequisites

- [Node.js v12+](https://nodejs.org/)
- [Vue 3](https://v3.vuejs.org/) or [Nuxt 3](https://v3.nuxtjs.org/)

## Installation

<NpmBadge package="maz-ui" dist-tag="latest" />

```bash
npm install maz-ui
# or pnpm add maz-ui
# or yarn add maz-ui
```

## Vue JS <NpmBadge package="vue" />

In the `main.js` or `main.ts`, import main maz-ui CSS file before your own CSS

```ts
import 'maz-ui/css/main.css'
import '@/css/path_to_your_main_file.css'
```

## Nuxt JS <NpmBadge package="nuxt" />

A Nuxt Module is available to install the library. Take advantage of the **automatic import** of CSS files, components, composables and plugins.

**Follow the [Nuxt Module Documentation](./nuxt.md) and see options**

```ts
export default defineNuxtConfig({
  modules: ['maz-ui/nuxt'],
})
```

---

## Recommendations

To optimize your bundle size, it's recommended to use the partial import

### Global component installation (recommended)

> Example with some components

```typescript
import { createApp } from 'vue'
...
import MazBtn from 'maz-ui/components/MazBtn'
import MazInput from 'maz-ui/components/MazInput'
import MazPhoneNumberInput from 'maz-ui/components/MazPhoneNumberInput'
...

const app = createApp(App)

...
app.component('MazBtn', MazBtn)
app.component('MazInput', MazInput)
app.component('MazPhoneNumberInput', MazPhoneNumberInput)
...
```

### Component import

> Import the module chosen directly in your component

```html
<template>
  <MazBtn>Button</MazBtn>
</template>

<script lang="ts" setup>
  import MazBtn from 'maz-ui/components/MazBtn'
</script>
```

### Not recommended

<br />

#### Fully library installation

```typescript
import { createApp } from 'vue'
import * as components from 'maz-ui/components'
import 'maz-ui/css/main.css'

const app = createApp(App)

Object.entries(components).forEach(([componentName, component]) => {
  app.component(componentName, component)
})
```

## Typescript Users (not required)

Now the module resolution `Node` is deprecated, for a better Typescript compatibility, please use `Node16`, `NodeNext` or `Bundler`.

::: info
The module resolution options `Node` still work
:::

`tsconfig.json`

```json
{
  "compilerOptions": {
    "moduleResolution": "NodeNext"
  }
}
```
