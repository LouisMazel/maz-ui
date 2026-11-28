import type { UseSlidingIndicatorOptions } from '@composables/useSlidingIndicator.ts'
import { useSlidingIndicator } from '@composables/useSlidingIndicator.ts'
import { FakeResizeObserver, resizeEntry, useFakeResizeObserver } from '@tests/helpers/resize-observer.ts'
import { withSetup } from '@tests/helpers/withSetup.ts'
import { nextTick, ref } from 'vue'

function rect(left: number, top: number, width: number, height: number) {
  return {
    left,
    top,
    width,
    height,
    right: left + width,
    bottom: top + height,
    x: left,
    y: top,
    toJSON: () => ({}),
  } as DOMRect
}

function createElement(box: DOMRect) {
  const element = document.createElement('button')
  element.getBoundingClientRect = () => box
  return element
}

function createGroup(direction: 'ltr' | 'rtl' = 'ltr') {
  const container = createElement(rect(100, 50, 300, 40))
  container.style.direction = direction
  Object.defineProperty(container, 'offsetWidth', { value: 300 })
  Object.defineProperty(container, 'clientWidth', { value: 300 })
  const first = createElement(direction === 'ltr' ? rect(100, 50, 100, 40) : rect(300, 50, 100, 40))
  const second = createElement(direction === 'ltr' ? rect(200, 50, 150, 40) : rect(150, 50, 150, 40))
  document.body.append(container)
  container.append(first, second)
  return { container, first, second }
}

function setup(options: Partial<UseSlidingIndicatorOptions> & Pick<UseSlidingIndicatorOptions, 'container' | 'active'>) {
  return withSetup(() => useSlidingIndicator(options))
}

async function flush() {
  await nextTick()
  await nextTick()
}

function mockReducedMotion(reduced: boolean) {
  vi.stubGlobal('matchMedia', vi.fn(() => ({
    matches: reduced,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })))
}

