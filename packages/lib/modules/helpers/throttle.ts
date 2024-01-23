export function throttle(action: () => void | Promise<void>, delay: number) {
  let lastExecTime = 0

  return async function () {
    const now = Date.now()

    if (now - lastExecTime >= delay) {
      await action()
      lastExecTime = now
    }
  }
}
