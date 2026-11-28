---
title: MazAnimatedText
description: MazAnimatedText is a standalone component that animates text with a sliding blur effect. It can highlight the last word with a gradient background and supports different animation directions (up, down, left, right).
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../../.vitepress/mixins/getting-started.md-->

## Basic usage

::: tip
This component is SSR friendly: the server renders the same markup as the client, so the text keeps its layout on hydration (no layout shift). The text is visible without JavaScript, and the words come in one after the other when it enters the screen once the page is hydrated (built on [vReveal](./../directives/reveal.md)). With `prefers-reduced-motion: reduce`, the text fades in quickly.
:::

<ComponentDemo expanded>
  <MazAnimatedText tag="h1" text="Hello" last-word="world" :delay="1000" :duration="2000" direction="up" :column-gap="0.5" :row-gap="0.5" />

<template #code>

```vue
<script lang="ts" setup>
import MazAnimatedText from 'maz-ui/components/MazAnimatedText'
</script>

<template>
  <MazAnimatedText tag="h1" text="Hello" last-word="world" :delay="1000" :duration="2000" direction="up" :column-gap="0.5" :row-gap="0.5" />
</template>
```

  </template>
</ComponentDemo>

## Effects

The `effect` prop picks another animation. Without it, the words come in as above. With `prefers-reduced-motion: reduce` (or the `motion` option of `MazUi`), every effect shows the final text at once.

### Scramble

The text decodes letter by letter when it enters the screen, and again when `text` changes. Screen readers read the real text, and the size of the text does not change.

<ComponentDemo expanded>
  <div class="maz:flex maz:flex-col maz:items-start maz:gap-3">
    <MazBtn size="sm" @click="scrambleText = scrambleText === 'Accessible, fast, light' ? 'Motion, with restraint' : 'Accessible, fast, light'">Change the text</MazBtn>
    <MazAnimatedText effect="scramble" tag="p" :text="scrambleText" class="maz:text-3xl maz:font-semibold" />
  </div>

<template #code>

```vue
<template>
  <MazAnimatedText effect="scramble" tag="p" :text="text" />
</template>
```

</template>
</ComponentDemo>

### Rotate

One word of the sentence changes in a loop. Give the words with `words`: they follow `text`, or take the place of `{word}` in it. The loop stops off screen, on hover and on focus, and its width is the one of the longest word (no layout shift). The text has `aria-live="off"`: the change is not announced.

<ComponentDemo>
  <MazAnimatedText effect="rotate" tag="h3" text="Build sites" :words="['fast', 'beautiful', 'accessible']" class="maz:text-3xl maz:font-semibold" />

<template #code>

```vue
<template>
  <MazAnimatedText effect="rotate" text="Build sites" :words="['fast', 'beautiful', 'accessible']" :interval="2500" />
  <MazAnimatedText effect="rotate" text="Sites that are {word} for everyone" :words="['fast', 'accessible']" />
</template>
```

</template>
</ComponentDemo>

### Typewriter

The text is typed with a human rhythm (longer pauses after commas and full stops) and a caret. The delay of `delay` is waited first.

<ComponentDemo>
  <MazAnimatedText effect="typewriter" tag="p" text="Hello. I type this text, letter after letter, like a person." class="maz:text-xl" />

<template #code>

```vue
<template>
  <MazAnimatedText effect="typewriter" tag="p" text="Hello. I type this text, letter after letter." :delay="300" />
</template>
```

</template>
</ComponentDemo>

### Shimmer

A band of light crosses the text, for loading states (an AI that thinks, a content that loads). `duration` is the time of one pass. The animation is paused off screen.

<ComponentDemo>
  <MazAnimatedText effect="shimmer" tag="p" text="Thinking..." class="maz:text-2xl maz:font-semibold" />

<template #code>

```vue
<template>
  <MazAnimatedText effect="shimmer" text="Thinking..." :duration="2000" />
</template>
```

</template>
</ComponentDemo>

### Highlight

A hand-drawn marker, underline or circle is drawn around keywords when the text enters the screen. Give the words with `highlight`, choose the shape with `highlight-type` (`marker`, `underline`, `circle`) and the color with `color`. You can also put your own `<mark>` elements in the default slot instead of `text`.

<ComponentDemo>
  <div class="maz:flex maz:flex-col maz:gap-4 maz:text-xl">
    <MazAnimatedText effect="highlight" tag="p" text="A fast, accessible and light library." :highlight="['fast', 'light']" />
    <MazAnimatedText effect="highlight" tag="p" text="A fast, accessible and light library." highlight="accessible" highlight-type="underline" color="secondary" />
    <MazAnimatedText effect="highlight" tag="p" text="A fast, accessible and light library." highlight="light" highlight-type="circle" color="accent" />
    <MazAnimatedText effect="highlight" tag="p">With the slot: <mark>a word</mark> and <mark>another</mark>.</MazAnimatedText>
  </div>

<template #code>

```vue
<template>
  <MazAnimatedText effect="highlight" text="A fast, accessible and light library." :highlight="['fast', 'light']" />
  <MazAnimatedText effect="highlight" text="A fast, accessible and light library." highlight="accessible" highlight-type="underline" color="secondary" />
  <MazAnimatedText effect="highlight" highlight-type="circle">
    With the slot: <mark>a word</mark> and <mark>another</mark>.
  </MazAnimatedText>
</template>
```

</template>
</ComponentDemo>

The strokes are decorative (`aria-hidden`), the words stay normal text. Without JavaScript, the words are shown without the strokes.

<script lang="ts" setup>
import { ref } from 'vue'

const scrambleText = ref('Accessible, fast, light')
</script>

<!--@include: ./../../.vitepress/generated-docs/maz-animated-text.doc.md-->
