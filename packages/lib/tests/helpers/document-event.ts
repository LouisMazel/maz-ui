import { DomEventName } from '@vue/test-utils/dist/constants/dom-events'

export const documentEmitVisibilityState = (value: 'hidden' | 'visible') => {
  Object.defineProperty(document, 'visibilityState', {
    value: value,
    writable: true,
  })
  documentEmitEvent('visibilitychange')
}

export const documentEmitEvent = (event: DomEventName) => {
  return document.dispatchEvent(new Event(event))
}

export const elementEmitEvent = (
  element: HTMLElement | Window,
  event: DomEventName,
) => {
  return element.dispatchEvent(new Event(event))
}
