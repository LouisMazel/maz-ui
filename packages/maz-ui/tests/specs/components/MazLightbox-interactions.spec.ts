import type { VueWrapper } from '@vue/test-utils'
import MazLightbox from '@components/MazLightbox.vue'
import { useTranslations } from '@maz-ui/translations/composables/useTranslations'
import { flushPromises, mount } from '@vue/test-utils'

const images = [
  { src: 'https://example.com/1.jpg', alt: 'First', caption: 'First caption', fullSrc: 'https://example.com/1-full.jpg' },
  { src: 'https://example.com/2.jpg', alt: 'Second' },
  { src: 'https://example.com/3.jpg', alt: 'Third' },
]

const labels: Record<string, string> = {
  'lightbox.close': 'Close',
  'lightbox.previous': 'Previous image',
  'lightbox.next': 'Next image',
  'lightbox.label': 'Image viewer',
  'lightbox.loading': 'Loading...',
}

interface FakeAnimation {
  keyframes: Keyframe[]
  options: KeyframeAnimationOptions
  onfinish: (() => void) | null
  oncancel: (() => void) | null
  cancel: () => void
}

const animations: FakeAnimation[] = []
let autoFinish = true
let wrapper: VueWrapper | undefined
const preloadedImages: { src: string, onload: (() => void) | null }[] = []
const OriginalImage = globalThis.Image

function stubMatchMedia(prefersReduced: boolean) {
  vi.stubGlobal('matchMedia', vi.fn(() => ({
    matches: prefersReduced,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })))
}

beforeEach(() => {
  vi.mocked(useTranslations).mockReturnValue({ t: (key: string) => labels[key] ?? key } as never)
  animations.length = 0
  preloadedImages.length = 0
  autoFinish = true
  stubMatchMedia(false)
  Element.prototype.animate = vi.fn((keyframes: Keyframe[], options: KeyframeAnimationOptions) => {
    const animation: FakeAnimation = { keyframes, options, onfinish: null, oncancel: null, cancel: vi.fn() }
    animations.push(animation)
    if (autoFinish)
      queueMicrotask(() => animation.onfinish?.())

    return animation as unknown as Animation
  }) as unknown as typeof Element.prototype.animate
  vi.spyOn(HTMLImageElement.prototype, 'naturalWidth', 'get').mockReturnValue(2000)
  vi.spyOn(HTMLImageElement.prototype, 'naturalHeight', 'get').mockReturnValue(1000)
  globalThis.Image = class {
    src = ''
    decoding = ''
    onload: (() => void) | null = null
    constructor() {
      preloadedImages.push(this)
    }
  } as unknown as typeof Image
})

afterEach(() => {
  wrapper?.unmount()
  wrapper = undefined
  globalThis.Image = OriginalImage
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
  document.documentElement.removeAttribute('dir')
  document.body.innerHTML = ''
})

function firePointer(target: Element, type: string, x: number, y: number, extra: { pointerId?: number, pointerType?: string, button?: number } = {}) {
  const event = new MouseEvent(type, { clientX: x, clientY: y, bubbles: true, button: extra.button ?? 0 })
  Object.defineProperties(event, {
    pointerId: { value: extra.pointerId ?? 1 },
    pointerType: { value: extra.pointerType ?? 'touch' },
  })
  target.dispatchEvent(event)
}

async function openLightbox(props: Record<string, unknown> = {}, load = true) {
  wrapper = mount(MazLightbox, {
    props: {
      'modelValue': true,
      'index': 0,
      images,
      'onUpdate:modelValue': (value: boolean) => wrapper?.setProps({ modelValue: value }),
      'onUpdate:index': (value: number) => wrapper?.setProps({ index: value }),
      ...props,
    },
    attachTo: document.body,
  })
  await flushPromises()
  if (load) {
    document.querySelector('.m-lightbox__image')?.dispatchEvent(new Event('load'))
    await flushPromises()
  }

  return wrapper
}

