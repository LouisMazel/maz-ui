/**
 * Wrap a state-changing callback in a View Transition.
 * Graceful degradation: if `document.startViewTransition` is not available
 * (Firefox stable as of mid-2026), the callback runs synchronously.
 *
 * This module is intended to be lazy-imported so the bundle stays minimal
 * when `{ animate: true }` is never used.
 */
export async function runViewTransition(callback: () => void): Promise<void> {
  if (typeof document === 'undefined') {
    callback()
    return
  }

  const api = (document as Document & { startViewTransition?: (cb: () => void) => { finished: Promise<void> } }).startViewTransition

  if (typeof api !== 'function') {
    callback()
    return
  }

  const transition = api.call(document, callback)
  await transition.finished.catch(() => {})
}
