import type { MazUiNuxtOptions } from './types'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  addComponent,
  addImports,
  addPlugin,
  createResolver,
  defineNuxtModule,
} from '@nuxt/kit'
import { defu } from 'defu'
import { capitalize } from 'maz-ui'

type MazUiComposables = keyof typeof import('maz-ui/composables')

type Composables = Omit<
  Record<MazUiComposables | 'useTheme' | 'useTranslations', true>,
  'useAos' | 'useDialog' | 'useToast' | 'useWait'
>

declare module '@nuxt/schema' {
  interface NuxtConfig {
    mazUi?: MazUiNuxtOptions
  }

  interface NuxtOptions {
    mazUi: MazUiNuxtOptions
  }

  interface PublicRuntimeConfig {
    mazUi: Required<MazUiNuxtOptions>
  }
}

type ComponentNames = keyof typeof import('maz-ui/components')

const COMPONENT_NAMES: Omit<
  Record<ComponentNames, true>,
  'useMazDialogConfirm'
> = {
  MazAccordion: true,
  MazAnimatedCounter: true,
  MazAnimatedElement: true,
  MazAnimatedText: true,
  MazAvatar: true,
  MazBackdrop: true,
  MazBadge: true,
  MazBottomSheet: true,
  MazBtn: true,
  MazCard: true,
  MazCardSpotlight: true,
  MazCarousel: true,
  MazChart: true,
  MazCheckbox: true,
  MazChecklist: true,
  MazCircularProgressBar: true,
  MazDialog: true,
  MazDialogConfirm: true,
  MazDrawer: true,
  MazDropdown: true,
  MazDropzone: true,
  MazExpandAnimation: true,
  MazFullscreenLoader: true,
  MazGallery: true,
  MazIcon: true,
  MazInput: true,
  MazInputCode: true,
  MazInputNumber: true,
  MazInputPhoneNumber: true,
  MazInputPrice: true,
  MazInputTags: true,
  MazLazyImg: true,
  MazLink: true,
  MazLoadingBar: true,
  MazPagination: true,
  MazDatePicker: true,
  MazPullToRefresh: true,
  MazRadio: true,
  MazRadioButtons: true,
  MazReadingProgressBar: true,
  MazSelect: true,
  MazSelectCountry: true,
  MazSlider: true,
  MazSpinner: true,
  MazStepper: true,
  MazSwitch: true,
  MazTable: true,
  MazTableCell: true,
  MazTableRow: true,
  MazTableTitle: true,
  MazTabs: true,
  MazTabsBar: true,
  MazTabsContent: true,
  MazTabsContentItem: true,
  MazTextarea: true,
  MazPopover: true,
}

const _dirname = dirname(fileURLToPath(import.meta.url))

const pluginComposables: Record<'useTheme' | 'useTranslations', true> = {
  useTheme: true,
  useTranslations: true,
}

const mazUiComposables: Omit<Record<MazUiComposables, true>, 'useAos' | 'useDialog' | 'useToast' | 'useWait'> = {
  useIdleTimeout: true,
  useReadingTime: true,
  useFormField: true,
  useWindowSize: true,
  useBreakpoints: true,
  useUserVisibility: true,
  useStringMatching: true,
  useTimer: true,
  useFormValidator: true,
  useDisplayNames: true,
  useFreezeValue: true,
  useInjectStrict: true,
  useDropzone: true,
  useInstanceUniqId: true,
  useMountComponent: true,
  useSwipe: true,
  useMutationObserver: true,
}

const defaults = {
  general: {
    autoImportPrefix: '',
    defaultMazIconPath: '',
    devtools: true,
  },
  css: {
    injectMainCss: true,
  },
  theme: {
    preset: 'maz-ui',
    strategy: 'hybrid',
    darkModeStrategy: 'class',
    colorMode: 'auto',
    mode: 'both',
  },
  translations: {
    locale: 'en',
    fallbackLocale: 'en',
    preloadFallback: true,
  },
  components: {
    autoImport: true,
  },
  plugins: {
    aos: false,
    dialog: false,
    toast: false,
    wait: false,
  },
  composables: {
    ...pluginComposables,
    ...mazUiComposables,
  } satisfies Composables,
  directives: {
    vZoomImg: false,
    vLazyImg: false,
    vClickOutside: false,
    vFullscreenImg: false,
    vTooltip: false,
  },
} satisfies Required<MazUiNuxtOptions>

function addMazUiComposableImport({
  name,
  from,
  prefix = '',
}: {
  name: string
  from: string
  prefix: string
}) {
  addImports({
    from,
    name,
    as: `use${capitalize(prefix)}${name.replace('use', '')}`,
  })
}

