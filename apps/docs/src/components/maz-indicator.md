---
title: MazIndicator
description: MazIndicator is a small dot or counter to show a status or a number of notifications. Use it alone, inline in a badge or a list row, or on the corner of an avatar, a button or an icon.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../../.vitepress/mixins/getting-started.md-->

## Basic usage

Without `content`, the indicator is a **dot**, to show a status (online, away, recording). Used alone, it is rendered inline and follows the font size of its context.

<ComponentDemo expanded>
  <div class="maz:flex maz:flex-wrap maz:items-center maz:gap-4">
    <span class="maz:inline-flex maz:items-center maz:gap-2"><MazIndicator color="success" /> Online</span>
    <span class="maz:inline-flex maz:items-center maz:gap-2"><MazIndicator color="warning" /> Away</span>
    <span class="maz:inline-flex maz:items-center maz:gap-2"><MazIndicator color="destructive" /> Busy</span>
  </div>

  <template #code>

```vue
<script lang="ts" setup>
import MazIndicator from 'maz-ui/components/MazIndicator'
</script>

<template>
  <span class="inline-flex items-center gap-2"><MazIndicator color="success" /> Online</span>
  <span class="inline-flex items-center gap-2"><MazIndicator color="warning" /> Away</span>
  <span class="inline-flex items-center gap-2"><MazIndicator color="destructive" /> Busy</span>
</template>
```

  </template>
</ComponentDemo>

## Counter

Set `content` to a **number** or a **short text** to get a counter (unread messages, notifications). Above `max` (`99` by default), a number shows `{max}+`.

<ComponentDemo>
  <div class="maz:flex maz:flex-wrap maz:items-center maz:gap-4">
    <MazIndicator :content="3" color="destructive" />
    <MazIndicator :content="42" color="destructive" />
    <MazIndicator :content="128" color="destructive" />
    <MazIndicator :content="128" :max="999" color="destructive" />
    <MazIndicator content="New" color="info" />
  </div>

  <template #code>

```vue
<template>
  <MazIndicator :content="3" color="destructive" />
  <MazIndicator :content="42" color="destructive" />

  <!-- Above `max` (99 by default): 99+ -->
  <MazIndicator :content="128" color="destructive" />

  <!-- 128 -->
  <MazIndicator :content="128" :max="999" color="destructive" />

  <!-- A short text -->
  <MazIndicator content="New" color="info" />
</template>
```

  </template>
</ComponentDemo>

### Show zero

A counter at `0` is hidden, like an empty notification count. Set `show-zero` to display it anyway. A text content (`'0'` for instance) is always displayed.

<ComponentDemo>
  <div class="maz:flex maz:flex-wrap maz:items-center maz:gap-4">
    <span class="maz:inline-flex maz:items-center maz:gap-2"><MazIndicator :content="0" /> hidden</span>
    <span class="maz:inline-flex maz:items-center maz:gap-2"><MazIndicator :content="0" show-zero /> shown</span>
  </div>

  <template #code>

```vue
<template>
  <!-- Renders nothing -->
  <MazIndicator :content="0" />

  <MazIndicator :content="0" show-zero />
</template>
```

  </template>
</ComponentDemo>

## Colors

Available colors: `primary` (default), `secondary`, `accent`, `info`, `success`, `warning`, `destructive` and `contrast`.

<ComponentDemo>
  <div class="maz:flex maz:flex-wrap maz:items-center maz:gap-4">
    <MazIndicator v-for="color in colors" :key="color" :color="color" />
    <MazIndicator v-for="color in colors" :key="`counter-${color}`" :color="color" :content="8" />
  </div>

  <template #code>

```vue
<template>
  <MazIndicator color="primary" />
  <MazIndicator color="success" />
  <MazIndicator color="destructive" :content="8" />
</template>
```

  </template>
</ComponentDemo>

## Sizes

By default, the indicator is sized in `em`: it follows the font size of its context (a text, a badge, an avatar). Set `size` to force one of the maz-ui sizes.

