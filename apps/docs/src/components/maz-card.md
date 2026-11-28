---
title: MazCard
description: MazCard is a standalone component to display some texts and images and also add button actions
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../../.vitepress/mixins/getting-started.md-->

## Basic usage

<ComponentDemo expanded>
  <MazCard title="Cute Kitten">
    <p class="maz:text-muted">
      Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s when an unknown printer took a galley of type and scrambled it to make a type specimen book.
    </p>
  </MazCard>

  <template #code>

```vue
<template>
  <MazCard class="vp-raw" title="Cute Kitten">
    <p class="text-muted">
      Lorem Ipsum is simply dummy text of the printing and typesetting industry.
      Lorem Ipsum has been the industry's standard dummy text ever since the 1500s when an
      unknown printer took a galley of type and scrambled it to make a type specimen book.
    </p>
  </MazCard>
</template>

<script lang="ts" setup>
  import MazCard from 'maz-ui/components/MazCard'
</script>
```

  </template>
</ComponentDemo>

## Advanced usage

<div class="vp-raw">
<MazCard :gallery="{ images: ['https://placedog.net/480/480'], height: 300 }" class="vp-raw">
  <template #content-title>
    Cute Kitten
  </template>
  <template #content-subtitle>
    Cat
  </template>
  <template #content-body>
    <p class="maz:text-muted" style="margin: 0;">
      Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s when an unknown printer took a galley of type and scrambled it to make a type specimen book.
    </p>
  </template>
  <template #actions>
    <MazBtn
      fab
      color="destructive"
      class="maz:me-2"
    >
      <MazIcon icon="/trash.svg" class="maz:text-xl" />
    </MazBtn>
    <MazBtn color="surface">
      <MazIcon icon="/user-plus.svg" class="maz:text-xl" />
    </MazBtn>
  </template>
</MazCard>
</div>

::: details View code

```vue
<template>
  <MazCard
    :gallery="{ images: ['https://placedog.net/520/520'], height: 300, zoom: true }"
  >
    <template #content-title>
      <h3>
        Cute Kitten
      </h3>
    </template>
    <template #content-subtitle>
      <span>
        Cat
      </span>
    </template>
    <template #content-body>
      <p class="text-muted">
        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s when an unknown printer took a galley of type and scrambled it to make a type specimen book.
      </p>
    </template>
    <template #actions>
      <MazBtn
        size="md"
        fab
        color="destructive"
        class="me-2"
      >
        <MazIcon icon="/trash.svg" />
      </MazBtn>
      <MazBtn
        size="md"
        color="contrast"
      >
        <MazIcon icon="/user-plus.svg" />
      </MazBtn>
    </template>
  </MazCard>
</template>

<script lang="ts" setup>
  import MazCard from 'maz-ui/components/MazCard'
</script>
```

:::

## Orientation

When you display images, you can change the orientation of the card, available options include: `column` `row` `row-reverse` `column-reverse`

### Row

<br />
<div class="vp-raw">
<MazCard :gallery="{ images: ['https://placedog.net/450/450'] }" orientation="row" class="vp-raw">
  <template #content-title>
    <h3> Cute Kitten </h3>
  </template>
  <template #content-body>
    <p class="maz:text-muted">
      Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s when an unknown printer took a galley of type and scrambled it to make a type specimen book.
    </p>
  </template>
</MazCard>
</div>

::: details View code

```html
<MazCard :gallery="{ images: ['https://placedog.net/450/450'] }" orientation="row">
  <template #content-title>
    <h3> Cute Kitten </h3>
  </template>
  <template #content-body>
    <p class="text-muted">
      Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s when an unknown printer took a galley of type and scrambled it to make a type specimen book.
    </p>
  </template>
</MazCard>
```

:::

### Row Reverse

<br />

