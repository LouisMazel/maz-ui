---
title: '@maz-ui/utils'
description: Lightweight, tree-shakeable utility functions and TypeScript helpers for Vue, Nuxt and any JavaScript/TypeScript project.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<NpmBadge package="@maz-ui/utils" />

`@maz-ui/utils` ships the runtime helpers and TypeScript type utilities that power maz-ui internally, packaged as a standalone, framework-agnostic library. No Vue dependency, no global side effects — just import what you need.

## Installation

::: code-group

```bash [pnpm]
pnpm add @maz-ui/utils
```

```bash [npm]
npm install @maz-ui/utils
```

```bash [yarn]
yarn add @maz-ui/utils
```

:::

## Basic usage

```ts
import { debounce, formatCurrency, sleep } from '@maz-ui/utils'

const debounced = debounce(() => console.log('typed'), 300)

const price = formatCurrency(1999.9, 'fr-FR', { currency: 'EUR' })

await sleep(500)
```

## What's inside

<UtilsCatalogue />

## Tree-shaking

The package is published with `"sideEffects": false`. Named imports — `import { sleep } from '@maz-ui/utils'` — are statically analysed by Vite, Rollup, esbuild and webpack: any helper you don't reference is dropped from your bundle.

For granular bundling you can also import a single helper through its dedicated subpath:

```ts
import { sleep } from '@maz-ui/utils/helpers/sleep'
```

## TypeScript helpers

Beyond runtime utilities, `@maz-ui/utils` also exports a set of generic type helpers (`DeepPartial`, `DeepKeyOf`, `FlattenObjectKeys`, …) under `@maz-ui/utils/ts-helpers`. See the **TypeScript Helpers** section in the sidebar.
