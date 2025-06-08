---
title: useReadingTime
description: This composable allows you to calculate the reading time of a text
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

## Basic usage

Time to read this page: <strong>{{ duration }} minutes</strong>

```vue
<template>
  <div>
    Time to read this page: <strong>{{ duration }} minutes</strong>
  </div>
</template>

<script lang="ts" setup>
  import { useReadingTime } from 'maz-ui/composables'

  const { duration } = useReadingTime({
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lectus quam id leo in. Placerat vestibulum lectus mauris ultrices eros in cursus turpis. Et tortor consequat id porta nibh venenatis cras sed. Praesent tristique magna sit amet. Iaculis at erat pellentesque adipiscing commodo elit at. Interdum velit euismod in pellentesque massa placerat duis. Eget nunc scelerisque viverra mauris in aliquam. Nulla facilisi morbi tempus iaculis urna id volutpat lacus. Pellentesque eu tincidunt tortor aliquam nulla facilisi cras fermentum odio. Egestas integer eget aliquet nibh praesent tristique magna sit amet. Volutpat blandit aliquam etiam erat velit scelerisque. Eget nullam non nisi est sit amet. Turpis egestas sed tempus urna et pharetra. Nisl rhoncus mattis rhoncus urna neque viverra justo. Rutrum tellus pellentesque eu tincidunt tortor aliquam. Non odio euismod lacinia at. Magna eget est lorem ipsum. Et ultrices neque ornare aenean euismod elementum nisi. Ullamcorper eget nulla facilisi etiam dignissim diam quis enim lobortis. Lobortis feugiat vivamus at augue eget arcu. Ut diam quam nulla porttitor massa id neque. Turpis in eu mi bibendum neque egestas. Vivamus at augue eget arcu dictum varius duis at. Nunc sed blandit libero volutpat. Convallis a cras semper auctor neque vitae tempus. Odio facilisis mauris sit amet massa vitae tortor condimentum. Condimentum id venenatis a condimentum. Tincidunt praesent semper feugiat nibh sed pulvinar. Dolor magna eget est lorem ipsum dolor. Ultricies mi eget mauris pharetra et ultrices neque ornare aenean. Sapien pellentesque habitant morbi tristique senectus et netus. Tortor vitae purus faucibus ornare suspendisse sed nisi. Est lorem ipsum dolor sit amet consectetur adipiscing elit pellentesque. Enim neque volutpat ac tincidunt vitae. Iaculis at erat pellentesque adipiscing commodo elit at imperdiet. Scelerisque felis imperdiet proin fermentum leo vel orci porta non. Ut etiam sit amet nisl purus in mollis nunc sed. Sed velit dignissim sodales ut eu sem integer. Odio tempor orci dapibus ultrices in iaculis nunc. Id semper risus in hendrerit gravida. Aliquam faucibus purus in massa tempor nec. Mattis nunc sed blandit libero volutpat sed cras ornare arcu. Quisque id diam vel quam elementum pulvinar etiam non quam. Et egestas quis ipsum suspendisse ultrices gravida dictum. Velit aliquet sagittis id consectetur purus ut faucibus pulvinar elementum. In hac habitasse platea dictumst quisque. Amet nisl purus in mollis nunc sed id semper. Sollicitudin tempor id eu nisl nunc mi. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper dignissim. In iaculis nunc sed augue lacus viverra vitae.'
  })
</script>
```

## With content selector

::: warning
This method is not SSR friendly (only on client side, with Nuxt use this composable in `onMounted(() => { ... })`) and not recommended because it is less performant than the previous one
:::

Time to read this page: <strong>{{ durationSelector }} minutes</strong>

