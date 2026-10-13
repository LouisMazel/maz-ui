---
title: MazTicker
description: MazTicker is a scrolling ticker component that continuously animates content in a loop with configurable speed, direction, pause controls, and gradient overlays
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../../.vitepress/mixins/getting-started.md-->

## Basic usage

<ComponentDemo expanded>
  <MazTicker>
    <span>Vue 3</span>
    <span>Nuxt 3</span>
    <span>TypeScript</span>
    <span>TailwindCSS</span>
    <span>Maz UI</span>
  </MazTicker>

  <template #code>

```vue
<template>
  <MazTicker>
    <span>Vue 3</span>
    <span>Nuxt 3</span>
    <span>TypeScript</span>
    <span>TailwindCSS</span>
    <span>Maz UI</span>
  </MazTicker>
</template>

<script lang="ts" setup>
  import MazTicker from 'maz-ui/components/MazTicker'
</script>
```

  </template>
</ComponentDemo>

## Screenshots gallery

A vertical ticker with images, similar to a screenshot showcase. Uses `orientation="vertical"` with `pause-on-hover` for user-friendly browsing.

<ComponentDemo>
  <div class="maz:flex maz:gap-4 maz:overflow-hidden" style="height: 300px">
    <MazTicker orientation="vertical" :overlay="false" :duration="30" pause-on-hover>
      <img
        v-for="i in 4" :key="i" :src="`https://picsum.photos/seed/maz-ticker-${i}/400/225`"
        :alt="`Screenshot ${i}`" class="maz:rounded-lg maz:border maz:border-gray-200 maz:object-cover maz:dark:border-gray-700"
        style="width: 400px; height: 225px"
      />
    </MazTicker>
    <MazTicker orientation="vertical" :overlay="false" :duration="30" reverse pause-on-hover>
      <img
        v-for="i in 4" :key="i" :src="`https://picsum.photos/seed/maz-ticker-${i + 4}/400/225`"
        :alt="`Screenshot ${i + 4}`" class="maz:rounded-lg maz:border maz:border-gray-200 maz:object-cover maz:dark:border-gray-700"
        style="width: 400px; height: 225px"
      />
    </MazTicker>
    <MazTicker class="maz:hidden maz:md:flex" orientation="vertical" :overlay="false" :duration="30" pause-on-hover>
      <img
        v-for="i in 4" :key="i" :src="`https://picsum.photos/seed/maz-ticker-${i + 8}/400/225`"
        :alt="`Screenshot ${i + 8}`" class="maz:rounded-lg maz:border maz:border-gray-200 maz:object-cover maz:dark:border-gray-700"
        style="width: 400px; height: 225px"
      />
    </MazTicker>
  </div>

  <template #code>

```vue
<template>
  <div class="maz:flex maz:gap-4 maz:overflow-hidden" style="height: 300px">
    <MazTicker
      orientation="vertical"
      :overlay="false"
      :duration="30"
      pause-on-hover
    >
      <img
        v-for="i in 4"
        :key="i"
        :src="`https://picsum.photos/seed/maz-ticker-${i}/400/225`"
        :alt="`Screenshot ${i}`"
        class="maz:rounded-lg maz:border maz:border-gray-200 maz:object-cover maz:dark:border-gray-700"
        style="width: 400px; height: 225px"
      />
    </MazTicker>
    <MazTicker
      orientation="vertical"
      :overlay="false"
      :duration="30"
      reverse
      pause-on-hover
    >
      <img
        v-for="i in 4"
        :key="i"
        :src="`https://picsum.photos/seed/maz-ticker-${i + 4}/400/225`"
        :alt="`Screenshot ${i + 4}`"
        class="maz:rounded-lg maz:border maz:border-gray-200 maz:object-cover maz:dark:border-gray-700"
        style="width: 400px; height: 225px"
      />
    </MazTicker>
    <MazTicker
      class="maz:hidden maz:md:flex"
      orientation="vertical"
      :overlay="false"
      :duration="30"
      pause-on-hover
    >
      <img
        v-for="i in 4"
        :key="i"
        :src="`https://picsum.photos/seed/maz-ticker-${i + 8}/400/225`"
        :alt="`Screenshot ${i + 8}`"
        class="maz:rounded-lg maz:border maz:border-gray-200 maz:object-cover maz:dark:border-gray-700"
        style="width: 400px; height: 225px"
      />
    </MazTicker>
  </div>
