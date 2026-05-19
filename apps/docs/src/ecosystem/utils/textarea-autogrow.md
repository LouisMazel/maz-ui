---
title: TextareaAutogrow
description: Automatically resize a `<textarea>` element to fit its content as the user types or the window resizes.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

The helper disables manual resize, sets `box-sizing: border-box`, and updates `height` to match `scrollHeight` on input and (debounced) on window resize.

## Usage

```ts
import { TextareaAutogrow } from '@maz-ui/utils'

const textarea = document.querySelector<HTMLTextAreaElement>('textarea#bio')!
const autogrow = new TextareaAutogrow(textarea)

// later
autogrow.disconnect()
```

## API

```ts
class TextareaAutogrow {
  constructor(element: HTMLTextAreaElement)
  disconnect(): void
}
```

| Method         | Description                                                       |
| -------------- | ----------------------------------------------------------------- |
| `disconnect()` | Detach the input and resize listeners. The textarea remains styled. |

## Notes

- Listeners are attached on first focus — until then, the textarea is fully styled but the height isn't yet computed.
- Resize updates are debounced by 200 ms.
- For a Vue-idiomatic API, see the [`v-fullsize-textarea`](/directives/v-fullsize-textarea) directive.
