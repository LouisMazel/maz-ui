import type { MazUiNuxtOptions } from './types'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { addComponent, addImports, addPlugin, createResolver, defineNuxtModule } from '@nuxt/kit'
import { defu } from 'defu'
import { capitalize } from 'maz-ui'

type MazUiComposables = keyof typeof import('maz-ui/composables')

type Composables = MazUiComposables | 'useTheme' | 'useTranslations'

declare module '@nuxt/schema' {
  interface NuxtConfig {
    mazUi?: MazUiNuxtOptions
  }

  interface NuxtOptions {
    mazUi: MazUiNuxtOptions
  }

  interface PublicRuntimeConfig {
    mazUi: MazUiNuxtOptions
  }
}

type ComponentNames = keyof typeof import('maz-ui/components')

const COMPONENT_NAMES: Omit<Record<ComponentNames, true>, 'useMazDialogPromise'> = {
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
  MazDialogPromise: true,
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

const defaults: Required<MazUiNuxtOptions> = {
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
    prefix: 'maz',
    colorMode: 'auto',
  },
  translations: {
    locale: 'en',
  },
  components: {
    autoImport: true,
  },
  composables: {
    useTheme: true,
    useAos: true,
    useToast: true,
    useDialog: true,
    useWait: true,
    useIdleTimeout: true,
    useReadingTime: true,
    useTranslations: true,
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
    useInstanceUniqId: true,
    useMountComponent: true,
    useSwipe: true,
  } satisfies Record<Composables, true>,
  directives: {
    vZoomImg: false,
    vLazyImg: false,
    vClickOutside: false,
    vFullscreenImg: false,
    vTooltip: false,
  },
}

