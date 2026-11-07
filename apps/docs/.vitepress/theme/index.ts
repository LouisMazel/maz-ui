import type { MazUiTranslationsOptions } from '@maz-ui/translations'
import type { MazUiOptions } from 'maz-ui/plugins'
import type { Theme } from 'vitepress'

import en from '@maz-ui/translations/locales/en'
import { MazUi } from 'maz-ui/plugins'
import { AosPlugin } from 'maz-ui/plugins/aos'

import { DialogPlugin } from 'maz-ui/plugins/dialog'
import { ToastPlugin } from 'maz-ui/plugins/toast'
import { WaitPlugin } from 'maz-ui/plugins/wait'

import DefaultTheme from 'vitepress/theme-without-fonts'
import { watch } from 'vue'
import ComponentDemo from './components/ComponentDemo.vue'
import Layout from './components/Layout.vue'
import NpmBadge from './components/NpmBadge.vue'
import UtilsCatalogue from './components/UtilsCatalogue.vue'
import { DOCS_THEME } from './theme-options'
import './fonts.css'
import './main.css'

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app, router: { route } }) {
    app.use(MazUi, {
      defaults: {
        global: {
          // roundedSize: 'xl',
          // size: 'sm'
        },
      } satisfies MazUiOptions['defaults'],
      theme: DOCS_THEME,
      translations: {
        locale: 'en',
        fallbackLocale: 'fr',
        preloadFallback: false,
        messages: {
          en,
        },
      } satisfies MazUiTranslationsOptions,
    })

    app.use(DialogPlugin)
    app.use(ToastPlugin, {
      persistent: false,
      position: 'bottom-right',
      timeout: 10_000,
    })
    app.use(WaitPlugin)
    app.use(AosPlugin, {
      delay: 500,
      animation: {
        duration: 400,
        once: false,
        delay: 0,
      },
    })

    app.provide('mazIconPath', '/icons')

    app.component('NpmBadge', NpmBadge)
    app.component('ComponentDemo', ComponentDemo)
    app.component('UtilsCatalogue', UtilsCatalogue)

    watch(
      () => route.path,
      () => app.config.globalProperties.$mazAos?.runAnimations(),
      { flush: 'post' },
    )
  },
} satisfies Theme
