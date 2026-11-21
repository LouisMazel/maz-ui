import { DialogPlugin } from '@plugins/dialog.ts'
import { ToastPlugin } from '@plugins/toast.ts'
import { WaitPlugin } from '@plugins/wait.ts'
import { createApp } from 'vue'

describe('given the deprecated plugins', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe.each([
    ['ToastPlugin', ToastPlugin, 'https://maz-ui.com/plugins/toast'],
    ['DialogPlugin', DialogPlugin, 'https://maz-ui.com/plugins/dialog'],
    ['WaitPlugin', WaitPlugin, 'https://maz-ui.com/plugins/wait'],
  ])('when %s is installed', (name, plugin, link) => {
    it('then it warns once with a link to the docs', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

      createApp({ template: '<div />' }).use(plugin)
      createApp({ template: '<div />' }).use(plugin)

      expect(warn).toHaveBeenCalledOnce()
      expect(warn.mock.calls[0]?.[0]).toContain(`${name} is deprecated`)
      expect(warn.mock.calls[0]?.[0]).toContain(link)
    })
  })
})
