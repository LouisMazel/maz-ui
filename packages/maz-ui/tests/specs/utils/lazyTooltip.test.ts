import type { DirectiveBinding } from 'vue'
import { createLazyTooltipDirective } from '@/utils/lazyTooltip.ts'

const mountedSpy = vi.fn()
const updatedSpy = vi.fn()
const unmountedSpy = vi.fn()

vi.mock('@/directives/vTooltip.ts', () => ({
  vTooltip: {
    mounted: (...args: unknown[]) => mountedSpy(...args),
    updated: (...args: unknown[]) => updatedSpy(...args),
    unmounted: (...args: unknown[]) => unmountedSpy(...args),
  },
}))

function binding(value: unknown) {
  return { value } as DirectiveBinding<never>
}

function connectedElement() {
  const element = document.createElement('button')
  document.body.append(element)
  return element
}

beforeEach(() => {
  vi.clearAllMocks()
  document.body.innerHTML = ''
})

describe('given the lazy tooltip directive', () => {
  describe('when mounted without a tooltip', () => {
    it('then the tooltip directive is not loaded', async () => {
      const directive = createLazyTooltipDirective()

      await (directive.mounted as (...args: unknown[]) => Promise<void>)(connectedElement(), binding(undefined))

      expect(mountedSpy).not.toHaveBeenCalled()
    })
  })

  describe('when mounted with a tooltip', () => {
    it('then it loads the directive and mounts the tooltip once', async () => {
      const directive = createLazyTooltipDirective()
      const element = connectedElement()

      await (directive.mounted as (...args: unknown[]) => Promise<void>)(element, binding('Hello'))
      await (directive.mounted as (...args: unknown[]) => Promise<void>)(element, binding('Hello'))

      expect(mountedSpy).toHaveBeenCalledTimes(1)
    })

    it('then it ignores an element removed while the directive was loading', async () => {
      const directive = createLazyTooltipDirective()

      await (directive.mounted as (...args: unknown[]) => Promise<void>)(document.createElement('button'), binding('Hello'))

      expect(mountedSpy).not.toHaveBeenCalled()
    })
  })

  describe('when updated', () => {
    it('then an active tooltip is updated and a new one is mounted', async () => {
      const directive = createLazyTooltipDirective()
      const update = directive.updated as (...args: unknown[]) => Promise<void>
      const active = connectedElement()
      const fresh = connectedElement()

      await (directive.mounted as (...args: unknown[]) => Promise<void>)(active, binding('A'))
      await update(active, binding('B'))
      await update(fresh, binding('C'))

      expect(updatedSpy).toHaveBeenCalledTimes(1)
      expect(mountedSpy).toHaveBeenCalledTimes(2)
    })
  })

  describe('when unmounted', () => {
    it('then an active tooltip is destroyed and an unknown element is ignored', async () => {
      const directive = createLazyTooltipDirective()
      const element = connectedElement()

      await (directive.mounted as (...args: unknown[]) => Promise<void>)(element, binding('A'))
      ;(directive.unmounted as (...args: unknown[]) => void)(element)
      ;(directive.unmounted as (...args: unknown[]) => void)(connectedElement())
      await Promise.resolve()
      await Promise.resolve()

      expect(unmountedSpy).toHaveBeenCalledTimes(1)
    })
  })
})
