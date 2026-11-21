import { hasInjectionContext, inject } from 'vue'
import { DialogHandler } from '../plugins/dialog/DialogHandler.ts'
import { createAppHandlerResolver, injectMazUiContext } from '../utils/mazUiContext.ts'

const resolveDialogHandler = createAppHandlerResolver(({ app, dialog }) => new DialogHandler(app, dialog))

/**
 * Open dialogs and confirmations, with the options given to the MazUi plugin (`dialog`): works without any other plugin
 */
export function useDialog(): DialogHandler {
  // Removed in v6 (plans/ROADMAP.md): handler provided by the deprecated DialogPlugin
  const provided = hasInjectionContext()
    ? inject<DialogHandler | undefined>('mazDialog', undefined)
    : undefined

  return provided ?? resolveDialogHandler(injectMazUiContext('useDialog'))
}