<MazCard collapsible class="maz-w-full" header="Content to read">
  <div id="content-to-read" class="maz-px-4">
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lectus quam id leo in. Placerat vestibulum lectus mauris ultrices eros in cursus turpis. Et tortor consequat id porta nibh venenatis cras sed. Praesent tristique magna sit amet. Iaculis at erat pellentesque adipiscing commodo elit at. Interdum velit euismod in pellentesque massa placerat duis. Eget nunc scelerisque viverra mauris in aliquam. Nulla facilisi morbi tempus iaculis urna id volutpat lacus. Pellentesque eu tincidunt tortor aliquam nulla facilisi cras fermentum odio. Egestas integer eget aliquet nibh praesent tristique magna sit amet. Volutpat blandit aliquam etiam erat velit scelerisque. Eget nullam non nisi est sit amet. Turpis egestas sed tempus urna et pharetra. Nisl rhoncus mattis rhoncus urna neque viverra justo. Rutrum tellus pellentesque eu tincidunt tortor aliquam. Non odio euismod lacinia at. Magna eget est lorem ipsum.
    </p>
    <p>
      Et ultrices neque ornare aenean euismod elementum nisi. Ullamcorper eget nulla facilisi etiam dignissim diam quis enim lobortis. Lobortis feugiat vivamus at augue eget arcu. Ut diam quam nulla porttitor massa id neque. Turpis in eu mi bibendum neque egestas. Vivamus at augue eget arcu dictum varius duis at. Nunc sed blandit libero volutpat. Convallis a cras semper auctor neque vitae tempus. Odio facilisis mauris sit amet massa vitae tortor condimentum. Condimentum id venenatis a condimentum. Tincidunt praesent semper feugiat nibh sed pulvinar. Dolor magna eget est lorem ipsum dolor. Ultricies mi eget mauris pharetra et ultrices neque ornare aenean. Sapien pellentesque habitant morbi tristique senectus et netus. Tortor vitae purus faucibus ornare suspendisse sed nisi. Est lorem ipsum dolor sit amet consectetur adipiscing elit pellentesque. Enim neque volutpat ac tincidunt vitae.
    </p>
    <p>
      Iaculis at erat pellentesque adipiscing commodo elit at imperdiet. Scelerisque felis imperdiet proin fermentum leo vel orci porta non. Ut etiam sit amet nisl purus in mollis nunc sed. Sed velit dignissim sodales ut eu sem integer. Odio tempor orci dapibus ultrices in iaculis nunc. Id semper risus in hendrerit gravida. Aliquam faucibus purus in massa tempor nec. Mattis nunc sed blandit libero volutpat sed cras ornare arcu. Quisque id diam vel quam elementum pulvinar etiam non quam. Et egestas quis ipsum suspendisse ultrices gravida dictum. Velit aliquet sagittis id consectetur purus ut faucibus pulvinar elementum. In hac habitasse platea dictumst quisque. Amet nisl purus in mollis nunc sed id semper. Sollicitudin tempor id eu nisl nunc mi. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper dignissim. In iaculis nunc sed augue lacus viverra vitae.
    </p>
  </div>
</MazCard>

```vue
<template>
  <div>
    Time to read this page: <strong>{{ duration }} minutes</strong>
  </div>

  <MazCard collapsible class="maz-w-full" header="Content to read">
    <div id="content-to-read" class="maz-px-4">
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lectus quam id leo in. Placerat vestibulum lectus mauris ultrices eros in cursus turpis. Et tortor consequat id porta nibh venenatis cras sed. Praesent tristique magna sit amet. Iaculis at erat pellentesque adipiscing commodo elit at. Interdum velit euismod in pellentesque massa placerat duis. Eget nunc scelerisque viverra mauris in aliquam. Nulla facilisi morbi tempus iaculis urna id volutpat lacus. Pellentesque eu tincidunt tortor aliquam nulla facilisi cras fermentum odio. Egestas integer eget aliquet nibh praesent tristique magna sit amet. Volutpat blandit aliquam etiam erat velit scelerisque. Eget nullam non nisi est sit amet. Turpis egestas sed tempus urna et pharetra. Nisl rhoncus mattis rhoncus urna neque viverra justo. Rutrum tellus pellentesque eu tincidunt tortor aliquam. Non odio euismod lacinia at. Magna eget est lorem ipsum.
      </p>
      <p>
        Et ultrices neque ornare aenean euismod elementum nisi. Ullamcorper eget nulla facilisi etiam dignissim diam quis enim lobortis. Lobortis feugiat vivamus at augue eget arcu. Ut diam quam nulla porttitor massa id neque. Turpis in eu mi bibendum neque egestas. Vivamus at augue eget arcu dictum varius duis at. Nunc sed blandit libero volutpat. Convallis a cras semper auctor neque vitae tempus. Odio facilisis mauris sit amet massa vitae tortor condimentum. Condimentum id venenatis a condimentum. Tincidunt praesent semper feugiat nibh sed pulvinar. Dolor magna eget est lorem ipsum dolor. Ultricies mi eget mauris pharetra et ultrices neque ornare aenean. Sapien pellentesque habitant morbi tristique senectus et netus. Tortor vitae purus faucibus ornare suspendisse sed nisi. Est lorem ipsum dolor sit amet consectetur adipiscing elit pellentesque. Enim neque volutpat ac tincidunt vitae.
      </p>
      <p>
        Iaculis at erat pellentesque adipiscing commodo elit at imperdiet. Scelerisque felis imperdiet proin fermentum leo vel orci porta non. Ut etiam sit amet nisl purus in mollis nunc sed. Sed velit dignissim sodales ut eu sem integer. Odio tempor orci dapibus ultrices in iaculis nunc. Id semper risus in hendrerit gravida. Aliquam faucibus purus in massa tempor nec. Mattis nunc sed blandit libero volutpat sed cras ornare arcu. Quisque id diam vel quam elementum pulvinar etiam non quam. Et egestas quis ipsum suspendisse ultrices gravida dictum. Velit aliquet sagittis id consectetur purus ut faucibus pulvinar elementum. In hac habitasse platea dictumst quisque. Amet nisl purus in mollis nunc sed id semper. Sollicitudin tempor id eu nisl nunc mi. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper dignissim. In iaculis nunc sed augue lacus viverra vitae.
      </p>
    </div>
  </MazCard>
</template>

<script lang="ts" setup>
  import { useReadingTime } from 'maz-ui/composables'

  const readingTime = ref<number>()

  const { duration } = useReadingTime({
    contentSelector: '#content-to-read'
  })

  readingTime.value = duration

  onMounted(() => {
    const { duration } = useReadingTime({
      contentSelector: '#content-to-read'
    })

    readingTime.value = duration
  })
</script>
```

