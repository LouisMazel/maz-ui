import { useReveal } from '@composables/useReveal.ts'
import { withSetup } from '@tests/helpers/withSetup.ts'
import { IntersectionObserverMock } from '@tests/vitest-global.setup.ts'
import { nextTick } from 'vue'

let host: HTMLElement

describe('given the useReveal composable', () => {
  beforeEach(() => {
    host = document.createElement('div')
    host.innerHTML = '<p data-maz-reveal="fade" data-maz-reveal-delay="200">One</p><p class="plain">Two</p>'
    document.body.append(host)
    vi.mocked(IntersectionObserver).mockClear()
  })

  afterEach(() => {
    host.remove()
  })

  describe('when it is called in a component', () => {
    it('then the elements with the attribute are revealed on mount, with the options of their attributes', () => {
      const [result, app] = withSetup(() => useReveal({ effect: 'scale' }))
      const [first, second] = host.querySelectorAll('p')

      expect(first?.getAttribute('data-maz-reveal-state')).toBe('hidden')
      expect(first?.style.getPropertyValue('--maz-reveal-delay')).toBe('200ms')
      expect(second?.hasAttribute('data-maz-reveal-state')).toBe(false)

      result.stop()
      app.unmount()
    })
  })

  describe('when a selector and a root are given', () => {
    it('then the matching elements get the default options', () => {
      const [result, app] = withSetup(() => useReveal({ selector: '.plain', root: host, effect: 'scale', blur: true }))
      const second = host.querySelector('.plain')

      expect(second?.getAttribute('data-maz-reveal')).toBe('scale')
      expect(second?.hasAttribute('data-maz-reveal-blur')).toBe(true)

      result.stop()
      app.unmount()
    })
  })

  describe('when new elements are added', () => {
    it('then scan reveals them and forgets the removed ones', () => {
      const [result, app] = withSetup(() => useReveal({ root: host }))
      const added = document.createElement('p')
      added.setAttribute('data-maz-reveal', 'blur')
      host.append(added)
      host.querySelector('p')?.remove()
      result.scan()

      expect(added.getAttribute('data-maz-reveal-state')).toBe('hidden')

      result.stop()

      expect(added.hasAttribute('data-maz-reveal')).toBe(false)
      app.unmount()
    })
  })

  describe('when a router is given', () => {
    it('then it scans again after each navigation and stops the hook', async () => {
      const remove = vi.fn()
      let afterEach: () => void = () => {}
      const router = { afterEach: vi.fn((hook: () => void) => {
        afterEach = hook
        return remove
      }) }
      const [result, app] = withSetup(() => useReveal({ router: router as never, root: host }))
      const added = document.createElement('p')
      added.setAttribute('data-maz-reveal', 'fade')
      host.append(added)
      afterEach()
      await nextTick()

      expect(added.getAttribute('data-maz-reveal-state')).toBe('hidden')

      result.stop()

      expect(remove).toHaveBeenCalled()
      expect(IntersectionObserverMock.unobserve).toHaveBeenCalled()
      app.unmount()
    })
  })
})
