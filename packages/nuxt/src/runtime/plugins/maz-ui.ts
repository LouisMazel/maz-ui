import type { ThemeState } from '@maz-ui/themes'
import type { MazUiTranslationsInstance } from '@maz-ui/translations'
import type { MazUiDefaultsOptions } from 'maz-ui/composables/useGlobalConfig'
import type { AosHandler, AosOptions } from 'maz-ui/plugins/aos'
import type { MazUiOptions } from 'maz-ui/plugins/maz-ui'
import type { NuxtApp } from 'nuxt/app'
import type { Ref } from 'vue'
import type { MazUiNuxtOptions } from '../../types'
import { getRequestThemeContext, getSystemColorMode, getThemeHead, getThemeHeadTags, resolveThemeContext } from '@maz-ui/themes/utils'
import { getAosInstance } from 'maz-ui/plugins/aos'
import { MazUi } from 'maz-ui/plugins/maz-ui'
import { defineNuxtPlugin, useHead, useRequestHeaders, useRouter } from 'nuxt/app'
import loadCountryFlag from '#build/maz-ui-flags.mjs'
import openExternal from '#build/maz-ui-open-external.mjs'
import messages from '#build/maz-ui-translations.mjs'

type NuxtThemeOptions = NonNullable<MazUiNuxtOptions['theme']>

/** On the server, the theme of the user is read from the request and rendered in the head */
async function resolveTheme(options: NuxtThemeOptions, nuxtApp: NuxtApp): Promise<MazUiOptions['theme']> {
  let context
  if (import.meta.server) {
    const head = await getThemeHead(options, getRequestThemeContext(useRequestHeaders(['cookie', 'sec-ch-prefers-color-scheme'])))
    // The await loses the Nuxt context, which Nuxt only restores in the body of the plugin
    nuxtApp.runWithContext(() => useHead(getThemeHeadTags(head)))
    context = head
  }
  else {
    context = await resolveThemeContext(options, {
      systemColorMode: getSystemColorMode(),
    })
  }

  return {
    ...options,
    preset: context.preset,
    // Private properties: the theme of the user is already resolved
    _colorMode: context.colorMode,
    _isDark: context.isDark,
    _presetBase: context.presetBase,
  } as MazUiOptions['theme']
}

function resolveDefaults(defaults: MazUiDefaultsOptions = {}): MazUiDefaultsOptions | undefined {
  if (loadCountryFlag) {
    return {
      ...defaults,
      global: { flagSrc: loadCountryFlag, ...defaults.global },
    }
  }

  return Object.keys(defaults).length > 0
    ? defaults
    : undefined
}

function resolveAos(aos: MazUiNuxtOptions['aos']): MazUiOptions['aos'] {
  if (!aos) {
    return false
  }

  const { router, ...options } = typeof aos === 'object'
    ? aos
    : {}

  delete options.injectCss

  return {
    ...options,
    router: router
      ? useRouter()
      : undefined,
  } satisfies AosOptions
}

export default defineNuxtPlugin(async (nuxtApp) => {
  const { vueApp, $config } = nuxtApp
  const { theme = {}, translations, defaults, toast, dialog, aos, plugins } = $config.public.mazUi

  vueApp.use(MazUi, {
    theme: await resolveTheme(theme as NuxtThemeOptions, nuxtApp),
    translations: {
      ...translations,
      messages,
    },
    defaults: resolveDefaults(defaults),
    toast,
    dialog,
    aos: resolveAos(aos),
    openExternal,
  })

  // The server renders with the messages, and the client hydrates with the same ones
  await vueApp.config.globalProperties.$mazTranslations.ready

  const provide: { mazAos?: AosHandler } = {}

  // Removed in v6 (plans/ROADMAP.md): `$mazAos` of the deprecated `plugins.aos` option
  if (aos && plugins?.aos) {
    provide.mazAos = getAosInstance()
  }

  return { provide }
})

declare module 'nuxt/app' {
  interface NuxtApp {
    $mazThemeState: Ref<ThemeState>
    $mazTranslations: MazUiTranslationsInstance
    /**
     * @deprecated use `useAos()`, removed in v6
     */
    $mazAos: AosHandler
  }
}
