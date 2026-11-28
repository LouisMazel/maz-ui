export type DebouncedFunction<F extends (...args: any[]) => any> = ((this: ThisParameterType<F>, ...args: Parameters<F>) => void) & {
  /** Drop the pending call, if any */
  cancel: () => void
  /** Run the pending call right now, if any */
  flush: () => void
}

export function debounce<F extends (...args: Parameters<F>) => ReturnType<F>>(
  fn: F,
  delay: number,
): DebouncedFunction<F> {
  let timeout: ReturnType<typeof setTimeout> | undefined
  let pending: { context: ThisParameterType<F>, args: Parameters<F> } | undefined

  function run() {
    timeout = undefined
    const call = pending
    pending = undefined
    if (call)
      fn.apply(call.context, call.args)
  }

  const debounced = function (this: ThisParameterType<F>, ...args: Parameters<F>) {
    clearTimeout(timeout)
    pending = { context: this, args }
    timeout = setTimeout(run, delay)
  } as DebouncedFunction<F>

  debounced.cancel = () => {
    clearTimeout(timeout)
    timeout = undefined
    pending = undefined
  }

  debounced.flush = () => {
    if (!pending)
      return
    clearTimeout(timeout)
    run()
  }

  return debounced
}
