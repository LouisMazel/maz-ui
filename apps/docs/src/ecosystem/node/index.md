---
title: '@maz-ui/node'
description: Lightweight Node.js utilities — promise-based shell execution, an opinionated consola-backed logger, and a banner printer for CLIs.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<NpmBadge package="@maz-ui/node" />

`@maz-ui/node` powers the CLIs and build scripts inside the maz-ui ecosystem. It's intentionally tiny: an `exec` wrapper that returns a real `Promise`, a colourful logger built on [consola](https://github.com/unjs/consola), and a banner helper using [figlet](https://github.com/patorjk/figlet.js).

## Installation

::: code-group

```bash [pnpm]
pnpm add @maz-ui/node
```

```bash [npm]
npm install @maz-ui/node
```

```bash [yarn]
yarn add @maz-ui/node
```

:::

## Basic usage

```ts
import { execPromise, logger, printBanner } from '@maz-ui/node'

printBanner({ name: 'my-cli', version: '1.0.0' })

logger.info('Running tests…')
await execPromise('npm test', { packageName: 'tests' })
logger.success('Done')
```

## What's inside

- [`execPromise`](./exec-promise) — Promise-based `child_process.exec` with structured logging.
- [`logger` / `createLogger`](./logger) — consola-backed logger with semantic log levels and helpers (`box`, `divider`, `brand`, …).
- [`printBanner`](./print-banner) — ASCII-art banner printer (figlet) with versioning, dividers and clearing.

## Requirements

- Node.js >= 18.0.0
- ESM only — published as `"type": "module"`.
