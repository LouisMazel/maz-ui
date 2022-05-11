# maz-ui

[![license](https://img.shields.io/github/license/LouisMazel/maz-ui.svg?style=flat-square)](https://github.com/LouisMazel/maz-ui/blob/master/LICENSE)
[![vue 3](https://img.shields.io/badge/vue-3-42b983.svg?style=flat-square)](https://vuejs.org)
[![npm](https://img.shields.io/npm/v/maz-ui/next.svg?style=flat-square)](https://www.npmjs.com/package/maz-ui)
[![npm](https://img.shields.io/npm/dt/maz-ui.svg?style=flat-square)](https://www.npmjs.com/package/maz-ui)
[![maintainability](https://api.codeclimate.com/v1/badges/6b27047dcf150ccddfac/maintainability)](https://codeclimate.com/github/LouisMazel/maz-ui/maintainability)
[![test_coverage](https://api.codeclimate.com/v1/badges/6b27047dcf150ccddfac/test_coverage)](https://codeclimate.com/github/LouisMazel/maz-ui/test_coverage)

[![npm](https://nodei.co/npm/maz-ui.png?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.com/package/maz-ui)

> [Maz-ui](https://louismazel.github.io/maz-ui/) is a standalone components library for [Vue.JS](https://vuejs.org) & [Nuxt.JS](https://nuxtjs.org/) (v3.x)

## Documentation & Components

[Documentation & Components](https://louismazel.github.io/maz-ui-3/)

## Install

[Getting Started](https://louismazel.github.io/maz-ui-3/guide/getting-started)

```shell
npm install maz-ui@next

# Or yarn add maz-ui@next
```

### Import necessary CSS file

In the `main.js` or `main.ts`, import these files.

```ts
import "maz-ui/css/main.css";
```

### Recommanded

To optimize your bundle size, it's recommanded to use the [partial import](https://louismazel.github.io/maz-ui-3/guide/getting-started)

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
  import MazBtn from "maz-ui/components/MazBtn";
</script>
```

### Not recommanded

#### Fully library installation

```typescript
import { createApp } from "vue";
import components from "maz-ui/components";
import "maz-ui/css/main.css";

const app = createApp(App);

Object.entries(components).forEach(([componentName, component]) => {
  app.component(componentName, component);
});
```

## LICENSE

[MIT](LICENSE)