</template>

<script lang="ts" setup>
  import MazTicker from 'maz-ui/components/MazTicker'
</script>
```

  </template>
</ComponentDemo>

## 3D Screenshots showcase

Create an eye-catching 3D perspective effect with tilted vertical tickers, inspired by the Nuxt UI Marquee screenshots demo.

<ComponentDemo>
  <div class="maz:overflow-hidden maz:rounded-lg maz:bg-gray-100 maz:dark:bg-gray-800" style="height: 400px; perspective: 1500px">
    <div class="maz:flex maz:gap-4" style="height: 900px; margin-top: -300px; margin-left: -150px; transform: rotateX(55deg) rotateZ(30deg); transform-origin: center center">
      <MazTicker reverse orientation="vertical" :overlay="false" :duration="40" style="width: 300px; flex-shrink: 0">
        <img
          v-for="i in 4"
          :key="i"
          :src="`https://picsum.photos/seed/maz-3d-${i}/460/258`"
          :alt="`Screenshot ${i}`"
          width="460"
          height="258"
          loading="lazy"
          class="maz:rounded-lg maz:border maz:border-gray-200 maz:bg-white maz:object-cover maz:dark:border-gray-700"
          style="width: 300px; height: 168px"
        />
      </MazTicker>
      <MazTicker orientation="vertical" :overlay="false" :duration="40" style="width: 300px; flex-shrink: 0">
        <img
          v-for="i in 4"
          :key="i"
          :src="`https://picsum.photos/seed/maz-3d-${i + 4}/460/258`"
          :alt="`Screenshot ${i + 4}`"
          width="460"
          height="258"
          loading="lazy"
          class="maz:rounded-lg maz:border maz:border-gray-200 maz:bg-white maz:object-cover maz:dark:border-gray-700"
          style="width: 300px; height: 168px"
        />
      </MazTicker>
      <MazTicker reverse orientation="vertical" :overlay="false" :duration="40" style="width: 300px; flex-shrink: 0">
        <img
          v-for="i in 4"
          :key="i"
          :src="`https://picsum.photos/seed/maz-3d-${i + 8}/460/258`"
          :alt="`Screenshot ${i + 8}`"
          width="460"
          height="258"
          loading="lazy"
          class="maz:rounded-lg maz:border maz:border-gray-200 maz:bg-white maz:object-cover maz:dark:border-gray-700"
          style="width: 300px; height: 168px"
        />
      </MazTicker>
    </div>
  </div>

  <template #code>

