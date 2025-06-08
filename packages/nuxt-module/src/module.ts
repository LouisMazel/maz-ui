import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { addComponent, addImports, addPlugin, createResolver, defineNuxtModule } from '@nuxt/kit'
import { defu } from 'defu'

import type { vLazyImgOptions, vTooltipOptions, vFullscreenImgOptions } from 'maz-ui/src/directives'
import type { AosOptions, DialogOptions, ToasterOptions } from 'maz-ui/src/plugins'
import type { BaseThemePreset, ThemePreset, Strategy, DarkMode } from '@maz-ui/themes'
import { mazUi } from '@maz-ui/themes/presets/mazUi'

export interface MazUiNuxtOptions {
  /**
   * General configuration
   */
  general?: {
    /**
     * Prefix for auto-imported composables
     * @description This prefix will be added after the `use` keyword
     * @example `autoImportPrefix: 'Maz'` will generate `useMazToast` instead of `useToast`
     * @default ''
     */
    autoImportPrefix?: string

    /**
     * Default path to public SVG icons folder for `<MazIcon />` component
     * @description Relative path from the public directory
     * @example '/icons' to access icons in `public/icons/`
     * @default ''
     */
    defaultMazIconPath?: string

    /**
     * Enable Nuxt DevTools integration
     * @description Adds a Maz-UI tab in Nuxt development tools
     * @default true
     */
    devtools?: boolean
  }

  /**
   * CSS and styles configuration
   */
  css?: {
    /**
     * Auto-import Maz-UI main CSS file
     * @description Automatically injects Maz-UI base styles
     * @default true
     */
    injectMainCss?: boolean
  }

  /**
   * Theme system configuration
   * @description If false, the theme system will be completely disabled
   * @default {
   *   preset: 'mazUi',
   *   strategy: 'hybrid',
   *   darkMode: 'class',
   * }
   */
  theme?:
    | false
    | {
      /**
       * Theme preset to use
       * @description Can be a predefined preset name or a custom preset object
       * @default 'mazUi'
       */
      preset?: BaseThemePreset

      /**
       * Custom preset overrides
       * @description Allows customizing specific parts of the preset without redefining it entirely
       * @default undefined
       */
      overrides?: Partial<ThemePreset>

      /**
       * CSS generation strategy
       * @description
       * - `runtime`: CSS generated and injected dynamically on client-side
       * - `buildtime`: CSS generated at build time and included in bundle
       * - `hybrid`: Critical CSS injected inline, full CSS loaded asynchronously (recommended)
       * @default 'hybrid'
       */
      strategy?: Strategy

      /**
       * Dark mode handling
       * @description
       * - `class`: Dark mode activated with `.dark` class
       * - `media`: Dark mode based on `prefers-color-scheme`
       * - `auto`: Automatic detection of system preferences
       * @default 'class'
       */
      darkMode?: DarkMode
    }

  /**
   * Components configuration
   */
  components?: {
    /**
     * Auto-import all Maz-UI components
     * @description Makes all Maz-UI components available globally without explicit imports
     * @default true
     */
    autoImport?: boolean
  }

  /**
   * Composables configuration
   */
  composables?: {
    /**
     * Enable auto-import of useTheme composable
     * @description Provides theme management functionality (toggle dark mode, change themes, etc.)
     * @default true
     */
    useTheme?: boolean

    /**
     * Enable auto-import of useAos composable and install AOS plugin
     * @description Animation On Scroll functionality with advanced configuration options
     * @default true
     */
    useAos?:
      | boolean
      | (Omit<AosOptions, 'router'> & {
        /**
         * Auto inject AOS CSS file
         * @default true
         */
        injectCss?: boolean
        /**
         * Re-run animations on page change (for SPA navigation)
         * @default false
         */
        router?: boolean
      })

    /**
     * Enable auto-import of useToast composable and install Toaster plugin
     * @description Toast notifications functionality
     * @default true
     */
    useToast?: boolean | ToasterOptions

    /**
     * Enable auto-import of useDialog composable and install Dialog plugin
     * @description Modal dialogs functionality
     * @default true
     */
    useDialog?: boolean | DialogOptions

    /**
     * Enable auto-import of useWait composable and install Wait plugin
     * @description Loading state management functionality
     * @default true
     */
    useWait?: boolean

    /**
     * Enable auto-import of useIdleTimeout composable
     * @description Detect user idle state and execute callbacks
     * @default true
     */
    useIdleTimeout?: boolean

    /**
     * Enable auto-import of useReadingTime composable
     * @description Calculate estimated reading time for text content
     * @default true
     */
    useReadingTime?: boolean

    /**
     * Enable auto-import of useWindowSize composable
     * @description Reactive window dimensions tracking
     * @default true
     */
    useWindowSize?: boolean

    /**
     * Enable auto-import of useBreakpoints composable
     * @description Responsive breakpoints detection and utilities
     * @default true
     */
    useBreakpoints?: boolean

    /**
     * Enable auto-import of useUserVisibility composable
     * @description Detect when user is viewing the page (Page Visibility API)
     * @default true
     */
    useUserVisibility?: boolean

    /**
     * Enable auto-import of useStringMatching composable
     * @description String matching and filtering utilities
     * @default true
     */
    useStringMatching?: boolean

    /**
     * Enable auto-import of useTimer composable
     * @description Timer and countdown functionality
     * @default true
     */
    useTimer?: boolean

    /**
     * Enable auto-import of useFormValidator and useFormField composables
     * @description Form validation utilities and field management
     * @default true
     */
    useFormValidator?: boolean

    /**
     * Enable auto-import of useLanguageDisplayNames composable
     * @description Get localized language display names
     * @default true
     */
    useLanguageDisplayNames?: boolean

    /**
     * Enable auto-import of useSwiper composable
     * @description Swiper/carousel functionality utilities
     * @default true
     */
    useSwiper?: boolean
  }

