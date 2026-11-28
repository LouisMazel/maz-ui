import { useIntersectionObserver } from '@composables/useIntersectionObserver.ts'
import { FakeIntersectionObserver, useFakeIntersectionObserver } from '@tests/helpers/intersection-observer.ts'
import { withSetup } from '@tests/helpers/withSetup.ts'
import { nextTick, ref } from 'vue'

describe('given useIntersectionObserver', () => {
  useFakeIntersectionObserver()

  describe('when the target is an element', () => {
    it('then it observes the element with the default options', async () => {
      const element = document.createElement('div')

      useIntersectionObserver(element)
      await nextTick()

      expect(FakeIntersectionObserver.last?.elements.has(element)).toBe(true)
      expect(FakeIntersectionObserver.last?.options).toEqual({ root: undefined, rootMargin: '0px', threshold: 0 })
    })
  })

  describe('when the element enters the viewport', () => {
    it('then isIntersecting, entry and the callback are updated', async () => {
      const element = document.createElement('div')
      const callback = vi.fn()
      const { isIntersecting, entry } = useIntersectionObserver(element, callback)
      await nextTick()

      FakeIntersectionObserver.last?.trigger(true)

      expect(isIntersecting.value).toBe(true)
      expect(entry.value?.target).toBe(element)
      expect(callback).toHaveBeenCalledOnce()
    })
  })

  describe('when the element leaves the viewport', () => {
    it('then isIntersecting is false', async () => {
      const element = document.createElement('div')
      const { isIntersecting } = useIntersectionObserver(element)
      await nextTick()

      FakeIntersectionObserver.last?.trigger(true)
      FakeIntersectionObserver.last?.trigger(false)

      expect(isIntersecting.value).toBe(false)
    })
  })

  describe('when several targets are given, one being a component and one empty', () => {
    it('then it observes every element', async () => {
      const first = document.createElement('div')
      const second = document.createElement('span')

      useIntersectionObserver([first, ref({ $el: second } as never), ref(null)])
      await nextTick()

      expect([...FakeIntersectionObserver.last!.elements]).toEqual([first, second])
    })
  })

  describe('when the target ref changes', () => {
    it('then the previous observer is disconnected and the new element observed', async () => {
      const first = document.createElement('div')
      const second = document.createElement('div')
      const target = ref<HTMLElement>(first)

      useIntersectionObserver(target)
      await nextTick()
      const previous = FakeIntersectionObserver.last!
      target.value = second
      await nextTick()

      expect(previous.disconnected).toBe(true)
      expect(FakeIntersectionObserver.last?.elements.has(second)).toBe(true)
    })
  })

  describe('when there is no element', () => {
    it('then no observer is created', async () => {
      useIntersectionObserver(ref(null))
      await nextTick()

      expect(FakeIntersectionObserver.instances).toHaveLength(0)
    })
  })

  describe('when a root, a rootMargin and a threshold are given', () => {
    it('then they are passed to the observer', async () => {
      const root = document.createElement('div')

      useIntersectionObserver(document.createElement('div'), undefined, { root: { $el: root } as never, rootMargin: '200px', threshold: [0, 1] })
      await nextTick()

      expect(FakeIntersectionObserver.last?.options).toEqual({ root, rootMargin: '200px', threshold: [0, 1] })
    })
  })

  describe('when once is true', () => {
    describe('when the element becomes visible', () => {
      it('then it stops observing', async () => {
        const { isActive } = useIntersectionObserver(document.createElement('div'), undefined, { once: true })
        await nextTick()
        const observer = FakeIntersectionObserver.last!

        observer.trigger(false)
        expect(isActive.value).toBe(true)
        observer.trigger(true)
        await nextTick()

        expect(isActive.value).toBe(false)
        expect(observer.disconnected).toBe(true)
      })
    })
  })

  describe('when immediate is false', () => {
    describe('when resume is called', () => {
      it('then it starts observing', async () => {
        const { resume, isActive } = useIntersectionObserver(document.createElement('div'), undefined, { immediate: false })
        await nextTick()
        expect(FakeIntersectionObserver.instances).toHaveLength(0)

        resume()
        await nextTick()

        expect(isActive.value).toBe(true)
        expect(FakeIntersectionObserver.instances).toHaveLength(1)
      })
    })
  })

  describe('when pause is called', () => {
    it('then the observer is disconnected', async () => {
      const { pause } = useIntersectionObserver(document.createElement('div'))
      await nextTick()

      pause()
      await nextTick()

      expect(FakeIntersectionObserver.last?.disconnected).toBe(true)
    })
  })

  describe('when stop is called', () => {
    it('then resume does not observe again', async () => {
      const { stop, resume } = useIntersectionObserver(document.createElement('div'))
      await nextTick()

      stop()
      resume()
      await nextTick()

      expect(FakeIntersectionObserver.instances).toHaveLength(1)
      expect(FakeIntersectionObserver.last?.disconnected).toBe(true)
    })
  })

  describe('when the component unmounts', () => {
    it('then the observer is disconnected', async () => {
      const [, app] = withSetup(() => useIntersectionObserver(document.createElement('div')))
      await nextTick()

      app.unmount()

      expect(FakeIntersectionObserver.last?.disconnected).toBe(true)
    })
  })

  describe('when IntersectionObserver is missing', () => {
    it('then isSupported is false and nothing is observed', async () => {
      const original = globalThis.IntersectionObserver
      Reflect.deleteProperty(globalThis, 'IntersectionObserver')

      const { isSupported } = useIntersectionObserver(document.createElement('div'))
      await nextTick()
      globalThis.IntersectionObserver = original

      expect(isSupported).toBe(false)
      expect(FakeIntersectionObserver.instances).toHaveLength(0)
    })
  })
})
