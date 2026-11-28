import { DialogHandler } from '@plugins/dialog/DialogHandler.ts'
import { createApp } from 'vue'

interface FakeAnimation {
  keyframes: Keyframe[]
  onfinish: (() => void) | null
  oncancel: (() => void) | null
  cancel: ReturnType<typeof vi.fn>
}

const animations: FakeAnimation[] = []

function rect(left: number, top: number, width: number, height: number) {
  return { left, top, width, height, right: left + width, bottom: top + height, x: left, y: top } as DOMRect
}

describe('given DialogHandler with an origin', () => {
  let handler: DialogHandler
  let counter = 0

  beforeEach(() => {
    counter += 1
    animations.length = 0
    Object.defineProperty(globalThis, 'innerWidth', { value: 1000, configurable: true })
    Object.defineProperty(globalThis, 'innerHeight', { value: 800, configurable: true })
    vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() })))
    HTMLElement.prototype.getBoundingClientRect = vi.fn(() => rect(300, 200, 500, 400))
    Element.prototype.animate = vi.fn((keyframes: Keyframe[]) => {
      const animation: FakeAnimation = { keyframes, onfinish: null, oncancel: null, cancel: vi.fn() }
      animations.push(animation)

      return animation as unknown as Animation
    }) as unknown as typeof Element.prototype.animate
    handler = new DialogHandler(createApp({}), { identifier: `origin-dialog-${counter}` })
  })

  afterEach(() => {
    const active = (handler as unknown as { activeDialogs: Map<string, { destroy: () => void }> }).activeDialogs
    active.forEach(entry => entry.destroy())
    delete (HTMLElement.prototype as Partial<HTMLElement>).getBoundingClientRect
    document.body.innerHTML = ''
    vi.unstubAllGlobals()
  })

  describe('when confirm is called with the click event as origin', () => {
    it('then the dialog grows from the point of the click', async () => {
      const promise = handler.confirm({ message: 'Message', origin: new MouseEvent('click', { clientX: 120, clientY: 90, detail: 1 }) })
      promise.catch(() => {})

      await vi.waitFor(() => expect(animations.length).toBeGreaterThan(0))

      expect(animations[0]?.keyframes[0]).toMatchObject({ transform: 'scale(0.05)', opacity: '0' })
    })
  })

  describe('when open is called with an element origin', () => {
    it('then the dialog grows from the element', async () => {
      const button = document.createElement('button')
      document.body.append(button)
      button.getBoundingClientRect = vi.fn(() => rect(100, 100, 50, 20))

      handler.open({ message: 'Message', origin: button })

      await vi.waitFor(() => expect(animations.length).toBeGreaterThan(0))

      expect(animations[0]?.keyframes[0]).toMatchObject({
        transform: 'translate(-200px, -100px) scale(0.1, 0.05)',
      })
    })
  })

  describe('when animated is false', () => {
    it('then the dialog does not move', async () => {
      handler.open({ message: 'Message', animated: false, origin: { x: 10, y: 10 } })

      await vi.waitFor(() => expect(document.body.querySelector('.m-dialog')).not.toBeNull())

      expect(animations).toHaveLength(0)
    })
  })
})
