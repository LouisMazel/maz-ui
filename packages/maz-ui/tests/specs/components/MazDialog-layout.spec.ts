import MazDialog from '@components/MazDialog.vue'
import { mount } from '@vue/test-utils'

function getWrapper(props: Record<string, unknown> = {}, slots: Record<string, string> = {}) {
  return mount(MazDialog, {
    props: { modelValue: true, title: 'Title', ...props },
    slots: { default: '<p>Body</p>', ...slots },
    global: { stubs: { Teleport: { template: '<div><slot /></div>' } } },
  })
}

describe('given a dialog header', () => {
  describe('when rendered', () => {
    it('then it uses the same vertical padding on both sides', () => {
      const header = getWrapper().find('.m-dialog-header')
      expect(header.classes()).toContain('maz:py-3')
      expect(header.classes()).not.toContain('maz:pt-2')
      expect(header.classes()).not.toContain('maz:pb-4')
    })

    it('then it has no divider by default', () => {
      expect(getWrapper().find('.m-dialog-header').classes()).not.toContain('--divider')
    })
  })

  describe('when header-divider is set', () => {
    it('then it adds a divider under the header', () => {
      expect(getWrapper({ headerDivider: true }).find('.m-dialog-header').classes()).toContain('--divider')
    })

    it('then it does not duplicate the divider of a scrollable dialog', () => {
      const wrapper = getWrapper({ headerDivider: true, scrollable: true })
      expect(wrapper.find('.m-dialog-header').classes()).not.toContain('--divider')
      expect(wrapper.find('.m-dialog-content').classes()).toContain('maz:border-t')
    })
  })
})

describe('given a dialog content', () => {
  describe('when content-padding is not set', () => {
    it('then it pads the content', () => {
      expect(getWrapper().find('.m-dialog-content').classes()).toContain('maz:px-6')
    })
  })

  describe('when content-padding is false', () => {
    it('then it removes the padding of the content', () => {
      const classes = getWrapper({ contentPadding: false }).find('.m-dialog-content').classes()
      expect(classes).not.toContain('maz:px-6')
      expect(classes).not.toContain('maz:pb-4')
    })

    it('then it removes the vertical padding of a scrollable content', () => {
      const classes = getWrapper({ contentPadding: false, scrollable: true }).find('.m-dialog-content').classes()
      expect(classes).not.toContain('maz:py-4')
    })
  })
})