```vue
<template>
  <div
    class="maz:overflow-hidden maz:rounded-lg maz:bg-gray-100 maz:dark:bg-gray-800"
    style="height: 400px; perspective: 1500px"
  >
    <div
      class="maz:flex maz:gap-4"
      style="height: 900px; margin-top: -300px; margin-left: -150px; transform: rotateX(55deg) rotateZ(30deg); transform-origin: center center"
    >
      <MazTicker
        reverse
        orientation="vertical"
        :overlay="false"
        :duration="40"
        style="width: 300px; flex-shrink: 0"
      >
        <img
          v-for="i in 4"
          :key="i"
          :src="`https://picsum.photos/seed/maz-3d-${i}/460/258`"
          :alt="`Screenshot ${i}`"
          width="460"
          height="258"
          loading="lazy"
          class="maz:rounded-lg maz:border maz:border-gray-200 maz:bg-white maz:object-cover maz:dark:border-gray-700"
          style="width: 300px; height: 168px"
        />
      </MazTicker>
      <MazTicker
        orientation="vertical"
        :overlay="false"
        :duration="40"
        style="width: 300px; flex-shrink: 0"
      >
        <img
          v-for="i in 4"
          :key="i"
          :src="`https://picsum.photos/seed/maz-3d-${i + 4}/460/258`"
          :alt="`Screenshot ${i + 4}`"
          width="460"
          height="258"
          loading="lazy"
          class="maz:rounded-lg maz:border maz:border-gray-200 maz:bg-white maz:object-cover maz:dark:border-gray-700"
          style="width: 300px; height: 168px"
        />
      </MazTicker>
      <MazTicker
        reverse
        orientation="vertical"
        :overlay="false"
        :duration="40"
        style="width: 300px; flex-shrink: 0"
      >
        <img
          v-for="i in 4"
          :key="i"
          :src="`https://picsum.photos/seed/maz-3d-${i + 8}/460/258`"
          :alt="`Screenshot ${i + 8}`"
          width="460"
          height="258"
          loading="lazy"
          class="maz:rounded-lg maz:border maz:border-gray-200 maz:bg-white maz:object-cover maz:dark:border-gray-700"
          style="width: 300px; height: 168px"
        />
      </MazTicker>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import MazTicker from 'maz-ui/components/MazTicker'
</script>
```

  </template>
</ComponentDemo>

## Orientation

### Horizontal (default)

By default, the ticker will scroll horizontally.

<ComponentDemo>
  <MazTicker orientation="horizontal">
    <span>Item 1</span>
    <span>Item 2</span>
    <span>Item 3</span>
  </MazTicker>

  <template #code>

```vue
<template>
  <MazTicker orientation="horizontal">
    <span>Item 1</span>
    <span>Item 2</span>
    <span>Item 3</span>
  </MazTicker>
</template>
```

  </template>
</ComponentDemo>

### Vertical

Otherwise, the ticker will scroll vertically.

<ComponentDemo>
  <div style="height: 100px">
    <MazTicker orientation="vertical">
      <div class="maz:py-2">Item 1</div>
      <div class="maz:py-2">Item 2</div>
      <div class="maz:py-2">Item 3</div>
    </MazTicker>
  </div>

  <template #code>

```vue
<template>
  <div style="height: 100px">
    <MazTicker orientation="vertical">
      <div class="maz:py-2">Item 1</div>
      <div class="maz:py-2">Item 2</div>
      <div class="maz:py-2">Item 3</div>
    </MazTicker>
  </div>
</template>
```

  </template>
</ComponentDemo>

## Reverse direction

<ComponentDemo>
  <div class="maz:flex maz:flex-col maz:gap-4">
    <MazTicker>
      <span>Normal direction</span>
    </MazTicker>
    <MazTicker reverse>
      <span>Reverse direction</span>
    </MazTicker>
  </div>

  <template #code>

```vue
<template>
  <MazTicker>
    <span>Normal direction</span>
  </MazTicker>
  <MazTicker reverse>
    <span>Reverse direction</span>
  </MazTicker>
</template>
```

  </template>
</ComponentDemo>

## Speed control

Control the animation speed with the `duration` prop (in seconds). Lower values = faster.

<ComponentDemo>
  <div class="maz:flex maz:flex-col maz:gap-4">
    <MazTicker :duration="5" :repeat="20">
      <span>Fast (5s)</span>
    </MazTicker>
    <MazTicker :duration="20" :repeat="20">
      <span>Normal (20s)</span>
    </MazTicker>
    <MazTicker :duration="40" :repeat="20">
      <span>Slow (40s)</span>
    </MazTicker>
  </div>

  <template #code>

```vue
<template>
  <MazTicker :duration="5">
    <span>Fast (5s)</span>
  </MazTicker>
  <MazTicker :duration="20">
    <span>Normal (20s)</span>
  </MazTicker>
  <MazTicker :duration="40">
    <span>Slow (40s)</span>
  </MazTicker>
