---
title: useThemeHandler
description: Vue composable for handling UI theme - Automatically sets dark and light theme and switches between them
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

## Usage

<MazBtn
  :left-icon="hasDarkTheme ? 'moon' : 'sun'"
  @click="toggleTheme"
>
  Click to toggle
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
      :left-icon="hasDarkTheme ? 'moon' : 'sun'"
      @click="toggleTheme"
    >
      Click to toggle
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

  import { useThemeHandler, type ThemeHandlerOptions } from 'maz-ui'

  // optional
  const options: ThemeHandlerOptions = {
    darkClass: 'dark',
    lightClass: 'light',
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
