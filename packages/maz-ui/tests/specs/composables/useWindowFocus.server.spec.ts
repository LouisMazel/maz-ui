import { useWindowFocus } from '@composables/useWindowFocus.ts'

vi.mock('@maz-ui/utils/helpers/isClient', () => ({
  isClient: () => false,
}))

describe('given the useWindowFocus composable on the server', () => {
  describe('when it is called', () => {
    it('then isFocused is false by default', () => {
      expect(useWindowFocus().isFocused.value).toBe(false)
    })

    it('then isFocused uses the initial value', () => {
      expect(useWindowFocus({ initialValue: true }).isFocused.value).toBe(true)
    })
  })
})
