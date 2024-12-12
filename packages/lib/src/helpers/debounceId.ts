type AsyncFunction<T, Args extends unknown[]> = (...args: Args) => T | Promise<T>

interface DebouncedFunctionMap<T> {
  [key: string]: {
    timer: NodeJS.Timeout | null
    promise: Promise<T> | null
  }
}

/**
 * Debounce an async function - called after a delay (only the last call is executed)
 */
export function debounceId<T, Args extends unknown[]>(
  identifier: string,
  func: AsyncFunction<T, Args>,
  delay: number,
): (...args: Args) => Promise<T> {
  const debouncedFunctions: DebouncedFunctionMap<T> = {}

  return function (...args: Args): Promise<T> {
    if (!debouncedFunctions[identifier]) {
      debouncedFunctions[identifier] = { timer: null, promise: null }
    }

    const debounced = debouncedFunctions[identifier]

    if (debounced.timer) {
      clearTimeout(debounced.timer)
    }

    debounced.promise = new Promise<T>((resolve, reject) => {
      debounced.timer = setTimeout(async () => {
        try {
          resolve(await func(...args))
        }
        catch (error) {
          reject(error)
        }
        finally {
          delete debouncedFunctions[identifier]
        }
      }, delay)
    })

    return debounced.promise
  }
}
