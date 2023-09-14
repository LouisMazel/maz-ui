import { mount } from '@vue/test-utils'
import MazTabs from '@components/MazTabs.vue'

describe('MazTabs.vue', () => {
  test('Should match with the snapshot', () => {
    const wrapper = mount(MazTabs)

    expect(wrapper.html()).toMatchSnapshot()
  })

  test('should display the content', () => {
    const wrapper = mount(MazTabs, {
      slots: {
        default: '<div>Contenu du slot</div>',
      },
    })

    expect(wrapper.text()).toContain('Contenu du slot')
  })

  test('initialize component with good value', () => {
    const wrapper = mount(MazTabs)

    expect(wrapper.vm.currentTab).toBe(1)
  })
})