</template>
```

  </template>
</ComponentDemo>

## Repeat

The `repeat` prop controls how many times the content is duplicated to create a seamless loop. The default value is `4`. Increase it when your content is short to avoid visible gaps during the animation.

<ComponentDemo>
  <div class="maz:flex maz:flex-col maz:gap-4">
    <MazTicker :repeat="2">
      <span>Repeat 2</span>
    </MazTicker>
    <MazTicker :repeat="10">
      <span>Repeat 10</span>
    </MazTicker>
  </div>

  <template #code>

```vue
<template>
  <MazTicker :repeat="2">
    <span>Repeat 2</span>
  </MazTicker>
  <MazTicker :repeat="10">
    <span>Repeat 10</span>
  </MazTicker>
</template>
```

  </template>
</ComponentDemo>

## Custom gap

<ComponentDemo>
  <div class="maz:flex maz:flex-col maz:gap-4">
    <MazTicker gap="0.5rem" :repeat="20">
      <span>Small gap</span>
    </MazTicker>
    <MazTicker gap="3rem" :repeat="20">
      <span>Large gap</span>
    </MazTicker>
  </div>

  <template #code>

```vue
<template>
  <MazTicker gap="0.5rem">
    <span>Small gap</span>
  </MazTicker>
  <MazTicker gap="3rem">
    <span>Large gap</span>
  </MazTicker>
</template>
```

  </template>
</ComponentDemo>

## Overlay

### Without overlay

You can disable the overlay by setting the `overlay` prop to `false`.

<ComponentDemo>
  <MazTicker :overlay="false" :repeat="10">
    <span>No gradient overlay</span>
  </MazTicker>

  <template #code>

```vue
<template>
  <MazTicker :overlay="false" :repeat="10">
    <span>No gradient overlay</span>
  </MazTicker>
</template>
```

  </template>
</ComponentDemo>

### Custom overlay size

You can change the size of the overlay by setting the `overlay-size` prop to a CSS value.

<ComponentDemo>
  <div class="maz:flex maz:flex-col maz:gap-4">
    <MazTicker overlay-size="10%" :repeat="10">
      <span>Small overlay (10%)</span>
    </MazTicker>
    <MazTicker overlay-size="50%" :repeat="10">
      <span>Large overlay (50%)</span>
    </MazTicker>
  </div>

  <template #code>

```vue
<template>
  <MazTicker overlay-size="10%" :repeat="10">
    <span>Small overlay (10%)</span>
  </MazTicker>
  <MazTicker overlay-size="50%" :repeat="10">
    <span>Large overlay (50%)</span>
  </MazTicker>
</template>
```

  </template>
</ComponentDemo>

## Pause controls

### Pause on hover

When a child element is hovered, the animation will pause.

<ComponentDemo>
  <MazTicker pause-on-hover>
    <span>Hover me to pause</span>
  </MazTicker>

  <template #code>

```vue
<template>
  <MazTicker pause-on-hover>
    <span>Hover me to pause</span>
  </MazTicker>
</template>
```

  </template>
</ComponentDemo>

### Pause on focus

When a child element is focused, the animation will pause.

<ComponentDemo>
  <MazTicker pause-on-focus>
    <a href="#">Focusable link 1</a>
    <a href="#">Focusable link 2</a>
    <a href="#">Focusable link 3</a>
  </MazTicker>

  <template #code>

```vue
<template>
  <MazTicker pause-on-focus>
    <a href="#">Focusable link 1</a>
    <a href="#">Focusable link 2</a>
    <a href="#">Focusable link 3</a>
  </MazTicker>
