import { useWait } from '@composables/useWait.ts'
import { ServerWaitHandler, waitInstance } from '@plugins/wait.ts'

vi.mock('@maz-ui/utils/helpers/isServer', () => ({
  isServer: () => true,
}))

describe('given useWait composable on the server', () => {
  describe('when it is called without plugin', () => {
    it('then it returns a server handler that never starts a loader', () => {
      const wait = useWait()
      wait.start('request')

      expect(wait).toBeInstanceOf(ServerWaitHandler)
      expect(wait).not.toBe(waitInstance)
      expect(wait.stop('request')).toBe(wait)
      expect(wait.isLoading('request')).toBe(false)
      expect(useWait()).toBe(wait)
    })
  })
})
