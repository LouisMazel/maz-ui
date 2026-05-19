---
title: execPromise
description: Promise-based wrapper around `child_process.exec` with structured stdout/stderr/error logging, package-scoped prefixes, and per-call log silencing.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

## Usage

```ts
import { execPromise, logger } from '@maz-ui/node'

try {
  const { stdout } = await execPromise('npm --version')
  logger.log('npm version:', stdout.trim())
}
catch (error) {
  logger.error('Command failed', error)
}
```

## API

```ts
function execPromise(
  command: string,
  options?: ExecPromiseOptions,
): Promise<{ stdout: string, stderr: string }>

interface ExecPromiseOptions {
  logger?: CustomLogger
  packageName?: string
  noSuccess?: boolean
  noStdout?: boolean
  noStderr?: boolean
  noError?: boolean
  logLevel?: LogLevel
  cwd?: string
}
```

### Options

| Option        | Type          | Default     | Description                                                                       |
| ------------- | ------------- | ----------- | --------------------------------------------------------------------------------- |
| `logger`      | `CustomLogger` | built-in    | Custom logger (must expose `log`, `error`, `info`, `warn`, `debug` methods).      |
| `packageName` | `string`      | —           | Prepended to logs as `[name]: ` — useful when many commands share a logger.       |
| `noSuccess`   | `boolean`     | `false`     | Skip the `info` line printed when the command finishes successfully.              |
| `noStdout`    | `boolean`     | `false`     | Don't pipe stdout to the logger (still returned in the promise result).           |
| `noStderr`    | `boolean`     | `false`     | Don't pipe stderr to the logger (still returned in the promise result).           |
| `noError`     | `boolean`     | `false`     | Don't log errors before rejecting.                                                |
| `logLevel`    | `LogLevel`    | unchanged   | Temporarily sets the default logger's level for this call.                        |
| `cwd`         | `string`      | `process.cwd()` | Working directory for the command.                                                |

The returned promise **resolves** with `{ stdout, stderr }` on success and **rejects** with the exec error on failure.

## Examples

Run a build silently, only reporting success/failure:

```ts
await execPromise('npm run build', {
  packageName: 'build',
  noStdout: true,
  noStderr: true,
})
```

Use a custom logger for an isolated subsystem:

```ts
import { createLogger, execPromise } from '@maz-ui/node'

const ciLogger = createLogger({ level: 2 })

await execPromise('npm test', {
  logger: ciLogger,
  packageName: 'tests',
})
```

## Notes

- `execPromise` uses Node's `child_process.exec`, which buffers all output in memory. For commands that produce very large streams, prefer `child_process.spawn` directly.
- `stdout`/`stderr` are still returned in the promise result even when `noStdout`/`noStderr` are set — the flags only affect logging.
