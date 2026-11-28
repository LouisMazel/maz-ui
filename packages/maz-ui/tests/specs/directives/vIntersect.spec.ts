import { vIntersect, vIntersectInstall } from '@directives/vIntersect.ts'
import { FakeIntersectionObserver, useFakeIntersectionObserver } from '@tests/helpers/intersection-observer.ts'
import { mount } from '@vue/test-utils'
import { createApp, nextTick } from 'vue'

function mountWith(template: string, data: Record<string, unknown>) {
  return mount({
    template,
    directives: { intersect: vIntersect },
    data: () => data,
  })
}

describe('given the vIntersect directive', () => {
  useFakeIntersectionObserver()

  describe('when the value is a function', () => {
    describe('when the element enters the viewport', () => {
      it('then the handler receives true and the entry', async () => {
        const handler = vi.fn()
        const wrapper = mountWith('<div v-intersect="handler" />', { handler })
        await nextTick()

        FakeIntersectionObserver.last?.trigger(true)

        expect(FakeIntersectionObserver.last?.elements.has(wrapper.element)).toBe(true)
        expect(handler).toHaveBeenCalledWith(true, expect.objectContaining({ target: wrapper.element }))
      })
    })
  })

  describe('when the value is an object with options', () => {
    it('then the options are passed to the observer', async () => {
      const root = document.createElement('div')
      mountWith('<div v-intersect="options" />', { options: { handler: vi.fn(), root, rootMargin: '100px', threshold: 0.5 } })
      await nextTick()

      expect(FakeIntersectionObserver.last?.options).toEqual({ root, rootMargin: '100px', threshold: 0.5 })
    })
  })

  describe('when the once modifier is used', () => {
    describe('when the element becomes visible', () => {
      it('then the observer is disconnected', async () => {
        const handler = vi.fn()
        mountWith('<div v-intersect.once="handler" />', { handler })
        await nextTick()
        const observer = FakeIntersectionObserver.last!

        observer.trigger(true)
        await nextTick()

        expect(handler).toHaveBeenCalledOnce()
        expect(observer.disconnected).toBe(true)
      })
    })
  })

  describe('when the component renders again with an inline handler', () => {
    it('then the observer is kept and the new handler is called', async () => {
      const calls: number[] = []
      const wrapper = mountWith('<div v-intersect="() => calls.push(count)">{{ count }}</div>', { calls, count: 1 })
      await nextTick()

      wrapper.vm.count = 2
      await nextTick()
      await nextTick()
      FakeIntersectionObserver.last?.trigger(true)

      expect(FakeIntersectionObserver.instances).toHaveLength(1)
      expect(calls).toEqual([2])
    })
  })

  describe('when the options change', () => {
    it('then a new observer is created', async () => {
      const handler = vi.fn()
      const wrapper = mountWith('<div v-intersect="{ handler, rootMargin }" />', { handler, rootMargin: '0px' })
      await nextTick()
      const previous = FakeIntersectionObserver.last!

      wrapper.vm.rootMargin = '50px'
      await nextTick()
      await nextTick()

      expect(previous.disconnected).toBe(true)
      expect(FakeIntersectionObserver.last?.options.rootMargin).toBe('50px')
    })
  })

  describe('when the component unmounts', () => {
    it('then the observer is disconnected', async () => {
      const wrapper = mountWith('<div v-intersect="handler" />', { handler: vi.fn() })
      await nextTick()

      wrapper.unmount()

      expect(FakeIntersectionObserver.last?.disconnected).toBe(true)
    })
  })

  describe('when the value has no handler', () => {
    it('then it throws a TypeError', () => {
      expect(() => mountWith('<div v-intersect="options" />', { options: { rootMargin: '0px' } })).toThrow(TypeError)
    })
  })

  describe('when the plugin is installed', () => {
    it('then the directive is registered as intersect', () => {
      const app = createApp({})

      app.use(vIntersectInstall)

      expect(app.directive('intersect')).toBe(vIntersect)
    })
  })
})
