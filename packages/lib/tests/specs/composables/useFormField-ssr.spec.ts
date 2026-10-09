import { useFormField } from '@composables/useFormField'
import { useFormValidator } from '@composables/useFormValidator'
import { withSetup } from '@tests/helpers/withSetup'
import { minLength, pipe, string } from 'valibot'
import { nextTick, ref } from 'vue'

vi.mock('@maz-ui/utils/helpers/isClient', () => ({
  isClient: () => false,
}))

describe('given useFormField in a non-client (SSR) environment', () => {
  describe('when a ref with an element is provided in eager mode', () => {
    it('then it does not bind any listeners', async () => {
      const input = document.createElement('input')
      const wrapper = document.createElement('div')
      wrapper.appendChild(input)
      const addSpy = vi.spyOn(input, 'addEventListener')
      const elRef = ref<HTMLElement | undefined>(wrapper)

      withSetup(() => {
        const form = useFormValidator({
          schema: { name: pipe(string(), minLength(2)) },
          defaultValues: { name: '' },
          options: { mode: 'eager' },
        })
        const field = useFormField('name', { ref: elRef })
        return { form, field }
      })

      await nextTick()

      expect(addSpy).not.toHaveBeenCalled()
      addSpy.mockRestore()
    })
  })
})
