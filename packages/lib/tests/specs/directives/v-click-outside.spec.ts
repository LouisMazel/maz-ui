import { mount } from '@vue/test-utils'
import { vClickOutside } from '@package/directives/click-outside.directive'

describe('vClickOutside directive', () => {
  // it('calls the callback function when clicked outside the element', async () => {
  //   const callback = vitest.fn()

  //   const wrapper = mount({
  //     template: `<div class="root"><div v-click-outside="callback"></div></div>`,
  //     directives: { clickOutside: vClickOutside },
  //     methods: { callback },
  //   })

  //   const rootElement = wrapper.find('.root')

  //   expect(rootElement.exists()).toBeTruthy()

  //   await wrapper.find('.root').trigger('click')

  //   // Ensure the callback function was called
  //   expect(callback).toHaveBeenCalled()
  // })

  it('does not call the callback function when clicked inside the element', async () => {
    const callback = vitest.fn()
    const wrapper = mount({
      template: `<div v-click-outside="callback"></div>`,
      directives: { clickOutside: vClickOutside },
      methods: { callback },
    })

    // Simulate a click inside the element
    wrapper.vm.$el.click()

    // Ensure the callback function was not called
    expect(callback).not.toHaveBeenCalled()
  })
})
