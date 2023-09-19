import { defineNuxtModule, addPlugin, createResolver, addImports, addComponent } from '@nuxt/kit'
import { defu } from 'defu'
import { componentList } from '../components/component-list'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

export interface MazUiNuxtOptions {
  /**
   * Enable auto import of main css file
   * @default true
   */
  injectCss?: boolean
  /**
   * Enable auto import of main css file
   * @default false
   */
  injectAosCss?: boolean
  /**
   * Install the toaster plugin and enable auto import of toaster composable
   * @default false
   */
  injectToaster?: boolean
  // /**
  //  * Enable auto import of useCurrency composable
  //  * @default false
  //  */
  // injectUseCurrency?: boolean
  /**
   * Enable auto import of useTheme composable
   * @default false
   */
  injectUseThemeHandler?: boolean
  // /**
  //  * install global of v-fullscreen-img directive
  //  * @default false
  //  */
  // installFullscreenImgDirective?: boolean
  /**
   * Enable auto import of all components
   * @default true
   */
  injectComponents?: boolean
  /**
   * Enable Nuxt Devtools integration
   * @default true
   */
  devtools?: boolean
}

declare module '@nuxt/schema' {
  interface PublicRuntimeConfig {
    mazUi?: MazUiNuxtOptions
  }
  interface NuxtConfig {
    mazUi?: MazUiNuxtOptions
  }
  interface NuxtOptions {
    mazUi?: MazUiNuxtOptions
  }
}

const _dirname = dirname(fileURLToPath(import.meta.url))

export default defineNuxtModule<MazUiNuxtOptions>({
  meta: {
    name: 'maz-ui/nuxt',
    configKey: 'mazUi',
    compatibility: {
      nuxt: '^3.0.0',
    },
  },
  defaults: {
    devtools: true,
    injectCss: true,
    injectComponents: true,
  },
  // eslint-disable-next-line sonarjs/cognitive-complexity
  setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url)

    const moduleOptions = defu(nuxt.options.runtimeConfig.public.mazUi, options)

    nuxt.options.runtimeConfig.public.mazUi = moduleOptions

    if (moduleOptions.injectCss) {
      const path = process.env.MAZ_UI_DEV === 'true' ? './../css/index.css' : './../css/main.css'
      nuxt.options.css = [resolve(path), ...nuxt.options.css]
    }

    if (moduleOptions.injectAosCss && process.env.MAZ_UI_DEV === 'true') {
      // the library should be built
      nuxt.options.css = [resolve('./../dist/css/aos.css'), ...nuxt.options.css]
    } else if (moduleOptions.injectAosCss) {
      nuxt.options.css = [resolve('./../css/aos.css'), ...nuxt.options.css]
    }

    if (moduleOptions.injectComponents) {
      for (const componentName of componentList) {
        addComponent({
          name: componentName,
          filePath:
            process.env.MAZ_UI_DEV === 'true'
              ? `maz-ui/components/${componentName}.vue`
              : `maz-ui/components/${componentName}`,
        })
      }
    }

    if (moduleOptions.injectToaster) {
      addPlugin(resolve(_dirname, './runtime/plugins/toaster'))

      addImports({
        from: resolve(_dirname, './runtime/composables/use-toast'),
        name: 'useToast',
        as: 'useToast',
      })
    }

    // if (moduleOptions.injectUseCurrency) {
    //   addImports({
    //     from: 'maz-ui',
    //     name: 'useCurrency',
    //     as: 'useCurrency',
    //   })
    // }

    if (moduleOptions.injectUseThemeHandler) {
      addImports({
        from: 'maz-ui',
        name: 'useThemeHandler',
        as: 'useThemeHandler',
      })
    }

    // if (moduleOptions.installFullscreenImgDirective) {
    //   addPlugin(resolve(_dirname, './runtime/plugins/v-fullscreen-img'))
    // }

    if (options.devtools) {
      // @ts-expect-error - private API
      nuxt.hook('devtools:customTabs', (iframeTabs) => {
        iframeTabs.push({
          // unique identifier
          name: 'maz-ui',
          // title to display in the tab
          title: 'maz-ui',
          // any icon from Iconify, or a URL to an image
          icon: 'https://louismazel.github.io/maz-ui-3/img/icons/android-chrome-512x512.png',
          // iframe view
          view: {
            type: 'iframe',
            src: 'https://louismazel.github.io/maz-ui-3',
          },
        })
      })
    }
  },
})
