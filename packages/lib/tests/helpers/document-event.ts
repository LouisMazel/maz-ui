// import { DomEventName } from '@vue/test-utils/dist/constants/dom-events'

export const documentEmitVisibilityState = (value: 'hidden' | 'visible') => {
  Object.defineProperty(document, 'visibilityState', {
    value,
    writable: true,
  })
  documentEmitEvent('visibilitychange')
}

export const documentEmitEvent = (event: string) => {
  return document.dispatchEvent(new Event(event))
}

export const elementEmitEvent = (element: HTMLElement | Window, event: string) => {
  return element.dispatchEvent(new Event(event))
}
