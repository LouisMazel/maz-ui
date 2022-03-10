/* eslint-disable @typescript-eslint/no-explicit-any */

type ArgumentTypes<F extends (...args: any[]) => void> = F extends (
  ...args: infer A
) => any
  ? A
  : never

type MethodTypes = {
  cancel: () => void
  flush: () => void
}

export function debounce<T extends (...args: any[]) => void>(
  fn: T,
  wait = 0,
  callFirst = false,
): ((...args: ArgumentTypes<T>) => void) & MethodTypes {
  let timeout: ReturnType<typeof setTimeout> | undefined = undefined
  let debouncedFn: VoidFunction | undefined = undefined

  const clear = function () {
    if (timeout) {
      clearTimeout(timeout)

      debouncedFn = undefined
      timeout = undefined
    }
  }

  const flush = function () {
    const call = debouncedFn
    clear()

    if (call) {
      call()
    }
  }

  const debounceWrapper = function (...args: any) {
    if (!wait) {
      return fn.apply(this, [args])
    }

    /* eslint-disable @typescript-eslint/no-this-alias  */
    const context = this
    const callNow = callFirst && !timeout
    clear()

    debouncedFn = function () {
      fn.apply(context, [args])
    }

    timeout = setTimeout(function () {
      timeout = undefined

      if (!callNow) {
        const call = debouncedFn
        debouncedFn = undefined

        if (typeof call !== 'undefined') return call()
      }
    }, wait)

    if (callNow) {
      return debouncedFn()
    }
  }

  debounceWrapper.cancel = clear
  debounceWrapper.flush = flush

  return debounceWrapper
}
