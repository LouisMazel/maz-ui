import { DialogHandler } from '@plugins/dialog/DialogHandler.ts'
import { ToastHandler } from '@plugins/toast/ToastHandler.ts'
import { createApp } from 'vue'

vi.mock('@maz-ui/utils/helpers/isClient', () => ({
  isClient: () => false,
}))

describe('given the toast and dialog handlers on the server', () => {
  describe('when a toast is shown', () => {
    it('then nothing is rendered and its controls do nothing', () => {
      const toast = new ToastHandler(createApp({ template: '<div />' }))

      const { close, destroy } = toast.success('Saved')

      expect(close()).toBeUndefined()
      expect(destroy()).toBeUndefined()
      expect(document.body.innerHTML).not.toContain('Saved')
    })
  })

  describe('when a confirmation is asked', () => {
    it('then it resolves false', async () => {
      const dialog = new DialogHandler(createApp({ template: '<div />' }))

      await expect(dialog.confirm({ message: 'Delete?' })).resolves.toBe(false)
    })
  })

  describe('when a dialog is opened', () => {
    it('then its controls do nothing', () => {
      const dialog = new DialogHandler(createApp({ template: '<div />' }))

      const { close, destroy } = dialog.open({ message: 'Hello' })

      expect(close()).toBeUndefined()
      expect(destroy()).toBeUndefined()
    })
  })
})
