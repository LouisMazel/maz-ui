import { DialogHandler } from '@modules/plugins/dialog/DialogHandler'
import { describe, expect, it, vi } from 'vitest'
import { createApp } from 'vue'

let resolveFn: (value: unknown) => void
const promiseCallback = vi.fn()
vi.mock('@components/MazDialogPromise.vue', () => ({
  default: {},
  useMazDialogPromise: () => ({
    showDialogAndWaitChoice: () => new Promise((resolve) => {
      resolveFn = resolve
      promiseCallback()
    }),
  }),
}))

vi.mock('@modules/helpers/mount-component', () => ({
  mount: () => ({
    destroy: vi.fn(),
    vNode: {
      component: {
        exposed: {
          close: vi.fn(),
        },
      },
    },
  }),
}))

describe('dialogHandler', () => {
  const app = createApp({})
  const dialog = new DialogHandler(app)

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should open a dialog with default options', async () => {
    vi.useFakeTimers()

    const { promise, destroy, close } = dialog.open({})

    expect(promise).toBeInstanceOf(Promise)
    expect(typeof destroy).toBe('function')
    expect(typeof close).toBe('function')

    resolveFn('resolved')

    setTimeout(() => {
      expect(destroy).toHaveBeenCalled()
    }, 700)
  })

  it('should call close and destroy functions when promise resolves', async () => {
    const { close, destroy } = dialog.open({})

    resolveFn('resolved')

    setTimeout(() => {
      expect(close).toHaveBeenCalled()
      expect(destroy).toHaveBeenCalled()
    })
  })

  it('should merge options correctly', () => {
    const customOptions = { identifier: 'custom-dialog' }
    const { promise } = dialog.open(customOptions)

    expect(promise).toBeInstanceOf(Promise)
  })

  it('should call promiseCallback if provided', async () => {
    dialog.open({ promiseCallback })

    resolveFn('resolved')

    expect(promiseCallback).toHaveBeenCalled()
  })
})