  /**
   * Vue directives configuration
   */
  directives?: {
    /**
     * Install v-zoom-img directive globally
     * @description Enables image zoom functionality on click
     * @default true
     */
    vZoomImg?: boolean

    /**
     * Install v-lazy-img directive globally
     * @description Lazy loading for images with intersection observer
     * @default true
     */
    vLazyImg?: boolean | vLazyImgOptions

    /**
     * Install v-click-outside directive globally
     * @description Detect clicks outside of an element
     * @default true
     */
    vClickOutside?: boolean

    /**
     * Install v-fullscreen-img directive globally
     * @description Fullscreen image viewer functionality
     * @default true
     */
    vFullscreenImg?: boolean | vFullscreenImgOptions

    /**
     * Install v-tooltip directive globally
     * @description Tooltip functionality for any element
     * @default true
     */
    vTooltip?: boolean | vTooltipOptions
  }
}

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
    preset: mazUi,
    strategy: 'hybrid',
    darkMode: 'class',
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
    useSwiper: true,
  },
  directives: {
    vZoomImg: true,
    vLazyImg: true,
    vClickOutside: true,
    vFullscreenImg: true,
    vTooltip: true,
  },
}

function addMazImport(name: string, path: string, prefix: string) {
  addImports({
    from: path,
    name,
    as: `use${prefix}${name.replace('use', '')}`,
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

    if (moduleOptions.composables.useTheme) {
      addImports({
        from: '@maz-ui/themes',
        name: 'useTheme',
        as: `use${moduleOptions.general?.autoImportPrefix || ''}Theme`,
      })
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

      addMazImport(
        'useAos',
        resolve(_dirname, './runtime/composables/useAos'),
        moduleOptions.general?.autoImportPrefix || '',
      )

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
      addMazImport(
        'useToast',
        resolve(_dirname, './runtime/composables/useToast'),
        moduleOptions.general?.autoImportPrefix || '',
      )
    }

    // Composables - Dialog
    if (moduleOptions.composables.useDialog) {
      addPlugin(resolve(_dirname, './runtime/plugins/dialog'))
      addMazImport(
        'useDialog',
        resolve(_dirname, './runtime/composables/useDialog'),
        moduleOptions.general?.autoImportPrefix || '',
      )
    }

    // Composables - Wait
    if (moduleOptions.composables.useWait) {
      addPlugin(resolve(_dirname, './runtime/plugins/wait'))
      addMazImport(
        'useWait',
        resolve(_dirname, './runtime/composables/useWait'),
        moduleOptions.general?.autoImportPrefix || '',
      )
    }

    // Autres composables
    if (moduleOptions.composables.useIdleTimeout) {
      addMazImport(
        'useIdleTimeout',
        'maz-ui/composables/useIdleTimeout',
        moduleOptions.general?.autoImportPrefix || '',
      )
    }

    if (moduleOptions.composables.useReadingTime) {
      addMazImport(
        'useReadingTime',
        'maz-ui/composables/useReadingTime',
        moduleOptions.general?.autoImportPrefix || '',
      )
    }

    if (moduleOptions.composables.useWindowSize) {
      addMazImport(
        'useWindowSize',
        'maz-ui/composables/useWindowSize',
        moduleOptions.general?.autoImportPrefix || '',
      )
    }

    if (moduleOptions.composables.useBreakpoints) {
      addImports({
        from: 'maz-ui/composables/useBreakpoints',
        name: 'useBreakpoints',
        as: 'useBreakpoints',
      })
    }

    if (moduleOptions.composables.useUserVisibility) {
      addMazImport(
        'useUserVisibility',
        'maz-ui/composables/useUserVisibility',
        moduleOptions.general?.autoImportPrefix || '',
      )
    }

    if (moduleOptions.composables.useStringMatching) {
      addMazImport(
        'useStringMatching',
        'maz-ui/composables/useStringMatching',
        moduleOptions.general?.autoImportPrefix || '',
      )
    }

    if (moduleOptions.composables.useTimer) {
      addMazImport(
        'useTimer',
        'maz-ui/composables/useTimer',
        moduleOptions.general?.autoImportPrefix || '',
      )
    }

    if (moduleOptions.composables.useFormValidator) {
      addMazImport(
        'useFormValidator',
        'maz-ui/composables/useFormValidator',
        moduleOptions.general?.autoImportPrefix || '',
      )
      addMazImport(
        'useFormField',
        'maz-ui/composables/useFormField',
        moduleOptions.general?.autoImportPrefix || '',
      )
    }

    if (moduleOptions.composables.useLanguageDisplayNames) {
      addMazImport(
        'useLanguageDisplayNames',
        'maz-ui/composables/useLanguageDisplayNames',
        moduleOptions.general?.autoImportPrefix || '',
      )
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
