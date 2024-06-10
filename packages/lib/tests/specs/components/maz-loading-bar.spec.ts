import { mount } from '@vue/test-utils'
import MazLoadingBar from '@components/MazLoadingBar.vue'

describe('mazLoadingBar', () => {
  it('renders default color correctly', () => {
    const wrapper = mount(MazLoadingBar)
    expect(wrapper.vm.colorCSVariables.alpha).toBe('var(--maz-color-primary-alpha-20)')
    expect(wrapper.vm.colorCSVariables.main).toBe('var(--maz-color-primary)')
  })
})
