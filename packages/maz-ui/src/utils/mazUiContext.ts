import type { App, InjectionKey } from 'vue'
import type { DialogOptions } from '../plugins/dialog/DialogHandler.ts'
import type { ToastOptions } from '../plugins/toast/types.ts'
import { getCurrentInstance, hasInjectionContext, inject } from 'vue'

export interface MazUiContext {
  app: App
  toast?: ToastOptions
  dialog?: DialogOptions
}

export const MAZ_UI_CONTEXT_INJECTION_KEY: InjectionKey<MazUiContext> = Symbol('mazUiContext')

/**
 * The app and the global options given to the MazUi plugin, or the app of the current component
 */
export function injectMazUiContext(composable: string): MazUiContext {
  const context = hasInjectionContext()
    ? inject(MAZ_UI_CONTEXT_INJECTION_KEY, undefined)
    : undefined

  if (context) {
    return context
  }

  const app = getCurrentInstance()?.appContext.app

  if (app) {
    return { app }
  }

  throw new TypeError(`[maz-ui](${composable}) no Vue app found: call ${composable}() in the setup of a component, or install the MazUi plugin to call it in an injection context (store, router guard, app.runWithContext). https://maz-ui.com/guide/vue#install-plugin`)
}

/**
 * One handler per app, created on the first call
 */
export function createAppHandlerResolver<T>(create: (context: MazUiContext) => T) {
  const handlers = new WeakMap<App, T>()

  return (context: MazUiContext): T => {
    let handler = handlers.get(context.app)

    if (!handler) {
      handler = create(context)
      handlers.set(context.app, handler)
    }

    return handler
  }
}