function getDialog() {
  return document.querySelector<HTMLElement>('[role="dialog"]')
}

function getStage() {
  return document.querySelector<HTMLElement>('.m-lightbox__stage')!
}

function getImage() {
  return document.querySelector<HTMLImageElement>('.m-lightbox__image')!
}

function getCounter() {
  return document.querySelector('.m-lightbox__counter')?.textContent?.trim()
}

async function press(key: string, init: KeyboardEventInit = {}) {
  const event = new KeyboardEvent('keydown', { key, cancelable: true, ...init })
  document.dispatchEvent(event)
  await flushPromises()

  return event
}

function isZoomed() {
  return getDialog()?.classList.contains('--zoomed')
}

function getScale() {
  return /scale\(([\d.]+)\)/.exec(getImage().style.transform)?.[1]
}

describe('given an origin element', () => {
  describe('when the lightbox opens and closes', () => {
    it('then it animates from the origin, emits open, then animates back and restores the focus', async () => {
      const origin = document.createElement('button')
      origin.getBoundingClientRect = () => ({ left: 10, top: 10, width: 40, height: 40, right: 50, bottom: 50, x: 10, y: 10 }) as DOMRect
      document.body.append(origin)
      const lightbox = await openLightbox({ origin })

      expect(lightbox.emitted('enter')).toHaveLength(1)
      expect(lightbox.emitted('open')).toHaveLength(1)
      expect(animations.length).toBeGreaterThan(0)

      document.querySelector<HTMLButtonElement>('button[aria-label="Close"]')!.click()
      await flushPromises()

      expect(lightbox.emitted('close')).toHaveLength(1)
      expect(getDialog()).toBeNull()
      expect(document.activeElement).toBe(origin)
    })
  })

  describe('when the origin is a function', () => {
    it('then it receives the index of the shown image', async () => {
      const origin = vi.fn(() => undefined)
      await openLightbox({ origin, index: 1 })

      expect(origin).toHaveBeenCalledWith(1)
    })
  })

  describe('when the origin is detached on close', () => {
    it('then the focus goes back to the previously focused element', async () => {
      const trigger = document.createElement('button')
      document.body.append(trigger)
      trigger.focus()
      const detached = document.createElement('div')
      const lightbox = await openLightbox({ origin: detached })

      await lightbox.vm.$.exposed!.close()
      await flushPromises()

      expect(document.activeElement).toBe(trigger)
    })
  })

  describe('when the animation is disabled', () => {
    it('then it opens and closes without any animation', async () => {
      const lightbox = await openLightbox({ animated: false })
      expect(lightbox.emitted('open')).toHaveLength(1)
      expect(getDialog()?.classList.contains('--instant')).toBe(true)

      await press('Escape')

      expect(animations).toHaveLength(0)
      expect(lightbox.emitted('close')).toHaveLength(1)
    })
  })
})

describe('given the reduced motion preference', () => {
  describe('when it navigates', () => {
    it('then the slides only fade and the root is instant', async () => {
      stubMatchMedia(true)
      await openLightbox()
      expect(getDialog()?.classList.contains('--instant')).toBe(true)
      animations.length = 0

      await press('ArrowRight')

      expect(animations.length).toBeGreaterThan(0)
      for (const animation of animations)
        expect(animation.keyframes.every(frame => Object.keys(frame).join() === 'opacity')).toBe(true)
    })
  })
})

