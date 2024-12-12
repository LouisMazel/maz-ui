import { injectStrict } from '@helpers/injectStrict'
import { shallowMount } from '@vue/test-utils'

describe('injectStrict', () => {
  it('should return the fallback value if provided and the key is not found in the provide context', () => {
    const TestComponent = {
      setup() {
        const value = injectStrict('key', 'fallback')
        return { value }
      },
      template: '<span>{{ value }}</span>',
    }

    const wrapper = shallowMount(TestComponent)

    expect(wrapper.text()).toBe('fallback')
  })
})
