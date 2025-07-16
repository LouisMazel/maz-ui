import MazGallery from '@components/MazGallery.vue'
import { mount } from '@vue/test-utils'

describe('given MazGallery component', () => {
  let wrapper: ReturnType<typeof mount>

  afterEach(() => {
    wrapper?.unmount()
  })

  describe('when images prop is provided', () => {
    it('then it should render the correct number of images', () => {
      const images = [
        { src: 'https://via.placeholder.com/500', alt: 'Image 1' },
        { src: 'https://via.placeholder.com/600', alt: 'Image 2' },
      ]

      wrapper = mount(MazGallery, {
        props: {
          images,
        },
      })

      const galleryItems = wrapper.findAll('.m-gallery__item')

      expect(galleryItems.length).toBe(images.length)
    })
  })

  describe('when no images are provided', () => {
    it('then it should render empty layer when hasEmptyLayer is true', async () => {
      wrapper = mount(MazGallery, {
        props: {
          hasEmptyLayer: true,
          images: [],
        },
      })

      const noPhotographyIcon = wrapper.find('.empty-layer')

      expect(noPhotographyIcon.exists()).toBe(true)

      await wrapper.setProps({ hasEmptyLayer: false })

      const noPhotographyIcon2 = wrapper.find('.empty-layer')

      expect(noPhotographyIcon2.exists()).toBe(false)
    })
  })

  describe('when style props are provided', () => {
    it('then it should apply the correct styles and classes', async () => {
      wrapper = mount(MazGallery, {
        props: {
          images: [
            { src: 'https://via.placeholder.com/500', alt: 'Image 1' },
            { src: 'https://via.placeholder.com/600', alt: 'Image 2' },
          ],
          height: 200,
          width: '50%',
        },
      })

      const gallery = wrapper.find('.m-gallery')

      expect(gallery.attributes('style')).toContain('height: 200px')
      expect(gallery.attributes('style')).toContain('width: 50%')
      expect(gallery.classes()).toContain('--radius')

      await wrapper.setProps({ radius: false })

      const gallery2 = wrapper.find('.m-gallery')

      expect(gallery2.classes()).not.toContain('--radius')
    })
  })

  describe('when there are more images than displayed count', () => {
    it('then it should show remaining layer when remaining prop is true', () => {
      const images = [
        { src: 'https://via.placeholder.com/500', alt: 'Image 1' },
        { src: 'https://via.placeholder.com/600', alt: 'Image 2' },
        { src: 'https://via.placeholder.com/700', alt: 'Image 3' },
        { src: 'https://via.placeholder.com/700', alt: 'Image 4' },
        { src: 'https://via.placeholder.com/700', alt: 'Image 5' },
        { src: 'https://via.placeholder.com/700', alt: 'Image 6' },
        { src: 'https://via.placeholder.com/700', alt: 'Image 7' },
        { src: 'https://via.placeholder.com/700', alt: 'Image 8' },
      ]

      wrapper = mount(MazGallery, {
        props: {
          images,
          remaining: true,
        },
      })

      const remainingLayer = wrapper.find('.m-gallery__remaining-layer')

      expect(remainingLayer.exists()).toBe(true)
    })
  })

  describe('when remaining prop is false', () => {
    it('then it should not show remaining layer', () => {
      const images = [
        { src: 'https://via.placeholder.com/500', alt: 'Image 1' },
        { src: 'https://via.placeholder.com/600', alt: 'Image 2' },
        { src: 'https://via.placeholder.com/700', alt: 'Image 3' },
      ]

      wrapper = mount(MazGallery, {
        props: {
          images,
          remaining: false,
        },
      })

      const remainingLayer = wrapper.find('.m-gallery__remaining-layer')

      expect(remainingLayer.exists()).toBe(false)
    })
  })

  describe('when an image is clicked', () => {
    it('then it should emit click event', async () => {
      const images = [
        { src: 'https://via.placeholder.com/500', alt: 'Image 1' },
        { src: 'https://via.placeholder.com/600', alt: 'Image 2' },
      ]

      wrapper = mount(MazGallery, {
        props: {
          images,
          zoom: true,
        },
      })

      const firstImage = wrapper.find('.m-gallery__item--1')

      await firstImage.trigger('click')

      expect(wrapper.emitted('click')).toBeTruthy()
    })
  })
})
