let timeout: NodeJS.Timeout | null = null

/**
 * Run the callback after a quiet period, a new call replaces the pending one (shared by every caller of the module).
 * @returns a function that cancels the pending call
 */
export function debounceCallback(callback: (...args: unknown[]) => unknown, delay: number) {
  if (timeout) {
    clearTimeout(timeout)
  }

  const current = setTimeout(callback, delay)
  timeout = current

  return function cancel() {
    clearTimeout(current)
    if (timeout === current)
      timeout = null
  }
}
