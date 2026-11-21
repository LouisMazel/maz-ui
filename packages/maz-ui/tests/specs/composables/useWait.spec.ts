import { useWait } from '@composables/useWait.ts'
import { waitInstance } from '@plugins/wait.ts'
import { withSetup } from '@tests/helpers/withSetup.ts'

describe('given useWait composable', () => {
  describe('when a wait handler is provided by the deprecated WaitPlugin', () => {
    it('then it returns the provided handler', () => {
      const mockWaitHandler = {
        start: vi.fn(),
        stop: vi.fn(),
      }

      const [result] = withSetup(() => useWait(), {
        mazWait: mockWaitHandler,
      })

      expect(result).toBe(mockWaitHandler)
    })
  })

  describe('when no plugin is installed', () => {
    describe('when it is called in the setup of a component', () => {
      it('then it returns the shared wait handler', () => {
        const [result] = withSetup(() => useWait())

        expect(result).toBe(waitInstance)
      })
    })

    describe('when it is called outside of any Vue app', () => {
      it('then it returns the same shared wait handler', () => {
        const wait = useWait()
        wait.start('outside')

        const [result] = withSetup(() => useWait())

        expect(result.isLoading('outside')).toBe(true)
        wait.stop('outside')
      })
    })
  })
})
