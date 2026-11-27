import { captureLastPointer, getLastPointerTarget, useOriginTransition } from '@composables/useOriginTransition.ts'
import { createApp } from 'vue'

interface FakeAnimation {
  keyframes: Keyframe[]
  options: KeyframeAnimationOptions
  onfinish: (() => void) | null
  oncancel: (() => void) | null
  cancel: ReturnType<typeof vi.fn>
  finish: () => void
}

const animations: FakeAnimation[] = []

function rect(left: number, top: number, width: number, height: number) {
  return { left, top, width, height, right: left + width, bottom: top + height, x: left, y: top } as DOMRect
}

function createElement(box: DOMRect, radius = '') {
  const element = document.createElement('div')
  element.style.borderRadius = radius
  document.body.append(element)
  element.getBoundingClientRect = vi.fn(() => box)
  return element
}

function mountWithReducedMotion(prefersReduced: boolean) {
  vi.stubGlobal('matchMedia', vi.fn(() => ({
    matches: prefersReduced,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })))
}

function setup(options: Parameters<typeof useOriginTransition>[0] = {}) {
  let result!: ReturnType<typeof useOriginTransition>
  const app = createApp({
    setup() {
      result = useOriginTransition(options)
      return {}
    },
    template: '<div></div>',
  })
  app.mount(document.createElement('div'))
  return { result, app }
}

function lastAnimation() {
  return animations[animations.length - 1] as FakeAnimation
}

