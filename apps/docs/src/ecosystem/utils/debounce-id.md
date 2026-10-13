---
title: debounceId
description: Debounce an async function with isolated state per identifier — only the last call resolves, others are cancelled.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

`debounceId` is the right tool when:

- You need to debounce **async** work and `await` the result.
- You want **per-key isolation** — debounces for `'search'` shouldn't interfere with debounces for `'autosave'`.

## Usage

```ts
import { debounceId } from '@maz-ui/utils'

const searchUsers = debounceId(
  'user-search',
  async (query: string) => {
    const res = await fetch(`/api/users?q=${query}`)
    return res.json()
  },
  300,
)

const users = await searchUsers('alice')
```

## API

```ts
function debounceId<T, Args extends unknown[]>(
  identifier: string,
  func: (...args: Args) => T | Promise<T>,
  delay: number,
): (...args: Args) => Promise<T>
```

| Parameter    | Type            | Description                                                  |
| ------------ | --------------- | ------------------------------------------------------------ |
| `identifier` | `string`        | Unique key — calls with the same key share a debounce timer |
| `func`       | `Function`      | The async (or sync) function to debounce                     |
| `delay`      | `number`        | Quiet window before the call resolves, in ms                 |

Returns a function that always returns a `Promise<T>`. Earlier pending promises are cancelled — only the last invocation resolves.

## Examples

Autosave a form, keyed by document ID, so concurrent edits to different documents don't share state:

```ts
import { debounceId } from '@maz-ui/utils'

async function saveDocument(id: string, payload: unknown) {
  const save = debounceId(
    `doc-${id}`,
    (body: unknown) => fetch(`/docs/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
    500,
  )
  return save(payload)
}
```

## Related

- [`throttleId`](./throttle-id) — same shape, but throttles instead of debounces.
