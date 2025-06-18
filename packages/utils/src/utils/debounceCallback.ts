let timeout: NodeJS.Timeout | null = null

export function debounceCallback(callback: (...args: unknown[]) => unknown, delay: number) {
  if (timeout) {
    clearTimeout(timeout)
  }

  timeout = setTimeout(callback, delay)
}