<ComponentDemo>
  <div class="maz:flex maz:flex-wrap maz:items-center maz:gap-4">
    <MazIndicator v-for="size in sizes" :key="size" :size="size" color="success" />
    <MazIndicator v-for="size in sizes" :key="`counter-${size}`" :size="size" :content="12" color="destructive" />
  </div>

  <template #code>

```vue
<template>
  <MazIndicator size="mini" color="success" />
  <MazIndicator size="xs" color="success" />
  <MazIndicator size="sm" color="success" />
  <MazIndicator size="md" color="success" />
  <MazIndicator size="lg" color="success" />
  <MazIndicator size="xl" color="success" />

  <MazIndicator size="xl" :content="12" color="destructive" />
</template>
```

  </template>
</ComponentDemo>

## On an element

Put content in the default slot (an avatar, a button, an icon): the indicator sits on one of its corners. The wrapper is an `inline-flex` element that takes the size of its content.

### Avatar

For an avatar, prefer the [`indicator` prop of MazAvatar](./maz-avatar.md#indicator), which sets the position and the overlap for you.

<ComponentDemo>
  <div class="maz:flex maz:flex-wrap maz:items-center maz:gap-6">
    <MazIndicator color="success" position="bottom-end" overlap="circular" label="Online">
      <MazAvatar caption="Camille Durand" color="auto" rounded-size="full" />
    </MazIndicator>
    <MazIndicator :content="3" color="destructive" overlap="circular" label="3 unread messages">
      <MazAvatar caption="Nina Rossi" color="auto" rounded-size="full" />
    </MazIndicator>
  </div>

  <template #code>

```vue
<script lang="ts" setup>
import MazAvatar from 'maz-ui/components/MazAvatar'
import MazIndicator from 'maz-ui/components/MazIndicator'
</script>

<template>
  <MazIndicator color="success" position="bottom-end" overlap="circular" label="Online">
    <MazAvatar caption="Camille Durand" color="auto" rounded-size="full" />
  </MazIndicator>

  <MazIndicator :content="3" color="destructive" overlap="circular" label="3 unread messages">
    <MazAvatar caption="Nina Rossi" color="auto" rounded-size="full" />
  </MazIndicator>
</template>
```

  </template>
</ComponentDemo>

### Button

`MazBtn` clips its content (`overflow-hidden`): a prop on the button would be cut. Wrap the button in a `MazIndicator` instead. It works with a normal button and with a `fab` one.

<ComponentDemo>
  <div class="maz:flex maz:flex-wrap maz:items-center maz:gap-6">
    <MazIndicator :content="3" color="destructive" label="3 new messages">
      <MazBtn>Inbox</MazBtn>
    </MazIndicator>
    <MazIndicator :content="12" color="destructive" overlap="circular" label="12 notifications">
      <MazBtn fab :icon="MazBell" aria-label="Notifications" />
    </MazIndicator>
    <MazIndicator color="success" overlap="circular" label="Connected">
      <MazBtn fab color="secondary" :icon="MazEnvelope" aria-label="Messages" />
    </MazIndicator>
  </div>

  <template #code>

```vue
<script lang="ts" setup>
import { MazBell } from '@maz-ui/icons/static/MazBell'
import MazBtn from 'maz-ui/components/MazBtn'
import MazIndicator from 'maz-ui/components/MazIndicator'
</script>

<template>
  <MazIndicator :content="3" color="destructive" label="3 new messages">
    <MazBtn>Inbox</MazBtn>
  </MazIndicator>

  <!-- A round fab button: `overlap="circular"` keeps the indicator on its edge -->
  <MazIndicator :content="12" color="destructive" overlap="circular" label="12 notifications">
    <MazBtn fab :icon="MazBell" aria-label="Notifications" />
  </MazIndicator>
</template>
```

  </template>
</ComponentDemo>

### Icon

<ComponentDemo>
  <div class="maz:flex maz:flex-wrap maz:items-center maz:gap-6">
    <MazIndicator :content="5" color="destructive" label="5 notifications">
      <MazBell class="maz:size-8" />
    </MazIndicator>
    <MazIndicator color="info">
      <MazEnvelope class="maz:size-8" />
    </MazIndicator>
  </div>

  <template #code>

```vue
<script lang="ts" setup>
import { MazBell } from '@maz-ui/icons/static/MazBell'
import { MazEnvelope } from '@maz-ui/icons/static/MazEnvelope'
import MazIndicator from 'maz-ui/components/MazIndicator'
</script>

<template>
  <MazIndicator :content="5" color="destructive" label="5 notifications">
    <MazBell class="size-8" />
  </MazIndicator>

  <MazIndicator color="info">
    <MazEnvelope class="size-8" />
  </MazIndicator>
</template>
```

  </template>
</ComponentDemo>

## Position and overlap

`position` sets the corner: `top-start`, `top-end` (default), `bottom-start` or `bottom-end`. Corners follow the reading direction (`start` and `end` flip in right-to-left languages).

`overlap` describes the shape of the content: on a `circular` one (a round avatar, a fab button), the indicator moves in to stay on the edge of the circle instead of floating in the empty corner.

<ComponentDemo>
  <div class="maz:flex maz:flex-col maz:gap-6">
    <div class="maz:flex maz:flex-wrap maz:items-center maz:gap-6">
      <MazIndicator v-for="position in positions" :key="position" :position="position" :content="1" color="destructive">
        <div class="maz:size-12 maz:rounded-md maz:bg-surface-600" />
      </MazIndicator>
    </div>
    <div class="maz:flex maz:flex-wrap maz:items-center maz:gap-6">
      <MazIndicator v-for="position in positions" :key="position" :position="position" overlap="circular" :content="1" color="destructive">
        <div class="maz:size-12 maz:rounded-full maz:bg-surface-600" />
      </MazIndicator>
    </div>
  </div>

  <template #code>

```vue
<template>
  <!-- rectangular (default) -->
  <MazIndicator position="top-start" :content="1" color="destructive">
    <div class="size-12 rounded-md bg-surface-600" />
  </MazIndicator>

  <!-- circular -->
  <MazIndicator position="bottom-end" overlap="circular" :content="1" color="destructive">
    <div class="size-12 rounded-full bg-surface-600" />
  </MazIndicator>
</template>
```

  </template>
</ComponentDemo>

## Attached

`attached` places the indicator on a corner of its **nearest positioned parent** (an element with `position: relative`), without wrapping anything. It is the way to add an indicator inside a component, like [MazAvatar](./maz-avatar.md) and [MazSidebarMenuButton](./maz-sidebar.md) do.

<ComponentDemo>
  <div class="maz:flex maz:flex-wrap maz:items-center maz:gap-6">
    <div class="maz:relative maz:size-12 maz:rounded-md maz:bg-surface-600">
      <MazIndicator attached :content="4" color="destructive" />
    </div>
    <div class="maz:relative maz:size-12 maz:rounded-full maz:bg-surface-600">
      <MazIndicator attached overlap="circular" position="bottom-end" color="success" />
    </div>
  </div>

  <template #code>

```vue
<template>
  <div class="relative size-12 rounded-md bg-surface-600">
    <MazIndicator attached :content="4" color="destructive" />
  </div>

  <div class="relative size-12 rounded-full bg-surface-600">
    <MazIndicator attached overlap="circular" position="bottom-end" color="success" />
  </div>
</template>
```

  </template>
</ComponentDemo>

## Ring

A thin ring detaches the indicator from the content it sits on. `bordered` is `true` by default with a default slot or `attached`, and `false` when the indicator is inline. Set `:bordered="false"` to remove it.

The ring takes the color of the surface behind (the container background, or the page surface). On another background, such as a colored header, override the `--m-indicator-ring` CSS variable so the ring blends in.

<ComponentDemo>
  <div class="maz:flex maz:flex-wrap maz:items-center maz:gap-6">
    <div class="maz:flex maz:items-center maz:gap-6 maz:rounded-md maz:bg-primary maz:p-6 maz:[--m-indicator-ring:var(--maz-primary)]">
      <MazIndicator color="success" position="bottom-end" overlap="circular">
        <MazAvatar caption="Louis Mazel" color="auto" rounded-size="full" />
      </MazIndicator>
      <MazIndicator :content="3" color="destructive" overlap="circular">
        <MazAvatar caption="Nina Rossi" color="auto" rounded-size="full" />
      </MazIndicator>
    </div>
    <MazIndicator :content="3" color="destructive" :bordered="false">
      <MazBtn>No ring</MazBtn>
    </MazIndicator>
  </div>

  <template #code>

```vue
<template>
  <header class="flex items-center gap-6 bg-primary p-6 [--m-indicator-ring:var(--maz-primary)]">
    <MazIndicator color="success" position="bottom-end" overlap="circular">
      <MazAvatar caption="Louis Mazel" color="auto" rounded-size="full" />
    </MazIndicator>
  </header>

  <MazIndicator :content="3" color="destructive" :bordered="false">
    <MazBtn>No ring</MazBtn>
  </MazIndicator>
</template>
```

  </template>
</ComponentDemo>

## Pulse

`pulse` adds an animated halo around the indicator, for a live status (recording, incoming call). The animation is disabled when the user asks to reduce motion.

<ComponentDemo>
  <div class="maz:flex maz:flex-wrap maz:items-center maz:gap-6">
    <span class="maz:inline-flex maz:items-center maz:gap-2"><MazIndicator color="destructive" pulse /> Recording</span>
    <MazIndicator :content="2" color="destructive" pulse label="2 incoming calls">
      <MazBtn>Calls</MazBtn>
    </MazIndicator>
  </div>

  <template #code>

```vue
<template>
  <span class="inline-flex items-center gap-2"><MazIndicator color="destructive" pulse /> Recording</span>

  <MazIndicator :content="2" color="destructive" pulse label="2 incoming calls">
    <MazBtn>Calls</MazBtn>
  </MazIndicator>
</template>
```

  </template>
</ComponentDemo>

## Invisible

`invisible` hides the indicator and keeps the wrapped content. Bind it to your state, for instance "no more unread messages".

<ComponentDemo>
  <div class="maz:flex maz:flex-wrap maz:items-center maz:gap-6">
    <MazIndicator :content="unread" color="destructive" :invisible="!unread" label="Unread messages">
      <MazBtn>Inbox</MazBtn>
    </MazIndicator>
    <MazBtn size="sm" color="secondary" @click="unread = unread ? 0 : 5">
      {{ unread ? 'Mark as read' : 'New messages' }}
    </MazBtn>
    <MazSwitch v-model="hidden">Invisible</MazSwitch>
    <MazIndicator color="success" :invisible="hidden">
      <MazBtn>Status</MazBtn>
    </MazIndicator>
  </div>

  <template #code>

```vue
<script lang="ts" setup>
import MazBtn from 'maz-ui/components/MazBtn'
import MazIndicator from 'maz-ui/components/MazIndicator'
import MazSwitch from 'maz-ui/components/MazSwitch'
import { ref } from 'vue'

const hidden = ref(false)
</script>

<template>
  <MazSwitch v-model="hidden">Invisible</MazSwitch>

  <MazIndicator color="success" :invisible="hidden">
    <MazBtn>Status</MazBtn>
  </MazIndicator>
</template>
```

  </template>
</ComponentDemo>

## Custom content

The `content` slot replaces the text of a counter. It receives `{ text }`, the text computed from `content` and `max` (`99+` for instance). It is not rendered for a dot.

<ComponentDemo>
  <MazIndicator :content="250" color="destructive" label="250 unread messages">
    <template #content="{ text }">
      {{ text }} new
    </template>
  </MazIndicator>

  <template #code>

```vue
<template>
  <MazIndicator :content="250" color="destructive" label="250 unread messages">
    <template #content="{ text }">
      {{ text }} new
    </template>
  </MazIndicator>
</template>
```

  </template>
</ComponentDemo>

## In a badge

A dot before the text of a pastel [MazBadge](./maz-badge.md) is a compact status.

<ComponentDemo>
  <div class="maz:flex maz:flex-wrap maz:items-center maz:gap-4">
    <MazBadge color="success" pastel class="maz:gap-2"><MazIndicator color="success" /> Online</MazBadge>
    <MazBadge color="warning" pastel class="maz:gap-2"><MazIndicator color="warning" /> Away</MazBadge>
    <MazBadge color="destructive" pastel class="maz:gap-2"><MazIndicator color="destructive" pulse /> Live</MazBadge>
  </div>

  <template #code>

```vue
<template>
  <MazBadge color="success" pastel class="gap-2">
    <MazIndicator color="success" /> Online
  </MazBadge>

  <MazBadge color="destructive" pastel class="gap-2">
    <MazIndicator color="destructive" pulse /> Live
  </MazBadge>
</template>
```

  </template>
</ComponentDemo>

## In a list

Inline, the indicator fits the `end` slot of a [MazListItem](./maz-list.md) (a status or a count). For a member avatar, use the `indicator` prop of [MazAvatar](./maz-avatar.md#indicator).

<ComponentDemo>
  <MazList title="Channels">
    <MazListItem v-for="channel in channels" :key="channel.name" :title="channel.name" clickable>
      <template #end>
        <MazIndicator v-if="channel.unread" :content="channel.unread" color="destructive" :label="`${channel.unread} unread messages`" />
        <MazIndicator v-else-if="channel.live" color="success" pulse label="Live" />
      </template>
    </MazListItem>
  </MazList>

  <template #code>

```vue
<script lang="ts" setup>
import MazIndicator from 'maz-ui/components/MazIndicator'
import MazList from 'maz-ui/components/MazList'
import MazListItem from 'maz-ui/components/MazListItem'

const channels = [
  { name: 'General', unread: 12, live: false },
  { name: 'Design', unread: 0, live: true },
  { name: 'Random', unread: 0, live: false },
]
</script>

<template>
  <MazList title="Channels">
    <MazListItem v-for="channel in channels" :key="channel.name" :title="channel.name" clickable>
      <template #end>
        <MazIndicator
          v-if="channel.unread"
          :content="channel.unread"
          color="destructive"
          :label="`${channel.unread} unread messages`"
        />
        <MazIndicator v-else-if="channel.live" color="success" pulse label="Live" />
      </template>
    </MazListItem>
  </MazList>
</template>
```

  </template>
</ComponentDemo>

## Accessibility

- Without `label`, the indicator is **decorative**: it is hidden from assistive technologies (`aria-hidden`). A status shown only by a colored dot is invisible to screen readers and ambiguous for color-blind users: set `label` ("Online", "3 unread messages") whenever the indicator carries information. With a `label`, it is exposed as an image (`role="img"`) named by `aria-label`.
- Give the label in the language of the page, and update it with the state (`:label="online ? 'Online' : 'Offline'"`).
- Do not rely on color alone for a status that matters: pair the dot with a text when you can (see "In a badge").
- The wrapped content keeps its own semantics. Name a button with an indicator on it (`aria-label`, or the `label` of the indicator for the count) and do not repeat the information twice.
- The indicator ignores pointer events (`pointer-events: none`) in a wrapper or when `attached`: the wrapped element stays clickable.
- `pulse` is turned off with `prefers-reduced-motion`.

<script lang="ts" setup>
import { MazBell } from '@maz-ui/icons/static/MazBell'
import { MazEnvelope } from '@maz-ui/icons/static/MazEnvelope'
import { ref } from 'vue'

const colors = ['primary', 'secondary', 'accent', 'info', 'success', 'warning', 'destructive', 'contrast']
const sizes = ['mini', 'xs', 'sm', 'md', 'lg', 'xl']
const positions = ['top-start', 'top-end', 'bottom-start', 'bottom-end']

const unread = ref(5)
const hidden = ref(false)

const channels = [
  { name: 'General', unread: 12, live: false },
  { name: 'Design', unread: 0, live: true },
  { name: 'Random', unread: 0, live: false },
]
</script>

<!--@include: ./../../.vitepress/generated-docs/maz-indicator.doc.md-->
