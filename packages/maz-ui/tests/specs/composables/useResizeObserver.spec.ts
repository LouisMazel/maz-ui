import { useResizeObserver } from '@composables/useResizeObserver.ts'
import { FakeResizeObserver, resizeEntry, useFakeResizeObserver } from '@tests/helpers/resize-observer.ts'
import { withSetup } from '@tests/helpers/withSetup.ts'
import { nextTick, ref } from 'vue'

describe('given useResizeObserver', () => {
  useFakeResizeObserver()

  describe('when the target is an element', () => {
    it('then it observes the content box of the element', async () => {
      const element = document.createElement('div')

      useResizeObserver(element)
      await nextTick()

      expect(FakeResizeObserver.last?.elements.get(element)).toEqual({ box: 'content-box' })
    })
  })

  describe('when the element is resized', () => {
    it('then width, height, entry and the callback are updated', async () => {
      const element = document.createElement('div')
      const callback = vi.fn()
      const { width, height, entry } = useResizeObserver(element, callback)
      await nextTick()

      FakeResizeObserver.last?.trigger([resizeEntry(element, 320, 180)])

      expect(width.value).toBe(320)
      expect(height.value).toBe(180)
      expect(entry.value?.target).toBe(element)
      expect(callback).toHaveBeenCalledOnce()
    })
  })

  describe('when the box is border-box', () => {
    it('then it observes and measures the border box', async () => {
      const element = document.createElement('div')
      const { width } = useResizeObserver(element, undefined, { box: 'border-box' })
      await nextTick()

      FakeResizeObserver.last?.trigger([{ ...resizeEntry(element, 100, 50), borderBoxSize: [{ inlineSize: 110, blockSize: 60 }] }])

      expect(FakeResizeObserver.last?.elements.get(element)).toEqual({ box: 'border-box' })
      expect(width.value).toBe(110)
    })
  })

  describe('when the entry has no box sizes', () => {
    it('then the size comes from contentRect', async () => {
      const element = document.createElement('div')
      const { height } = useResizeObserver(element)
      await nextTick()

      FakeResizeObserver.last?.trigger([resizeEntry(element, 40, 24, false)])

      expect(height.value).toBe(24)
    })
  })

  describe('when several targets are given, one being a component and one empty', () => {
    it('then it observes every element and measures the first one', async () => {
      const first = document.createElement('div')
      const second = document.createElement('span')
      const { width } = useResizeObserver([first, ref({ $el: second } as never), ref(null)])
      await nextTick()

      FakeResizeObserver.last?.trigger([resizeEntry(second, 10, 10)])
      expect(width.value).toBe(0)
      FakeResizeObserver.last?.trigger([resizeEntry(second, 10, 10), resizeEntry(first, 200, 20)])

      expect([...FakeResizeObserver.last!.elements.keys()]).toEqual([first, second])
      expect(width.value).toBe(200)
    })
  })

  describe('when the target ref changes', () => {
    it('then the previous observer is disconnected and the new element observed', async () => {
      const first = document.createElement('div')
      const second = document.createElement('div')
      const target = ref<HTMLElement>(first)

      useResizeObserver(target)
      await nextTick()
      const previous = FakeResizeObserver.last!
      target.value = second
      await nextTick()

      expect(previous.disconnected).toBe(true)
      expect(FakeResizeObserver.last?.elements.has(second)).toBe(true)
    })
  })

  describe('when there is no element', () => {
    it('then no observer is created', async () => {
      useResizeObserver(ref(null))
      await nextTick()

      expect(FakeResizeObserver.instances).toHaveLength(0)
    })
  })

  describe('when immediate is false', () => {
    describe('when resume is called', () => {
      it('then it starts observing', async () => {
        const { resume, isActive } = useResizeObserver(document.createElement('div'), undefined, { immediate: false })
        await nextTick()
        expect(FakeResizeObserver.instances).toHaveLength(0)

        resume()
        await nextTick()

        expect(isActive.value).toBe(true)
        expect(FakeResizeObserver.instances).toHaveLength(1)
      })
    })
  })

  describe('when pause is called', () => {
    it('then the observer is disconnected', async () => {
      const { pause } = useResizeObserver(document.createElement('div'))
      await nextTick()

      pause()
      await nextTick()

      expect(FakeResizeObserver.last?.disconnected).toBe(true)
    })
  })

  describe('when stop is called', () => {
    it('then resume does not observe again', async () => {
      const { stop, resume } = useResizeObserver(document.createElement('div'))
      await nextTick()

      stop()
      resume()
      await nextTick()

      expect(FakeResizeObserver.instances).toHaveLength(1)
      expect(FakeResizeObserver.last?.disconnected).toBe(true)
    })
  })

  describe('when the component unmounts', () => {
    it('then the observer is disconnected', async () => {
      const [, app] = withSetup(() => useResizeObserver(document.createElement('div')))
      await nextTick()

      app.unmount()

      expect(FakeResizeObserver.last?.disconnected).toBe(true)
    })
  })

  describe('when ResizeObserver is missing', () => {
    it('then isSupported is false and nothing is observed', async () => {
      const original = globalThis.ResizeObserver
      Reflect.deleteProperty(globalThis, 'ResizeObserver')

      const { isSupported } = useResizeObserver(document.createElement('div'))
      await nextTick()
      globalThis.ResizeObserver = original

      expect(isSupported).toBe(false)
      expect(FakeResizeObserver.instances).toHaveLength(0)
    })
  })
})
