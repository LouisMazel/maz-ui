import { defineNuxtModule, addPlugin, createResolver, addImports, addComponent } from '@nuxt/kit'
import { defu } from 'defu'
import { componentList } from '../components/component-list'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

export interface MazUiNuxtOptions {
  /**
   * Install the toaster plugin and enable auto import of toaster composable
   */
  injectToaster?: boolean
  /**
   * Enable auto import of useCurrency composable
   */
  injectUseCurrency?: boolean
  /**
   * Enable auto import of useTheme composable
   */
  injectUseThemeHandler?: boolean
  /**
   * install global of v-fullscreen-img directive
   */
  installFullscreenImgDirective?: boolean
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
    injectComponents: true,
  },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)

    const moduleOptions = defu(nuxt.options.runtimeConfig.public.mazUi, options)

    nuxt.options.runtimeConfig.public.mazUi = moduleOptions

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
      addPlugin(resolver.resolve(_dirname, './runtime/plugins/toaster'))

      addImports({
        from: resolver.resolve(_dirname, './runtime/composables/use-toast'),
        name: 'useToast',
        as: 'useToast',
      })
    }

    if (moduleOptions.injectUseCurrency) {
      addImports({
        from: 'maz-ui',
        name: 'useCurrency',
        as: 'useCurrency',
      })
    }

    if (moduleOptions.injectUseThemeHandler) {
      addImports({
        from: 'maz-ui',
        name: 'useThemeHandler',
        as: 'useThemeHandler',
      })
    }

    if (moduleOptions.installFullscreenImgDirective) {
      addPlugin(resolver.resolve(_dirname, './runtime/plugins/v-fullscreen-img'))
    }

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
