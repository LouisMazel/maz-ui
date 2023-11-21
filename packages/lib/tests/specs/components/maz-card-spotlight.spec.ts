import { mount } from '@vue/test-utils'
import MazCardSpotlight from '@components/MazCardSpotlight.vue'

describe('MazCardSpotlight', () => {
  test('renders with default props', async () => {
    const wrapper = mount(MazCardSpotlight)

    await wrapper.vm.$nextTick()

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.classes()).toContain('card')
    expect(wrapper.classes()).toContain('maz-elevation')
  })

  test('does not render elevation when noElevation prop is true', async () => {
    const wrapper = mount(MazCardSpotlight, {
      props: {
        noElevation: true,
      },
    })

    await wrapper.vm.$nextTick()

    expect(wrapper.classes()).not.toContain('maz-elevation')
  })

  test('removes event listener on component unmount', async () => {
    const removeEventListener = vi.spyOn(window, 'removeEventListener')
    const wrapper = mount(MazCardSpotlight)

    await wrapper.vm.$nextTick()
    wrapper.unmount()

    expect(removeEventListener).toHaveBeenCalledWith('mousemove', expect.any(Function))
  })
})
