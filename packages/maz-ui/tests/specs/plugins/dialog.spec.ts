import { DialogPlugin } from '@plugins/dialog'
import { createApp } from 'vue'

describe('given DialogPlugin', () => {
  describe('when installed on a Vue app', () => {
    it('then it should provide mazDialog and set global property', () => {
      const app = createApp({ template: '<div />' })
      const provideSpy = vi.spyOn(app, 'provide')

      app.use(DialogPlugin)

      expect(provideSpy).toHaveBeenCalledWith('mazDialog', expect.any(Object))
      expect(app.config.globalProperties.$mazDialog).toBeDefined()
      expect(app.config.globalProperties.$mazDialog.open).toBeDefined()
    })
  })

  describe('when installed with options', () => {
    it('then it should pass options to DialogHandler', () => {
      const app = createApp({ template: '<div />' })
      const options = { title: 'Custom Title' }

      app.use(DialogPlugin, options)

      expect(app.config.globalProperties.$mazDialog).toBeDefined()
      expect(app.config.globalProperties.$mazDialog.globalOptions).toBeDefined()
    })
  })
})
