---
description: Documentation to know how install the maz-ui library
---

# Getting Started

## Prerequisites

- [Node.js v12+](https://nodejs.org/)
- [Vue 3](https://v3.vuejs.org/) or [Nuxt 3](https://v3.nuxtjs.org/)

## Installation

This section will help you to install the library.

### Library installation from NPM

<br />

<NpmBadge package="maz-ui" dist-tag="latest" />

```bash
npm install maz-ui
```

### Import necessary CSS file

#### Vue JS <NpmBadge package="vue" />

In the `main.js` or `main.ts`, import main maz-ui css file before your own css

```ts
import 'maz-ui/css/main.css'
import '@/css/path_to_your_main_file.css'
```

#### Nuxt JS <NpmBadge package="nuxt" />

```ts
export default {
  css: [
    'maz-ui/css/main.css',
    '@/css/path_to_your_main_file.css',
  ],
  build: {
    transpile: ['maz-ui'], // ⚠️ important ⚠️
  },
}
```

#### Optional

You can add these css rules in your main css file to use maz-ui font family

```css
html {
  font-family: var(--maz-font-family);
  line-height: 1.5;
}
```

### Recommanded

To optimize your bundle size, it's recommanded to use the partial import

#### Global component installation (recommanded)

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

#### Component import

> Import the module chosen directly in your component

```html
<template>
  <MazBtn>Button</MazBtn>
</template>

<script lang="ts" setup>
  import MazBtn from 'maz-ui/components/MazBtn'
</script>
```

### Not recommanded

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
