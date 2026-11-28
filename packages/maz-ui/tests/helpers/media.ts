export function stubMedia({ reduced = false, hover = true }: { reduced?: boolean, hover?: boolean } = {}) {
  vi.stubGlobal('matchMedia', vi.fn((query: string) => ({
    matches: query.includes('reduced-motion') ? reduced : query.includes('hover: hover') ? hover : false,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })))
}

export function pointer(type: string, init: MouseEventInit & { pointerType?: string } = {}) {
  const event = new MouseEvent(type, { bubbles: true, ...init })

  Object.defineProperty(event, 'pointerType', { value: init.pointerType ?? 'mouse' })

  return event
}

export function rect(element: Element, box: { left?: number, top?: number, width: number, height: number }) {
  const { left = 0, top = 0, width, height } = box

  vi.spyOn(element, 'getBoundingClientRect').mockReturnValue({
    left,
    top,
    width,
    height,
    right: left + width,
    bottom: top + height,
    x: left,
    y: top,
    toJSON: () => ({}),
  })
}
