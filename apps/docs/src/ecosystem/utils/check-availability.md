---
title: checkAvailability
description: Poll a getter until a value is available (or matches an expected value), then run a callback — with timeout and configurable retry interval.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

Useful for waiting on a third-party SDK to attach itself to `window`, on a Vue ref to be populated after mount, or on any asynchronously-available value.

## Usage

```ts
import { checkAvailability } from '@maz-ui/utils'

checkAvailability(
  () => window.Stripe,
  (Stripe) => {
    const stripe = Stripe('pk_...')
  },
)
```

## API

```ts
function checkAvailability<T>(
  getRef: () => T | null | undefined,
  callback: (value: NonNullable<T>) => void,
  options?: {
    maxAttempts?: number
    interval?: number
    expectedValue?: T
    errorMessage?: string
    onError?: (error: Error) => void
  },
): void
```

| Option          | Type       | Default | Description                                                            |
| --------------- | ---------- | ------- | ---------------------------------------------------------------------- |
| `maxAttempts`   | `number`   | `20`    | Number of polls before giving up                                       |
| `interval`      | `number`   | `100`   | Delay between polls, in milliseconds                                   |
| `expectedValue` | `T`        | —       | When set, callback fires only when `getRef()` strictly equals this value |
| `errorMessage`  | `string`   | —       | Custom error message when `maxAttempts` is exceeded                    |
| `onError`       | `Function` | —       | Called with the timeout `Error` instead of throwing                    |

With default options, the helper polls every 100 ms up to 20 times — a 2 second timeout in total.

## Examples

Wait for a global SDK with a custom timeout:

```ts
checkAvailability(
  () => window.gtag,
  (gtag) => {
    gtag('event', 'page_view')
  },
  {
    maxAttempts: 50,
    interval: 200,
    onError: (err) => {
      console.warn('gtag never loaded', err)
    },
  },
)
```

Wait for a specific value (e.g. SDK becomes ready):

```ts
checkAvailability(
  () => window.__SDK_STATE__,
  () => boot(),
  { expectedValue: 'ready' },
)
```
