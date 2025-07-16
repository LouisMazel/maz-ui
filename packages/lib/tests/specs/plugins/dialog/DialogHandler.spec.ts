import { DialogHandler } from '@plugins/dialog/DialogHandler'
import { describe, expect, it, vi } from 'vitest'
import { createApp } from 'vue'

let resolveFn: (value: unknown) => void
const callback = vi.fn()
vi.mock('@components/MazDialogConfirm/useMazDialogConfirm', () => ({
  useMazDialogConfirm: () => ({
    showDialogAndWaitChoice: () => new Promise((resolve) => {
      resolveFn = resolve
      callback()
    }),
  }),
}))

vi.mock('@components/MazDialogConfirm.vue', () => ({
  default: {
    expose: {
      close: vi.fn(),
    },
    render: vi.fn(),
  },
}))

vi.mock('@utils/mountComponent', () => ({
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

  it('should open a dialog with default options', () => {
    vi.useFakeTimers()

    const { destroy, close } = dialog.open({})

    expect(typeof destroy).toBe('function')
    expect(typeof close).toBe('function')

    resolveFn('resolved')

    setTimeout(() => {
      expect(destroy).toHaveBeenCalled()
    }, 700)
  })

  it('should call close and destroy functions when promise resolves', () => {
    const { close, destroy } = dialog.open({})

    resolveFn('resolved')

    setTimeout(() => {
      expect(close).toHaveBeenCalled()
      expect(destroy).toHaveBeenCalled()
    })
  })

  it('should call onAccept if provided', () => {
    dialog.open({ onAccept: callback })

    resolveFn('resolved')

    expect(callback).toHaveBeenCalled()
  })
})
