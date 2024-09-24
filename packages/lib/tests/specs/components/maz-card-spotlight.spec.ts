import MazCardSpotlight from '@components/MazCardSpotlight.vue'
import { mount } from '@vue/test-utils'

describe('mazCardSpotlight', () => {
  it('renders with default props', async () => {
    const wrapper = mount(MazCardSpotlight)

    await wrapper.vm.$nextTick()

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.classes()).toContain('m-card-spotlight')
    expect(wrapper.classes()).toContain('maz-elevation')
  })

  it('does not render elevation when noElevation prop is true', async () => {
    const wrapper = mount(MazCardSpotlight, {
      props: {
        noElevation: true,
      },
    })

    await wrapper.vm.$nextTick()

    expect(wrapper.classes()).not.toContain('maz-elevation')
  })

  it('removes event listener on component unmount', async () => {
    const removeEventListener = vi.spyOn(window, 'removeEventListener')
    const wrapper = mount(MazCardSpotlight)

    await wrapper.vm.$nextTick()
    wrapper.unmount()

    expect(removeEventListener).toHaveBeenCalledWith('mousemove', expect.any(Function))
  })
})
