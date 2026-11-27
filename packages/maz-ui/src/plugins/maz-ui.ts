import type { MazUiThemeOptions } from '@maz-ui/themes/plugin'
import type { MazUiTranslationsOptions } from '@maz-ui/translations'
import type { Plugin } from 'vue'
import type { MazUiDefaultsOptions } from '../composables/useGlobalConfig.ts'
import type { MazUiExternalLinksOptions } from '../utils/externalLinks.ts'
import type { AosOptions } from './aos.ts'
import type { DialogOptions } from './dialog/DialogHandler.ts'
import type { ToastOptions } from './toast/types.ts'
import { MazUiTheme } from '@maz-ui/themes/plugin'
import { MazUiTranslations } from '@maz-ui/translations/plugin'
import { GLOBAL_CONFIG_INJECTION_KEY } from '../composables/useGlobalConfig.ts'
import { EXTERNAL_LINKS_INJECTION_KEY } from '../utils/externalLinks.ts'
import { MAZ_UI_CONTEXT_INJECTION_KEY } from '../utils/mazUiContext.ts'
import { AosPlugin } from './aos.ts'

export interface MazUiOptions extends MazUiExternalLinksOptions {
  /**
   * The theme configurations
   * Can not be disabled
   */
  theme: MazUiThemeOptions
  /**
   * The translations configurations
   * Can not be disabled
   */
  translations?: MazUiTranslationsOptions
  /**
   * Global default prop values for components.
   *
   * Priority, per prop: instance prop > `defaults[Component]` > `defaults.global` > library default.
   * A global default never wins over a prop set on the component instance.
   */
  defaults?: MazUiDefaultsOptions
  /**
   * Global options of the toasts of `useToast()`
   */
  toast?: ToastOptions
  /**
   * Global options of the dialogs of `useDialog()`
   */
  dialog?: DialogOptions
  /**
   * Animations on scroll (`useAos()`): `true` with the default options, or its options.
   * Also import `maz-ui/aos.css`.
   * @default false
   */
  aos?: boolean | AosOptions
}

/**
 * @example
 * ```ts
 * import { MazUi } from 'maz-ui/plugins/maz-ui'
 * import { mazUi as mazUiPreset } from '@maz-ui/themes/presets/mazUi'
 * import 'maz-ui/style.css'
 *
 * app.use(MazUi, {
 *   theme: {
 *     preset: mazUiPreset,
 *     strategy: 'runtime',
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
 *   defaults: {
 *     global: { roundedSize: 'lg' },
 *     MazBtn: { roundedSize: 'full' },
 *     MazCard: { bordered: false, elevation: true },
 *   },
 *   toast: { position: 'top-right' },
 *   dialog: { acceptText: 'Yes' },
 * })
 * ```
 */
export const MazUi: Plugin<[MazUiOptions]> = {
  install(app, options) {
    const { theme, translations, defaults, toast, dialog, aos, openExternal, isExternalLink } = options

    app.use(MazUiTheme, theme)
    app.use(MazUiTranslations, translations)

    app.provide(MAZ_UI_CONTEXT_INJECTION_KEY, { app, toast, dialog })

    if (aos) {
      app.use(AosPlugin, aos === true
        ? undefined
        : aos)
    }

    if (openExternal || isExternalLink)
      app.provide(EXTERNAL_LINKS_INJECTION_KEY, { openExternal, isExternalLink })

    if (defaults) {
      app.provide(GLOBAL_CONFIG_INJECTION_KEY, defaults)
      app.config.globalProperties.$mazGlobalConfig = defaults
    }
  },
}

declare module 'vue' {
  interface ComponentCustomProperties {
    /**
     * Global component defaults provided by the MazUi plugin.
     */
    $mazGlobalConfig?: MazUiDefaultsOptions
  }
}
