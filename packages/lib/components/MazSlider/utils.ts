interface IPosObject {
  x: number
  y: number
}

export function getOffset(elem: HTMLDivElement): IPosObject {
  const doc = document.documentElement as HTMLElement
  const body = document.body as HTMLElement
  const rect = elem.getBoundingClientRect()
  const offset: IPosObject = {
    y: rect.top + (window.pageYOffset || doc.scrollTop) - (doc.clientTop || body.clientTop || 0),
    x:
      rect.left + (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || body.clientLeft || 0),
  }
  return offset
}

/**
 * Get the position of the mouse/finger in the element
 * @param e Trigger event
 * @param elem Container element
 * @param isReverse From the right/bottom
 */
export function getPos(e: MouseEvent | TouchEvent, elem: HTMLDivElement, isReverse = false): IPosObject {
  const event = 'targetTouches' in e ? e.targetTouches[0] : e
  const offset = getOffset(elem)
  const posObj = {
    x: event.pageX - offset.x,
    y: event.pageY - offset.y,
  }
  return {
    x: isReverse ? elem.offsetWidth - posObj.x : posObj.x,
    y: isReverse ? elem.offsetHeight - posObj.y : posObj.y,
  }
}

export function isBetween(value: number, prev: number, next: number, direction: string) {
  return direction === 'minus' ? (prev ? value >= prev : true) : next ? value <= next : true
}

export function getOpacityCoeff(index: number, middle: number, length: number) {
  const currentIndex = index + 1
  const isBiggerThanMiddle = middle < currentIndex
  const deviation = isBiggerThanMiddle ? currentIndex - middle : middle - currentIndex
  return ((100 / length) * deviation) / 100
}
