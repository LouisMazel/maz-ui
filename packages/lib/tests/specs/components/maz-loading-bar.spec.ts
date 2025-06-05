import MazLoadingBar from '@components/MazLoadingBar.vue'
import { mount } from '@vue/test-utils'

describe('mazLoadingBar', () => {
  it('renders default color correctly', () => {
    const wrapper = mount(MazLoadingBar)
    // @ts-expect-error - colorCSSVariables is not typed
    expect(wrapper.vm.colorCSSVariables.alpha).toBe('var(--maz-color-primary-alpha-20)')
    // @ts-expect-error - colorCSSVariables is not typed
    expect(wrapper.vm.colorCSSVariables.main).toBe('var(--maz-color-primary)')
  })
})
