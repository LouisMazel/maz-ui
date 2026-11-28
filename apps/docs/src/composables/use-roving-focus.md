---
title: useRovingFocus
description: Keyboard navigation of a group (tabs, segmented controls, menus, toolbars, pagination) - one item in the tab sequence, the arrows move the focus.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

## Usage

Give the container and a selector for the items. Bind `onKeydown` on the container and `getTabIndex` on each item.

<ComponentDemo expanded>
  <div class="maz:flex maz:flex-col maz:items-start maz:gap-3 maz:text-sm">
    <div
      ref="container"
      role="toolbar"
      aria-label="Text formatting"
      class="maz:flex maz:gap-2 maz:rounded-md maz:border maz:border-divider maz:bg-container maz:p-2"
      @keydown="onKeydown"
    >
      <MazBtn
        v-for="(label, index) in formats"
        :key="label"
        size="sm"
        color="contrast"
        :tabindex="getTabIndex(index)"
        @click="lastAction = label"
      >
        {{ label }}
      </MazBtn>
    </div>
    <div class="maz:text-muted">Tab into the toolbar, then use the arrows, Home and End.</div>
    <div>Current index: <MazBadge color="info" size="sm">{{ currentIndex }}</MazBadge> Last action: <MazBadge color="container" size="sm">{{ lastAction || 'none' }}</MazBadge></div>
  </div>

  <template #code>

```vue
<script lang="ts" setup>
import { useRovingFocus } from 'maz-ui/composables/useRovingFocus'
import { useTemplateRef } from 'vue'

const container = useTemplateRef('container')

const { onKeydown, getTabIndex, currentIndex } = useRovingFocus({
  container,
  selector: 'button',
})
</script>

<template>
  <div ref="container" role="toolbar" @keydown="onKeydown">
    <MazBtn
      v-for="(label, index) in ['Bold', 'Italic', 'Underline']"
      :key="label"
      :tabindex="getTabIndex(index)"
    >
      {{ label }}
    </MazBtn>
  </div>
</template>
```

  </template>
</ComponentDemo>

Only one item is reachable with `Tab`. The arrows, `Home` and `End` move the focus between the items.

## Select on focus

For tabs and radio-like groups, activate the item when it gets the focus.

```ts
const { onKeydown, getTabIndex, currentIndex } = useRovingFocus({
  container,
  selector: '[role="tab"]',
  activateOnFocus: true,
  onActivate: index => selectTab(index),
})
```

Share the current index with your component by passing your own ref in `currentIndex`.

## Options

- `container` and `selector`: the items are the elements of the container that match the selector. The container also gives the reading direction.
- `items`: a getter of the elements, instead of `container` and `selector`.
- `orientation`: `'horizontal'` (default), `'vertical'` or `'both'`.
- `loop`: go back to the first item after the last one. Default `true`.
- `homeEnd`: `Home` and `End` go to the first and the last item. Default `true`.
- `typeahead`: typing letters jumps to the item whose text starts with them (500ms buffer). Default `false`.
- `skipDisabled`: skip the items with `disabled` or `aria-disabled="true"`. Default `true`.
- `activateOnFocus`: call `onActivate` each time the focus moves. Default `false`.
- `onActivate`: called with the index and the element.
- `rtl`: force the direction. By default it is read from the container.
- `currentIndex`: a ref to share the current index.

## Returned values

- `onKeydown(event, index?)`: the handler of the `keydown` event. Without `index`, the item is found from the event target.
- `getTabIndex(index)`: `0` for the current item, `-1` for the others.
- `focusItem(index)`: focuses an item and makes it the current one.
- `currentIndex`: the index of the current item.

## Behavior

- In RTL, `ArrowLeft` goes to the next item for a horizontal group.
- A disabled item is never focused when `skipDisabled` is on. If the current item is disabled, the first enabled one is in the tab sequence.
- The event is prevented only when the key is handled.

::: tip
Use it with [useSlidingIndicator](./use-sliding-indicator.md) to slide a pill under the active item.
:::

## Types

```ts
interface UseRovingFocusOptions {
  container?: MaybeRefOrGetter<Element | ComponentPublicInstance | undefined | null>
  selector?: string
  items?: () => (HTMLElement | null | undefined)[]
  /** @default 'horizontal' */
  orientation?: 'horizontal' | 'vertical' | 'both'
  /** @default true */
  loop?: boolean
  rtl?: boolean
  /** @default true */
  homeEnd?: boolean
  /** @default false */
  typeahead?: boolean
  /** @default true */
  skipDisabled?: boolean
  /** @default false */
  activateOnFocus?: boolean
  onActivate?: (index: number, element: HTMLElement) => void
  currentIndex?: Ref<number>
}

function useRovingFocus(options?: UseRovingFocusOptions): {
  onKeydown: (event: KeyboardEvent, index?: number) => void
  getTabIndex: (index: number) => 0 | -1
  focusItem: (index: number) => void
  currentIndex: Ref<number>
}
```

<script lang="ts" setup>
import { useRovingFocus } from 'maz-ui/composables/useRovingFocus'
import { ref, useTemplateRef } from 'vue'

const container = useTemplateRef('container')
const lastAction = ref('')
const formats = ['Bold', 'Italic', 'Underline', 'Strike']

const { onKeydown, getTabIndex, currentIndex } = useRovingFocus({
  container,
  selector: 'button',
})
</script>
