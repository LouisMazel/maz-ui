import MazFullscreenImg from '@modules/directives/v-fullscreen-img/MazFullscreenImg.vue'
import { shallowMount } from '@vue/test-utils'

const defaultProperties = {
  clickedElementBounds: {
    top: 10,
    left: 20,
    width: 30,
    height: 40,
  },
  clickedElement: document.createElement('img'),
  animated: true,
  scaleAnimation: false,
}

describe('MazFullscreenImg', () => {
  test('should render correctly when opened', async () => {
    const wrapper = shallowMount(MazFullscreenImg, {
      props: {
        src: 'https://via.placeholder.com/150',
        alt: 'placeholder image',
        openInstanceClass: 'zv-open',
        destroy: () => {},
        ...defaultProperties,
      },
    })

    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()

    expect(wrapper.find('.m-fullscreen-img-loader').isVisible()).toBe(true)
    expect(wrapper.find('.m-fullscreen-btn').exists()).toBe(true)
  })

  test('should render correctly with an alternative text', async () => {
    const alt = 'alternative text'

    const wrapper = shallowMount(MazFullscreenImg, {
      props: {
        src: 'https://via.placeholder.com/150',
        alt,
        openInstanceClass: 'zv-open',
        destroy: () => {},
        ...defaultProperties,
      },
    })

    // expect(wrapper.find('.m-fullscreen-img-wrapper').isVisible()).toBe(true)
    expect(wrapper.find('img').attributes('alt')).toBe(alt)
  })

  test('should close the component and destroy it correctly', async () => {
    const destroy = vi.fn()

    const wrapper = shallowMount(MazFullscreenImg, {
      props: {
        src: 'https://via.placeholder.com/150',
        alt: 'placeholder image',
        openInstanceClass: 'zv-open',
        destroy,
        ...defaultProperties,
      },
    })

    await wrapper.find('.m-fullscreen-btn.--close').trigger('click')

    expect(wrapper.emitted('before-close')).toBeTruthy()
  })
})
