import { ToastHandler } from '@plugins/toast/ToastHandler.ts'
import { createApp, nextTick } from 'vue'

const clientState = vi.hoisted(() => ({ client: true }))

vi.mock('@maz-ui/utils/helpers/isClient', () => ({
  isClient: () => clientState.client,
}))

async function flush() {
  await nextTick()
  await nextTick()
  await Promise.resolve()
  await nextTick()
}

async function settled() {
  await flush()
  await vi.advanceTimersByTimeAsync(500)
  await flush()
}

function getToasts() {
  return [...document.querySelectorAll<HTMLElement>('.m-toast')]
}

describe('given the promise method of ToastHandler', () => {
  let handler: ToastHandler

  beforeEach(() => {
    vi.useFakeTimers()
    clientState.client = true
    handler = new ToastHandler(createApp({}), { timeout: 1000 })
  })

  afterEach(() => {
    vi.runOnlyPendingTimers()
    vi.useRealTimers()
    document.body.innerHTML = ''
  })

  describe('when the promise resolves', () => {
    it('then the loading toast becomes a success toast and the source is returned', async () => {
      const source = Promise.resolve('data')
      const result = handler.promise(source, {
        loading: 'Saving',
        success: data => `Saved ${data}`,
        error: 'Failed',
      })

      await flush()

      expect(result).toBe(source)

      await settled()

      const toast = getToasts()[0]

      expect(toast.textContent).toContain('Saved data')
      expect(toast.classList.contains('--success')).toBe(true)
    })

    it('then a string success message is used as is', async () => {
      handler.promise(Promise.resolve(1), { loading: 'Saving', success: 'Done', error: 'Failed' })

      await settled()

      expect(getToasts()[0].textContent).toContain('Done')
    })
  })

  describe('when the promise rejects', () => {
    it('then the toast becomes an error toast with the computed message', async () => {
      const source = Promise.reject(new Error('boom'))
      source.catch(() => {})

      handler.promise(source, {
        loading: 'Saving',
        success: 'Done',
        error: reason => `Error ${(reason as Error).message}`,
      })

      await settled()

      const toast = getToasts()[0]

      expect(toast.textContent).toContain('Error boom')
      expect(toast.classList.contains('--destructive')).toBe(true)
    })

    it('then a string error message is used as is', async () => {
      const source = Promise.reject(new Error('boom'))
      source.catch(() => {})

      handler.promise(source, { loading: 'Saving', success: 'Done', error: 'Failed' })

      await settled()

      expect(getToasts()[0].textContent).toContain('Failed')
    })
  })

  describe('when the source is a function', () => {
    it('then it is called and its promise returned', async () => {
      const factory = vi.fn(() => Promise.resolve('x'))

      const result = handler.promise(factory, { loading: 'Saving', success: 'Done', error: 'Failed' })

      await flush()

      expect(factory).toHaveBeenCalledOnce()
      await expect(result).resolves.toBe('x')
    })
  })

  describe('when it runs on the server', () => {
    it('then no toast is mounted and the source is returned', async () => {
      clientState.client = false
      const source = Promise.resolve('x')

      const result = handler.promise(source, { loading: 'Saving', success: 'Done', error: 'Failed' })

      await flush()

      expect(result).toBe(source)
      expect(getToasts()).toHaveLength(0)
    })

    it('then showing a message mounts nothing and returns inert callbacks', async () => {
      clientState.client = false

      const { close, destroy } = handler.message('Hello')

      await flush()

      expect(getToasts()).toHaveLength(0)
      expect(() => {
        close()
        destroy()
      }).not.toThrow()
    })
  })

  describe('when the accent and neutral shortcuts are used', () => {
    it('then each toast gets its type', async () => {
      handler.accent('Accent')
      handler.neutral('Neutral')

      await flush()

      const classes = getToasts().map(toast => toast.className)

      expect(classes.some(name => name.includes('--accent'))).toBe(true)
      expect(classes.some(name => name.includes('--neutral'))).toBe(true)
    })
  })

  describe('when the close callback of a toast is called', () => {
    it('then the toast leaves', async () => {
      const { close } = handler.message('Bye')

      await flush()
      close()
      await flush()

      expect(getToasts()[0].classList.contains('--leaving')).toBe(true)
    })
  })
})
