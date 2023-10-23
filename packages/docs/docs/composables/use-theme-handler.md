---
title: useThemeHandler
description: Vue composable for handling UI theme - Automatically sets dark and light theme and switches between them
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

## Usage

<div class="maz-flex maz-gap-4">
  <div class="maz-flex maz-flex-center maz-flex-col maz-text-center maz-gap-2">
    <span>Dark</span>
    <MazBtn
      icon="moon"
      fab
      :color="theme === 'dark' ? 'secondary' : 'primary'"
      size="lg"
      @click="setDarkTheme"
    />
  </div>
  <div class="maz-flex maz-flex-center maz-flex-col maz-text-center maz-gap-2">
    <span>Light</span>
    <MazBtn
      icon="sun"
      fab
      :color="theme === 'light' ? 'secondary' : 'primary'"
      size="lg"
      @click="setLightTheme"
    />
  </div>
  <div class="maz-flex maz-flex-center maz-flex-col maz-text-center maz-gap-2">
    <span>System</span>
    <MazBtn
      icon="computer-desktop"
      fab
      :color="theme === 'system' ? 'secondary' : 'primary'"
      size="lg"
      @click="setSystemTheme"
    />
  </div>
  <div class="maz-flex maz-flex-center maz-flex-col maz-text-center maz-gap-2">
    <span>Toggle</span>
    <MazBtn
      icon="arrow-path"
      fab
      size="lg"
      @click="toggleTheme"
    />
  </div>
</div>

### Data

<br />

<code>
 {{ { theme, hasDarkTheme, hasLightTheme, hasSystemTheme } }}
</code>

## How to use it?

::: info
`autoSetTheme` method, does not store theme value in localStorage but always lets the user's preferences apply on every visit (some users automatically have light mode during the day and dark at night)
:::

:::tip

Always run `autoSetTheme` method on app initialization and let the user change the theme with `toggleTheme` or `setDarkTheme` or `setLightTheme`

:::

### Example

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
      icon="moon"
      fab
      size="lg"
      @click="setDarkTheme"
    />

    <MazBtn
      icon="sun"
      fab
      size="lg"
      @click="setLightTheme"
    />

    <MazBtn
      icon="computer-desktop"
      fab
      size="lg"
      @click="setSystemTheme"
    />

    <MazBtn
      icon="arrow-path"
      fab
      size="lg"
      @click="toggleTheme"
    />
  </div>
</template>

<script lang="ts" setup>
  import { onMounted } from 'vue'

  import MazBtn from 'maz-ui/components/MazBtn'

  import { useThemeHandler, type ThemeHandlerOptions } from 'maz-ui'

  // optional
  const options: ThemeHandlerOptions = {
    /* should be "dark" to works with maz-ui */
    darkClass: 'dark',
    lightClass: 'light',
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
    setSystemTheme,
    theme,
    hasDarkTheme,
    hasLightTheme,
    hasSystemTheme
  } = useThemeHandler(options)

  onBeforeMount(() => {
    /*
    * Will automatically set the theme according
    * with the user preferences and add class to <html /> element
    */
    autoSetTheme()
  })
</script>
```

<script lang="ts" setup>
  import { onBeforeMount } from 'vue'

  import { useThemeHandler, type ThemeHandlerOptions } from 'maz-ui'

  // optional
  const options: ThemeHandlerOptions = {
    darkClass: 'dark',
    lightClass: 'light',
    storageThemeKey: 'theme',
    storageThemeValueDark: 'dark',
    storageThemeValueLight: 'light',
    storageThemeValueSystem: 'system',
  }

  const {
    autoSetTheme,
    toggleTheme,
    setDarkTheme,
    setLightTheme,
    setSystemTheme,
    theme,
    hasDarkTheme,
    hasLightTheme,
    hasSystemTheme,
  } = useThemeHandler(options)

  onBeforeMount(() => {
    autoSetTheme()
  })
</script>
