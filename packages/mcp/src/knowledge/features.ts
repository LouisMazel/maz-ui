import type { DocEntry } from './schema.ts'

/**
 * `useToast`, `useDialog` and `useWait` work without their plugin: the docs of the toast plugin give the composable, not `ToastPlugin`.
 * Read from the docs of the installed maz-ui, the server can be newer than it.
 */
export function hasStandaloneComposables(docsById: ReadonlyMap<string, DocEntry>): boolean {
  return docsById.get('plugins/toast')?.symbols[0] !== 'ToastPlugin'
}

/**
 * `vReveal` replaces the AOS plugin: its docs exist in the installed maz-ui.
 * Read from the docs of the installed maz-ui, the server can be newer than it.
 */
export function hasReveal(docsById: ReadonlyMap<string, DocEntry>): boolean {
  return docsById.has('directives/reveal')
}