describe('given a lightbox in navigation', () => {
  describe('when it moves to the next image', () => {
    it('then the leaving slide is removed once its animation ends', async () => {
      await openLightbox()

      await press('ArrowRight')
      await flushPromises()

      expect(document.querySelectorAll('.m-lightbox__slide')).toHaveLength(1)
      expect(getCounter()).toBe('2 / 3')
    })

    it('then both slides stay while the animation runs', async () => {
      await openLightbox()
      autoFinish = false

      await press('ArrowRight')

      expect(document.querySelectorAll('.m-lightbox__slide')).toHaveLength(2)
    })
  })

  describe('when it wraps around with the loop', () => {
    it('then next on the last image goes to the first and previous on the first goes to the last', async () => {
      const lightbox = await openLightbox({ index: 2 })

      await lightbox.vm.$.exposed!.next()
      await lightbox.vm.$.exposed!.previous()

      expect(lightbox.emitted('update:index')).toEqual([[0], [2]])
      expect(lightbox.emitted('next')).toHaveLength(1)
      expect(lightbox.emitted('previous')).toHaveLength(1)
    })
  })

  describe('when the loop is disabled at the boundaries', () => {
    it('then next on the last image and previous on the first do nothing', async () => {
      const lightbox = await openLightbox({ loop: false })

      await press('ArrowLeft')
      await wrapper?.setProps({ index: 2 })
      await press('ArrowRight')

      expect(lightbox.emitted('update:index')).toBeUndefined()
    })
  })

  describe('when goTo is called', () => {
    it('then it jumps to the index and ignores the current and invalid ones', async () => {
      const lightbox = await openLightbox()

      await lightbox.vm.$.exposed!.goTo(2)
      await lightbox.vm.$.exposed!.goTo(2)
      await lightbox.vm.$.exposed!.goTo(9)
      await lightbox.vm.$.exposed!.goTo(-1)

      expect(lightbox.emitted('update:index')).toEqual([[2]])
      expect(lightbox.emitted('next')).toHaveLength(1)
    })
  })

  describe('when goTo goes backwards', () => {
    it('then it emits previous', async () => {
      const lightbox = await openLightbox({ index: 2 })

      await lightbox.vm.$.exposed!.goTo(0)

      expect(lightbox.emitted('previous')).toHaveLength(1)
    })
  })

  describe('when the image is not shown yet', () => {
    it('then navigation is ignored', async () => {
      const lightbox = await openLightbox({}, false)

      await press('ArrowRight')

      expect(lightbox.emitted('update:index')).toBeUndefined()
    })
  })

  describe('when End is pressed on the last image and Home on the first', () => {
    it('then nothing happens', async () => {
      const lightbox = await openLightbox()

      await press('Home')
      await wrapper?.setProps({ index: 2 })
      await press('End')

      expect(lightbox.emitted('update:index')).toBeUndefined()
    })
  })

  describe('when Home and End are pressed in a right to left page', () => {
    it('then End still goes to the last image', async () => {
      document.documentElement.dir = 'rtl'
      const lightbox = await openLightbox()

      await press('End')

      expect(lightbox.emitted('update:index')?.[0]).toEqual([2])
    })
  })

  describe('when the arrow keys are pressed in a right to left page', () => {
    it('then ArrowRight goes to the previous image', async () => {
      document.documentElement.dir = 'rtl'
      const lightbox = await openLightbox({ index: 1 })

      await press('ArrowRight')

      expect(lightbox.emitted('update:index')?.[0]).toEqual([0])
    })
  })
})

