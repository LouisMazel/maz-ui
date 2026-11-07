import type { ThemeState } from '@maz-ui/themes'
import type { Ref } from 'vue'
import { MazUiTheme } from '@maz-ui/themes/plugin'
import { getRequestThemeContext, getSystemColorMode, getThemeHead, getThemeHeadTags, resolveThemeContext } from '@maz-ui/themes/utils'
import { defineNuxtPlugin, useHead, useRequestHeaders } from 'nuxt/app'

export default defineNuxtPlugin(async ({ vueApp, $config }) => {
  const options = $config.public.mazUi.theme ?? {}

  let context
  if (import.meta.server) {
    const head = await getThemeHead(options, getRequestThemeContext(useRequestHeaders(['cookie', 'sec-ch-prefers-color-scheme'])))
    useHead(getThemeHeadTags(head))
    context = head
  }
  else {
    context = await resolveThemeContext(options, {
      systemColorMode: getSystemColorMode(),
    })
  }

  MazUiTheme.install?.(vueApp, {
    ...options,
    preset: context.preset,
    // @ts-expect-error private properties: the theme of the user is already resolved from the request
    _colorMode: context.colorMode,
    _isDark: context.isDark,
    _presetBase: context.presetBase,
  })
})

declare module 'nuxt/app' {
  interface NuxtApp {
    $mazThemeState: Ref<ThemeState>
  }
}
