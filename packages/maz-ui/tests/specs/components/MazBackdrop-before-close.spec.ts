import MazBackdrop from '@components/MazBackdrop.vue'
import MazDialog from '@components/MazDialog.vue'
import MazDrawer from '@components/MazDrawer.vue'
import { flushPromises, mount } from '@vue/test-utils'

function mountBackdrop(beforeClose?: () => unknown) {
  return mount(MazBackdrop, {
    props: { modelValue: true, beforeClose: beforeClose as () => void },
    global: { stubs: { Teleport: { template: '<div><slot /></div>' } } },
  })
}

describe('given a backdrop with a beforeClose function', () => {
  describe('when beforeClose returns false', () => {
    it('then it keeps the backdrop open on close()', async () => {
      const wrapper = mountBackdrop(() => false)
      await wrapper.vm.close()
      expect(wrapper.vm.present).toBe(true)
    })

    it('then it keeps the backdrop open on Escape', async () => {
      const beforeClose = vi.fn(() => false)
      const wrapper = mountBackdrop(beforeClose)
      document.dispatchEvent(new KeyboardEvent('keyup', { key: 'Escape' }))
      await flushPromises()
      expect(beforeClose).toHaveBeenCalledOnce()
      expect(wrapper.vm.present).toBe(true)
    })

    it('then it keeps the backdrop open on click outside', async () => {
      const wrapper = mountBackdrop(() => false)
      await wrapper.find('.m-backdrop-content').trigger('pointerdown')
      await flushPromises()
      expect(wrapper.vm.present).toBe(true)
    })
  })

  describe('when beforeClose resolves false', () => {
    it('then it keeps the backdrop open', async () => {
      const wrapper = mountBackdrop(() => Promise.resolve(false))
      await wrapper.vm.close()
      expect(wrapper.vm.present).toBe(true)
    })
  })

  describe('when beforeClose returns true, undefined or resolves undefined', () => {
    it.each([
      ['true', () => true],
      ['undefined', () => {}],
      ['a promise of undefined', () => Promise.resolve()],
    ])('closes the backdrop with %s', async (_name, beforeClose) => {
      const wrapper = mountBackdrop(beforeClose)
      await wrapper.vm.close()
      expect(wrapper.vm.present).toBe(false)
    })
  })

  describe('when beforeClose rejects', () => {
    it('then it keeps the backdrop open', async () => {
      const wrapper = mountBackdrop(() => Promise.reject(new Error('fail')))
      await expect(wrapper.vm.toggleModal(false)).rejects.toThrow('fail')
      expect(wrapper.vm.present).toBe(true)
    })
  })
})

describe('given a dialog or a drawer with beforeClose', () => {
  describe('when beforeClose returns false and the dialog is closed', () => {
    it('then it keeps the dialog open', async () => {
      const wrapper = mount(MazDialog, {
        props: { modelValue: true, beforeClose: () => false },
        global: { stubs: { Teleport: { template: '<div><slot /></div>' } } },
      })
      await wrapper.vm.close()
      expect(wrapper.find('.m-dialog').exists()).toBe(true)
      expect(wrapper.emitted('close')).toBeUndefined()
    })
  })

  describe('when beforeClose returns false and the drawer is closed', () => {
    it('then it keeps the drawer open', async () => {
      const wrapper = mount(MazDrawer, {
        props: { modelValue: true, beforeClose: () => false } as never,
        global: { stubs: { Teleport: { template: '<div><slot /></div>' } } },
      })
      await wrapper.find('.m-backdrop-content').trigger('pointerdown')
      await flushPromises()
      expect(wrapper.find('.m-drawer').exists()).toBe(true)
    })
  })
})

describe('given the close function of a backdrop', () => {
  describe('when it is called', () => {
    it('then it returns the promise of the close', async () => {
      const wrapper = mountBackdrop(() => false)
      await expect(wrapper.vm.close()).resolves.toBeUndefined()
    })
  })
})