<div class="vp-raw">
<MazCard :gallery="{ images: ['https://placedog.net/380/380'] }" orientation="row-reverse" class="vp-raw">
  <template #content-title>
    <h3> Cute Kitten </h3>
  </template>
  <template #content-body>
    <p class="maz:text-muted">
      Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s when an unknown printer took a galley of type and scrambled it to make a type specimen book.
    </p>
  </template>
</MazCard>
</div>

::: details View code

```html
<MazCard
  :gallery="{ images: ['https://placedog.net/380/380'] }"
  orientation="row-reverse"
>
  <template #content-title>
    <h3> Cute Kitten </h3>
  </template>
  <template #content-body>
    <p class="text-muted">
      Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s when an unknown printer took a galley of type and scrambled it to make a type specimen book.
    </p>
  </template>
</MazCard>

```

:::

### Column Reverse

<br />

<div class="vp-raw">
<MazCard
  :gallery="{ images: ['https://placedog.net/420/420'], height: 300 }"
  orientation="column-reverse"
  class="vp-raw"
>
  <template #content-title>
    <h3> Cute Kitten </h3>
  </template>
  <template #content-body>
    <p class="maz:text-muted">
      Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s when an unknown printer took a galley of type and scrambled it to make a type specimen book.
    </p>
  </template>
</MazCard>
</div>

::: details View code

```html
<MazCard
  :gallery="{ images: ['https://placedog.net/420/420'], height: 300 }"
  orientation="column-reverse"
>
  <template #content-title>
    <h3> Cute Kitten </h3>
  </template>
  <template #content-body>
    <p class="text-muted">
      Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s when an unknown printer took a galley of type and scrambled it to make a type specimen book.
    </p>
  </template>
</MazCard>
```

:::

## Collapsible

Use props: `collapsible` & `v-model:collapse-open`

<div class="vp-raw">
<MazCard collapsible title="Lorem Ipsum is simply" block style="margin-bottom: 1rem;" class="vp-raw">
  <p>
    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s when an unknown printer took a galley of type and scrambled it to make a type specimen book.
  </p>
</MazCard>
</div>

<div class="vp-raw">
<MazCard collapsible v-model:collapse-open="cardOpen" title="Lorem Ipsum is simply" block class="vp-raw">
  <p>
    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s when an unknown printer took a galley of type and scrambled it to make a type specimen book.
  </p>
</MazCard>
</div>

::: details View code

```vue
<template>
  <MazCard collapsible title="Lorem Ipsum is simply" block style="margin-bottom: 1rem;">
    <p>
      Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s when an unknown printer took a galley of type and scrambled it to make a type specimen book.
    </p>
  </MazCard>

  <MazCard collapsible v-model:collapse-open="cardOpen" title="Lorem Ipsum is simply" block>
    <p>
      Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s when an unknown printer took a galley of type and scrambled it to make a type specimen book.
    </p>
  </MazCard>
</template>

<script setup>
  import { ref } from 'vue'

  const cardOpen = ref(true)
</script>
```

<script setup>
  import { ref } from 'vue'

  const cardOpen = ref(true)
</script>

:::

## Linked card

To access the link, simply click the card.

- `href` is the link or `to` if you use router-link or nuxt-link
- `href-target` is the behavior of the link on click
- You can use `:scale="false"` to remove the scale animation on hover
- On hover (with a mouse), the image moves closer and an element with the `m-card__arrow` class slides toward the end of the line

<div class="vp-raw">
<MazCard
  :gallery="{ images: ['https://placedog.net/400/400'], height: 300 }"
  href="/components/maz-card#linked-card"
  href-target="_blank"
  block
  class="vp-raw"
>
  Click on the card to follow the href link
</MazCard>
</div>

::: details View code

```html
<MazCard
  :gallery="{ images: ['https://placedog.net/400/400'], height: 300 }"
  href="/components/maz-card#linked-card"
  href-target="_blank"
  block
>
  <span>
    Click on the card to follow the href link
  </span>
</MazCard>
```

:::

## No bordered

