export const documentEmitVisibilityStateHidden = () => {
  Object.defineProperty(document, 'visibilityState', {
    value: 'hidden',
    writable: true,
  })
  documentEmitEvent('visibilitychange')
}

export const documentEmitVisibilityStateVisible = () => {
  Object.defineProperty(document, 'visibilityState', {
    value: 'visible',
    writable: true,
  })
  documentEmitEvent('visibilitychange')
}

export const documentEmitEvent = (event: string) => {
  return document.dispatchEvent(new Event(event))
}