export default defineNuxtModule<MazUiNuxtOptions>({
  meta: {
    name: 'maz-ui',
    configKey: 'mazUi',
    compatibility: {
      nuxt: '>=3.0.0',
    },
  },
  defaults,
  /* eslint-disable complexity, sonarjs/cognitive-complexity */
  setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url)

    nuxt.options.build.transpile.push('maz-ui', '@maz-ui/themes', '@maz-ui/translations')

    const moduleOptions = defu(
      nuxt.options.runtimeConfig.public.mazUi,
      options,
      defaults,
    )

    nuxt.options.runtimeConfig.public.mazUi = moduleOptions

    // CSS

    if (moduleOptions.css.injectMainCss) {
      nuxt.options.css.unshift('maz-ui/dist/css/main.css')
    }

    // Plugins

    addPlugin(resolve(_dirname, './runtime/plugins/theme'))
    addPlugin(resolve(_dirname, './runtime/plugins/translations'))

    // Components

    if (moduleOptions.components.autoImport) {
      for (const name of Object.keys(COMPONENT_NAMES)) {
        addComponent({
          name,
          filePath: `maz-ui/components/${name}`,

        })
      }
    }

    // Plugins

    const autoImportPrefix = moduleOptions.general.autoImportPrefix

    if (moduleOptions.plugins.aos) {
      addPlugin(resolve(_dirname, './runtime/plugins/aos'))

      addImports({
        name: 'useAos',
        from: resolve(_dirname, './runtime/composables/useAos'),
        as: `use${capitalize(autoImportPrefix)}Aos`,
      })

      const injectAosCSS
        = typeof moduleOptions.plugins.aos === 'object'
          && typeof moduleOptions.plugins.aos.injectCss === 'boolean'
          ? moduleOptions.plugins.aos.injectCss
          : true

      if (injectAosCSS) {
        nuxt.options.css = ['maz-ui/aos-styles', ...nuxt.options.css]
      }
    }

    if (moduleOptions.plugins.toast) {
      addPlugin(resolve(_dirname, './runtime/plugins/toast'))
      addImports({
        name: 'useToast',
        from: resolve(_dirname, './runtime/composables/useToast'),
        as: `use${capitalize(autoImportPrefix)}Toast`,
      })
    }

    if (moduleOptions.plugins.dialog) {
      addPlugin(resolve(_dirname, './runtime/plugins/dialog'))
      addImports({
        name: 'useDialog',
        from: resolve(_dirname, './runtime/composables/useDialog'),
        as: `use${capitalize(autoImportPrefix)}Dialog`,
      })
    }

    if (moduleOptions.plugins.wait) {
      addPlugin(resolve(_dirname, './runtime/plugins/wait'))
      addImports({
        name: 'useWait',
        from: resolve(_dirname, './runtime/composables/useWait'),
        as: `use${capitalize(autoImportPrefix)}Wait`,
      })
    }

    // Directives

    if (moduleOptions.directives.vZoomImg) {
      addPlugin(resolve(_dirname, './runtime/plugins/v-zoom-img'))
    }

    if (moduleOptions.directives.vLazyImg) {
      addPlugin(resolve(_dirname, './runtime/plugins/v-lazy-img'))
    }

    if (moduleOptions.directives.vClickOutside) {
      addPlugin(resolve(_dirname, './runtime/plugins/v-click-outside'))
    }

    if (moduleOptions.directives.vFullscreenImg) {
      addPlugin(resolve(_dirname, './runtime/plugins/v-fullscreen-img'))
    }

    if (moduleOptions.directives.vTooltip) {
      addPlugin(resolve(_dirname, './runtime/plugins/v-tooltip'))
    }

    // Composables

    const allowedMazUiComposables = Object.keys(moduleOptions.composables).filter(composable => mazUiComposables[composable as keyof typeof mazUiComposables])

    for (const composable of allowedMazUiComposables) {
      addMazUiComposableImport({
        name: composable,
        from: `maz-ui/composables/${composable}`,
        prefix: autoImportPrefix,
      })
    }

    if (moduleOptions.composables.useTheme) {
      addImports({
        name: 'useTheme',
        from: '@maz-ui/themes',
        as: `use${capitalize(autoImportPrefix)}Theme`,
      })
    }

    if (moduleOptions.composables.useTranslations) {
      addImports({
        name: 'useTranslations',
        from: '@maz-ui/translations',
        as: `use${capitalize(autoImportPrefix)}Translations`,
      })
    }

    // Maz Icon Path
    if (moduleOptions.general.defaultMazIconPath) {
      addPlugin(resolve(_dirname, './runtime/plugins/maz-icon-path'))
    }

    // Devtools
    if (moduleOptions.general.devtools) {
      nuxt.hook('devtools:customTabs', (iframeTabs) => {
        iframeTabs.push({
          name: 'maz-ui',
          title: 'maz-ui',
          icon: 'https://maz-ui.com/img/icons/android-chrome-512x512.png',
          view: {
            type: 'iframe',
            src: 'https://maz-ui.com',
          },
        })
      })
    }
  },
})