<div class="vp-raw">
<MazCard :bordered="false" class="vp-raw">
  Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s when an unknown printer took a galley of type and scrambled it to make a type specimen book.
</MazCard>
</div>

::: details View code

```html
<MazCard :bordered="false">
  Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s when an unknown printer took a galley of type and scrambled it to make a type specimen book.
</MazCard>
```

:::

## Elevation

`elevation` sets the shadow of the card, from `0` (none) to `3` (large). `true` keeps the default shadow. The shadows come from the theme and are deeper in dark mode, so a card needs no extra border there.

<div class="vp-raw maz:grid maz:gap-4 maz:grid-cols-1 maz:tab-l:grid-cols-3">
  <MazCard :elevation="1" :bordered="false" class="vp-raw">
    Level 1
  </MazCard>
  <MazCard :elevation="2" :bordered="false" class="vp-raw">
    Level 2
  </MazCard>
  <MazCard :elevation="3" :bordered="false" class="vp-raw">
    Level 3
  </MazCard>
</div>

```html
<MazCard :elevation="2" :bordered="false">
  Level 2
</MazCard>
```

## Border draw

Add `border-draw`: the border draws itself around the card from the point where the pointer enters, and on keyboard focus. Change its color with the `--maz-border-draw-color` CSS variable.

<div class="vp-raw">
<MazCard border-draw class="vp-raw">
  Enter the card from any side
</MazCard>
</div>

```html
<MazCard border-draw>
  Enter the card from any side
</MazCard>
```

## Gallery images

<div class="vp-raw">
<MazCard
  :gallery="{
    images: ['https://placedog.net/640/640', 'https://placedog.net/560/560', 'https://placedog.net/720/720', 'https://placedog.net/360/360'],
    displayedCount: 3,
    remaining: true,
    zoom: true,
  }"
  class="vp-raw"
>
  Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s when an unknown printer took a galley of type and scrambled it to make a type specimen book.
</MazCard>
</div>

::: details View code

```html
<MazCard
  :gallery="{
    images: ['https://placedog.net/640/640', 'https://placedog.net/560/560', 'https://placedog.net/720/720', 'https://placedog.net/360/360'],
    displayedCount: 3,
    remaining: true,
    zoom: true,
  }"
>
  Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s when an unknown printer took a galley of type and scrambled it to make a type specimen book.
</MazCard>
```

:::

## Footer slot

### Basic

<div class="vp-raw">
<MazCard class="vp-raw">
  Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s when an unknown printer took a galley of type and scrambled it to make a type specimen book.

  <template #footer>
    <MazBtn>
      Button
    </MazBtn>
  </template>
</MazCard>
</div>

::: details View code

```html
<MazCard>
  Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s when an unknown printer took a galley of type and scrambled it to make a type specimen book.

  <template #footer>
    <MazBtn>
      Button
    </MazBtn>
  </template>
</MazCard>
```

:::

### Footer aligned on left

Use the prop option `footer-align="start"`

<div class="vp-raw">
<MazCard footer-align="start" class="vp-raw">
  Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s when an unknown printer took a galley of type and scrambled it to make a type specimen book.

  <template #footer>
    <MazBtn>
      Button
    </MazBtn>
  </template>
</MazCard>
</div>

::: details View code

```html
<MazCard footer-align="start">
  Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s when an unknown printer took a galley of type and scrambled it to make a type specimen book.

  <template #footer>
    <MazBtn>
      Button
    </MazBtn>
  </template>
</MazCard>
```

:::

## Types

```ts
type MazGalleryImage =
  | {
      thumbnail?: string
      src: string
      alt?: string
    }
  | string
```

## Motion

- A linked card grows a little on hover, its image comes closer and `m-card__arrow` slides. Only with a mouse: nothing moves on touch screens.
- `border-draw` draws the border from where the pointer enters.
- Turn the scale off with `:scale="false"`. Reduced motion removes every transition.

<!--@include: ./../../.vitepress/generated-docs/maz-card.doc.md-->