## Velocity

> The velocity is the number of words per minute. By default it is 150 words per minute.

**Velocity**: {{ velocity ?? 150 }} words per minute

<MazInputNumber v-model="velocity" placeholder="Velocity" />

Time to read this page: <strong>{{ durationSelector }} minutes</strong>

{{wordCount}}

<script lang="ts" setup>
  import { ref, onMounted } from 'vue'
  import { useReadingTime } from 'maz-ui/src/composables/useReadingTime'

  const velocity = ref()

  const { duration } = useReadingTime({
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lectus quam id leo in. Placerat vestibulum lectus mauris ultrices eros in cursus turpis. Et tortor consequat id porta nibh venenatis cras sed. Praesent tristique magna sit amet. Iaculis at erat pellentesque adipiscing commodo elit at. Interdum velit euismod in pellentesque massa placerat duis. Eget nunc scelerisque viverra mauris in aliquam. Nulla facilisi morbi tempus iaculis urna id volutpat lacus. Pellentesque eu tincidunt tortor aliquam nulla facilisi cras fermentum odio. Egestas integer eget aliquet nibh praesent tristique magna sit amet. Volutpat blandit aliquam etiam erat velit scelerisque. Eget nullam non nisi est sit amet. Turpis egestas sed tempus urna et pharetra. Nisl rhoncus mattis rhoncus urna neque viverra justo. Rutrum tellus pellentesque eu tincidunt tortor aliquam. Non odio euismod lacinia at. Magna eget est lorem ipsum. Et ultrices neque ornare aenean euismod elementum nisi. Ullamcorper eget nulla facilisi etiam dignissim diam quis enim lobortis. Lobortis feugiat vivamus at augue eget arcu. Ut diam quam nulla porttitor massa id neque. Turpis in eu mi bibendum neque egestas. Vivamus at augue eget arcu dictum varius duis at. Nunc sed blandit libero volutpat. Convallis a cras semper auctor neque vitae tempus. Odio facilisis mauris sit amet massa vitae tortor condimentum. Condimentum id venenatis a condimentum. Tincidunt praesent semper feugiat nibh sed pulvinar. Dolor magna eget est lorem ipsum dolor. Ultricies mi eget mauris pharetra et ultrices neque ornare aenean. Sapien pellentesque habitant morbi tristique senectus et netus. Tortor vitae purus faucibus ornare suspendisse sed nisi. Est lorem ipsum dolor sit amet consectetur adipiscing elit pellentesque. Enim neque volutpat ac tincidunt vitae. Iaculis at erat pellentesque adipiscing commodo elit at imperdiet. Scelerisque felis imperdiet proin fermentum leo vel orci porta non. Ut etiam sit amet nisl purus in mollis nunc sed. Sed velit dignissim sodales ut eu sem integer. Odio tempor orci dapibus ultrices in iaculis nunc. Id semper risus in hendrerit gravida. Aliquam faucibus purus in massa tempor nec. Mattis nunc sed blandit libero volutpat sed cras ornare arcu. Quisque id diam vel quam elementum pulvinar etiam non quam. Et egestas quis ipsum suspendisse ultrices gravida dictum. Velit aliquet sagittis id consectetur purus ut faucibus pulvinar elementum. In hac habitasse platea dictumst quisque. Amet nisl purus in mollis nunc sed id semper. Sollicitudin tempor id eu nisl nunc mi. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper dignissim. In iaculis nunc sed augue lacus viverra vitae.',
    velocity,
  })

  const contentSelector = ref()

  const { duration: durationSelector, wordCount } = useReadingTime({
    contentSelector,
    velocity,
  })

  onMounted(() => {
    setTimeout(() => {
      contentSelector.value = '#content-to-read'
    }, 500)
  })
</script>

## Types

### Options

```ts
export type ReadingTimeOptions = {
  /**
   * Content to calculate the reading time
   * @default undefined
   */
  content?: string | Ref<string>
  /**
   * Selector of the content to calculate the reading time
   * @default undefined
   */
  contentSelector?: string | Ref<string>
  /**
   * Words per minute
   * @default 150
   */
  velocity?: number
}
```

### Returns

```ts
export type ReadingTimeReturn = {
  /** Content to calculate the reading time */
  content: ComputedRef<string | undefined | null>
  /** Number of words in the content */
  wordCount: ComputedRef<number>
  /** Words per minute */
  velocity: ComputedRef<number>
  /** Reading time in minutes */
  duration: ComputedRef<number>
}
```
