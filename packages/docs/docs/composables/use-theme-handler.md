---
title: useThemeHandler
description: Vue composable for handling UI theme - Automatically sets dark and light theme and switches between them
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

## Usage

<ComponentDemo>
  <div class="maz-flex maz-gap-4">
    <div class="maz-flex maz-flex-center maz-flex-col maz-text-center maz-gap-2">
      <span>Dark</span>
      <MazBtn
        icon="moon"
        fab
        :color="hasDarkTheme ? 'secondary' : 'primary'"
        :class="theme === 'dark' ? '!maz-outline !maz-outline-offset-2 !maz-outline-secondary' : ''"
        size="lg"
        @click="selectedTheme = 'dark'"
      />
    </div>
    <div class="maz-flex maz-flex-center maz-flex-col maz-text-center maz-gap-2">
      <span>Light</span>
      <MazBtn
        icon="sun"
        fab
        :color="hasLightTheme ? 'secondary' : 'primary'"
        :class="theme === 'light' ? '!maz-outline !maz-outline-offset-2 !maz-outline-secondary' : ''"
        size="lg"
        @click="selectedTheme = 'light'"
      />
    </div>
    <div class="maz-flex maz-flex-center maz-flex-col maz-text-center maz-gap-2">
      <span>System</span>
      <MazBtn
        icon="computer-desktop"
        fab
        :color="hasSystemTheme ? 'secondary' : 'primary'"
        size="lg"
        @click="selectedTheme = 'system'"
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
  <template #content>
    <br />
    <div class="language-js ext-json"><span class="lang">json</span><pre class="language-js"><code>{{ { theme, selectedTheme, hasDarkTheme, hasLightTheme, hasSystemTheme } }}</code></pre></div>
  </template>
</ComponentDemo>

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

  import { useThemeHandler, type ThemeHandlerOptions } from 'maz-ui/composables'

  // Optional
  const options: ThemeHandlerOptions = {
    /** should be "dark" to works with maz-ui */
    darkClass: 'dark',
    lightClass: 'light',
    /** local storage preferences */
    storageThemeKey: 'theme',
    storageThemeValueDark: 'dark',
    storageThemeValueLight: 'light',
    /** watch for changes in the system theme */
    watchChanges: true,
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
    selectedTheme,
  } = useThemeHandler(options)

  autoSetTheme()
</script>
```

## Types

### Options

Options available to customize the composable

```ts
export type ThemeHandlerOptions = {
  /**
   * Class to be added to the html element when dark theme is set
   * @default 'dark'
   */
  darkClass?: string
  /**
   * Class to be added to the html element when light theme is set
   * @default 'light'
   */
  lightClass?: string
  /**
   * Key to store the theme in local storage
   * @default 'theme'
   */
  storageThemeKey?: string
  /**
   * Value to set the theme to dark
   * @default 'dark'
   */
  storageThemeValueDark?: string
  /**
   * Value to set the theme to light
   * @default 'light'
   */
  storageThemeValueLight?: string
  /**
   * Value to set the theme to system
   * @default 'system'
   */
  storageThemeValueSystem?: string
  /**
   * Watch for changes in the system theme
   * @default true
   */
  watchChanges?: boolean
  /**
   * Default theme to set if no theme has been previously set by the user
   * Useful to force a theme on first visit
   * The value will not be stored in local storage
   * @default undefined
   */
  defaultTheme?: 'light' | 'dark'
}
```

### Returns

Methods and values returns by the composable

```ts
type ThemeHandler = {
  /** Automatically sets the theme based on the user's preferences or the stored value */
  autoSetTheme: () => void;
  /** Toggles the theme between dark and light */
  toggleTheme: () => void;
  /** Sets the theme to system */
  setSystemTheme: () => void;
  /** Sets the theme to dark */
  setDarkTheme: () => void;
  /** Sets the theme to light */
  setLightTheme: () => void;
  /** Sets the default theme */
  setDefaultTheme: () => void;
  /** Computed value if the theme is dark */
  hasDarkTheme: ComputedRef<boolean>;
  /** Computed value if the theme is light */
  hasLightTheme: ComputedRef<boolean>;
  /** Computed value if the theme is system */
  hasSystemTheme: ComputedRef<boolean>;
  /**
   * Current active theme
   * @default 'system'
   */
  theme: Ref<string>;
  /**
   * Selected theme by user (or by autoSetTheme method)
   * @default 'system'
   */
  selectedTheme: Ref<string>;
}
```

<script lang="ts" setup>
  import { useThemeHandler, type ThemeHandlerOptions } from 'maz-ui/src/composables/useThemeHandler'

  const options: ThemeHandlerOptions = {
    darkClass: 'dark',
    lightClass: 'light',
    storageThemeKey: 'theme',
    storageThemeValueDark: 'dark',
    storageThemeValueLight: 'light',
    storageThemeValueSystem: 'system',
    watchChanges: true,
  }

  const {
    autoSetTheme,
    toggleTheme,
    theme,
    hasDarkTheme,
    hasLightTheme,
    hasSystemTheme,
    internalTheme,
    selectedTheme,
    setDefaultTheme,
  } = useThemeHandler(options)

  autoSetTheme()
</script>
