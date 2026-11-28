import type { Plugin } from 'vue'
import type { DialogOptions } from './dialog/DialogHandler.ts'
import { warnDeprecated } from '../utils/warnDeprecated.ts'
import { DialogHandler } from './dialog/DialogHandler.ts'

/**
 * @deprecated `useDialog()` works without it, it will be removed in v6: give its options to the MazUi plugin (`dialog`). https://maz-ui.com/plugins/dialog
 */
// Removed in v6 (plans/ROADMAP.md): deprecated DialogPlugin
export const DialogPlugin: Plugin<[DialogOptions?]> = {
  install(app, options) {
    warnDeprecated('DialogPlugin', 'DialogPlugin is deprecated and will be removed in v6: useDialog() works without it, remove app.use(DialogPlugin) and give its options to the MazUi plugin: app.use(MazUi, { dialog: { ... } }). https://maz-ui.com/plugins/dialog')

    const dialogHandler = new DialogHandler(app, options)
    app.provide('mazDialog', dialogHandler)

    app.config.globalProperties.$mazDialog = {
      open: dialogHandler.open.bind(dialogHandler),
      confirm: dialogHandler.confirm.bind(dialogHandler),
      globalOptions: dialogHandler.globalOptions,
    }
  },
}

declare module 'vue' {
  interface ComponentCustomProperties {
    /**
     * Dialog handler instance, provided by the deprecated `DialogPlugin`
     * @deprecated use `useDialog()` from `maz-ui/composables/useDialog`, it will be removed in v6
     */
    // Removed in v6 (plans/ROADMAP.md): deprecated DialogPlugin
    $mazDialog: Omit<DialogHandler, 'app'>
  }
}

export { type DialogConfirmOptions, DialogHandler, type DialogOptions } from './dialog/DialogHandler.ts'
