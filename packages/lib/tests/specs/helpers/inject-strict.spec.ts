import { mount } from '@vue/test-utils'
import { injectStrict } from '@package/helpers'

describe('injectStrict', () => {
  it('should return the fallback value if provided and the key is not found in the provide context', () => {
    const TestComponent = {
      setup() {
        const value = injectStrict('key', 'fallback')
        return { value }
      },
      template: '<span>{{ value }}</span>',
    }

    const wrapper = mount(TestComponent)

    expect(wrapper.text()).toBe('fallback')
  })
})
