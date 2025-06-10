import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { addComponent, addImports, addPlugin, createResolver, defineNuxtModule } from '@nuxt/kit'
import { defu } from 'defu'
import { capitalize } from './../../lib/src/formatters/capitalize.js'
import type { MazUiNuxtOptions } from './types'

type MazUiComposables = keyof typeof import('maz-ui/src/composables/index.js')
type ThemeComposables = keyof typeof import('@maz-ui/themes/src/composables/useTheme.js')

type Composables = MazUiComposables | ThemeComposables

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

type ComponentNames = keyof typeof import('maz-ui/src/components/index.js')

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
  MazPicker: true,
  MazPullToRefresh: true,
  MazRadio: true,
  MazRadioButtons: true,
  MazReadingProgressBar: true,
  MazSelect: true,
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
    strategy: 'hybrid',
    darkModeStrategy: 'class',
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
    useWindowSize: true,
    useBreakpoints: true,
    useUserVisibility: true,
    useStringMatching: true,
    useTimer: true,
    useFormValidator: true,
    useLanguageDisplayNames: true,
    useFreezeValue: true,
    useInjectStrict: true,
    useInstanceUniqId: true,
    useMountComponent: true,
    useSwipe: true,
  } satisfies Record<Exclude<Composables, 'useFormField' | '_initThemeState'>, boolean>,
  directives: {
    vZoomImg: true,
    vLazyImg: true,
    vClickOutside: true,
    vFullscreenImg: true,
    vTooltip: true,
  },
}

function addMazImport({
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
  async setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url)

    nuxt.options.build.transpile = ['maz-ui', '@maz-ui/themes', ...nuxt.options.build.transpile]

    const moduleOptions = defu(nuxt.options.runtimeConfig.public.mazUi, options, defaults)

    nuxt.options.runtimeConfig.public.mazUi = moduleOptions

    // CSS
    if (moduleOptions.css.injectMainCss) {
      nuxt.options.css = ['maz-ui/dist/css/main.css', ...nuxt.options.css]
    }

    if (moduleOptions.theme !== false) {
      addPlugin(resolve(_dirname, './runtime/plugins/theme'))
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

    // Composables - AOS
    if (moduleOptions.composables.useAos) {
      addPlugin(resolve(_dirname, './runtime/plugins/aos'))

      addMazImport({
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
        const aosCssPath
          = process.env.MAZ_UI_DEV === 'true'
            ? 'maz-ui/src/plugins/aos/scss/index.scss'
            : 'maz-ui/aos-styles'
        nuxt.options.css = [aosCssPath, ...nuxt.options.css]
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

    // Composables - Toast
    if (moduleOptions.composables.useToast) {
      addPlugin(resolve(_dirname, './runtime/plugins/toaster'))
      addMazImport({
        name: 'useToast',
        path: resolve(_dirname, './runtime/composables/useToast'),
        prefix: moduleOptions.general?.autoImportPrefix,
      })
    }

    // Composables - Dialog
    if (moduleOptions.composables.useDialog) {
      addPlugin(resolve(_dirname, './runtime/plugins/dialog'))
      addMazImport({
        name: 'useDialog',
        path: resolve(_dirname, './runtime/composables/useDialog'),
        prefix: moduleOptions.general?.autoImportPrefix,
      })
    }

    // Composables - Wait
    if (moduleOptions.composables.useWait) {
      addPlugin(resolve(_dirname, './runtime/plugins/wait'))
      addMazImport({
        name: 'useWait',
        path: resolve(_dirname, './runtime/composables/useWait'),
        prefix: moduleOptions.general?.autoImportPrefix,
      })
    }

    // Autres composables
    if (moduleOptions.composables.useIdleTimeout) {
      addMazImport({
        name: 'useIdleTimeout',
        path: 'maz-ui/composables/useIdleTimeout',
        prefix: moduleOptions.general?.autoImportPrefix,
      })
    }

    if (moduleOptions.composables.useReadingTime) {
      addMazImport({
        name: 'useReadingTime',
        path: 'maz-ui/composables/useReadingTime',
        prefix: moduleOptions.general?.autoImportPrefix,
      })
    }

    if (moduleOptions.composables.useWindowSize) {
      addMazImport({
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
      addMazImport({
        name: 'useUserVisibility',
        path: 'maz-ui/composables/useUserVisibility',
        prefix: moduleOptions.general?.autoImportPrefix,
      })
    }

    if (moduleOptions.composables.useStringMatching) {
      addMazImport({
        name: 'useStringMatching',
        path: 'maz-ui/composables/useStringMatching',
        prefix: moduleOptions.general?.autoImportPrefix,
      })
    }

    if (moduleOptions.composables.useTimer) {
      addMazImport({
        name: 'useTimer',
        path: 'maz-ui/composables/useTimer',
        prefix: moduleOptions.general?.autoImportPrefix,
      })
    }

    if (moduleOptions.composables.useFormValidator) {
      addMazImport({
        name: 'useFormValidator',
        path: 'maz-ui/composables/useFormValidator',
        prefix: moduleOptions.general?.autoImportPrefix,
      })
      addMazImport({
        name: 'useFormField',
        path: 'maz-ui/composables/useFormField',
        prefix: moduleOptions.general?.autoImportPrefix,
      })
    }

    if (moduleOptions.composables.useLanguageDisplayNames) {
      addMazImport({
        name: 'useLanguageDisplayNames',
        path: 'maz-ui/composables/useLanguageDisplayNames',
        prefix: moduleOptions.general?.autoImportPrefix,
      })
    }

    if (moduleOptions.composables.useTheme) {
      addMazImport({
        name: 'useTheme',
        path: '@maz-ui/themes/src/composables/useTheme.js',
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
