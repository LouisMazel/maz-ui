import type { Plugin } from 'vue'

import type { VLazyImgOptions, VTooltipOptions } from '../directives'
import type { AosOptions, DialogOptions, ToastOptions } from './index'

import { MazUiTheme, type MazUiThemeOptions } from '@maz-ui/themes/src/plugin.js'
import { MazTranslations, type MazTranslationsOptions } from '@maz-ui/translations/src/index.js'

export interface MazUiOptions {
  /**
   * The theme configurations
   * Can not be disabled
   */
  theme?: MazUiThemeOptions
  /**
   * The translations configurations
   * Can not be disabled
   */
  translations?: MazTranslationsOptions

  plugins?: {
    /**
     * If true or options are provided, the dialog plugin will be installed
     * The dialog plugin configurations are available in the [dialog plugin documentation](./dialog.md)
     */
    dialog?: boolean | DialogOptions

    /**
     * If true or options are provided, the toast plugin will be installed
     * The toast plugin configurations
     */
    toast?: boolean | ToastOptions

    /**
     * If true, the wait plugin will be installed
     * No global options are available for this plugin
     */
    wait?: boolean

    /**
     * If true or options are provided, the aos plugin will be installed
     * The aos plugin configurations
     */
    aos?: boolean | AosOptions
  }

  directives?: {
    /**
     * If true, the tooltip directive will be installed globally
     */
    vTooltip?: boolean | VTooltipOptions
    /**
     * If true, the lazy-img directive will be installed globally
     */
    vLazyImg?: boolean | VLazyImgOptions
    /**
     * If true, the click-outside directive will be installed globally
     */
    vClickOutside?: boolean
    /**
     * If true, the fullscreen-img directive will be installed globally
     */
    vFullscreenImg?: boolean
    /**
     * If true, the scroll-lock directive will be installed globally
     * No global options are available for this plugin
     */
    vZoomImg?: boolean
  }
}

/**
 * @example
 * ```ts
 * import { MazUi } from 'maz-ui/plugins/maz-ui'
 * import { mazUi as mazUiPreset } from '@maz-ui/themes/presets/mazUi'
 * import 'maz-ui/styles'
 *
 * app.use(MazUi, {
 *   theme: {
 *     preset: mazUiPreset,
 *     strategy: 'hybrid',
 *     darkMode: 'class',
 *   },
 *   translations: {
 *     locale: 'en',
 *     translations: {
 *       en: {
 *         ...
 *       },
 *       fr: {
 *         ...
 *       },
 *     },
 *   },
 *   plugins: {
 *     dialog: true,
 *     toast: true,
 *     wait: true,
 *     aos: true,
 *   },
 *   directives: {
 *     vTooltip: true,
 *     vLazyImg: true,
 *     vClickOutside: true,
 *     vFullscreenImg: true,
 *     vZoomImg: true,
 *   },
 * })
 * ```
 */
export const MazUi = {
  // eslint-disable-next-line complexity, sonarjs/cognitive-complexity
  async install(app, options: MazUiOptions = {}) {
    const { theme, translations } = options

    app.use(MazUiTheme, theme)
    app.use(MazTranslations, translations)

    const pluginPromises: Promise<void>[] = []

    if (options.plugins?.dialog) {
      const dialogOptions = typeof options.plugins.dialog === 'boolean' ? undefined : options.plugins.dialog
      pluginPromises.push(
        import('./dialog').then(({ DialogPlugin }) => {
          app.use(DialogPlugin, dialogOptions)
        }),
      )
    }

    if (options.plugins?.toast) {
      const toastOptions = typeof options.plugins.toast === 'boolean' ? undefined : options.plugins.toast
      pluginPromises.push(
        import('./toast').then(({ ToastPlugin }) => {
          app.use(ToastPlugin, toastOptions)
        }),
      )
    }

    if (options.plugins?.wait) {
      pluginPromises.push(
        import('./wait').then(({ WaitPlugin }) => {
          app.use(WaitPlugin)
        }),
      )
    }

    if (options.plugins?.aos) {
      const aosOptions = typeof options.plugins.aos === 'boolean' ? undefined : options.plugins.aos
      pluginPromises.push(
        import('./aos').then(({ AosPlugin }) => {
          app.use(AosPlugin, aosOptions)
        }),
      )
    }

    if (options.directives?.vTooltip) {
      const vTooltipOptions = typeof options.directives.vTooltip === 'boolean' ? undefined : options.directives.vTooltip
      pluginPromises.push(
        import('../directives/vTooltip').then(({ vTooltipInstall }) => {
          app.use(vTooltipInstall, vTooltipOptions)
        }),
      )
    }

    if (options.directives?.vLazyImg) {
      const vLazyImgOptions = typeof options.directives.vLazyImg === 'boolean' ? undefined : options.directives.vLazyImg
      pluginPromises.push(
        import('../directives/vLazyImg').then(({ vLazyImgInstall }) => {
          app.use(vLazyImgInstall, vLazyImgOptions)
        }),
      )
    }

    if (options.directives?.vClickOutside) {
      pluginPromises.push(
        import('../directives/vClickOutside').then(({ vClickOutsideInstall }) => {
          app.use(vClickOutsideInstall)
        }),
      )
    }

    if (options.directives?.vFullscreenImg) {
      pluginPromises.push(
        import('../directives/vFullscreenImg').then(({ vFullscreenImgInstall }) => {
          app.use(vFullscreenImgInstall)
        }),
      )
    }

    if (options.directives?.vZoomImg) {
      pluginPromises.push(
        import('../directives/vZoomImg').then(({ vZoomImgInstall }) => {
          app.use(vZoomImgInstall)
        }),
      )
    }

    await Promise.all(pluginPromises)
  },
} satisfies Plugin<MazUiOptions>
