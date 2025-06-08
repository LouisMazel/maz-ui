import type { ThemeState } from '@maz-ui/themes'
import { MazUi } from 'maz-ui/plugins/maz-ui'
import type { MazThemePluginOptions } from 'maz-ui/plugins/maz-ui'
import { defineNuxtPlugin } from 'nuxt/app'

export default defineNuxtPlugin(({ vueApp, $config }) => {
  const themeConfig = $config.public.mazUi?.theme

  if (themeConfig === false) {
    return
  }

  const mazUiOptions: MazThemePluginOptions = {
    ...themeConfig,
  }

  vueApp.use(MazUi, mazUiOptions)
})

declare module '#app' {
  interface NuxtApp {
    $theme: ThemeState
  }
}
