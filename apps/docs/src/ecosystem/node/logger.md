---
title: logger / createLogger
description: Opinionated [consola](https://github.com/unjs/consola)-backed logger with semantic levels, status helpers (`success`, `ready`, `fail`), and formatting helpers (`box`, `divider`, `brand`).
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

The default `logger` is a singleton ready to use; `createLogger` builds a fresh instance with its own level and reporters.

## Quick start

```ts
import { logger } from '@maz-ui/node'

logger.info('Build started')
logger.success('All checks passed')
logger.warn('Deprecated flag used')
logger.error('Build failed', errorObject)
```

## Default instance

```ts
import { logger } from '@maz-ui/node'
```

A pre-configured `Logger` with `level: 'default'` (numeric 3). Suitable for most scripts.

## Custom instances

```ts
import { createLogger } from '@maz-ui/node'

const dev = createLogger({ level: 4 }) // debug
const ci = createLogger({ level: 2 }) // normal
const silent = createLogger({ level: Number.NEGATIVE_INFINITY })
```

```ts
function createLogger(options?: LoggerOptions): Logger

type LoggerOptions = Partial<ConsolaOptions>
```

`LoggerOptions` is forwarded directly to [consola's `createConsola()`](https://github.com/unjs/consola#instance-options) — see consola docs for every accepted field (tag, reporters, formatOptions, …).

## API

```ts
interface Logger {
  // Core
  log(message, ...args): void
  info(message, ...args): void
  warn(message, ...args): void
  error(message, ...args): void
  debug(message, ...args): void
  trace(message, ...args): void
  verbose(message, ...args): void
  silent(message, ...args): void
  fatal(message, ...args): void

  // Status
  start(message, ...args): void
  ready(message, ...args): void
  success(message, ...args): void
  fail(message, ...args): void

  // Formatting
  box(message, ...args): void
  brand(message: string): void
  divider(character?: string): void
  eot(): void
  break(count?: number): void
  clear(): void

  // Reporters
  addReporter(reporter: ConsolaReporter): void
  removeReporter(reporter: ConsolaReporter): void

  // Level control
  setLevel(level: LogLevel): void
  getLevel(): number
}
```

### Log levels

`setLevel()` accepts a semantic name. Anything below the active level is suppressed.

| Level       | Numeric           | Description                  |
| ----------- | ----------------- | ---------------------------- |
| `'silent'`  | `-Infinity`       | No logs displayed            |
| `'error'`   | `0`               | Fatal and error only         |
| `'warning'` | `1`               | Warnings and above           |
| `'normal'`  | `2`               | Normal logs and above        |
| `'default'` | `3` (default)     | Informational logs           |
| `'debug'`   | `4`               | Debug logs and above         |
| `'trace'`   | `5`               | All logs including trace     |
| `'verbose'` | `Infinity`        | Maximum verbosity            |

```ts
logger.setLevel('debug')
logger.debug('Now visible')

logger.setLevel('silent')
logger.error('No longer printed')
```

### Formatting helpers

| Method       | Output                                                              |
| ------------ | ------------------------------------------------------------------- |
| `box(msg)`   | Renders the message inside a bordered box.                          |
| `brand(msg)` | Prints in bright blue — used by `printBanner`.                      |
| `divider(c)` | Prints a separator line that adapts to the terminal width.          |
| `eot()`      | Prints a blank line (end-of-transmission marker).                   |
| `break(n)`   | Prints `n` blank lines (default: 1).                                |

## Examples

Build script with mixed levels:

```ts
import { createLogger, execPromise } from '@maz-ui/node'

const log = createLogger({ level: 3 })

log.box('🚀 Build starting')
log.divider()

await execPromise('npm install', { logger: log, packageName: 'setup' })
log.ready('Dependencies installed')

await execPromise('npm run build', { logger: log, packageName: 'build' })
log.success('Build complete')
```

Switch verbosity from an env flag:

```ts
const log = createLogger({
  level: process.env.CI ? 2 : 4,
})
```
