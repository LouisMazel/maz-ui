import { isServer } from '@maz-ui/utils/helpers/isServer'

export function useMutationObserver(
  target: HTMLElement,
  callback: MutationCallback,
  options: MutationObserverInit = {},
) {
  if (isServer() || !('MutationObserver' in globalThis)) {
    return { stop: () => {} }
  }

  const observer = new MutationObserver(callback)
  observer.observe(target, options)

  const stop = () => {
    observer.disconnect()
  }

  return { stop }
}