describe('given keyboard shortcuts', () => {
  describe('when a modifier key is held', () => {
    it('then the shortcuts are ignored', async () => {
      const lightbox = await openLightbox()

      await press('ArrowRight', { ctrlKey: true })
      await press('ArrowRight', { metaKey: true })
      await press('+', { altKey: true })

      expect(lightbox.emitted('update:index')).toBeUndefined()
      expect(isZoomed()).toBe(false)
    })
  })

  describe('when an unknown key is pressed', () => {
    it('then the default behavior is kept', async () => {
      await openLightbox()

      const event = await press('a')

      expect(event.defaultPrevented).toBe(false)
    })
  })

  describe('when the event is already prevented', () => {
    it('then Escape does not close', async () => {
      const lightbox = await openLightbox()
      const event = new KeyboardEvent('keydown', { key: 'Escape', cancelable: true })
      event.preventDefault()

      document.dispatchEvent(event)
      await flushPromises()

      expect(lightbox.emitted('before-close')).toBeUndefined()
    })
  })

  describe('when Tab is pressed', () => {
    it('then the focus stays inside the dialog', async () => {
      await openLightbox()
      document.querySelector<HTMLButtonElement>('button[aria-label="Next image"]')!.focus()

      const event = await press('Tab')

      expect(event.defaultPrevented).toBe(true)
      expect(getDialog()?.contains(document.activeElement)).toBe(true)
    })

    it('then shift Tab from the first button wraps to the last', async () => {
      await openLightbox()
      document.querySelector<HTMLButtonElement>('button[aria-label="Close"]')!.focus()

      await press('Tab', { shiftKey: true })

      expect(getDialog()?.contains(document.activeElement)).toBe(true)
    })
  })

  describe('when the zoom keys are used', () => {
    it('then plus and equals zoom in, minus zooms out and zero resets', async () => {
      await openLightbox()

      await press('=')
      const zoomedOnce = Number(getScale())
      await press('+')
      expect(Number(getScale())).toBeGreaterThan(zoomedOnce)
      await press('-')
      expect(Number(getScale())).toBeCloseTo(zoomedOnce, 1)
      await press('0')

      expect(isZoomed()).toBe(false)
    })

    it('then minus on the unzoomed image keeps the scale at 1', async () => {
      await openLightbox()

      await press('-')

      expect(isZoomed()).toBe(false)
    })

    it('then they are ignored when the zoom is disabled', async () => {
      await openLightbox({ zoom: false })

      const event = await press('+')

      expect(isZoomed()).toBe(false)
      expect(event.defaultPrevented).toBe(false)
    })

    it('then the zoom is capped by maxZoom', async () => {
      await openLightbox({ maxZoom: 2 })

      await press('+')
      await press('+')
      await press('+')

      expect(getScale()).toBe('2')
    })
  })
})

