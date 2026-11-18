import { useRelativeTime } from '@composables/useRelativeTime'
import { withSetup } from '@tests/helpers/withSetup'
import { nextTick } from 'vue'

vi.mock('@maz-ui/utils/helpers/isClient', () => ({
  isClient: () => false,
}))

describe('given useRelativeTime in a non-client (SSR) environment', () => {
  describe('when the composable is used', () => {
    it('then the text is computed without any timer', async () => {
      vi.useFakeTimers()
      vi.setSystemTime(new Date('2024-06-15T12:00:00.000Z'))

      const [{ text }, app] = withSetup(() => useRelativeTime(new Date('2024-06-15T11:59:30.000Z'), { locale: 'en' }))

      await nextTick()

      expect(text.value).toBe('30 seconds ago')
      expect(vi.getTimerCount()).toBe(0)

      app.unmount()
      vi.useRealTimers()
    })
  })
})
