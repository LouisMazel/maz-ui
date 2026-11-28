import MazBackdrop from '@components/MazBackdrop.vue'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'

interface FakeAnimation {
  keyframes: Keyframe[]
  options: KeyframeAnimationOptions
  onfinish: (() => void) | null
  oncancel: (() => void) | null
  cancel: ReturnType<typeof vi.fn>
}

const animations: FakeAnimation[] = []

function rect(left: number, top: number, width: number, height: number) {
  return { left, top, width, height, right: left + width, bottom: top + height, x: left, y: top } as DOMRect
}

function createOrigin() {
  const origin = document.createElement('button')
  document.body.append(origin)
  origin.getBoundingClientRect = vi.fn(() => rect(100, 100, 50, 20))
  HTMLElement.prototype.getBoundingClientRect = vi.fn(() => rect(300, 200, 500, 400))

  return origin
}

function getWrapper(props: Record<string, unknown> = {}) {
  return mount(MazBackdrop, {
    props: { modelValue: true, growFromOrigin: true, ...props },
    slots: { default: '<div class="panel">Panel</div>' },
    attachTo: document.body,
    global: { stubs: { transition: false, teleport: false } },
  })
}

function lastAnimation() {
  return animations.at(-1) as FakeAnimation
}

describe('given a backdrop that grows from its origin', () => {
  beforeEach(() => {
    animations.length = 0
    Object.defineProperty(globalThis, 'innerWidth', { value: 1000, configurable: true })
    Object.defineProperty(globalThis, 'innerHeight', { value: 800, configurable: true })
    vi.stubGlobal('matchMedia', vi.fn(() => ({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })))
    Element.prototype.animate = vi.fn((keyframes: Keyframe[], options: KeyframeAnimationOptions) => {
      const animation: FakeAnimation = { keyframes, options, onfinish: null, oncancel: null, cancel: vi.fn() }
      animations.push(animation)

      return animation as unknown as Animation
    }) as unknown as typeof Element.prototype.animate
  })

  afterEach(() => {
    delete (HTMLElement.prototype as Partial<HTMLElement>).getBoundingClientRect
    document.body.innerHTML = ''
    vi.unstubAllGlobals()
  })

  describe('when it opens with an element origin', () => {
    it('then the panel animates from the rect of the origin', () => {
      const origin = createOrigin()
      getWrapper({ origin })

      expect(animations).toHaveLength(1)
      expect(lastAnimation().keyframes[0]).toMatchObject({ opacity: '0' })
      expect(String(lastAnimation().keyframes[0]?.transform)).toContain('translate(')
    })

    it('then it emits open when the animation finishes', async () => {
      const wrapper = getWrapper({ origin: createOrigin() })

      expect(wrapper.emitted('open')).toBeUndefined()

      lastAnimation().onfinish?.()
      await nextTick()

      expect(wrapper.emitted('open')).toHaveLength(1)
    })

    it('then the backdrop has the grow class', () => {
      getWrapper({ origin: createOrigin() })

      expect(document.querySelector('.m-backdrop')?.classList.contains('--grow')).toBe(true)
    })
  })

  describe('when it opens with a point origin', () => {
    it('then the panel scales from the point', () => {
      getWrapper({ origin: { x: 200, y: 300 } })

      expect(lastAnimation().keyframes[0]).toMatchObject({ transform: 'scale(0.05)', opacity: '0' })
    })
  })

  describe('when it opens without origin', () => {
    it('then the panel fades and scales slightly', () => {
      getWrapper()

      expect(lastAnimation().keyframes[0]).toMatchObject({ transform: 'scale(0.97)', opacity: '0' })
    })
  })

  describe('when it is not animated', () => {
    it('then the panel does not animate', () => {
      getWrapper({ origin: createOrigin(), animated: false })

      expect(animations).toHaveLength(0)
    })
  })

  describe('when it closes', () => {
    it('then the panel goes back to the origin and the close events follow the animation', async () => {
      const origin = createOrigin()
      const wrapper = getWrapper({ origin })
      lastAnimation().onfinish?.()
      await nextTick()

      await wrapper.setProps({ modelValue: false })

      expect(animations).toHaveLength(2)
      expect(lastAnimation().keyframes[1]).toMatchObject({ opacity: '0' })
      expect(String(lastAnimation().keyframes[1]?.transform)).toContain('translate(')
      expect(wrapper.emitted('close')).toBeUndefined()

      lastAnimation().onfinish?.()
      await nextTick()

      expect(wrapper.emitted('close')).toHaveLength(1)
      expect(wrapper.emitted('update:model-value')?.at(-1)).toEqual([false])
    })

    it('then an interrupted enter still ends the close', async () => {
      const wrapper = getWrapper({ origin: createOrigin() })

      await wrapper.setProps({ modelValue: false })
      lastAnimation().onfinish?.()
      await nextTick()

      expect(wrapper.emitted('close')).toHaveLength(1)
    })
  })

  describe('given a backdrop without grow-from-origin', () => {
    describe('when it opens', () => {
      it('then the panel is not animated by script and has no grow class', () => {
        mount(MazBackdrop, {
          props: { modelValue: true, origin: createOrigin() },
          slots: { default: '<div class="panel">Panel</div>' },
          global: { stubs: { transition: false, teleport: false } },
        })

        expect(animations).toHaveLength(0)
        expect(document.querySelector('.m-backdrop')?.classList.contains('--grow')).toBe(false)
      })
    })
  })
})
