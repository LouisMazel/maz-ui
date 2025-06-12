type AsyncFunction<T, Args extends unknown[]> = (...args: Args) => T | Promise<T>

interface ThrottleState<T, Args extends unknown[]> {
  promise: Promise<T> | null
  lastCall: number
  lastArgs: Args
}

/**
 * Throttle an async function - called at first call and then at intervals (only the last call is executed)
 */
export function throttleId<T, Args extends unknown[]>(
  identifier: string,
  func: AsyncFunction<T, Args>,
  interval: number,
): (...args: Args) => Promise<T> {
  const state: Record<string, ThrottleState<T, Args>> = {}

  // eslint-disable-next-line require-await
  return async (...args: Args): Promise<T> => {
    const now = Date.now()

    if (!state[identifier]) {
      state[identifier] = { promise: null, lastCall: 0, lastArgs: [] as unknown as Args }
    }

    if (now - state[identifier].lastCall >= interval) {
      state[identifier].lastCall = now
      return func(...args)
    }

    state[identifier].lastArgs = args

    if (!state[identifier].promise) {
      state[identifier].promise = new Promise<T>((resolve) => {
        setTimeout(
          async () => {
            state[identifier].lastCall = Date.now()
            const result = await func(...state[identifier].lastArgs)
            state[identifier].promise = null
            resolve(result)
          },
          interval - (now - state[identifier].lastCall),
        )
      })
    }

    return state[identifier].promise as Promise<T>
  }
}
