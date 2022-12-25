---
title: useThemeHandler
description: Vue composable to handling UI theme - Automatically set dark and light theme and switch between them
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

## Usage

<MazBtn
  :left-icon="hasDarkTheme ? 'moon' : 'sun'"
  @click="toggleTheme"
>
  Click to toggle mode
</MazBtn>

<br />
<br />

<MazBtn
  left-icon="moon"
  @click="setDarkTheme"
>
  Click to set dark mode
</MazBtn>

<br />
<br />

<MazBtn
  left-icon="sun"
  @click="setLightTheme"
>
  Click to set light mode
</MazBtn>

### Data

<br />

<code>
 {{ { theme, hasDarkTheme, hasLightTheme } }}
</code>

## How to use it ?

In your main Vue component (often App.vue - default layout for nuxt)

`App.vue` or `layouts/default.vue`

```vue
<template>
  <div
    class="app"
    :class="{
      '--has-dark-theme': hasDarkTheme,
      '--has-light-theme': hasLightTheme,
    }"
  >
    <!-- Theme switching -->
    <MazBtn
      :left-icon="hasDarkTheme ? 'moon' : 'sun'"
      @click="toggleTheme"
    >
      Click to toggle mode
    </MazBtn>

    <MazBtn
      left-icon="moon"
      @click="setDarkTheme"
    >
      Click to set dark mode
    </MazBtn>

    <MazBtn
      left-icon="sun"
      @click="setLightTheme"
    >
      Click to set light mode
    </MazBtn>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted } from 'vue'

  import { useThemeHandler } from 'maz-ui'
  import type { ThemeHandlerOptions } from 'maz-ui'
  import MazBtn from 'maz-ui/components/MazBtn'

  // optional
  const options: ThemeHandlerOptions = {
    /* should be "dark" to works with maz-ui */
    darkClass: 'dark',
    /* local storage preferences */
    storageThemeKey: 'theme',
    storageThemeValueDark: 'dark',
    storageThemeValueLight: 'light',
  }

  const {
    autoSetTheme,
    toggleTheme,
    setDarkTheme,
    setLightTheme,
    theme,
    hasDarkTheme,
    hasLightTheme
  } = useThemeHandler(options)

  onMounted(() => {
    /*
    * Will automatically set the theme according
    * with the user preferences and add class to <html /> element
    */
    autoSetTheme()
  })
</script>
```

<script lang="ts" setup>
  import { onMounted } from 'vue'

  import { useThemeHandler } from 'maz-ui'
  import type { ThemeHandlerOptions } from 'maz-ui'

  // optional
  const options: ThemeHandlerOptions = {
    darkClass: 'dark',
    storageThemeKey: 'theme',
    storageThemeValueDark: 'dark',
    storageThemeValueLight: 'light',
  }

  const {
    autoSetTheme,
    toggleTheme,
    setDarkTheme,
    setLightTheme,
    theme,
    hasDarkTheme,
    hasLightTheme
  } = useThemeHandler(options)

  onMounted(() => {
    autoSetTheme()
  })
</script>
