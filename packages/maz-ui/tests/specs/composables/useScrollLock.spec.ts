import type { App } from 'vue'
import { useScrollLock } from '@composables/useScrollLock.ts'
import { withSetup } from '@tests/helpers/withSetup.ts'
import { nextTick, ref } from 'vue'

const apps: App[] = []

function lockOf(...args: Parameters<typeof useScrollLock>) {
  const [result, app] = withSetup(() => useScrollLock(...args))
  apps.push(app)
  return result
}

function elementWithScrollbar(scrollbar = 15) {
  const element = document.createElement('div')
  Object.defineProperty(element, 'offsetWidth', { value: 100 + scrollbar })
  Object.defineProperty(element, 'clientWidth', { value: 100 })
  return element
}

describe('given useScrollLock', () => {
  afterEach(() => {
    for (const app of apps.splice(0)) app.unmount()
    document.documentElement.removeAttribute('style')
  })

  describe('when lock is called without target', () => {
    it('then the page does not scroll', () => {
      const { lock, isLocked } = lockOf()

      lock()

      expect(isLocked.value).toBe(true)
      expect(document.documentElement.style.overflow).toBe('hidden')
    })

    describe('when unlock is called', () => {
      it('then the previous overflow is restored', () => {
        document.documentElement.style.overflow = 'auto'
        const { lock, unlock } = lockOf()

        lock()
        unlock()

        expect(document.documentElement.style.overflow).toBe('auto')
      })
    })
  })

  describe('when the initial value is true', () => {
    it('then the page is locked right away', () => {
      lockOf(undefined, true)

      expect(document.documentElement.style.overflow).toBe('hidden')
    })
  })

  describe('when the page has a scrollbar', () => {
    it('then its width is kept as a padding and a variable', () => {
      vi.spyOn(globalThis, 'innerWidth', 'get').mockReturnValue(document.documentElement.clientWidth + 17)
      const { lock, unlock } = lockOf()

      lock()

      expect(document.documentElement.style.paddingInlineEnd).toBe('17px')
      expect(document.documentElement.style.getPropertyValue('--scrollbar-width')).toBe('17px')
      unlock()
      expect(document.documentElement.style.getPropertyValue('--scrollbar-width')).toBe('')
      vi.restoreAllMocks()
    })
  })

  describe('when the target is an element with a scrollbar', () => {
    it('then the element is locked with its scrollbar width', () => {
      const element = elementWithScrollbar()
      const { toggle } = lockOf(element)

      toggle()

      expect(element.style.overflow).toBe('hidden')
      expect(element.style.paddingInlineEnd).toBe('15px')
    })
  })

  describe('when two locks are held on the same element', () => {
    describe('when the first one is released', () => {
      it('then the element stays locked until the last one', () => {
        const element = document.createElement('div')
        const first = lockOf(element, true)
        const second = lockOf(element, true)

        first.unlock()
        expect(element.style.overflow).toBe('hidden')
        second.unlock()

        expect(element.style.overflow).toBe('')
      })
    })
  })

  describe('when isLocked is set', () => {
    it('then the element is locked', () => {
      const element = document.createElement('div')
      const { isLocked } = lockOf(element)

      isLocked.value = true

      expect(element.style.overflow).toBe('hidden')
    })
  })

  describe('when the target is a component ref that changes', () => {
    it('then the lock moves to the new element', async () => {
      const first = document.createElement('div')
      const second = document.createElement('div')
      const target = ref<{ $el: HTMLElement } | null>({ $el: first })
      lockOf(target as never, true)

      target.value = { $el: second }
      await nextTick()

      expect(first.style.overflow).toBe('')
      expect(second.style.overflow).toBe('hidden')
    })
  })

  describe('when the target is empty', () => {
    it('then lock does nothing', () => {
      const { lock, isLocked } = lockOf(ref(null))

      lock()

      expect(isLocked.value).toBe(true)
      expect(document.documentElement.style.overflow).toBe('')
    })
  })

  describe('when unlock is called twice', () => {
    it('then it does not throw', () => {
      const { lock, unlock } = lockOf()

      lock()

      expect(() => {
        unlock()
        unlock()
      }).not.toThrow()
    })
  })

  describe('when the component unmounts while locked', () => {
    it('then the page scrolls again', () => {
      const [, app] = withSetup(() => useScrollLock(undefined, true))

      app.unmount()

      expect(document.documentElement.style.overflow).toBe('')
    })
  })
})
