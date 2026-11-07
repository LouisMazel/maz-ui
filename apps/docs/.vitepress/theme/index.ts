import type { MazUiThemeOptions } from '@maz-ui/themes'

import type { MazUiTranslationsOptions } from '@maz-ui/translations'
import type { MazUiOptions } from 'maz-ui/plugins'
import type { Theme } from 'vitepress'
import { folio } from '@maz-ui/themes/presets/folio'

import en from '@maz-ui/translations/locales/en'
import { MazUi } from 'maz-ui/plugins'
import { AosPlugin } from 'maz-ui/plugins/aos'

import { DialogPlugin } from 'maz-ui/plugins/dialog'
import { ToastPlugin } from 'maz-ui/plugins/toast'
import { WaitPlugin } from 'maz-ui/plugins/wait'

import { inBrowser } from 'vitepress'
import DefaultTheme from 'vitepress/theme-without-fonts'
import { h, watch } from 'vue'
import { DOCS_COLOR_SCALE } from './color-scale'
import ComponentDemo from './components/ComponentDemo.vue'
import Layout from './components/Layout.vue'
import NpmBadge from './components/NpmBadge.vue'
import UtilsCatalogue from './components/UtilsCatalogue.vue'
import './fonts.css'
import './main.css'

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
    })
  },
  enhanceApp({ app, router: { route } }) {
    app.use(MazUi, {
      defaults: {
        global: {
          // roundedSize: 'xl',
          // size: 'sm'
        },
      } satisfies MazUiOptions['defaults'],
      theme: {
        preset: folio,
        darkModeStrategy: 'class',
        strategy: 'runtime',
        persistPreset: true,
        overrides: {
          scales: {
            color: DOCS_COLOR_SCALE,
          },
        },
      } satisfies MazUiThemeOptions,
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
      (path, oldPath) => {
        if (inBrowser && path !== oldPath) {
          app.config.globalProperties.$mazAos.runAnimations()
        }
      },
    )
  },
} satisfies Theme
