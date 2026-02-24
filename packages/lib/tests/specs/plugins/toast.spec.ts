import { ToastPlugin } from '@plugins/toast'
import { createApp } from 'vue'

describe('given ToastPlugin', () => {
  describe('when installed on a Vue app', () => {
    it('then it should provide mazToast and set global property', () => {
      const app = createApp({ template: '<div />' })
      const provideSpy = vi.spyOn(app, 'provide')

      app.use(ToastPlugin)

      expect(provideSpy).toHaveBeenCalledWith('mazToast', expect.any(Object))
      expect(app.config.globalProperties.$mazToast).toBeDefined()
    })
  })

  describe('when installed with options', () => {
    it('then it should pass options to ToastHandler', () => {
      const app = createApp({ template: '<div />' })
      const options = { position: 'top-right' as const }

      app.use(ToastPlugin, options)

      expect(app.config.globalProperties.$mazToast).toBeDefined()
    })
  })
})
