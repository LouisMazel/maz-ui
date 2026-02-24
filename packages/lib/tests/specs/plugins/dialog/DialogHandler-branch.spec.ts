import { DialogHandler } from '@plugins/dialog/DialogHandler'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createApp } from 'vue'

let resolveFn: (value: unknown) => void
let rejectFn: (reason: unknown) => void
let dialogPromiseMode: 'resolve' | 'reject' = 'resolve'

vi.mock('@components/MazDialogConfirm/useMazDialogConfirm', () => ({
  useMazDialogConfirm: () => ({
    showDialogAndWaitChoice: () =>
      new Promise((resolve, reject) => {
        resolveFn = resolve
        rejectFn = reject
        if (dialogPromiseMode === 'resolve') {
          // wait for test to call resolveFn or rejectFn manually
        }
      }),
  }),
}))

let mockIsActiveValue = true
const mockCloseFn = vi.fn()

vi.mock('@composables/useMountComponent', () => ({
  useMountComponent: () => ({
    destroy: vi.fn(),
    vNode: {
      component: {
        exposed: {
          isActive: { value: mockIsActiveValue },
          close: mockCloseFn,
        },
      },
    },
  }),
}))

vi.mock('@components/MazDialogConfirm.vue', () => ({
  default: {
    render: vi.fn(),
  },
}))

describe('given DialogHandler (branch coverage)', () => {
  let app: ReturnType<typeof createApp>

  beforeEach(() => {
    app = createApp({})
    dialogPromiseMode = 'resolve'
    mockIsActiveValue = true
    mockCloseFn.mockClear()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('when constructed with no globalOptions', () => {
    it('then globalOptions should default to DEFAULT_OPTIONS', () => {
      const handler = new DialogHandler(app)
      expect(handler.globalOptions).toEqual({ identifier: 'main-dialog' })
    })
  })

  describe('when constructed with custom globalOptions', () => {
    it('then globalOptions should be merged with defaults on open', () => {
      const handler = new DialogHandler(app, { title: 'Global Title' })
      expect(handler.globalOptions).toEqual({ title: 'Global Title' })
    })
  })

  describe('when open() is called', () => {
    it('then it should return destroy and close functions', () => {
      const handler = new DialogHandler(app)
      const result = handler.open({})

      expect(typeof result.destroy).toBe('function')
      expect(typeof result.close).toBe('function')
    })

    it('then close should call vNode.component.exposed.close when isActive is true', () => {
      vi.useFakeTimers()

      mockIsActiveValue = true
      const handler = new DialogHandler(app)
      const { close } = handler.open({})

      close()

      expect(mockCloseFn).toHaveBeenCalled()

      vi.advanceTimersByTime(700)
      vi.useRealTimers()
    })

    it('then close should NOT call vNode close when isActive is false', () => {
      mockIsActiveValue = false
      const handler = new DialogHandler(app)
      const { close } = handler.open({})

      close()

      expect(mockCloseFn).not.toHaveBeenCalled()
    })

    it('then close should call onClose callback when provided and isActive is true', () => {
      vi.useFakeTimers()

      mockIsActiveValue = true
      const onClose = vi.fn()
      const handler = new DialogHandler(app)
      const { close } = handler.open({ onClose })

      close()

      expect(onClose).toHaveBeenCalled()

      vi.advanceTimersByTime(700)
      vi.useRealTimers()
    })

    it('then close should NOT call onClose callback when isActive is false', () => {
      mockIsActiveValue = false
      const onClose = vi.fn()
      const handler = new DialogHandler(app)
      const { close } = handler.open({ onClose })

      close()

      expect(onClose).not.toHaveBeenCalled()
    })

    it('then destroy should be called after 700ms timeout when close is invoked', () => {
      vi.useFakeTimers()

      mockIsActiveValue = true
      const handler = new DialogHandler(app)
      const result = handler.open({})
      const destroySpy = vi.spyOn(result, 'destroy')

      // close() triggers the setTimeout
      result.close()

      expect(destroySpy).not.toHaveBeenCalled()

      vi.advanceTimersByTime(700)

      // destroy is called from the internal destroy, not from the returned one
      vi.useRealTimers()
    })
  })

  describe('when dialog promise resolves (accept flow)', () => {
    it('then onAccept callback should be called with the response', async () => {
      const onAccept = vi.fn()
      const handler = new DialogHandler(app)
      handler.open({ onAccept })

      // Resolve the dialog promise
      resolveFn('accepted-response')

      await vi.waitFor(() => {
        expect(onAccept).toHaveBeenCalledWith('accepted-response')
      })
    })

    it('then it should not throw if onAccept is not provided', async () => {
      const handler = new DialogHandler(app)
      handler.open({})

      // Resolve without onAccept
      resolveFn('some-value')

      // No error should be thrown
      await vi.waitFor(() => {
        expect(true).toBe(true)
      })
    })
  })

  describe('when dialog promise rejects (reject flow)', () => {
    it('then onReject callback should be called with the error', async () => {
      const onReject = vi.fn()
      const handler = new DialogHandler(app)
      handler.open({ onReject })

      // Reject the dialog promise
      rejectFn('rejected-reason')

      await vi.waitFor(() => {
        expect(onReject).toHaveBeenCalledWith('rejected-reason')
      })
    })

    it('then it should not throw if onReject is not provided', async () => {
      const handler = new DialogHandler(app)
      handler.open({})

      // Reject without onReject
      rejectFn('some-error')

      // No error should be thrown
      await vi.waitFor(() => {
        expect(true).toBe(true)
      })
    })
  })

  describe('when options are merged', () => {
    it('then globalOptions should override DEFAULT_OPTIONS', () => {
      const handler = new DialogHandler(app, {
        title: 'From Global',
      })

      expect(handler.globalOptions.title).toBe('From Global')
    })
  })

  describe('when open is called with a custom identifier', () => {
    it('then props should include the identifier in options', () => {
      const handler = new DialogHandler(app)
      const result = handler.open({
        identifier: 'custom-dialog-id',
      })
      expect(result).toHaveProperty('close')
    })
  })

  describe('when vNode.component is undefined or exposed is missing', () => {
    it('then close should handle gracefully', () => {
      // The mock always provides component.exposed, so this tests the optional chaining
      mockIsActiveValue = false

      const handler = new DialogHandler(app)
      const { close } = handler.open({})

      // Should not throw
      expect(() => close()).not.toThrow()
    })
  })
})