describe('given the zoom', () => {
  describe('when the image is clicked at a point', () => {
    it('then it zooms around this point and a second click resets', async () => {
      await openLightbox()

      getImage().dispatchEvent(new MouseEvent('click', { bubbles: true, clientX: 700, clientY: 400 }))
      await flushPromises()

      expect(getScale()).toBe('2.5')
      expect(getImage().style.transform).toContain('-282px')
      expect(getStage().classList.contains('maz:cursor-grab')).toBe(true)

      getImage().dispatchEvent(new MouseEvent('click', { bubbles: true }))
      await flushPromises()

      expect(getImage().style.transform).toBe('')
    })
  })

  describe('when the wheel turns with ctrl', () => {
    it('then it zooms and prevents the page zoom', async () => {
      await openLightbox()
      const wheel = new WheelEvent('wheel', { ctrlKey: true, deltaY: -50, clientX: 512, clientY: 384, bubbles: true, cancelable: true })

      getStage().dispatchEvent(wheel)
      await flushPromises()

      expect(wheel.defaultPrevented).toBe(true)
      expect(isZoomed()).toBe(true)
    })

    it('then it does nothing without ctrl or when the zoom is disabled', async () => {
      await openLightbox()
      getStage().dispatchEvent(new WheelEvent('wheel', { deltaY: -50, bubbles: true }))
      await flushPromises()
      expect(isZoomed()).toBe(false)

      wrapper?.unmount()
      await openLightbox({ zoom: false })
      getStage().dispatchEvent(new WheelEvent('wheel', { ctrlKey: true, deltaY: -50, bubbles: true }))
      await flushPromises()

      expect(isZoomed()).toBe(false)
    })
  })

  describe('when the zoomed image is dragged', () => {
    it('then it pans within the limits and does not change the image', async () => {
      const lightbox = await openLightbox()
      await press('+')
      await press('+')
      await press('+')
      const stage = getStage()
      const before = getImage().style.transform

      firePointer(stage, 'pointerdown', 500, 400)
      firePointer(stage, 'pointermove', 480, 390)
      firePointer(stage, 'pointermove', 400, 350)
      firePointer(stage, 'pointerup', 400, 350)
      await flushPromises()

      expect(getImage().style.transform).not.toBe(before)
      expect(lightbox.emitted('update:index')).toBeUndefined()
      expect(isZoomed()).toBe(true)
    })
  })

  describe('when two fingers pinch', () => {
    it('then it zooms around their middle and pans with them', async () => {
      await openLightbox()
      const stage = getStage()

      firePointer(stage, 'pointerdown', 450, 384, { pointerId: 1 })
      firePointer(stage, 'pointerdown', 550, 384, { pointerId: 2 })
      firePointer(stage, 'pointermove', 400, 384, { pointerId: 1 })
      firePointer(stage, 'pointermove', 600, 384, { pointerId: 2 })
      await flushPromises()

      expect(isZoomed()).toBe(true)
      expect(Number(getScale())).toBeCloseTo(2, 1)

      firePointer(stage, 'pointerup', 600, 384, { pointerId: 2 })
      firePointer(stage, 'pointermove', 420, 384, { pointerId: 1 })
      firePointer(stage, 'pointerup', 420, 384, { pointerId: 1 })
      await flushPromises()

      expect(isZoomed()).toBe(true)
    })

    it('then pinching back below the threshold resets the zoom', async () => {
      await openLightbox()
      const stage = getStage()

      firePointer(stage, 'pointerdown', 400, 384, { pointerId: 1 })
      firePointer(stage, 'pointerdown', 600, 384, { pointerId: 2 })
      firePointer(stage, 'pointermove', 490, 384, { pointerId: 1 })
      firePointer(stage, 'pointermove', 510, 384, { pointerId: 2 })
      firePointer(stage, 'pointerup', 510, 384, { pointerId: 2 })
      firePointer(stage, 'pointerup', 490, 384, { pointerId: 1 })
      await flushPromises()

      expect(isZoomed()).toBe(false)
    })

    it('then it does not zoom when the zoom is disabled', async () => {
      await openLightbox({ zoom: false })
      const stage = getStage()

      firePointer(stage, 'pointerdown', 450, 384, { pointerId: 1 })
      firePointer(stage, 'pointerdown', 550, 384, { pointerId: 2 })
      firePointer(stage, 'pointermove', 400, 384, { pointerId: 1 })
      firePointer(stage, 'pointermove', 600, 384, { pointerId: 2 })
      await flushPromises()

      expect(isZoomed()).toBe(false)
    })
  })
})

