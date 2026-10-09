---
title: ScriptLoader
description: Class to inject and cache a <script> tag in document head, with an awaitable load promise — ideal for third-party SDKs.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

`ScriptLoader` handles deduplication (won't inject the same script twice), error reporting, and optional one-time loading semantics.

## Usage

```ts
import { ScriptLoader } from '@maz-ui/utils'

const loader = new ScriptLoader({
  identifier: 'stripe-js',
  src: 'https://js.stripe.com/v3/',
})

await loader.load()
// window.Stripe is now available
```

## API

```ts
class ScriptLoader {
  constructor(options: ScriptLoaderOptions)
  load(): Promise<Event | undefined>
  removeTag(tag: Element | string): void
}

interface ScriptLoaderOptions {
  identifier: string
  src: string
  once?: boolean   // default: true
  async?: boolean  // default: true
  defer?: boolean  // default: true
}
```

| Option       | Type      | Default | Description                                                                  |
| ------------ | --------- | ------- | ---------------------------------------------------------------------------- |
| `identifier` | `string`  | —       | Unique key used to deduplicate the script across calls (set as `data-identifier`) |
| `src`        | `string`  | —       | Script URL                                                                   |
| `once`       | `boolean` | `true`  | When `true`, skip injection if a script with the same identifier already loaded |
| `async`      | `boolean` | `true`  | Sets the `async` attribute on the `<script>` tag                             |
| `defer`      | `boolean` | `true`  | Sets the `defer` attribute on the `<script>` tag                             |

### Methods

- **`load()`** — Inject the script (or resolve immediately if cached) and return a promise that resolves to the load `Event` once the script is ready.
- **`removeTag(tag)`** — Remove an injected `<script>` tag by element reference or identifier string.

## Errors

`ScriptLoader` throws synchronously in two situations:

- `src` or `identifier` is missing.
- Called in a non-browser environment (no `window` available).

## Examples

Reload a script on demand by disabling caching:

```ts
const loader = new ScriptLoader({
  identifier: 'my-widget',
  src: '/widget.js',
  once: false,
})

await loader.load() // first injection
await loader.load() // previous tag removed, new one injected
```
