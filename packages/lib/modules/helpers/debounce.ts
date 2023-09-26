export function debounce(func: (...args: unknown[]) => unknown, delay: number) {
  let timeoutId: NodeJS.Timeout | null

  return (...args: unknown[]) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(() => {
      func(...args)
    }, delay)
  }
}
