import { config } from '@vue/test-utils'

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
  vi.stubGlobal('ResizeObserver', vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  })))

  // Mock fetch to prevent network requests in tests
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
    ok: true,
    json: vi.fn().mockResolvedValue({}),
    text: vi.fn().mockResolvedValue(''),
    blob: vi.fn().mockResolvedValue(new Blob()),
    arrayBuffer: vi.fn().mockResolvedValue(new ArrayBuffer(0)),
  }))

  // Mock XMLHttpRequest to prevent network requests
  const MockXMLHttpRequest = vi.fn().mockImplementation(() => ({
    open: vi.fn(),
    send: vi.fn(() => {
      // Do nothing to prevent network calls
    }),
    setRequestHeader: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    abort: vi.fn(),
    readyState: 4,
    status: 200,
    statusText: 'OK',
    responseText: '',
    response: '',
    responseType: '',
    responseURL: '',
    timeout: 0,
    upload: {
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    },
    withCredentials: false,
    onreadystatechange: null,
    onload: null,
    onerror: null,
    ontimeout: null,
    onabort: null,
    onloadstart: null,
    onloadend: null,
    onprogress: null,
  }))

  vi.stubGlobal('XMLHttpRequest', MockXMLHttpRequest as any)

  // Mock Image constructor to prevent image loading
  const MockImage = vi.fn().mockImplementation(() => ({
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    src: '',
    onload: null,
    onerror: null,
    complete: true,
    naturalWidth: 100,
    naturalHeight: 100,
  }))
  vi.stubGlobal('Image', MockImage as any)

  // Mock WebSocket to prevent websocket connections
  vi.stubGlobal('WebSocket', vi.fn().mockImplementation(() => ({
    send: vi.fn(),
    close: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    readyState: 1, // OPEN
  })))

  // Mock navigator.sendBeacon
  Object.defineProperty(globalThis.navigator, 'sendBeacon', {
    value: vi.fn().mockReturnValue(true),
    writable: true,
    configurable: true,
  })
}

vi.mock('@maz-ui/translations', () => ({
  useTranslations: vi.fn().mockReturnValue({
    t: vi.fn().mockReturnValue('test'),
  }),
}))
config.global.stubs = {
  teleport: true,
  Teleport: true,
}
