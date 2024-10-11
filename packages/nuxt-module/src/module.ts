import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineNuxtModule, addPlugin, createResolver, addImports, addComponent } from '@nuxt/kit'
import { defu } from 'defu'

import type {
  AosOptions,
  ToasterOptions,
  ThemeHandlerOptions,
  vLazyImgOptions,
  vTooltipOptions,
  DialogOptions,
} from 'maz-ui'
import { getComponentList } from './../../lib/build/get-component-list'

export interface MazUiNuxtOptions {
  /**
   * Enable auto-import of main css file
   * @default true
   */
  injectCss?: boolean
  /**
   * Install aos plugin and enable auto-import of useAos composable
   * @default true
   */
  injectAos?:
    | boolean
    | (Omit<AosOptions, 'router'> & {
      /**
       * Auto inject aos CSS file
       * @default true
       */
      injectCss?: boolean
      /**
       * Set `true` to re-run animations on page change
       * @default false
       */
      router?: boolean
    })
  /**
   * Install toaster plugin and enable auto-import of useToast composable
   * @default true
   */
  injectUseToast?: boolean | ToasterOptions
  /**
   * Install dialog plugin and enable auto-import of useToast composable
   * @default true
   */
  injectUseDialog?: boolean | DialogOptions
  /**
   * Install wait plugin and enable auto-import of useWait composable
   * @default true
   */
  injectUseWait?: boolean
  /**
   * Enable auto-import of useSwipe composable
   * @default true
   */
  injectUseSwiper?: boolean
  /**
   * Enable auto-import of useThemeHandler composable
   * @default true
   */
  injectUseThemeHandler?: boolean | ThemeHandlerOptions
  /**
   * Enable auto-import of useIdleTimeout composable
   * @default true
   */
  injectUseIdleTimeout?: boolean
  /**
   * Enable auto-import of useUserVisibility composable
   * @default true
   */
  injectUseUserVisibility?: boolean
  /**
   * Enable auto-import of useTimer composable
   * @default true
   */
  injectUseTimer?: boolean
  /**
   * Enable auto-import of useWindowSize composable
   * @default true
   */
  injectUseWindowSize?: boolean
  /**
   * Enable auto-import of useBreakpoints composable
   * @default true
   */
  injectUseBreakpoints?: boolean
  /**
   * Enable auto-import of useReadingTime composable
   * @default true
   */
  injectUseReadingTime?: boolean
  /**
   * Enable auto-import of useStringMatching composable
   * @default true
   */
  injectUseStringMatching?: boolean
  /**
   * Enable auto-import of useFormValidator and useFormField composables
   * @default true
   */
  injectUseFormValidator?: boolean
  /**
   * Globally install of v-zoom-img directive
   * @default true
   */
  installVZoomImg?: boolean
  /**
   * Globally install of v-click-outside directive
   * @default true
   */
  installVClickOutside?: boolean
  /**
   * Globally install of v-fullscreen-img directive
   * @default true
   */
  installVFullscreenImg?: boolean
  /**
   * Globally install of v-lazy-img directive
   * @default true
   */
  installVLazyImg?: boolean | vLazyImgOptions
  /**
   * Globally install of v-tooltip directive
   * @default true
   */
  installVTooltip?: boolean | vTooltipOptions
  /**
   * Enable auto-import of all components
   * @default true
   */
  injectComponents?: boolean
  /**
   * Default path to public svg icons folder for `<MazIcon />` component
   * @default ''
   */
  defaultMazIconPath?: string
  /**
   * Enable Nuxt Devtools integration
   * @default true
   */
  devtools?: boolean
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

const _dirname = dirname(fileURLToPath(import.meta.url))

const defaults: Required<MazUiNuxtOptions> = {
  defaultMazIconPath: '',
  devtools: true,
  injectAos: true,
  injectComponents: true,
  injectCss: true,
  injectUseDialog: true,
  injectUseIdleTimeout: true,
  injectUseReadingTime: true,
  injectUseWindowSize: true,
  injectUseBreakpoints: true,
  injectUseUserVisibility: true,
  injectUseStringMatching: true,
  injectUseTimer: true,
  injectUseThemeHandler: true,
  injectUseToast: true,
  injectUseWait: true,
  injectUseSwiper: true,
  installVClickOutside: true,
  installVFullscreenImg: true,
  installVLazyImg: true,
  installVTooltip: true,
  installVZoomImg: true,
  injectUseFormValidator: true,
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

    nuxt.options.build.transpile = ['maz-ui', ...nuxt.options.build.transpile]

    const moduleOptions = defu(nuxt.options.runtimeConfig.public.mazUi, options)

    nuxt.options.runtimeConfig.public.mazUi = moduleOptions

    if (moduleOptions.injectCss) {
      const path
        = process.env.MAZ_UI_DEV === 'true' ? 'maz-ui/css/index.css' : 'maz-ui/css/main.css'
      nuxt.options.css = [path, ...nuxt.options.css]
    }

    if (moduleOptions.injectComponents) {
      const componentList = await getComponentList()

      for (const { name } of componentList) {
        addComponent({
          name,
          filePath:
            process.env.MAZ_UI_DEV === 'true'
              ? `maz-ui/components/${name}.vue`
              : `maz-ui/components/${name}.mjs`,
        })
      }

      addImports({
        from: 'maz-ui',
        name: 'useMazDialogPromise',
        as: 'useMazDialogPromise',
      })
    }

    if (moduleOptions.injectAos) {
      addPlugin(resolve(_dirname, './runtime/plugins/aos'))

      addImports({
        from: resolve(_dirname, './runtime/composables/useAos'),
        name: 'useAos',
        as: 'useAos',
      })

      const injectAosCSS
        = typeof moduleOptions.injectAos === 'object'
        && typeof moduleOptions.injectAos.injectCss === 'boolean'
          ? moduleOptions.injectAos.injectCss
          : true

      if (
        typeof moduleOptions.injectAos === 'object'
        && injectAosCSS
        && process.env.MAZ_UI_DEV === 'true'
      ) {
        nuxt.options.css = ['maz-ui/dist/css/aos.css', ...nuxt.options.css]
      }
      else if (typeof moduleOptions.injectAos === 'object' && injectAosCSS) {
        nuxt.options.css = ['maz-ui/css/aos.css', ...nuxt.options.css]
      }
    }

    if (moduleOptions.injectUseToast) {
      addPlugin(resolve(_dirname, './runtime/plugins/toaster'))

      addImports({
        from: resolve(_dirname, './runtime/composables/useToast'),
        name: 'useToast',
        as: 'useToast',
      })
    }

    if (moduleOptions.injectUseDialog) {
      addPlugin(resolve(_dirname, './runtime/plugins/dialog'))

      addImports({
        from: resolve(_dirname, './runtime/composables/useDialog'),
        name: 'useDialog',
        as: 'useDialog',
      })
    }

    if (moduleOptions.injectUseWait) {
      addPlugin(resolve(_dirname, './runtime/plugins/wait'))

      addImports({
        from: resolve(_dirname, './runtime/composables/useWait'),
        name: 'useWait',
        as: 'useWait',
      })
    }

    if (moduleOptions.installVZoomImg) {
      addPlugin(resolve(_dirname, './runtime/plugins/v-zoom-img'))
    }

    if (moduleOptions.installVLazyImg) {
      addPlugin(resolve(_dirname, './runtime/plugins/v-lazy-img'))
    }

    if (moduleOptions.installVClickOutside) {
      addPlugin(resolve(_dirname, './runtime/plugins/v-click-outside'))
    }

    if (moduleOptions.installVFullscreenImg) {
      addPlugin(resolve(_dirname, './runtime/plugins/v-fullscreen-img'))
    }

    if (moduleOptions.installVTooltip) {
      addPlugin(resolve(_dirname, './runtime/plugins/v-tooltip'))
    }

    if (moduleOptions.injectUseThemeHandler) {
      addImports({
        from: resolve(_dirname, './runtime/composables/useThemeHandler'),
        name: 'useThemeHandler',
        as: 'useThemeHandler',
      })
    }

    if (moduleOptions.injectUseIdleTimeout) {
      addImports({
        from: 'maz-ui',
        name: 'useIdleTimeout',
        as: 'useIdleTimeout',
      })
    }

    if (moduleOptions.injectUseReadingTime) {
      addImports({
        from: 'maz-ui',
        name: 'useReadingTime',
        as: 'useReadingTime',
      })
    }

    if (moduleOptions.injectUseWindowSize) {
      addImports({
        from: 'maz-ui',
        name: 'useWindowSize',
        as: 'useWindowSize',
      })
    }

    if (moduleOptions.injectUseBreakpoints) {
      addImports({
        from: 'maz-ui',
        name: 'useBreakpoints',
        as: 'useBreakpoints',
      })
    }

    if (moduleOptions.injectUseUserVisibility) {
      addImports({
        from: 'maz-ui',
        name: 'useUserVisibility',
        as: 'useUserVisibility',
      })
    }

    if (moduleOptions.injectUseUserVisibility) {
      addImports({
        from: 'maz-ui',
        name: 'useUserVisibility',
        as: 'useUserVisibility',
      })
    }

    if (moduleOptions.injectUseStringMatching) {
      addImports({
        from: 'maz-ui',
        name: 'useStringMatching',
        as: 'useStringMatching',
      })
    }

    if (moduleOptions.injectUseTimer) {
      addImports({
        from: 'maz-ui',
        name: 'useTimer',
        as: 'useTimer',
      })
    }

    if (moduleOptions.injectUseFormValidator) {
      addImports({
        from: 'maz-ui',
        name: 'useFormValidator',
        as: 'useFormValidator',
      })
      addImports({
        from: 'maz-ui',
        name: 'useFormField',
        as: 'useFormField',
      })
    }

    // if (moduleOptions.injectUseCurrency) {
    //   addImports({
    //     from: 'maz-ui',
    //     name: 'useCurrency',
    //     as: 'useCurrency',
    //   })
    // }

    if (moduleOptions.defaultMazIconPath) {
      addPlugin(resolve(_dirname, './runtime/plugins/maz-icon-path'))
    }

    if (options.devtools) {
      nuxt.hook('devtools:customTabs', (iframeTabs) => {
        iframeTabs.push({
          // unique identifier
          name: 'maz-ui',
          // title to display in the tab
          title: 'maz-ui',
          // any icon from Iconify, or a URL to an image
          icon: 'https://maz-ui.com/img/icons/android-chrome-512x512.png',
          // iframe view
          view: {
            type: 'iframe',
            src: 'https://maz-ui.com',
          },
        })
      })
    }
  },
})
