<script lang="ts" setup generic="TLocale extends string">
import type { MazUiThemeOptions, ThemePreset, ThemeState } from '@maz-ui/themes'
import type { MazUiTranslationsMessages, MazUiTranslationsOptions } from '@maz-ui/translations'
import type { MazUiExternalLinksOptions } from '../utils/externalLinks.ts'
import { setupTheme } from '@maz-ui/themes/utils/setup-theme'
import { createMazUiTranslations } from '@maz-ui/translations/utils/instance'
import { onUnmounted, provide, ref, watch } from 'vue'
import { EXTERNAL_LINKS_INJECTION_KEY } from '../utils/externalLinks.ts'

export type MazUiProviderTranslations<T extends string = string> = Omit<MazUiTranslationsOptions, 'messages' | 'locale'> & {
  locale: T
  messages: MazUiTranslationsMessages & Record<T, MazUiTranslationsMessages[string]>
}

export interface MazUiProviderProps<T extends string = string> extends MazUiExternalLinksOptions {
  theme: MazUiThemeOptions & { preset: ThemePreset }
  /**
   * Must include `locale` and at least the messages for that locale in `messages`
   * @example { locale: 'fr', messages: { fr: { ... } } }
   */
  translations: MazUiProviderTranslations<T>
}

const {
  theme,
  translations,
  openExternal,
  isExternalLink,
} = defineProps<MazUiProviderProps<TLocale>>()

if (openExternal || isExternalLink) {
  provide(EXTERNAL_LINKS_INJECTION_KEY, {
    openExternal: (href, event) => openExternal?.(href, event),
    get isExternalLink() {
      return isExternalLink
    },
  })
}

const i18n = createMazUiTranslations(translations)
provide('mazTranslations', i18n)

const providedThemeState = ref<ThemeState>()
provide('mazThemeState', providedThemeState)

let themeCleanup: (() => void) | undefined

function initTheme(options: MazUiThemeOptions & { preset: ThemePreset }) {
  themeCleanup?.()

  const { themeState, cleanup } = setupTheme(options)
  // Share the underlying ThemeState object so mutations routed through
  // useTheme remain observable by setup-theme's internal watchers.
  providedThemeState.value = themeState.value

  themeCleanup = cleanup
}

initTheme(theme)

watch(() => theme, (newThemeOptions) => {
  initTheme(newThemeOptions)
}, { deep: true })

watch(() => translations, (newTranslationsOptions) => {
  for (const [targetLocale, localeMessages] of Object.entries(newTranslationsOptions?.messages ?? {})) {
    if (typeof localeMessages === 'object') {
      i18n.setLocaleMessage(targetLocale, localeMessages)
    }
  }

  if (newTranslationsOptions?.locale) {
    i18n.setLocale(newTranslationsOptions.locale)
  }
}, { deep: true })

onUnmounted(() => {
  themeCleanup?.()
})
</script>

<template>
  <slot />
</template>
