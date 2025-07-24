// import { DomEventName } from '@vue/test-utils/dist/constants/dom-events'

export function documentEmitVisibilityState(value: 'hidden' | 'visible') {
  Object.defineProperty(document, 'visibilityState', {
    value,
    writable: true,
  })
  documentEmitEvent('visibilitychange')
}

export function documentEmitEvent(event: string) {
  return document.dispatchEvent(new Event(event))
}

export function elementEmitEvent(element: HTMLElement | Window | typeof globalThis, event: string) {
  return element.dispatchEvent(new Event(event))
}
