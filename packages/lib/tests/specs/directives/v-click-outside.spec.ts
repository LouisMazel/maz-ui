import { shallowMount } from '@vue/test-utils'
import { vClickOutside } from '@package/directives/click-outside'

describe('vClickOutside directive', () => {
  it('does not call the callback function when clicked inside the element', async () => {
    const callback = vitest.fn()
    const wrapper = shallowMount({
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