describe('given pointer gestures', () => {
  describe('when the pointer is a mouse with the right button', () => {
    it('then the gesture is ignored', async () => {
      const lightbox = await openLightbox()
      const stage = getStage()

      firePointer(stage, 'pointerdown', 500, 300, { pointerType: 'mouse', button: 2 })
      firePointer(stage, 'pointermove', 100, 300, { pointerType: 'mouse' })
      firePointer(stage, 'pointerup', 100, 300, { pointerType: 'mouse' })
      await flushPromises()

      expect(lightbox.emitted('update:index')).toBeUndefined()
    })
  })

  describe('when a pointer moves or ends without having started', () => {
    it('then nothing happens', async () => {
      const lightbox = await openLightbox()
      const stage = getStage()

      firePointer(stage, 'pointermove', 100, 300)
      firePointer(stage, 'pointerup', 100, 300)
      await flushPromises()

      expect(lightbox.emitted('update:index')).toBeUndefined()
      expect(getDialog()).not.toBeNull()
    })
  })

  describe('when the image is not shown yet', () => {
    it('then the gesture is ignored', async () => {
      const lightbox = await openLightbox({}, false)
      const stage = getStage()

      firePointer(stage, 'pointerdown', 500, 300)
      firePointer(stage, 'pointermove', 100, 300)
      firePointer(stage, 'pointerup', 100, 300)
      stage.dispatchEvent(new MouseEvent('click', { bubbles: true }))
      await flushPromises()

      expect(lightbox.emitted('update:index')).toBeUndefined()
      expect(lightbox.emitted('before-close')).toBeUndefined()
    })
  })

  describe('when a fast short flick is made', () => {
    it('then the velocity is enough to change the image', async () => {
      const lightbox = await openLightbox()
      const stage = getStage()

      firePointer(stage, 'pointerdown', 500, 300)
      firePointer(stage, 'pointermove', 470, 300)
      firePointer(stage, 'pointerup', 470, 300)
      await flushPromises()

      expect(lightbox.emitted('update:index')?.[0]).toEqual([1])
    })
  })

  describe('when the user swipes towards the end', () => {
    it('then it goes to the previous image', async () => {
      const lightbox = await openLightbox({ index: 1 })
      const stage = getStage()

      firePointer(stage, 'pointerdown', 100, 300)
      firePointer(stage, 'pointermove', 200, 300)
      firePointer(stage, 'pointermove', 600, 300)
      firePointer(stage, 'pointerup', 600, 300)
      await flushPromises()

      expect(lightbox.emitted('update:index')?.[0]).toEqual([0])
      expect(lightbox.emitted('previous')).toHaveLength(1)
    })
  })

  describe('when the user swipes past the last image without loop', () => {
    it('then the drag is damped and it stays on the image', async () => {
      const lightbox = await openLightbox({ loop: false, images: [images[0], images[1]], index: 1 })
      const stage = getStage()

      firePointer(stage, 'pointerdown', 500, 300)
      firePointer(stage, 'pointermove', 400, 300)
      firePointer(stage, 'pointermove', 100, 300)
      const slides = document.querySelector<HTMLElement>('.m-lightbox__slides')!
      firePointer(stage, 'pointerup', 100, 300)
      await flushPromises()

      expect(lightbox.emitted('update:index')).toBeUndefined()
      expect(slides.style.transform).toContain('translate3d(0px, 0px, 0')
    })
  })

  describe('when the user swipes with a single image', () => {
    it('then the drag is damped and it stays', async () => {
      const lightbox = await openLightbox({ images: [images[0]] })
      const stage = getStage()

      firePointer(stage, 'pointerdown', 500, 300)
      firePointer(stage, 'pointermove', 400, 300)
      firePointer(stage, 'pointermove', 100, 300)
      firePointer(stage, 'pointerup', 100, 300)
      await flushPromises()

      expect(lightbox.emitted('update:index')).toBeUndefined()
    })
  })

  describe('when the user drags up fast', () => {
    it('then it closes with the velocity', async () => {
      const lightbox = await openLightbox()
      const stage = getStage()

      firePointer(stage, 'pointerdown', 500, 300)
      firePointer(stage, 'pointermove', 500, 270)
      firePointer(stage, 'pointerup', 500, 270)
      await flushPromises()

      expect(lightbox.emitted('close')).toHaveLength(1)
    })
  })

  describe('when the user drags down a little slowly', () => {
    it('then the image goes back and the lightbox stays', async () => {
      const lightbox = await openLightbox()
      const stage = getStage()

      firePointer(stage, 'pointerdown', 500, 300)
      await new Promise(resolve => setTimeout(resolve, 80))
      firePointer(stage, 'pointermove', 500, 340)
      firePointer(stage, 'pointerup', 500, 340)
      await flushPromises()

      expect(lightbox.emitted('close')).toBeUndefined()
      expect(getDialog()?.style.getPropertyValue('--m-lightbox-fade')).toBe('1')
    })
  })

  describe('when the pointer is cancelled', () => {
    it('then the drag ends', async () => {
      await openLightbox()
      const stage = getStage()

      firePointer(stage, 'pointerdown', 500, 300)
      await new Promise(resolve => setTimeout(resolve, 80))
      firePointer(stage, 'pointermove', 500, 340)
      await flushPromises()
      expect(getDialog()?.classList.contains('--dragging')).toBe(true)
      firePointer(stage, 'pointercancel', 500, 340)
      await flushPromises()

      expect(getDialog()?.classList.contains('--dragging')).toBe(false)
    })
  })

  describe('when a drag ends with a click', () => {
    it('then the click is swallowed once', async () => {
      const lightbox = await openLightbox()
      const stage = getStage()

      firePointer(stage, 'pointerdown', 500, 300)
      firePointer(stage, 'pointermove', 470, 300)
      firePointer(stage, 'pointerup', 470, 300)
      await flushPromises()
      stage.dispatchEvent(new MouseEvent('click', { bubbles: true }))
      await flushPromises()

      expect(lightbox.emitted('before-close')).toBeUndefined()
    })
  })

  describe('when the setPointerCapture fails', () => {
    it('then the gesture still works', async () => {
      const lightbox = await openLightbox()
      const stage = getStage()
      stage.setPointerCapture = () => {
        throw new Error('no capture')
      }

      firePointer(stage, 'pointerdown', 500, 300)
      firePointer(stage, 'pointermove', 100, 300)
      firePointer(stage, 'pointerup', 100, 300)
      await flushPromises()

      expect(lightbox.emitted('update:index')?.[0]).toEqual([1])
    })
  })
})

