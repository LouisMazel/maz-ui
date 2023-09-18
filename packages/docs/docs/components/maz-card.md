---
title: MazCard
description: MazCard is a standalone component to display some texts, images and also add button actions
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../.vitepress/mixins/getting-started.md-->

## Basic usage

<MazCard :images="['https://placekitten.com/600/600']" :gallery-height="300" zoom>
  <template #title>
    <h3 style="margin: 0">
      Cute Kitten
    </h3>
  </template>
  <template #subtitle>
    <span>
      Cat
    </span>
  </template>
  <template #content>
    <p class="maz-text-muted" style="margin: 0; margin-top: 20px">
      Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
    </p>
  </template>
  <template #actions>
    <MazBtn
      size="md"
      fab
      color="danger"
      class="maz-mr-2"
    >
      <MazIcon name="trash" />
    </MazBtn>
    <MazBtn
      size="md"
      color="white"
    >
      <MazIcon name="user-plus" />
    </MazBtn>
  </template>
</MazCard>

::: details Show code

```vue
<template>
  <MazCard
    :images="['https://placekitten.com/600/600']"
    :gallery-height="300"
    zoom
  >
    <template #title>
      <h3 style="margin: 0">
        Cute Kitten
      </h3>
    </template>
    <template #subtitle>
      <span>
        Cat
      </span>
    </template>
    <template #content>
      <p class="maz-text-muted" style="margin: 0; margin-top: 20px">
        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
      </p>
    </template>
    <template #actions>
      <MazBtn
        size="md"
        fab
        color="danger"
        class="maz-mr-2"
      >
        <MazIcon name="trash" />
      </MazBtn>
      <MazBtn
        size="md"
        color="white"
      >
        <MazIcon name="user-plus" />
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
<MazCard :images="['https://placekitten.com/600/600']" orientation="row">
  <template #title>
    <h3 style="margin: 0; margin-bottom: 20px">
      Cute Kitten
    </h3>
  </template>
  <template #content>
    <p class="maz-text-muted" style="margin: 0">
      Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
    </p>
  </template>
</MazCard>

::: details Show code

```html
<MazCard :images="['https://placekitten.com/600/600']" orientation="row">
  <template #title>
    <h3 style="margin: 0; margin-bottom: 20px">
      Cute Kitten
    </h3>
  </template>
  <template #content>
    <p class="maz-text-muted" style="margin: 0">
      Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
    </p>
  </template>
</MazCard>
```

:::

### Row Reverse

<br />

<MazCard :images="['https://placekitten.com/600/600']" orientation="row-reverse">
  <template #title>
    <h3 style="margin: 0; margin-bottom: 20px">
      Cute Kitten
    </h3>
  </template>
  <template #content>
    <p class="maz-text-muted" style="margin: 0">
      Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
    </p>
  </template>
</MazCard>

::: details Show code

```html
<MazCard
  :images="['https://placekitten.com/600/600']"
  orientation="row-reverse"
>
  <template #title>
    <h3 style="margin: 0; margin-bottom: 20px">
      Cute Kitten
    </h3>
  </template>
  <template #content>
    <p class="maz-text-muted" style="margin: 0">
      Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
    </p>
  </template>
</MazCard>
```

:::

### Column Reverse

<br />

<MazCard
  :images="['https://placekitten.com/600/600']"
  orientation="column-reverse"
>
  <template #title>
    <h3 style="margin: 0; margin-bottom: 20px">
      Cute Kitten
    </h3>
  </template>
  <template #content>
    <p class="maz-text-muted" style="margin: 0">
      Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
    </p>
  </template>
</MazCard>

::: details Show code

```html
<MazCard
  :images="['https://placekitten.com/600/600']"
  orientation="column-reverse"
>
  <template #title>
    <h3 style="margin: 0; margin-bottom: 20px">
      Cute Kitten
    </h3>
  </template>
  <template #content>
    <p class="maz-text-muted" style="margin: 0">
      Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
    </p>
  </template>
