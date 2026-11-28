import MazToast from '@plugins/toast/MazToast.vue'
import { getToastStack } from '@plugins/toast/stack.ts'
import { flushPromises, mount } from '@vue/test-utils'
import { nextTick } from 'vue'

async function flush() {
  await nextTick()
  await nextTick()
}

async function advance(ms: number) {
  await vi.advanceTimersByTimeAsync(ms)
  await flush()
}

function getToasts() {
  return [...document.querySelectorAll<HTMLElement>('.m-toast')]
}

function getButton(toast: HTMLElement) {
  return toast.querySelector('.m-toast__button') as HTMLElement
}

function getActionButtons() {
  return [...document.querySelectorAll<HTMLElement>('.m-toast__button > :is(button, a)')]
}

function pointer(element: Element, type: string, init: Record<string, unknown> = {}) {
  const event = new Event(type, { bubbles: true })
  const { timeStamp, ...rest } = init
  Object.assign(event, { clientX: 0, clientY: 0, pointerId: 1, pointerType: 'mouse', button: 0, ...rest })
  Object.defineProperty(event, 'timeStamp', { value: timeStamp ?? 0 })
  element.dispatchEvent(event)
}

function mockSize(element: HTMLElement, size: { width?: number, height?: number }) {
  Object.defineProperty(element, 'offsetWidth', { configurable: true, value: size.width ?? 0 })
  Object.defineProperty(element, 'offsetHeight', { configurable: true, value: size.height ?? 0 })
}

