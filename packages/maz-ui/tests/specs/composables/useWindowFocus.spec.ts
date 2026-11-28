import { useWindowFocus } from '@composables/useWindowFocus.ts'
import { withSetup } from '@tests/helpers/withSetup.ts'

describe('given the useWindowFocus composable', () => {
  describe('when the document has the focus', () => {
    it('then isFocused follows the focus and blur events', () => {
      vi.spyOn(document, 'hasFocus').mockReturnValue(true)
      const [{ isFocused }, app] = withSetup(() => useWindowFocus())

      expect(isFocused.value).toBe(true)

      globalThis.dispatchEvent(new Event('blur'))
      expect(isFocused.value).toBe(false)

      globalThis.dispatchEvent(new Event('focus'))
      expect(isFocused.value).toBe(true)

      app.unmount()
      globalThis.dispatchEvent(new Event('blur'))
      expect(isFocused.value).toBe(true)
    })
  })

  describe('when it is used inside a component', () => {
    it('then isFocused equals initialValue until the component is mounted', () => {
      vi.spyOn(document, 'hasFocus').mockReturnValue(true)
      let valueDuringSetup: boolean | undefined
      const [{ isFocused }, app] = withSetup(() => {
        const result = useWindowFocus({ initialValue: false })
        valueDuringSetup = result.isFocused.value
        return result
      })

      expect(valueDuringSetup).toBe(false)
      expect(isFocused.value).toBe(true)
      app.unmount()
    })
  })

  describe('when the document does not have the focus', () => {
    it('then isFocused starts false', () => {
      vi.spyOn(document, 'hasFocus').mockReturnValue(false)
      const [{ isFocused }, app] = withSetup(() => useWindowFocus())

      expect(isFocused.value).toBe(false)
      app.unmount()
    })
  })
})