</MazCard>
```

:::

## Collapsable

Use props: `collapsable` & `collapse-open`

<MazCard collapsable style="width: 100%; margin-bottom: 16px;">
  <template #header>
    <h4 style="margin: 0">
      Lorem Ipsum is simply
    </h4>
  </template>
  <template #content>
    <div style="padding: 16px;">
      <p style="margin: 0">
        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
      </p>
    </div>
  </template>
</MazCard>

<MazCard collapsable collapse-open style="width: 100%;">
  <template #header>
    <h4 style="margin: 0">
      Lorem Ipsum is simply
    </h4>
  </template>
  <template #content>
    <div style="padding: 16px;">
      <p style="margin: 0">
        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
      </p>
    </div>
  </template>
</MazCard>

::: details Show code

```html
<MazCard collapsable style="width: 100%; margin-bottom: 16px;">
  <template #header>
    <h4 style="margin: 0">
      Lorem Ipsum is simply
    </h4>
  </template>
  <template #content>
    <div style="padding: 16px;">
      <p style="margin: 0">
        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
      </p>
    </div>
  </template>
</MazCard>

<MazCard collapsable collapse-open style="width: 100%;">
  <template #header>
    <h4 style="margin: 0">
      Lorem Ipsum is simply
    </h4>
  </template>
  <template #content>
    <div style="padding: 16px;">
      <p style="margin: 0">
        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
      </p>
    </div>
  </template>
</MazCard>
```

:::

## Linked card

To access the link, simply click the card.

- `href` is the link
- `href-target` is the behaviour of the link on click
- You can use `:scale="false"` to remove the scale animation on hover

<MazCard
  :images="['https://placekitten.com/500/500']"
  href="https://louismazel.github.io/maz-ui-3/components/maz-card#linked-card"
  href-target="_blank"
  style="width: 100%"
  scale
>
  <span style="color: var(--vp-c-text-1)">
    Click on the card to follow the href link
  </span>
</MazCard>

::: details Show code

```html
<MazCard
  :images="['https://placekitten.com/1000/1000']"
  href="https://louismazel.github.io/maz-ui-3/components/maz-card#linked-card"
  href-target="_blank"
  scale
>
  <span>
    Click on the card to follow the href link
  </span>
</MazCard>
```

:::

## Bordered and no elevation

<MazCard bordered :elevation="false">
  <span>
    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
  </span>
</MazCard>

## Gallery images

<MazCard
  :images="['https://placekitten.com/600/600', 'https://placekitten.com/700/700', 'https://placekitten.com/400/400', 'https://placekitten.com/300/300']"
  :images-show-count="3"
  :no-remaining="false"
  zoom
>
  <span>
    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
  </span>
</MazCard>

::: details Show code

```html
<MazCard
  :images="['https://placekitten.com/600/600', 'https://placekitten.com/700/700', 'https://placekitten.com/400/400', 'https://placekitten.com/300/300']"
  :images-show-count="3"
  :no-remaining="false"
  zoom
>
  <span>
    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
  </span>
</MazCard>
```

:::

## Footer slot

### Basic

<MazCard>
  <span>
    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
  </span>
  <template #footer>
    <MazBtn>
      Coucou
    </MazBtn>
  </template>
</MazCard>

::: details Show code

```html
<MazCard>
  <span>
    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
  </span>
  <template #footer>
    <MazBtn>
      Coucou
    </MazBtn>
  </template>
</MazCard>
```

:::

### Footer align on left

Use the prop option `footer-align="left"`

<MazCard footer-align="left">
  <span>
    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
  </span>
  <template #footer>
    <MazBtn>
      Coucou
    </MazBtn>
  </template>
</MazCard>

::: details Show code

```html
<MazCard footer-align="left">
  <span>
    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
  </span>
  <template #footer>
    <MazBtn>
      Coucou
    </MazBtn>
  </template>
</MazCard>
```

:::

<!--@include: ./../.vitepress/generated-docs/maz-card.doc.md-->