describe('given MazToast extended', () => {
  let wrappers: ReturnType<typeof mountToast>[] = []

  function mountToast(props: Record<string, unknown> = {}) {
    return mount(MazToast, { props: { message: 'Message', position: 'bottom-right', ...props } })
  }

  function add(props: Record<string, unknown> = {}) {
    const wrapper = mountToast(props)
    wrappers.push(wrapper)
    return wrapper
  }

  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    for (const wrapper of wrappers) {
      wrapper.unmount()
    }
    wrappers = []
    document.body.innerHTML = ''
    document.body.removeAttribute('dir')
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  describe.each([
    ['info', 'maz:bg-info-800'],
    ['success', 'maz:bg-success-800'],
    ['warning', 'maz:bg-warning-800'],
    ['destructive', 'maz:bg-destructive-800'],
    ['neutral', 'maz:bg-neutral-foreground'],
    ['contrast', 'maz:bg-contrast-foreground'],
  ])('when the type is %s', (type, progressClass) => {
    it('then the progress bar has its color', async () => {
      add({ type, timeout: 5000 })
      await flush()

      expect(document.querySelector('.m-toast__progress-bar-inner')?.classList.contains(progressClass)).toBe(true)
    })
  })

  describe.each([
    ['top-left', '--top', '--left'],
    ['top-center', '--top', '--center'],
    ['top-right', '--top', '--right'],
    ['bottom-center', '--bottom', '--center'],
    ['bottom-left', '--bottom', '--left'],
  ])('when the position is %s', (position, y, x) => {
    it('then the toast and its container carry the position classes', async () => {
      add({ position })
      await flush()

      const toast = getToasts()[0]
      const container = document.querySelector('.m-toast-container') as HTMLElement

      expect(toast.classList.contains(y)).toBe(true)
      expect(toast.classList.contains(x)).toBe(true)
      expect(container.classList.contains(y)).toBe(true)
      expect(container.classList.contains(x)).toBe(true)
    })
  })

  describe('when the document is right to left and the toast is on the right', () => {
    it('then the toast leaves towards the left', async () => {
      document.body.setAttribute('dir', 'rtl')
      add({ position: 'bottom-right' })
      await flush()

      expect(getToasts()[0].style.transform).toContain('translate(0px')
    })
  })

  describe('when the type is warning or destructive', () => {
    it('then the role is alert', async () => {
      add({ type: 'warning' })
      await flush()

      expect(getButton(getToasts()[0]).getAttribute('role')).toBe('alert')
    })

    it('then the role is status for other types', async () => {
      add({ type: 'info' })
      await flush()

      expect(getButton(getToasts()[0]).getAttribute('role')).toBe('status')
    })
  })

  describe('when the timeout elapses', () => {
    it('then the toast closes and the container is removed', async () => {
      const wrapper = add({ timeout: 1000 })
      await flush()
      await advance(100)

      expect(wrapper.emitted('open')).toBeTruthy()

      await advance(1200)
      await advance(500)

      expect(wrapper.emitted('close')).toBeTruthy()
      expect(document.querySelector('.m-toast-container')).toBeNull()
    })
  })

  describe('when the tab is hidden', () => {
    it('then the timer is paused until the tab is visible again', async () => {
      const wrapper = add({ timeout: 1000 })
      await flush()
      await advance(100)

      vi.spyOn(document, 'hidden', 'get').mockReturnValue(true)
      document.dispatchEvent(new Event('visibilitychange'))
      await advance(3000)

      expect(wrapper.emitted('close')).toBeFalsy()

      vi.spyOn(document, 'hidden', 'get').mockReturnValue(false)
      document.dispatchEvent(new Event('visibilitychange'))
      await advance(1500)
      await advance(500)

      expect(wrapper.emitted('close')).toBeTruthy()
    })
  })

  describe('when the toast is hovered', () => {
    it('then the timer is paused and resumes on leave', async () => {
      const wrapper = add({ timeout: 1000 })
      await flush()
      await advance(100)

      const button = getButton(getToasts()[0])
      button.dispatchEvent(new Event('mouseover', { bubbles: true }))
      await advance(3000)

      expect(wrapper.emitted('close')).toBeFalsy()

      button.dispatchEvent(new Event('mouseleave', { bubbles: true }))
      await advance(1500)
      await advance(500)

      expect(wrapper.emitted('close')).toBeTruthy()
    })

    it('then the timer keeps running when pauseOnHover is false', async () => {
      const wrapper = add({ timeout: 1000, pauseOnHover: false })
      await flush()
      await advance(100)

      getButton(getToasts()[0]).dispatchEvent(new Event('mouseover', { bubbles: true }))
      await advance(1500)
      await advance(500)

      expect(wrapper.emitted('close')).toBeTruthy()
    })
  })

  describe('when the toast is touched', () => {
    it('then the timer pauses on touchstart and resumes on touchend', async () => {
      const wrapper = add({ timeout: 1000 })
      await flush()
      await advance(100)

      const button = getButton(getToasts()[0])
      button.dispatchEvent(new Event('touchstart', { bubbles: true }))
      await advance(3000)

      expect(wrapper.emitted('close')).toBeFalsy()

      button.dispatchEvent(new Event('touchend', { bubbles: true }))
      await advance(1500)
      await advance(500)

      expect(wrapper.emitted('close')).toBeTruthy()
    })
  })

  describe('when the toast is persistent', () => {
    it('then it never closes by itself', async () => {
      const wrapper = add({ timeout: 500, persistent: true })
      await flush()
      await advance(5000)

      expect(wrapper.emitted('close')).toBeFalsy()
      expect(getToasts()).toHaveLength(1)
    })
  })

  describe('when the stack is hovered', () => {
    it('then the timer of the toast is paused until the stack is released', async () => {
      const wrapper = add({ timeout: 1000 })
      await flush()
      await advance(100)

      const container = document.querySelector('.m-toast-container') as HTMLElement
      container.dispatchEvent(new Event('mouseenter'))
      await advance(3000)

      expect(wrapper.emitted('close')).toBeFalsy()

      container.dispatchEvent(new Event('mouseleave'))
      await advance(1500)
      await advance(500)

      expect(wrapper.emitted('close')).toBeTruthy()
    })

    it('then the timer keeps running when pauseOnHover is false', async () => {
      const wrapper = add({ timeout: 1000, pauseOnHover: false })
      await flush()
      await advance(100)

      const container = document.querySelector('.m-toast-container') as HTMLElement
      container.dispatchEvent(new Event('mouseenter'))
      await advance(1500)
      await advance(500)

      expect(wrapper.emitted('close')).toBeTruthy()
    })
  })

  describe('when the focus moves inside the container', () => {
    it('then the stack stays focused', async () => {
      add()
      await flush()

      const container = document.querySelector('.m-toast-container') as HTMLElement
      const inside = document.createElement('button')
      container.append(inside)

      container.dispatchEvent(new Event('focusin'))
      container.dispatchEvent(new FocusEvent('focusout', { relatedTarget: inside }))

      expect(getToastStack('bottom-right')?.focused).toBe(true)
    })
  })

  describe('when the toast is clicked', () => {
    it('then it emits click and closes', async () => {
      const wrapper = add({ timeout: 0 })
      await flush()

      getButton(getToasts()[0]).dispatchEvent(new Event('click', { bubbles: true }))
      await advance(500)

      expect(wrapper.emitted('click')).toHaveLength(1)
      expect(wrapper.emitted('close')).toBeTruthy()
    })

    it('then closing twice is ignored', async () => {
      const wrapper = add({ timeout: 0 })
      await flush()

      ;(wrapper.vm as unknown as { closeToast: () => void }).closeToast()
      ;(wrapper.vm as unknown as { closeToast: () => void }).closeToast()
      await advance(500)

      expect(wrapper.emitted('close')).toHaveLength(1)
    })
  })

  describe('when the toast is closed before it is shown', () => {
    it('then it leaves immediately', async () => {
      const first = add({ timeout: 0 })
      await flush()
      const second = add({ timeout: 0, queue: true })
      await flush()

      ;(second.vm as unknown as { closeToast: () => void }).closeToast()
      await flush()

      expect(second.emitted('close')).toBeTruthy()
      expect(first.emitted('close')).toBeFalsy()
    })
  })

  describe('when the queue option is set', () => {
    it('then the second toast waits for the first one to leave', async () => {
      const first = add({ message: 'First', timeout: 0, queue: true })
      await flush()
      const second = add({ message: 'Second', timeout: 0, queue: true })
      await flush()
      await advance(300)

      expect(getToasts().filter(toast => toast.style.display !== 'none')).toHaveLength(1)

      ;(first.vm as unknown as { closeToast: () => void }).closeToast()
      await advance(500)
      await advance(500)

      expect(second.emitted('open')).toBeTruthy()
    })
  })

  describe('when maxToasts is a number', () => {
    it('then the toast beyond the limit waits', async () => {
      add({ message: 'First', timeout: 0, maxToasts: 1 })
      await flush()
      const second = add({ message: 'Second', timeout: 0, maxToasts: 1 })
      await advance(600)

      expect(second.emitted('open')).toBeFalsy()
    })
  })

  describe('when settle is called', () => {
    it('then a loading toast becomes a success one and starts its timer', async () => {
      const wrapper = add({ loading: true, timeout: 1000 })
      await flush()

      expect(document.querySelector('.m-toast__progress-bar')).toBeNull()
      expect(wrapper.findComponent({ name: 'MazSpinner' }).exists()).toBe(true)

      ;(wrapper.vm as unknown as { settle: (status: string, text: string) => void }).settle('success', 'Done')
      await advance(400)

      expect(getToasts()[0].classList.contains('--success')).toBe(true)
      expect(getToasts()[0].textContent).toContain('Done')
      expect(wrapper.findComponent({ name: 'MazDrawnIcon' }).props('name')).toBe('check-circle')

      await advance(1500)
      await advance(500)

      expect(wrapper.emitted('close')).toBeTruthy()
    })

    it('then an error result uses the destructive type and the x icon', async () => {
      const wrapper = add({ loading: true, timeout: 1000 })
      await flush()

      ;(wrapper.vm as unknown as { settle: (status: string, text: string) => void }).settle('error', 'Oops')
      await advance(400)

      expect(getToasts()[0].classList.contains('--destructive')).toBe(true)
      expect(wrapper.findComponent({ name: 'MazDrawnIcon' }).props('name')).toBe('x-circle')
    })

    it('then it is ignored once the toast is leaving', async () => {
      const wrapper = add({ loading: true, timeout: 1000 })
      await flush()

      const exposed = wrapper.vm as unknown as { settle: (status: string, text: string) => void, closeToast: () => void }
      exposed.closeToast()
      exposed.settle('success', 'Late')
      await advance(500)

      expect(getToasts()).toHaveLength(0)
    })

    it('then a toast not shown yet does not start its timer', async () => {
      add({ message: 'First', timeout: 0, queue: true })
      await flush()
      const second = add({ loading: true, timeout: 1000, queue: true })
      await flush()

      ;(second.vm as unknown as { settle: (status: string, text: string) => void }).settle('success', 'Done')
      await advance(2000)

      expect(second.emitted('close')).toBeFalsy()
    })
  })

  describe('when the html option is set', () => {
    it('then the message is rendered as html', async () => {
      add({ message: '<strong>Bold</strong>', html: true })
      await flush()

      expect(document.querySelector('.m-toast__message strong')?.textContent).toBe('Bold')
    })
  })

  describe('when a button has an action', () => {
    it('then it shows its loading state while the action runs', async () => {
      let release: () => void = () => {}
      const onClick = vi.fn(() => new Promise<void>((resolve) => {
        release = resolve
      }))

      const wrapper = add({ timeout: 0, button: { text: 'Undo', onClick, closeToast: true } })
      await flush()

      await vi.dynamicImportSettled()
      await flushPromises()

      getActionButtons()[0].dispatchEvent(new Event('click', { bubbles: true }))
      await flush()

      expect(onClick).toHaveBeenCalled()

      release()
      await advance(500)

      expect(wrapper.emitted('close')).toBeTruthy()
    })

    it('then a button without action does not close the toast by default', async () => {
      const wrapper = add({ timeout: 0, buttons: [{ text: 'Link', href: 'https://example.com', target: '_blank' }, { text: 'Same', href: 'https://example.com' }] })
      await flush()

      await vi.dynamicImportSettled()
      await flushPromises()

      expect(getActionButtons()).toHaveLength(2)

      getActionButtons()[0].dispatchEvent(new Event('click', { bubbles: true }))
      await advance(500)

      expect(wrapper.emitted('close')).toBeFalsy()
      expect(wrapper.emitted('click')).toBeTruthy()
    })
  })

  describe('when the toast is swiped', () => {
    async function mountEntered(props: Record<string, unknown> = {}) {
      const wrapper = add({ timeout: 0, ...props })
      await flush()
      await advance(300)
      const toast = getToasts()[0]
      mockSize(toast, { width: 300, height: 60 })
      return { wrapper, toast, button: getButton(toast) }
    }

    it('then a long swipe dismisses it', async () => {
      const { wrapper, button } = await mountEntered()

      pointer(button, 'pointerdown', { clientX: 0, timeStamp: 0 })
      pointer(button, 'pointermove', { clientX: 100, timeStamp: 50 })
      pointer(button, 'pointermove', { clientX: 250, timeStamp: 100 })
      pointer(button, 'pointerup', { clientX: 250, timeStamp: 110 })
      await advance(500)

      expect(wrapper.emitted('close')).toBeTruthy()
    })

    it('then a short slow swipe springs back', async () => {
      const { wrapper, toast, button } = await mountEntered()

      pointer(button, 'pointerdown', { clientX: 0, timeStamp: 0 })
      pointer(button, 'pointermove', { clientX: 20, timeStamp: 1000 })
      pointer(button, 'pointerup', { clientX: 20, timeStamp: 2000 })
      await flush()

      expect(toast.classList.contains('--releasing')).toBe(true)
      expect(wrapper.emitted('close')).toBeFalsy()
    })

    it('then a cancelled gesture springs back even when far', async () => {
      const { wrapper, toast, button } = await mountEntered()

      pointer(button, 'pointerdown', { clientX: 0, timeStamp: 0 })
      pointer(button, 'pointermove', { clientX: 280, timeStamp: 10 })
      pointer(button, 'pointercancel', { clientX: 280, timeStamp: 20 })
      await flush()

      expect(toast.classList.contains('--releasing')).toBe(true)
      expect(wrapper.emitted('close')).toBeFalsy()
    })

    it('then the click that follows a drag is ignored', async () => {
      const { wrapper, button } = await mountEntered()

      pointer(button, 'pointerdown', { clientX: 0, timeStamp: 0 })
      pointer(button, 'pointermove', { clientX: 20, timeStamp: 1000 })
      pointer(button, 'pointerup', { clientX: 20, timeStamp: 2000 })
      button.dispatchEvent(new Event('click', { bubbles: true }))
      await advance(500)

      expect(wrapper.emitted('click')).toBeFalsy()
    })

    it('then a tiny movement is not a drag', async () => {
      const { toast, button } = await mountEntered()

      pointer(button, 'pointerdown', { clientX: 0 })
      pointer(button, 'pointermove', { clientX: 2 })
      pointer(button, 'pointerup', { clientX: 2 })
      await flush()

      expect(toast.classList.contains('--dragging')).toBe(false)
      expect(toast.classList.contains('--releasing')).toBe(false)
    })

    it('then moves without a pointerdown are ignored', async () => {
      const { toast, button } = await mountEntered()

      pointer(button, 'pointermove', { clientX: 100 })
      pointer(button, 'pointerup', { clientX: 100 })
      await flush()

      expect(toast.classList.contains('--dragging')).toBe(false)
    })

    it('then a right mouse button or a button target does not start a drag', async () => {
      const { toast, button } = await mountEntered({ button: { text: 'Go' } })

      pointer(button, 'pointerdown', { clientX: 0, button: 2 })
      pointer(button, 'pointermove', { clientX: 100 })
      await flush()

      expect(toast.classList.contains('--dragging')).toBe(false)

      const inner = button.querySelector('button') as HTMLElement
      pointer(inner, 'pointerdown', { clientX: 0 })
      pointer(inner, 'pointermove', { clientX: 100 })
      await flush()

      expect(toast.classList.contains('--dragging')).toBe(false)
    })

    it('then a vertical swipe dismisses a centered toast', async () => {
      const wrapper = add({ timeout: 0, position: 'top-center' })
      await flush()
      await advance(300)
      const toast = getToasts()[0]
      mockSize(toast, { width: 300, height: 60 })

      pointer(getButton(toast), 'pointerdown', { clientY: 0, timeStamp: 0 })
      pointer(getButton(toast), 'pointermove', { clientY: -80, timeStamp: 20 })
      pointer(getButton(toast), 'pointerup', { clientY: -80, timeStamp: 30 })
      await advance(500)

      expect(wrapper.emitted('close')).toBeTruthy()
    })

    it('then it does not start while the toast is not entered', async () => {
      add({ timeout: 0 })
      await flush()
      const button = getButton(getToasts()[0])

      pointer(button, 'pointerdown', { clientX: 0 })
      pointer(button, 'pointermove', { clientX: 100 })

      expect(getToasts()[0].classList.contains('--dragging')).toBe(false)
    })
  })

  describe('when a touch tap happens on a stack of several toasts', () => {
    it('then the first tap pins the stack and a pointerdown outside unpins it', async () => {
      add({ message: 'First', timeout: 0 })
      await flush()
      add({ message: 'Second', timeout: 0 })
      await advance(300)

      const [newest] = getToasts()
      const button = getButton(newest)

      pointer(button, 'pointerdown', { pointerType: 'touch' })
      pointer(button, 'pointerup', { pointerType: 'touch' })
      button.dispatchEvent(new Event('click', { bubbles: true }))
      await flush()

      expect(getToastStack('bottom-right')?.pinned).toBe(true)
      expect(getToasts()).toHaveLength(2)

      pointer(document.querySelector('.m-toast-container') as Element, 'pointerdown')
      await flush()

      expect(getToastStack('bottom-right')?.pinned).toBe(true)

      pointer(document.body, 'pointerdown')
      await flush()

      expect(getToastStack('bottom-right')?.pinned).toBe(false)
    })

    it('then the second tap closes the toast', async () => {
      add({ message: 'First', timeout: 0 })
      await flush()
      const second = add({ message: 'Second', timeout: 0 })
      await advance(300)

      const button = getButton(getToasts()[0])

      pointer(button, 'pointerdown', { pointerType: 'touch' })
      button.dispatchEvent(new Event('click', { bubbles: true }))
      pointer(button, 'pointerdown', { pointerType: 'touch' })
      button.dispatchEvent(new Event('click', { bubbles: true }))
      await advance(500)

      expect(second.emitted('close')).toBeTruthy()
    })
  })

  describe('when the toast is unmounted', () => {
    it('then its listeners are removed', async () => {
      const spy = vi.spyOn(document, 'removeEventListener')
      const wrapper = add({ timeout: 1000 })
      await flush()

      wrapper.unmount()
      wrappers = []

      expect(spy).toHaveBeenCalledWith('visibilitychange', expect.any(Function))
    })
  })
})