function addComposableImport({
  name,
  path,
  prefix = '',
}: {
  name: string
  path: string
  prefix?: string
}) {
  addImports({
    from: path,
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

    nuxt.options.build.transpile = ['maz-ui', '@maz-ui/themes', ...nuxt.options.build.transpile]

    const moduleOptions = defu(nuxt.options.runtimeConfig.public.mazUi, options, defaults)

    nuxt.options.runtimeConfig.public.mazUi = moduleOptions

    // CSS

    if (moduleOptions.css.injectMainCss) {
      nuxt.options.css = ['maz-ui/dist/css/main.css', ...nuxt.options.css]
    }

    // Plugins

    if (moduleOptions.theme !== false) {
      addPlugin(resolve(_dirname, './runtime/plugins/theme'))
    }

    if (moduleOptions.translations !== false) {
      addPlugin(resolve(_dirname, './runtime/plugins/translations'))
    }

    // Components

    if (moduleOptions.components.autoImport) {
      for (const name of Object.keys(COMPONENT_NAMES)) {
        addComponent({
          name,
          filePath: `maz-ui/components/${name}`,
        })
      }
    }

    // AOS

    if (moduleOptions.composables.useAos) {
      addPlugin(resolve(_dirname, './runtime/plugins/aos'))

      addComposableImport({
        name: 'useAos',
        path: resolve(_dirname, './runtime/composables/useAos'),
        prefix: moduleOptions.general?.autoImportPrefix,
      })

      const injectAosCSS
        = typeof moduleOptions.composables.useAos === 'object'
          && typeof moduleOptions.composables.useAos.injectCss === 'boolean'
          ? moduleOptions.composables.useAos.injectCss
          : true

      if (injectAosCSS) {
        nuxt.options.css = ['maz-ui/aos-styles', ...nuxt.options.css]
      }
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

    if (moduleOptions.composables.useToast) {
      addPlugin(resolve(_dirname, './runtime/plugins/toast'))
      addComposableImport({
        name: 'useToast',
        path: resolve(_dirname, './runtime/composables/useToast'),
        prefix: moduleOptions.general?.autoImportPrefix,
      })
    }

    if (moduleOptions.composables.useDialog) {
      addPlugin(resolve(_dirname, './runtime/plugins/dialog'))
      addComposableImport({
        name: 'useDialog',
        path: resolve(_dirname, './runtime/composables/useDialog'),
        prefix: moduleOptions.general?.autoImportPrefix,
      })
    }

    if (moduleOptions.composables.useWait) {
      addPlugin(resolve(_dirname, './runtime/plugins/wait'))
      addComposableImport({
        name: 'useWait',
        path: resolve(_dirname, './runtime/composables/useWait'),
        prefix: moduleOptions.general?.autoImportPrefix,
      })
    }

    if (moduleOptions.composables.useIdleTimeout) {
      addComposableImport({
        name: 'useIdleTimeout',
        path: 'maz-ui/composables/useIdleTimeout',
        prefix: moduleOptions.general?.autoImportPrefix,
      })
    }

    if (moduleOptions.composables.useReadingTime) {
      addComposableImport({
        name: 'useReadingTime',
        path: 'maz-ui/composables/useReadingTime',
        prefix: moduleOptions.general?.autoImportPrefix,
      })
    }

    if (moduleOptions.composables.useWindowSize) {
      addComposableImport({
        name: 'useWindowSize',
        path: 'maz-ui/composables/useWindowSize',
        prefix: moduleOptions.general?.autoImportPrefix,
      })
    }

    if (moduleOptions.composables.useBreakpoints) {
      addImports({
        from: 'maz-ui/composables/useBreakpoints',
        name: 'useBreakpoints',
        as: 'useBreakpoints',
      })
    }

    if (moduleOptions.composables.useUserVisibility) {
      addComposableImport({
        name: 'useUserVisibility',
        path: 'maz-ui/composables/useUserVisibility',
        prefix: moduleOptions.general?.autoImportPrefix,
      })
    }

    if (moduleOptions.composables.useStringMatching) {
      addComposableImport({
        name: 'useStringMatching',
        path: 'maz-ui/composables/useStringMatching',
        prefix: moduleOptions.general?.autoImportPrefix,
      })
    }

    if (moduleOptions.composables.useTimer) {
      addComposableImport({
        name: 'useTimer',
        path: 'maz-ui/composables/useTimer',
        prefix: moduleOptions.general?.autoImportPrefix,
      })
    }

    if (moduleOptions.composables.useFreezeValue) {
      addComposableImport({
        name: 'useFreezeValue',
        path: 'maz-ui/composables/useFreezeValue',
        prefix: moduleOptions.general?.autoImportPrefix,
      })
    }

    if (moduleOptions.composables.useInjectStrict) {
      addComposableImport({
        name: 'useInjectStrict',
        path: 'maz-ui/composables/useInjectStrict',
        prefix: moduleOptions.general?.autoImportPrefix,
      })
    }

    if (moduleOptions.composables.useInstanceUniqId) {
      addComposableImport({
        name: 'useInstanceUniqId',
        path: 'maz-ui/composables/useInstanceUniqId',
        prefix: moduleOptions.general?.autoImportPrefix,
      })
    }

    if (moduleOptions.composables.useMountComponent) {
      addComposableImport({
        name: 'useMountComponent',
        path: 'maz-ui/composables/useMountComponent',
        prefix: moduleOptions.general?.autoImportPrefix,
      })
    }

    if (moduleOptions.composables.useSwipe) {
      addComposableImport({
        name: 'useSwipe',
        path: 'maz-ui/composables/useSwipe',
        prefix: moduleOptions.general?.autoImportPrefix,
      })
    }

    if (moduleOptions.composables.useFormValidator) {
      addComposableImport({
        name: 'useFormValidator',
        path: 'maz-ui/composables/useFormValidator',
        prefix: moduleOptions.general?.autoImportPrefix,
      })
    }

    if (moduleOptions.composables.useFormField) {
      addComposableImport({
        name: 'useFormField',
        path: 'maz-ui/composables/useFormField',
        prefix: moduleOptions.general?.autoImportPrefix,
      })
    }

    if (moduleOptions.composables.useDisplayNames) {
      addComposableImport({
        name: 'useDisplayNames',
        path: 'maz-ui/composables/useDisplayNames',
        prefix: moduleOptions.general?.autoImportPrefix,
      })
    }

    if (moduleOptions.composables.useTheme && moduleOptions.theme !== false) {
      addComposableImport({
        name: 'useTheme',
        path: '@maz-ui/themes/composables/useTheme',
        prefix: moduleOptions.general?.autoImportPrefix,
      })
    }

    if (moduleOptions.composables.useTranslations) {
      addComposableImport({
        name: 'useTranslations',
        path: '@maz-ui/translations',
        prefix: moduleOptions.general?.autoImportPrefix,
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
