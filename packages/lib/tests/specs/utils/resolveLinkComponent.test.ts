import { createApp, defineComponent, h } from 'vue'
import { resolveLinkComponent } from '@/utils/resolveLinkComponent'

function callInsideSetup(fn: () => unknown): unknown {
  let result: unknown
  const app = createApp(defineComponent({
    setup() {
      result = fn()
      return () => h('div')
    },
  }))
  app.mount(document.createElement('div'))
  app.unmount()
  return result
}

const NuxtLinkStub = defineComponent({ name: 'NuxtLink', render: () => h('a') })
const RouterLinkStub = defineComponent({ name: 'RouterLink', render: () => h('a') })

describe('Given resolveLinkComponent helper', () => {
  describe('When a link component is provided via inject', () => {
    it('Then it returns the provided component', () => {
      let result: unknown
      const app = createApp(defineComponent({
        setup() {
          result = resolveLinkComponent()
          return () => h('div')
        },
      }))
      app.provide('mazLinkComponent', NuxtLinkStub)
      app.mount(document.createElement('div'))
      app.unmount()

      expect(result).toBe(NuxtLinkStub)
    })
  })

  describe('When only RouterLink is available', () => {
    it('Then it returns RouterLink', () => {
      let result: unknown
      const app = createApp(defineComponent({
        setup() {
          result = resolveLinkComponent()
          return () => h('div')
        },
      }))
      app.component('RouterLink', RouterLinkStub)
      app.mount(document.createElement('div'))
      app.unmount()

      expect(result).toBe(RouterLinkStub)
    })
  })

  describe('When no router components are available', () => {
    it('Then it returns anchor tag and log warning', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const result = callInsideSetup(() => resolveLinkComponent())

      expect(result).toBe('a')
      expect(consoleSpy).toHaveBeenCalledWith(
        'You are using the "to" property but no router component was found (NuxtLink or RouterLink), falling back to anchor ("<a />" - HTMLAnchorElement) tag',
      )

      consoleSpy.mockRestore()
    })
  })

  describe('When provided component takes priority over RouterLink', () => {
    it('Then it returns the provided component', () => {
      let result: unknown
      const app = createApp(defineComponent({
        setup() {
          result = resolveLinkComponent()
          return () => h('div')
        },
      }))
      app.component('RouterLink', RouterLinkStub)
      app.provide('mazLinkComponent', NuxtLinkStub)
      app.mount(document.createElement('div'))
      app.unmount()

      expect(result).toBe(NuxtLinkStub)
    })
  })
})
