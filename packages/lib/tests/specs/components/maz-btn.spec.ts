import MazBtn from '@package/components/MazBtn.vue'
import { shallowMount } from '@vue/test-utils'

describe('MazBtn', () => {
  test('Should match wtesth the snapshot', () => {
    const wrapper = shallowMount(MazBtn)
    expect(wrapper.html()).toMatchSnapshot()
  })

  test('renders the component elements and classes correctly', () => {
    const wrapper = shallowMount(MazBtn)

    expect(wrapper.find('button').exists()).toBe(true)
    expect(wrapper.find('.m-btn__icon-left').exists()).toBe(false)

    expect(wrapper.find('span').exists()).toBe(true)
    expect(wrapper.find('.m-btn__icon-right').exists()).toBe(false)
    expect(wrapper.find('.m-btn__loading-wrapper').exists()).toBe(false)

    expect(wrapper.find('.m-btn').exists()).toBe(true)
  })

  test('renders the button content correctly using slots', () => {
    const wrapper = shallowMount(MazBtn, {
      slots: {
        default: 'Button Text',
        'left-icon': '<div class="left-icon">Left Icon</div>',
        'right-icon': '<div class="right-icon">Right Icon</div>',
      },
    })

    expect(wrapper.text()).toContain('Button Text')
    expect(wrapper.find('.m-btn__icon-left').exists()).toBe(true)
    expect(wrapper.find('.m-btn__icon-right').exists()).toBe(true)
  })

  test('shows the loading spinner when the "loading" prop is set to "true"', () => {
    const wrapper = shallowMount(MazBtn, {
      propsData: {
        loading: true,
      },
    })

    // Vérifie que le wrapper de chargement est affiché
    expect(wrapper.find('.m-btn__loading-wrapper').exists()).toBe(true)
  })
})