describe('given the preload', () => {
  describe('when it opens', () => {
    it('then it preloads the neighbours and the full source', async () => {
      await openLightbox()

      const sources = preloadedImages.map(image => image.src)
      expect(sources).toContain('https://example.com/2.jpg')
      expect(sources).toContain('https://example.com/3.jpg')
      expect(sources).toContain('https://example.com/1-full.jpg')
    })

    it('then the full source replaces the src once loaded', async () => {
      await openLightbox()

      preloadedImages.find(image => image.src.endsWith('1-full.jpg'))?.onload?.()
      await flushPromises()

      expect(getImage().getAttribute('src')).toBe('https://example.com/1-full.jpg')
    })
  })

  describe('when it navigates', () => {
    it('then each neighbour is preloaded only once', async () => {
      await openLightbox()
      const count = preloadedImages.length

      await press('ArrowRight')
      await press('ArrowLeft')

      expect(preloadedImages.length).toBeGreaterThanOrEqual(count)
      expect(preloadedImages.filter(image => image.src.endsWith('2.jpg'))).toHaveLength(1)
    })
  })
})

describe('given the props', () => {
  describe('when the index is changed from outside', () => {
    it('then the counter and the caption follow', async () => {
      await openLightbox()

      await wrapper?.setProps({ index: 1 })
      await flushPromises()

      expect(getCounter()).toBe('2 / 3')
      expect(document.querySelector('.m-lightbox__caption')?.textContent?.trim()).toBe('Second')
    })

    it('then an out of range index is clamped', async () => {
      await openLightbox({ index: 42 })

      expect(getCounter()).toBe('3 / 3')
    })
  })

  describe('when counter and caption are disabled', () => {
    it('then neither is rendered', async () => {
      await openLightbox({ counter: false, caption: false })

      expect(getCounter()).toBeUndefined()
      expect(document.querySelector('.m-lightbox__caption')).toBeNull()
    })
  })

  describe('when a label is provided', () => {
    it('then it labels the dialog', async () => {
      await openLightbox({ label: 'Gallery' })

      expect(getDialog()?.getAttribute('aria-label')).toBe('Gallery')
    })

    it('then the image without alt falls back to the default label', async () => {
      await openLightbox({ images: ['https://example.com/a.jpg'] })

      expect(getDialog()?.getAttribute('aria-label')).toBe('Image viewer')
      expect(document.querySelector('.m-lightbox__caption')).toBeNull()
    })
  })

  describe('when there is no image', () => {
    it('then it closes immediately', async () => {
      const lightbox = await openLightbox({ images: [] })

      expect(lightbox.emitted('update:modelValue')?.[0]).toEqual([false])
      expect(getDialog()).toBeNull()
    })
  })

  describe('when the toolbar slot is used', () => {
    it('then it receives the image and the close function', async () => {
      wrapper = mount(MazLightbox, {
        props: { 'modelValue': true, images, 'onUpdate:modelValue': (value: boolean) => wrapper?.setProps({ modelValue: value }) },
        slots: { toolbar: `<template #toolbar="{ image, index, close }"><button class="tool" @click="close">{{ image.alt }}{{ index }}</button></template>` },
        attachTo: document.body,
      })
      await flushPromises()
      document.querySelector('.m-lightbox__image')?.dispatchEvent(new Event('load'))
      await flushPromises()

      const tool = document.querySelector<HTMLButtonElement>('.tool')!
      expect(tool.textContent).toBe('First0')
      tool.click()
      await flushPromises()

      expect(wrapper.emitted('close')).toHaveLength(1)
    })
  })
})

