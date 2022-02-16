# Getting Started

## Prerequisites

- [Node.js v12+](https://nodejs.org/)
- [Vue 3](https://v3.vuejs.org/)

## Installation

This section will help you to install the library.

### Library installation from NPM

<br />

<NpmBadge package="maz-ui" dist-tag="beta" />

<CodeGroup>
  <CodeGroupItem title="NPM" active>

```bash
npm i maz-ui@beta
```
  </CodeGroupItem>
  <CodeGroupItem title="YARN">

```bash
yarn add maz-ui@beta
```
  </CodeGroupItem>

</CodeGroup>

### Import necessary CSS file

In the `main.js` or `main.ts`, import these files.

```ts
import 'maz-ui/css/main.css'
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
import components from 'maz-ui/components'
import 'maz-ui/css/main.css'

const app = createApp(App)

Object.entries(components).forEach(([componentName, component]) => {
  app.component(componentName, component)
})
```
