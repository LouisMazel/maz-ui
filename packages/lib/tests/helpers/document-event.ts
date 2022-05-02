export const documentEmitVisibilityState = (value: 'hidden' | 'visible') => {
  Object.defineProperty(document, 'visibilityState', {
    value: value,
    writable: true,
  })
  documentEmitEvent('visibilitychange')
}

export const documentEmitEvent = (event: string) => {
  return document.dispatchEvent(new Event(event))
}
