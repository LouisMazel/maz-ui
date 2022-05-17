import { shallowMount } from '@vue/test-utils'
import NGallery from './NGallery.vue'
import NGalleryScrollButtons from '~/components/ui/NGallery/NGalleryScrollButtons.vue'
import NGalleryResponsive from '~/components/ui/NGallery/NGalleryResponsive.vue'

const getMedia = () => ({
  mobile: '',
  small: '',
  url: '',
  sources: [
    {
      srcset: '',
      media: '',
    },
  ],
})

describe('~/components/ui/NGallery/NGallery', () => {
  let wrapper: any

  beforeEach(() => {
    wrapper = shallowMount(NGallery, {
      components: {
        NGalleryResponsive,
      },
      stubs: {
        NGalleryScrollButtons: true,
        NGalleryResponsiveItemsBar: true,
        NLazyImg: true,
      },
      mocks: {
        $mq: {
          'tab-m': true,
        },
      },
      propsData: {
        medias: [getMedia(), getMedia(), getMedia()],
      },
    })
  })

  test('should have children components', async () => {
    await nextTick()
    expect(wrapper.findComponent(NGalleryScrollButtons)).toBeDefined()
    expect(wrapper.findComponent(NGalleryResponsive)).toBeDefined()
  })

  test('should have good count of mapped image', () => {
    expect(wrapper.vm.mediasWithId).toHaveLength(3)
  })

  test('should have images mapped with id & image property', () => {
    for (const [i, imageWithId] of wrapper.vm.mediasWithId.entries()) {
      expect(imageWithId.id).toEqual(i)
      expect(imageWithId).toHaveProperty('srcs')
    }
  })

  test('should have first image as main image on init', () => {
    expect(wrapper.vm.mainImage.id).toEqual(0)
  })

  test('should have second image as main image on select and have the good slide animation', () => {
    wrapper.vm.setMainImage(wrapper.vm.mediasWithId[2])
    expect(wrapper.vm.mainImage.id).toEqual(2)
    expect(wrapper.vm.slideTransition).toBe('slide-up')
    wrapper.vm.setMainImage(wrapper.vm.mediasWithId[1])
    expect(wrapper.vm.mainImage.id).toEqual(1)
    expect(wrapper.vm.slideTransition).toBe('slide-down')
  })

  test('should have scroll buttons if image count is above 5', async () => {
    expect(wrapper.vm.hasScrollButton).toBeFalsy()
    await wrapper.setProps({
      medias: [getMedia, getMedia, getMedia, getMedia, getMedia, getMedia],
    })
    wrapper.vm.$nextTick()
    expect(wrapper.vm.medias).toHaveLength(6)
    expect(wrapper.vm.hasScrollButton).toBeTruthy()
  })

  test('should have the selected class in column', () => {
    expect(
      wrapper.find('.n-gallery-desktop-column-scroll-images').classes(),
    ).toContain('is-selected')
  })
})
