import { vClickOutside } from '@directives/vClickOutside'
import { shallowMount } from '@vue/test-utils'

describe('vClickOutside directive', () => {
  it('does not call the callback function when clicked inside the element', () => {
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
