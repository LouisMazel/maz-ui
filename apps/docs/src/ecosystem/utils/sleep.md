---
title: sleep
description: Pause execution for a given number of milliseconds. Returns a promise that resolves after the delay.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

## Usage

```ts
import { sleep } from '@maz-ui/utils'

await sleep(500)
console.log('Half a second later')
```

## API

```ts
function sleep(duration: number): Promise<void>
```

| Parameter  | Type     | Description           |
| ---------- | -------- | --------------------- |
| `duration` | `number` | Delay in milliseconds |

Returns a `Promise<void>` that resolves once the delay elapses.

## Examples

Chain delays in a sequence:

```ts
async function rampUp() {
  console.log('Starting')
  await sleep(1000)
  console.log('1s later')
  await sleep(2000)
  console.log('3s later')
}
```

Use as a guard between retries with exponential backoff:

```ts
async function withRetry(task: () => Promise<void>, attempts = 3) {
  for (let i = 0; i < attempts; i++) {
    try {
      return await task()
    }
    catch {
      await sleep(2 ** i * 100)
    }
  }
  throw new Error('Max retries exceeded')
}
```