describe('given useSlidingIndicator', () => {
  useFakeResizeObserver()

  beforeEach(() => {
    vi.useFakeTimers()
    mockReducedMotion(false)
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
    document.body.innerHTML = ''
  })

  describe('when the first placement happens', () => {
    it('then the indicator is hidden before, positioned after, and without transition', async () => {
      const { container, first } = createGroup()
      const [{ style, isReady }] = setup({ container, active: first })

      expect(isReady.value).toBe(false)
      expect(style.value).toEqual({ opacity: 0 })

      await flush()

      expect(isReady.value).toBe(true)
      expect(style.value).toEqual({ width: '100px', height: '40px', transform: 'translateX(0px)' })
    })
  })

  describe('when the active element changes', () => {
    it('then the indicator moves with the transition tokens', async () => {
      const { container, first, second } = createGroup()
      const active = ref<HTMLElement>(first)
      const [{ style }] = setup({ container, active })
      await flush()
      vi.advanceTimersByTime(50)

      active.value = second
      await flush()

      expect(style.value).toMatchObject({
        width: '150px',
        transform: 'translateX(100px)',
        transitionProperty: 'transform, width, height',
        transitionDuration: 'calc(var(--maz-motion-normal) * var(--maz-motion-scale))',
        transitionTimingFunction: 'var(--maz-easing-spring)',
      })
    })
  })

  describe('when the orientation is vertical', () => {
    it('then the transform translates on both axes', async () => {
      const { container, first, second } = createGroup()
      second.getBoundingClientRect = () => rect(100, 90, 100, 30)
      const [{ style }] = setup({ container, active: second, orientation: 'vertical' })
      await flush()

      expect(first).toBeDefined()
      expect(style.value).toMatchObject({ transform: 'translate(0px, 40px)', height: '30px' })
    })
  })

  describe('when the direction is rtl', () => {
    it('then the offset is computed from the inline start', async () => {
      const { container, second } = createGroup('rtl')
      const [{ style }] = setup({ container, active: second })
      await flush()

      expect(style.value).toMatchObject({ transform: 'translateX(-100px)', width: '150px' })
    })
  })

  describe('when stretch is enabled and the active element changes', () => {
    it('then the indicator covers both elements, then shrinks to the target', async () => {
      const { container, first, second } = createGroup()
      const active = ref<HTMLElement>(first)
      const [{ style }] = setup({ container, active, stretch: true })
      await flush()
      vi.advanceTimersByTime(50)

      active.value = second
      await flush()

      expect(style.value).toMatchObject({ transform: 'translateX(0px)', width: '250px' })

      vi.advanceTimersByTime(150)
      await nextTick()

      expect(style.value).toMatchObject({ transform: 'translateX(100px)', width: '150px' })
    })

    it('then the vertical indicator stretches on the vertical axis', async () => {
      const { container, first, second } = createGroup()
      second.getBoundingClientRect = () => rect(100, 90, 100, 30)
      const active = ref<HTMLElement>(first)
      const [{ style }] = setup({ container, active, stretch: true, orientation: 'vertical' })
      await flush()
      vi.advanceTimersByTime(50)

      active.value = second
      await flush()

      expect(style.value).toMatchObject({ transform: 'translate(0px, 0px)', height: '70px' })
    })
  })

  describe('when animated is false', () => {
    it('then the style has no transition', async () => {
      const { container, first, second } = createGroup()
      const active = ref<HTMLElement>(first)
      const [{ style, shouldAnimate }] = setup({ container, active, animated: false, stretch: true })
      await flush()
      vi.advanceTimersByTime(50)
      active.value = second
      await flush()

      expect(shouldAnimate.value).toBe(false)
      expect(style.value.transitionProperty).toBeUndefined()
      expect(style.value).toMatchObject({ width: '150px' })
    })
  })

  describe('when the user prefers reduced motion', () => {
    it('then shouldAnimate is false and the style has no transition', async () => {
      mockReducedMotion(true)
      const { container, first } = createGroup()
      const [{ style, shouldAnimate }] = setup({ container, active: first })
      await flush()
      vi.advanceTimersByTime(50)

      expect(shouldAnimate.value).toBe(false)
      expect(style.value.transitionProperty).toBeUndefined()
    })
  })

  describe('when the container is resized', () => {
    it('then the indicator is measured again', async () => {
      const { container, first } = createGroup()
      const [{ style }] = setup({ container, active: first })
      await flush()

      first.getBoundingClientRect = () => rect(100, 50, 120, 40)
      FakeResizeObserver.last?.trigger([resizeEntry(container, 300, 40)])

      expect(style.value).toMatchObject({ width: '120px' })
    })
  })

  describe('when update is called', () => {
    it('then the indicator is measured again', async () => {
      const { container, first } = createGroup()
      const [{ style, update }] = setup({ container, active: first })
      await flush()

      first.getBoundingClientRect = () => rect(100, 50, 80, 40)
      update()

      expect(style.value).toMatchObject({ width: '80px' })
    })
  })

  describe('when there is no active element', () => {
    it('then the indicator stays hidden and not ready', async () => {
      const { container } = createGroup()
      const [{ style, isReady }] = setup({ container, active: undefined })
      await flush()

      expect(isReady.value).toBe(false)
      expect(style.value).toEqual({ opacity: 0 })
    })
  })

  describe('when the active element is removed after the placement', () => {
    it('then the indicator is hidden', async () => {
      const { container, first } = createGroup()
      const active = ref<HTMLElement | undefined>(first)
      const [{ style }] = setup({ container, active })
      await flush()

      active.value = undefined
      await flush()

      expect(style.value).toEqual({ opacity: 0 })
    })
  })

  describe('when the targets are component instances', () => {
    it('then their root elements are used', async () => {
      const { container, first } = createGroup()
      const [{ style }] = setup({ container: { $el: container } as never, active: { $el: first } as never })
      await flush()

      expect(style.value).toMatchObject({ width: '100px' })
    })
  })
})

describe('given a sliding indicator placed in a left to right page', () => {
  describe('when the direction of the page changes', () => {
    it('then the indicator is placed again', async () => {
      const container = document.createElement('div')
      const active = document.createElement('button')
      container.append(active)
      document.body.append(container)
      let left = 10
      active.getBoundingClientRect = () => ({ left, top: 0, width: 40, height: 20, right: left + 40, bottom: 20, x: left, y: 0, toJSON: () => ({}) }) as DOMRect
      container.getBoundingClientRect = () => ({ left: 0, top: 0, width: 200, height: 20, right: 200, bottom: 20, x: 0, y: 0, toJSON: () => ({}) }) as DOMRect

      const { useSlidingIndicator } = await import('@composables/useSlidingIndicator.ts')
      const { effectScope, nextTick } = await import('vue')
      const scope = effectScope()
      const result = scope.run(() => useSlidingIndicator({ container, active }))!
      await nextTick()
      await nextTick()
      const before = String(result.style.value.transform)

      left = 150
      document.documentElement.setAttribute('dir', 'rtl')
      await new Promise(resolve => setTimeout(resolve, 0))
      await nextTick()

      expect(String(result.style.value.transform)).not.toBe(before)

      document.documentElement.removeAttribute('dir')
      scope.stop()
      container.remove()
    })
  })
})
