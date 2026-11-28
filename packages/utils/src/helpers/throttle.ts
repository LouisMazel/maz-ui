export type ThrottledFunction<T extends (...args: any[]) => any> = ((...args: Parameters<T>) => void) & {
  /** Drop the trailing call, if any */
  cancel: () => void
}

export function throttle<T extends (...args: Parameters<T>) => ReturnType<T>>(
  func: T,
  limit: number,
): ThrottledFunction<T> {
  let inThrottle: boolean = false
  let lastFunc: ReturnType<typeof setTimeout>
  let lastRan: number

  const throttled = function (this: any, ...args: Parameters<T>): void {
    if (!inThrottle) {
      func.apply(this, args)
      lastRan = Date.now()
      inThrottle = true
    }
    else {
      clearTimeout(lastFunc)
      lastFunc = setTimeout(() => {
        if (Date.now() - lastRan >= limit) {
          func.apply(this, args)
          lastRan = Date.now()
        }
      }, Math.max(limit - (Date.now() - lastRan), 0))
    }
  } as ThrottledFunction<T>

  throttled.cancel = () => {
    clearTimeout(lastFunc)
  }

  return throttled
}