describe('useOriginTransition', () => {
  beforeEach(() => {
    animations.length = 0
    mountWithReducedMotion(false)
    Object.defineProperty(globalThis, 'innerWidth', { value: 1000, configurable: true })
    Object.defineProperty(globalThis, 'innerHeight', { value: 800, configurable: true })
    Element.prototype.animate = vi.fn((keyframes: Keyframe[], options: KeyframeAnimationOptions) => {
      const animation: FakeAnimation = {
        keyframes,
        options,
        onfinish: null,
        oncancel: null,
        cancel: vi.fn(),
        finish() {
          animation.onfinish?.()
        },
      }
      animations.push(animation)
      return animation as unknown as Animation
    }) as unknown as typeof Element.prototype.animate
  })

  afterEach(() => {
    document.body.innerHTML = ''
    vi.unstubAllGlobals()
    vi.useRealTimers()
  })

  describe('given an element origin', () => {
    describe('when the element enters', () => {
      it('then it animates from the rect of the origin to the identity', () => {
        const origin = createElement(rect(100, 100, 50, 20), '8px')
        const element = createElement(rect(300, 200, 500, 400), '16px')
        const { result } = setup({ origin })
        const done = vi.fn()

        result.enter(element, done)

        const animation = lastAnimation()
        expect(animation.keyframes[0]).toMatchObject({
          transform: 'translate(-200px, -100px) scale(0.1, 0.05)',
          opacity: '0',
          borderRadius: '8px',
        })
        expect(animation.keyframes[1]).toMatchObject({ transform: 'none', opacity: '1', borderRadius: '16px' })
        expect(element.style.transformOrigin).toBe('0px 0px')
        expect(element.style.willChange).toBe('transform, opacity')
        expect(done).not.toHaveBeenCalled()
      })

      it('then the styles are cleaned and done is called once when the animation finishes', () => {
        const origin = createElement(rect(100, 100, 50, 20))
        const element = createElement(rect(300, 200, 500, 400))
        const { result } = setup({ origin })
        const done = vi.fn()

        result.enter(element, done)
        lastAnimation().finish()
        lastAnimation().finish()
        lastAnimation().oncancel?.()

        expect(done).toHaveBeenCalledTimes(1)
        expect(element.style.willChange).toBe('')
        expect(element.style.transformOrigin).toBe('')
      })

      it('then it reads one rect per element', () => {
        const origin = createElement(rect(100, 100, 50, 20))
        const element = createElement(rect(300, 200, 500, 400))
        const { result } = setup({ origin })

        result.enter(element, vi.fn())

        expect(element.getBoundingClientRect).toHaveBeenCalledTimes(1)
        expect(origin.getBoundingClientRect).toHaveBeenCalledTimes(1)
      })
    })

    describe('when the element leaves after the enter', () => {
      it('then it goes back to the rect of the origin with the leave ratio and the easing in', () => {
        const origin = createElement(rect(100, 100, 50, 20))
        const element = createElement(rect(300, 200, 500, 400))
        const { result } = setup({ origin, duration: 200, easing: { enter: 'ease-out', leave: 'ease-in' } })
        const done = vi.fn()

        result.enter(element, vi.fn())
        lastAnimation().finish()
        result.leave(element, done)

        const animation = lastAnimation()
        expect(animation.keyframes[0]).toMatchObject({ transform: 'none', opacity: '1' })
        expect(animation.keyframes[1]).toMatchObject({ transform: 'translate(-200px, -100px) scale(0.1, 0.05)', opacity: '0' })
        expect(animation.options).toMatchObject({ duration: 140, easing: 'ease-in', fill: 'forwards' })
        animation.finish()
        expect(done).toHaveBeenCalledTimes(1)
        expect(animation.cancel).toHaveBeenCalled()
      })
    })

    describe('when the origin is replaced with setOrigin before the leave', () => {
      it('then it goes back to the new origin', () => {
        const first = createElement(rect(100, 100, 50, 20))
        const second = createElement(rect(500, 500, 100, 100))
        const element = createElement(rect(300, 200, 500, 400))
        const { result } = setup({ origin: first, duration: 200 })

        result.enter(element, vi.fn())
        lastAnimation().finish()
        result.setOrigin(() => second)
        result.leave(element, vi.fn())

        expect(lastAnimation().keyframes[1]).toMatchObject({ transform: 'translate(200px, 300px) scale(0.2, 0.25)' })
      })
    })
  })

  describe('given a selector origin', () => {
    describe('when the element enters', () => {
      it('then the matching element is the origin', () => {
        const origin = createElement(rect(0, 0, 100, 100))
        origin.id = 'trigger'
        const element = createElement(rect(100, 100, 200, 200))
        const { result } = setup({ origin: '#trigger' })

        result.enter(element, vi.fn())

        expect(lastAnimation().keyframes[0]).toMatchObject({ transform: 'translate(-100px, -100px) scale(0.5, 0.5)' })
      })

      it('then an invalid or unknown selector gives the fade and scale fallback', () => {
        const element = createElement(rect(100, 100, 200, 200))
        const { result } = setup({ origin: '#unknown' })
        const invalid = setup({ origin: '###' }).result

        result.enter(element, vi.fn())
        invalid.enter(element, vi.fn())

        expect(animations[0]?.keyframes[0]).toMatchObject({ transform: 'scale(0.97)', opacity: '0' })
        expect(animations[1]?.keyframes[0]).toMatchObject({ transform: 'scale(0.97)', opacity: '0' })
      })
    })
  })

  describe('given a point origin', () => {
    describe('when the element enters', () => {
      it('then it grows from a tiny scale at the point', () => {
        const element = createElement(rect(100, 100, 200, 200))
        const { result } = setup({ origin: { x: 150, y: 120 } })

        result.enter(element, vi.fn())

        expect(lastAnimation().keyframes[0]).toMatchObject({ transform: 'scale(0.05)', opacity: '0' })
        expect(element.style.transformOrigin).toBe('50px 20px')
      })

      it('then a point outside the viewport gives the fallback', () => {
        const element = createElement(rect(100, 100, 200, 200))
        const { result } = setup({ origin: { x: -10, y: 120 } })

        result.enter(element, vi.fn())

        expect(lastAnimation().keyframes[0]).toMatchObject({ transform: 'scale(0.97)' })
      })
    })
  })

  describe('given an event origin', () => {
    describe('when the event is a pointer click', () => {
      it('then the point of the event is the origin', () => {
        const element = createElement(rect(100, 100, 200, 200))
        const event = new MouseEvent('click', { clientX: 200, clientY: 150, detail: 1 })
        const { result } = setup({ origin: event })

        result.enter(element, vi.fn())

        expect(lastAnimation().keyframes[0]).toMatchObject({ transform: 'scale(0.05)' })
        expect(element.style.transformOrigin).toBe('100px 50px')
      })
    })

    describe('when the event is a keyboard click', () => {
      it('then the target of the event is the origin', () => {
        const button = createElement(rect(0, 0, 100, 100))
        const element = createElement(rect(100, 100, 200, 200))
        const event = new MouseEvent('click', { detail: 0 })
        Object.defineProperty(event, 'target', { value: button })
        const { result } = setup({ origin: event })

        result.enter(element, vi.fn())

        expect(lastAnimation().keyframes[0]).toMatchObject({ transform: 'translate(-100px, -100px) scale(0.5, 0.5)' })
      })
    })
  })

  describe('given no usable origin', () => {
    describe('when there is no origin', () => {
      it('then it fades and scales slightly', () => {
        const element = createElement(rect(100, 100, 200, 200))
        const { result } = setup()

        result.enter(element, vi.fn())

        expect(lastAnimation().keyframes).toEqual([
          { transform: 'scale(0.97)', opacity: '0' },
          { transform: 'none', opacity: '1', borderRadius: '0px' },
        ])
      })
    })

    describe('when the origin is disconnected', () => {
      it('then it uses the fallback', () => {
        const origin = document.createElement('button')
        const element = createElement(rect(100, 100, 200, 200))
        const { result } = setup({ origin })

        result.enter(element, vi.fn())

        expect(lastAnimation().keyframes[0]).toMatchObject({ transform: 'scale(0.97)' })
      })
    })

    describe('when the origin is out of the viewport on leave', () => {
      it('then it fades and scales instead of going back', () => {
        const origin = createElement(rect(100, 100, 50, 20))
        const element = createElement(rect(300, 200, 500, 400))
        const { result } = setup({ origin })

        result.enter(element, vi.fn())
        lastAnimation().finish()
        origin.getBoundingClientRect = vi.fn(() => rect(100, 2000, 50, 20))
        result.leave(element, vi.fn())

        expect(lastAnimation().keyframes[1]).toMatchObject({ transform: 'scale(0.97)', opacity: '0' })
      })
    })

    describe('when the origin has no size', () => {
      it('then it uses the fallback', () => {
        const origin = createElement(rect(100, 100, 0, 0))
        const element = createElement(rect(300, 200, 500, 400))
        const { result } = setup({ origin })

        result.enter(element, vi.fn())

        expect(lastAnimation().keyframes[0]).toMatchObject({ transform: 'scale(0.97)' })
      })
    })

    describe('when the origin is inside the element', () => {
      it('then it uses the fallback', () => {
        const element = createElement(rect(100, 100, 200, 200))
        const origin = document.createElement('button')
        element.append(origin)
        const { result } = setup({ origin })

        result.enter(element, vi.fn())

        expect(lastAnimation().keyframes[0]).toMatchObject({ transform: 'scale(0.97)' })
      })
    })

    describe('when the fallback is fade', () => {
      it('then only the opacity animates', () => {
        const element = createElement(rect(100, 100, 200, 200))
        const { result } = setup({ fallback: 'fade' })

        result.enter(element, vi.fn())

        expect(lastAnimation().keyframes[0]).toEqual({ opacity: '0' })
      })
    })

    describe('when the fallback is none', () => {
      it('then done is called at once without animation', () => {
        const element = createElement(rect(100, 100, 200, 200))
        const { result } = setup({ fallback: 'none' })
        const done = vi.fn()

        result.enter(element, done)

        expect(animations).toHaveLength(0)
        expect(done).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe('given the animated option is false', () => {
    describe('when the element enters and leaves', () => {
      it('then done is called at once without animation', () => {
        const element = createElement(rect(100, 100, 200, 200))
        const { result } = setup({ animated: false })
        const done = vi.fn()

        result.enter(element, done)
        result.leave(element, done)

        expect(animations).toHaveLength(0)
        expect(done).toHaveBeenCalledTimes(2)
      })
    })
  })

  describe('given Element.animate does not exist', () => {
    describe('when the element enters', () => {
      it('then done is called at once', () => {
        const element = createElement(rect(100, 100, 200, 200))
        Object.defineProperty(element, 'animate', { value: undefined })
        const { result } = setup()
        const done = vi.fn()

        result.enter(element, done)

        expect(done).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe('given animate throws', () => {
    describe('when the element enters', () => {
      it('then done is called and the styles are cleaned', () => {
        const element = createElement(rect(100, 100, 200, 200))
        Element.prototype.animate = vi.fn(() => {
          throw new Error('invalid')
        }) as unknown as typeof Element.prototype.animate
        const { result } = setup({ origin: { x: 150, y: 150 } })
        const done = vi.fn()

        result.enter(element, done)

        expect(done).toHaveBeenCalledTimes(1)
        expect(element.style.willChange).toBe('')
        expect(element.style.transformOrigin).toBe('')
      })
    })
  })

  describe('given a zero duration', () => {
    describe('when the element enters', () => {
      it('then done is called at once', () => {
        const element = createElement(rect(100, 100, 200, 200))
        const { result } = setup({ duration: 0 })
        const done = vi.fn()

        result.enter(element, done)

        expect(animations).toHaveLength(0)
        expect(done).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe('given the motion tokens of the theme', () => {
    describe('when the element enters and leaves', () => {
      it('then the duration and the easings are read from the tokens', () => {
        const root = document.documentElement
        root.style.setProperty('--maz-motion-normal', '0.3s')
        root.style.setProperty('--maz-motion-scale', '2')
        root.style.setProperty('--maz-easing-out', 'ease-out')
        root.style.setProperty('--maz-easing-in', 'var(--other)')
        const element = createElement(rect(100, 100, 200, 200))
        const { result } = setup()

        result.enter(element, vi.fn())
        const enterAnimation = lastAnimation()
        result.leave(element, vi.fn())

        expect(enterAnimation.options).toMatchObject({ duration: 600, easing: 'ease-out' })
        expect(lastAnimation().options).toMatchObject({ duration: 420, easing: 'cubic-bezier(0.4, 0, 1, 1)' })
        root.removeAttribute('style')
      })

      it('then invalid tokens give the defaults', () => {
        document.documentElement.style.setProperty('--maz-motion-normal', 'fast')
        const element = createElement(rect(100, 100, 200, 200))
        const { result } = setup()

        result.enter(element, vi.fn())

        expect(lastAnimation().options).toMatchObject({ duration: 200, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' })
        document.documentElement.removeAttribute('style')
      })
    })
  })

  describe('given reduced motion', () => {
    describe('when the element enters with an origin', () => {
      it('then it is a plain fade', () => {
        mountWithReducedMotion(true)
        document.documentElement.style.setProperty('--maz-motion-fast', '100ms')
        const origin = createElement(rect(100, 100, 50, 20))
        const element = createElement(rect(300, 200, 500, 400))
        const { result } = setup({ origin })
        const done = vi.fn()

        result.enter(element, done)

        expect(lastAnimation().keyframes[0]).toEqual({ opacity: '0' })
        expect(lastAnimation().options).toMatchObject({ duration: 100 })
        lastAnimation().finish()
        expect(done).toHaveBeenCalledTimes(1)
        document.documentElement.removeAttribute('style')
      })
    })

    describe('when the element leaves', () => {
      it('then it fades out and calls done once', () => {
        mountWithReducedMotion(true)
        const element = createElement(rect(300, 200, 500, 400))
        const { result } = setup()
        const done = vi.fn()

        result.leave(element, done)
        lastAnimation().finish()

        expect(lastAnimation().keyframes[1]).toEqual({ opacity: '0' })
        expect(done).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe('given a leave that starts during the enter', () => {
    describe('when the enter is running', () => {
      it('then the enter is cancelled, its done is called once and the leave starts from the current values', () => {
        const origin = createElement(rect(100, 100, 50, 20))
        const element = createElement(rect(300, 200, 500, 400))
        const { result } = setup({ origin })
        const enterDone = vi.fn()
        const leaveDone = vi.fn()
        const getComputed = vi.spyOn(globalThis, 'getComputedStyle').mockReturnValue({
          transform: 'matrix(0.5, 0, 0, 0.5, -50, -20)',
          opacity: '0.4',
          borderRadius: '12px',
          getPropertyValue: () => '',
        } as unknown as CSSStyleDeclaration)

        result.enter(element, enterDone)
        const enterAnimation = lastAnimation()
        result.leave(element, leaveDone)
        getComputed.mockRestore()

        expect(enterAnimation.cancel).toHaveBeenCalled()
        expect(enterDone).toHaveBeenCalledTimes(1)
        expect(lastAnimation().keyframes[0]).toEqual({
          transform: 'matrix(0.5, 0, 0, 0.5, -50, -20)',
          opacity: '0.4',
          borderRadius: '12px',
        })
        expect(element.style.transformOrigin).toBe('0px 0px')
        enterAnimation.oncancel?.()
        expect(enterDone).toHaveBeenCalledTimes(1)
        lastAnimation().finish()
        expect(leaveDone).toHaveBeenCalledTimes(1)
        expect(element.style.transformOrigin).toBe('')
      })
    })

    describe('when the enter restarts during the leave', () => {
      it('then the enter ends at the identity from the current values', () => {
        const origin = createElement(rect(100, 100, 50, 20))
        const element = createElement(rect(300, 200, 500, 400))
        const { result } = setup({ origin })

        result.leave(element, vi.fn())
        result.enter(element, vi.fn())

        expect(lastAnimation().keyframes[1]).toMatchObject({ transform: 'none', opacity: '1' })
      })
    })
  })

  describe('given the scope is disposed during an animation', () => {
    describe('when the app is unmounted', () => {
      it('then done is called once', () => {
        const element = createElement(rect(100, 100, 200, 200))
        const { result, app } = setup()
        const done = vi.fn()

        result.enter(element, done)
        app.unmount()

        expect(done).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe('given the last pointer tracker', () => {
    describe('when a pointerdown happens on a button before the enter', () => {
      it('then the element grows from the button containing the target', () => {
        const button = createElement(rect(0, 0, 100, 100))
        const icon = document.createElement('span')
        button.append(icon)
        const buttonElement = document.createElement('button')
        buttonElement.append(icon)
        document.body.append(buttonElement)
        buttonElement.getBoundingClientRect = vi.fn(() => rect(10, 10, 100, 100))
        const element = createElement(rect(110, 110, 200, 200))
        const { result } = setup()

        icon.dispatchEvent(new Event('pointerdown', { bubbles: true }))
        result.enter(element, vi.fn())

        expect(lastAnimation().keyframes[0]).toMatchObject({ transform: 'translate(-100px, -100px) scale(0.5, 0.5)' })
        expect(getLastPointerTarget()).toBe(buttonElement)
      })

      it('then the pointer target is ignored after one second', () => {
        vi.useFakeTimers()
        const target = createElement(rect(0, 0, 100, 100))
        captureLastPointer()
        captureLastPointer()
        target.dispatchEvent(new Event('pointerdown', { bubbles: true }))

        expect(getLastPointerTarget()).toBe(target)
        vi.advanceTimersByTime(1001)
        expect(getLastPointerTarget()).toBeNull()
        expect(getLastPointerTarget(5000)).toBe(target)
      })
    })

    describe('when the pointerdown is on the body or on a removed element', () => {
      it('then there is no target', () => {
        document.body.dispatchEvent(new Event('pointerdown', { bubbles: true }))
        expect(getLastPointerTarget()).toBeNull()

        const target = createElement(rect(0, 0, 100, 100))
        target.dispatchEvent(new Event('pointerdown', { bubbles: true }))
        target.remove()
        expect(getLastPointerTarget()).toBeNull()
      })

      it('then a pointerdown without element target resets the target', () => {
        document.dispatchEvent(new Event('pointerdown'))

        expect(getLastPointerTarget()).toBeNull()
      })
    })
  })
})
