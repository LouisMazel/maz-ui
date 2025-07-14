export function setup() {
  process.env.TZ = 'Europe/Paris'

  // Mock Canvas API for Chart.js tests
  const mockContext = {
    fillRect: vi.fn(),
    clearRect: vi.fn(),
    getImageData: vi.fn(() => ({ data: Array.from({ length: 4 }) })),
    putImageData: vi.fn(),
    createImageData: vi.fn(() => []),
    setTransform: vi.fn(),
    drawImage: vi.fn(),
    save: vi.fn(),
    fillText: vi.fn(),
    restore: vi.fn(),
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    closePath: vi.fn(),
    stroke: vi.fn(),
    translate: vi.fn(),
    scale: vi.fn(),
    rotate: vi.fn(),
    arc: vi.fn(),
    fill: vi.fn(),
    measureText: vi.fn(() => ({ width: 0 })),
    transform: vi.fn(),
    rect: vi.fn(),
    clip: vi.fn(),
    quadraticCurveTo: vi.fn(),
    bezierCurveTo: vi.fn(),
    createLinearGradient: vi.fn(() => ({
      addColorStop: vi.fn(),
    })),
    createRadialGradient: vi.fn(() => ({
      addColorStop: vi.fn(),
    })),
    isPointInPath: vi.fn(() => false),
    isPointInStroke: vi.fn(() => false),
    canvas: {
      width: 500,
      height: 300,
      style: {},
      getContext: vi.fn(),
    },
  }

  Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
    value: vi.fn(() => mockContext),
    writable: true,
    configurable: true,
  })

  Object.defineProperty(HTMLCanvasElement.prototype, 'width', {
    value: 500,
    writable: true,
    configurable: true,
  })

  Object.defineProperty(HTMLCanvasElement.prototype, 'height', {
    value: 300,
    writable: true,
    configurable: true,
  })

  // Mock ResizeObserver for Chart.js
  globalThis.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }))
}

vi.mock('@maz-ui/translations/src/useTranslations.js', () => ({
  useTranslations: vi.fn().mockReturnValue({
    t: vi.fn().mockReturnValue('test'),
  }),
}))