describe('given the lifecycle', () => {
  describe('when the model is toggled', () => {
    it('then it opens again after closing', async () => {
      const lightbox = await openLightbox()

      await lightbox.setProps({ modelValue: false })
      await flushPromises()
      expect(getDialog()).toBeNull()

      await lightbox.setProps({ modelValue: true })
      await flushPromises()
      document.querySelector('.m-lightbox__image')?.dispatchEvent(new Event('load'))
      await flushPromises()

      expect(getDialog()).not.toBeNull()
      expect(lightbox.emitted('open')).toHaveLength(2)
    })
  })

  describe('when it is closed while still loading', () => {
    it('then it closes without waiting for the image', async () => {
      const lightbox = await openLightbox({}, false)

      await lightbox.setProps({ modelValue: false })
      await flushPromises()

      expect(lightbox.emitted('close')).toHaveLength(1)
      expect(lightbox.emitted('open')).toBeUndefined()
    })
  })

  describe('when the image fails to load', () => {
    it('then the spinner is removed', async () => {
      await openLightbox({}, false)
      expect(document.querySelector('[role="status"]')?.getAttribute('aria-label')).toBe('Loading...')

      getImage().dispatchEvent(new Event('error'))
      await flushPromises()

      expect(document.querySelector('[role="status"]')).toBeNull()
    })
  })

  describe('when the window is resized', () => {
    it('then the image is fitted to the new viewport', async () => {
      await openLightbox()
      const before = getImage().style.width

      Object.defineProperty(globalThis, 'innerWidth', { value: 600, configurable: true })
      globalThis.dispatchEvent(new Event('resize'))
      await flushPromises()
      const after = getImage().style.width
      Object.defineProperty(globalThis, 'innerWidth', { value: 1024, configurable: true })

      expect(after).not.toBe(before)
    })
  })

  describe('when the component is unmounted while open', () => {
    it('then the keyboard listener is removed', async () => {
      const lightbox = await openLightbox()
      const emitSpy = vi.spyOn(lightbox.vm.$, 'emit')

      lightbox.unmount()
      wrapper = undefined
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
      await flushPromises()

      expect(emitSpy).not.toHaveBeenCalled()
      expect(getDialog()).toBeNull()
    })
  })

  describe('when the image is already complete', () => {
    it('then it does not wait for the load event', async () => {
      vi.spyOn(HTMLImageElement.prototype, 'complete', 'get').mockReturnValue(true)
      const lightbox = await openLightbox({}, false)

      expect(lightbox.emitted('open')).toHaveLength(1)
    })
  })
})
