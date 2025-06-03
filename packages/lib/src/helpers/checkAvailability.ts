export function checkAvailability<T>(getRef: () => T | null | undefined, callback: (component: NonNullable<T>) => void, options?: { maxAttempts?: number, interval?: number, errorMessage?: string, expectedValue?: T, onError?: (error: Error) => void }) {
  const opts = {
    maxAttempts: 20,
    interval: 100,
    ...options,
  }

  let attempts = 0

  function check() {
    const ref = getRef()
    if (ref !== null && ref !== undefined) {
      if (opts.expectedValue !== undefined && ref !== opts.expectedValue) {
        if (attempts < opts.maxAttempts) {
          attempts++
          setTimeout(check, opts.interval)
        }
        else {
          opts.onError?.(new Error(opts.errorMessage || `[maz-ui](checkAvailability) Nothing found after ${opts.maxAttempts} attempts`))
        }
      }
      else {
        callback(ref as NonNullable<T>)
      }
    }
    else if (attempts < opts.maxAttempts) {
      attempts++
      setTimeout(check, opts.interval)
    }
    else {
      opts.onError?.(new Error(opts.errorMessage || `[maz-ui](checkAvailability) Nothing found after ${opts.maxAttempts} attempts`))
    }
  }

  check()
}
