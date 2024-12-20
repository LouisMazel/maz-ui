import MazCircularProgressBar from '@components/MazCircularProgressBar.vue'
import { mount, type VueWrapper } from '@vue/test-utils'

const mockIntersectionObserver = vi.fn()
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
})

window.IntersectionObserver = mockIntersectionObserver

describe('mazCircularProgressBar', () => {
  let wrapper: VueWrapper<InstanceType<typeof MazCircularProgressBar>>

  beforeEach(async () => {
    wrapper = mount(MazCircularProgressBar, {
      props: {
        percentage: 50,
      },
    })

    await vi.dynamicImportSettled()
  })

  it('renders progress bar with default values', () => {
    expect(wrapper.text()).toContain('50')
  })

  it('updates percentage and triggers animation', async () => {
    await wrapper.setProps({ suffix: '%' })
    expect(wrapper.find('.maz-sr-only').text()).toContain('50%')

    await wrapper.setProps({ percentage: 75 })

    await new Promise(resolve => setTimeout(resolve, 100))

    expect(wrapper.text()).toContain('75%')
  })

  it('renders with auto color', async () => {
    await wrapper.setProps({
      percentage: 25,
      autoColor: true,
    })

    expect(wrapper.find('svg stop').attributes('stop-color')).toContain('maz-color-danger')

    await wrapper.setProps({
      percentage: 50,
      autoColor: true,
    })

    expect(wrapper.find('svg stop').attributes('stop-color')).toContain('maz-color-warning')

    await wrapper.setProps({
      percentage: 100,
      autoColor: true,
    })

    expect(wrapper.find('svg stop').attributes('stop-color')).toContain('maz-color-success')
  })
})
