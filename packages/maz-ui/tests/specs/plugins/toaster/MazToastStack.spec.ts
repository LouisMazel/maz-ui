import MazDrawnIcon from '@components/MazDrawnIcon.vue'
import MazToast from '@plugins/toast/MazToast.vue'
import { getToastStack } from '@plugins/toast/stack.ts'
import { ToastHandler } from '@plugins/toast/ToastHandler.ts'
import { mount } from '@vue/test-utils'
import { createApp, nextTick } from 'vue'

async function flush() {
  await nextTick()
  await nextTick()
}

function mountToast(props: Record<string, unknown> = {}) {
  return mount(MazToast, { props: { message: 'Message', position: 'bottom-right', ...props } })
}

function getToasts() {
  return [...document.querySelectorAll<HTMLElement>('.m-toast')]
}

function mockWidth(element: HTMLElement, width: number) {
  Object.defineProperty(element, 'offsetWidth', { configurable: true, value: width })
}

function pointer(element: Element, type: string, clientX: number) {
  const event = new Event(type, { bubbles: true })
  Object.assign(event, { clientX, clientY: 0, pointerId: 1, pointerType: 'mouse', button: 0 })
  element.dispatchEvent(event)
}

describe('given stacked MazToast', () => {
  let wrappers: ReturnType<typeof mountToast>[] = []

  afterEach(() => {
    for (const wrapper of wrappers) {
      wrapper.unmount()
    }
    wrappers = []
    document.body.innerHTML = ''
    vi.useRealTimers()
  })

  function add(props: Record<string, unknown> = {}) {
    const wrapper = mountToast(props)
    wrappers.push(wrapper)
    return wrapper
  }

  describe('when several toasts share a position', () => {
    it('then the older ones are behind the newest', async () => {
      add({ message: 'First' })
      await flush()
      add({ message: 'Second' })
      await flush()

      const [newest, oldest] = getToasts()

      expect(newest.textContent).toContain('Second')
      expect(newest.classList.contains('--behind')).toBe(false)
      expect(oldest.classList.contains('--behind')).toBe(true)
      expect(getToasts().every(toast => toast.classList.contains('--entered'))).toBe(true)
    })

    it('then the fourth toast is hidden but kept', async () => {
      for (let index = 0; index < 4; index++) {
        add({ message: `Toast ${index}` })
        await flush()
      }

      const toasts = getToasts()

      expect(toasts).toHaveLength(4)
      expect(toasts[3].classList.contains('--hidden')).toBe(true)
      expect(toasts[2].classList.contains('--hidden')).toBe(false)
    })
  })

  describe('when the container is hovered', () => {
    it('then the stack spreads and collapses again', async () => {
      add({ message: 'First' })
      await flush()
      add({ message: 'Second' })
      await flush()

      const container = document.querySelector('.m-toast-container') as HTMLElement
      container.dispatchEvent(new Event('mouseenter'))
      await flush()

      expect(getToasts().some(toast => toast.classList.contains('--behind'))).toBe(false)

      container.dispatchEvent(new Event('mouseleave'))
      await flush()

      expect(getToasts().some(toast => toast.classList.contains('--behind'))).toBe(true)
    })
  })

  describe('when the focus enters the container', () => {
    it('then the stack spreads until the focus leaves', async () => {
      add({ message: 'First' })
      await flush()
      add({ message: 'Second' })
      await flush()

      const container = document.querySelector('.m-toast-container') as HTMLElement
      container.dispatchEvent(new Event('focusin'))
      await flush()

      expect(getToasts().some(toast => toast.classList.contains('--behind'))).toBe(false)

      container.dispatchEvent(new FocusEvent('focusout', { relatedTarget: document.body }))
      await flush()

      expect(getToasts().some(toast => toast.classList.contains('--behind'))).toBe(true)
    })
  })

  describe('when stacked is false', () => {
    it('then the toasts stay in a list', async () => {
      add({ message: 'First', stacked: false })
      await flush()
      add({ message: 'Second', stacked: false })
      await flush()

      expect(getToasts().some(toast => toast.classList.contains('--behind'))).toBe(false)
    })
  })

  describe('when the container is created', () => {
    it('then it is a labelled region', async () => {
      add()
      await flush()

      const container = document.querySelector('.m-toast-container')

      expect(container?.getAttribute('role')).toBe('region')
      expect(container?.getAttribute('aria-label')).toBeTruthy()
    })
  })

  describe('when a toast is closed', () => {
    it('then it leaves the stack at once and the others move', async () => {
      add({ message: 'First' })
      await flush()
      const second = add({ message: 'Second' })
      await flush()

      expect(getToastStack('bottom-right')?.entries).toHaveLength(2)

      second.vm.closeToast()
      await flush()

      expect(getToastStack('bottom-right')?.entries).toHaveLength(1)
      expect(getToasts().find(toast => toast.textContent?.includes('Second'))?.classList.contains('--leaving')).toBe(true)
      expect(getToasts().find(toast => toast.textContent?.includes('First'))?.classList.contains('--behind')).toBe(false)
    })

    it('then the toast is removed after the leave transition', async () => {
      vi.useFakeTimers()
      const wrapper = add()
      await flush()

      wrapper.vm.closeToast()
      vi.advanceTimersByTime(100)
      await flush()

      expect(wrapper.emitted('close')).toBeTruthy()
      expect(document.querySelector('.m-toast-container')).toBeNull()
    })
  })

  describe('when the toast is dragged towards the edge', () => {
    async function setup() {
      const wrapper = add()
      await flush()
      const card = document.querySelector('.m-toast__button') as HTMLElement
      mockWidth(card.closest('.m-toast') as HTMLElement, 352)
      return { wrapper, card }
    }

    it('then the toast follows the pointer', async () => {
      const { card } = await setup()

      pointer(card, 'pointerdown', 100)
      pointer(card, 'pointermove', 130)
      await flush()

      expect(card.closest('.m-toast')?.classList.contains('--dragging')).toBe(true)
      expect((card.closest('.m-toast') as HTMLElement).style.transform).toContain('translate(30px')
    })

    it('then a short drag springs back', async () => {
      const { card } = await setup()

      pointer(card, 'pointerdown', 100)
      pointer(card, 'pointermove', 106)
      pointer(card, 'pointerup', 106)
      await flush()

      const toast = card.closest('.m-toast') as HTMLElement

      expect(toast.classList.contains('--leaving')).toBe(false)
      expect(toast.classList.contains('--releasing')).toBe(true)
      expect(toast.style.transform).toContain('translate(0px')
    })

    it('then a long drag dismisses the toast', async () => {
      const { card } = await setup()

      pointer(card, 'pointerdown', 100)
      pointer(card, 'pointermove', 300)
      pointer(card, 'pointerup', 300)
      await flush()

      expect(card.closest('.m-toast')?.classList.contains('--leaving')).toBe(true)
    })

    it('then the click that ends the drag does not close the toast twice or emit', async () => {
      const { wrapper, card } = await setup()

      pointer(card, 'pointerdown', 100)
      pointer(card, 'pointermove', 106)
      pointer(card, 'pointerup', 106)
      card.dispatchEvent(new Event('click', { bubbles: true }))
      await flush()

      expect(wrapper.emitted('click')).toBeUndefined()
    })
  })

  describe('when the toast is dragged towards the inside', () => {
    it('then the drag is damped and never dismisses', async () => {
      add()
      await flush()
      const card = document.querySelector('.m-toast__button') as HTMLElement
      mockWidth(card.closest('.m-toast') as HTMLElement, 352)

      pointer(card, 'pointerdown', 300)
      pointer(card, 'pointermove', 100)
      pointer(card, 'pointerup', 100)
      await flush()

      expect(card.closest('.m-toast')?.classList.contains('--leaving')).toBe(false)
    })
  })

  describe('when the page is hidden', () => {
    function setHidden(hidden: boolean) {
      Object.defineProperty(document, 'hidden', { configurable: true, value: hidden })
      document.dispatchEvent(new Event('visibilitychange'))
    }

    afterEach(() => {
      setHidden(false)
    })

    it('then the timer pauses and resumes with the page', async () => {
      vi.useFakeTimers()
      add({ timeout: 2000 })
      await flush()

      const bar = () => (document.querySelector('.m-toast__progress-bar-inner') as HTMLElement).style.transform

      setHidden(true)
      vi.advanceTimersByTime(1000)
      await flush()

      expect(bar()).toBe('scaleX(1)')

      setHidden(false)
      vi.advanceTimersByTime(600)
      await flush()

      expect(bar()).not.toBe('scaleX(1)')
    })
  })

  describe('when the toast is loading', () => {
    it('then it shows a spinner without progress line and settles on success', async () => {
      const wrapper = add({ loading: true, message: 'Saving', timeout: 2000 })
      await flush()

      expect(wrapper.findComponent({ name: 'MazSpinner' }).exists()).toBe(true)
      expect(document.querySelector('.m-toast__progress-bar')).toBeNull()

      wrapper.vm.settle('success', 'Saved')
      await flush()

      const toast = document.querySelector('.m-toast') as HTMLElement

      expect(toast.classList.contains('--success')).toBe(true)
      expect(wrapper.findComponent(MazDrawnIcon).props('name')).toBe('check-circle')
      expect(document.querySelector('.m-toast__progress-bar')).not.toBeNull()
    })

    it('then it settles on error with an assertive role', async () => {
      const wrapper = add({ loading: true, message: 'Saving' })
      await flush()

      wrapper.vm.settle('error', 'Failed')
      await flush()

      expect(wrapper.findComponent(MazDrawnIcon).props('name')).toBe('x-circle')
      expect(document.querySelector('.m-toast__button')?.getAttribute('role')).toBe('alert')
    })
  })
})

describe('given ToastHandler.promise', () => {
  let handler: ToastHandler

  beforeEach(() => {
    handler = new ToastHandler(createApp({}), { timeout: 5000 })
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  describe('when the promise resolves', () => {
    it('then it returns the same promise and shows the success state', async () => {
      let resolve!: (value: string) => void
      const source = new Promise<string>((done) => {
        resolve = done
      })
      const result = handler.promise(source, {
        loading: 'Loading',
        success: data => `Got ${data}`,
        error: 'Failed',
      })

      await flush()

      expect(result).toBe(source)
      expect(document.querySelector('.m-toast')?.classList.contains('--neutral')).toBe(true)

      resolve('data')
      await result
      await flush()

      expect(document.querySelector('.m-toast')?.classList.contains('--success')).toBe(true)
    })
  })

  describe('when the promise rejects', () => {
    it('then it shows the error state and the promise still rejects', async () => {
      const result = handler.promise(() => Promise.reject(new Error('boom')), {
        loading: 'Loading',
        success: 'Done',
        error: reason => `Failed: ${(reason as Error).message}`,
      })

      await expect(result).rejects.toThrow('boom')
      await flush()

      expect(document.querySelector('.m-toast')?.classList.contains('--destructive')).toBe(true)
    })
  })
})
