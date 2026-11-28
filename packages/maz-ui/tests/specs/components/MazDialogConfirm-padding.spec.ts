import MazDialogConfirm from '@components/MazDialogConfirm.vue'
import { mount } from '@vue/test-utils'

describe('given a MazDialogConfirm with a message', () => {
  describe('when it is open', () => {
    it('then its content keeps the padding of the dialog', async () => {
      const wrapper = mount(MazDialogConfirm, {
        props: { modelValue: true, title: 'Archive', message: 'The report is archived' },
        attachTo: document.body,
        global: { stubs: { teleport: true } },
      })
      await vi.dynamicImportSettled()

      expect(document.querySelector('.m-dialog-content')?.classList.contains('maz:px-6')).toBe(true)

      wrapper.unmount()
      document.body.innerHTML = ''
    })
  })
})