</template>
```

  </template>
</ComponentDemo>

### Programmatic pause

You can control the animation programmatically with the `paused` prop.

<ComponentDemo>
  <div class="maz:flex maz:flex-col maz:gap-4">
    <MazBtn size="sm" @click="isPaused = !isPaused">
      {{ isPaused ? 'Resume' : 'Pause' }}
    </MazBtn>
    <MazTicker :paused="isPaused">
      <span>Controlled by button</span>
    </MazTicker>
  </div>

  <template #code>

```vue
<template>
  <MazBtn size="sm" @click="isPaused = !isPaused">
    {{ isPaused ? 'Resume' : 'Pause' }}
  </MazBtn>
  <MazTicker :paused="isPaused">
    <span>Controlled by button</span>
  </MazTicker>
</template>

<script lang="ts" setup>
  import { ref } from 'vue'
  import MazTicker from 'maz-ui/components/MazTicker'
  import MazBtn from 'maz-ui/components/MazBtn'

  const isPaused = ref(false)
</script>
```

  </template>
</ComponentDemo>

## Custom content

MazTicker accepts any HTML content, not just text.

<ComponentDemo>
  <MazTicker pause-on-hover :duration="15">
    <MazBadge color="primary">Vue 3</MazBadge>
    <MazBadge color="success">Nuxt 3</MazBadge>
    <MazBadge color="info">TypeScript</MazBadge>
    <MazBadge color="warning">TailwindCSS</MazBadge>
    <MazBadge color="accent">Maz UI</MazBadge>
  </MazTicker>

  <template #code>

```vue
<template>
  <MazTicker pause-on-hover :duration="15">
    <MazBadge color="primary">Vue 3</MazBadge>
    <MazBadge color="success">Nuxt 3</MazBadge>
    <MazBadge color="info">TypeScript</MazBadge>
    <MazBadge color="warning">TailwindCSS</MazBadge>
    <MazBadge color="accent">Maz UI</MazBadge>
  </MazTicker>
</template>

<script lang="ts" setup>
  import MazTicker from 'maz-ui/components/MazTicker'
  import MazBadge from 'maz-ui/components/MazBadge'
</script>
```

  </template>
</ComponentDemo>

## Slots

### Before and after

Replace the default before and after slots with custom content.

<ComponentDemo>
  <MazTicker>
    <template #before>
      <div class="maz:flex maz:items-center maz:px-4 maz:font-semibold">Latest:</div>
    </template>
    <span>Breaking news item</span>
    <template #after>
      <div class="maz:flex maz:items-center maz:px-4 maz:font-semibold">End</div>
    </template>
  </MazTicker>

  <template #code>

```vue
<template>
  <MazTicker>
    <template #before>
      <div class="maz:flex maz:items-center maz:px-4 maz:font-semibold">Latest:</div>
    </template>
    <span>Breaking news item</span>
    <template #after>
      <div class="maz:flex maz:items-center maz:px-4 maz:font-semibold">End</div>
    </template>
  </MazTicker>
</template>
```

  </template>
</ComponentDemo>

## Timing function

<ComponentDemo>
  <div class="maz:flex maz:flex-col maz:gap-4">
    <MazTicker animation-timing-function="linear" :repeat="10">
      <span>Linear (default)</span>
    </MazTicker>
    <MazTicker animation-timing-function="ease-in-out" :repeat="10">
      <span>Ease in out</span>
    </MazTicker>
  </div>

  <template #code>

```vue
<template>
  <MazTicker animation-timing-function="linear" :repeat="10">
    <span>Linear (default)</span>
  </MazTicker>
  <MazTicker animation-timing-function="ease-in-out" :repeat="10">
    <span>Ease in out</span>
  </MazTicker>
</template>
```

  </template>
</ComponentDemo>

<script lang="ts" setup>
  import { ref } from 'vue'

  const isPaused = ref(false)
</script>

<!--@include: ./../../.vitepress/generated-docs/maz-ticker.doc.md-->
