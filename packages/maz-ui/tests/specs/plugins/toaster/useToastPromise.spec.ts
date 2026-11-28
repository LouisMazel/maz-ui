import { useToast } from '@composables/useToast.ts'
import { ToastHandler } from '@plugins/toast/ToastHandler.ts'
import { withSetup } from '@tests/helpers/withSetup.ts'

describe('given the promise method of useToast', () => {
  describe('when it is called', () => {
    it('then it delegates to the handler and returns the promise', () => {
      const source = Promise.resolve('ok')
      const spy = vi.spyOn(ToastHandler.prototype, 'promise').mockReturnValue(source)
      const options = { loading: 'Loading', success: 'Done', error: 'Failed' }

      const [toast] = withSetup(() => useToast())

      expect(toast.promise(source, options)).toBe(source)
      expect(spy).toHaveBeenCalledWith(source, options)
    })
  })
})
