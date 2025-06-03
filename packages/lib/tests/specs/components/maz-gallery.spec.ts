import MazGallery from '@components/MazGallery.vue'
import { mount } from '@vue/test-utils'

describe('mazGallery', () => {
  it('renders images when images prop is provided', () => {
    const images = [
      { src: 'https://via.placeholder.com/500', alt: 'Image 1' },
      { src: 'https://via.placeholder.com/600', alt: 'Image 2' },
    ]

    const wrapper = mount(MazGallery, {
      props: {
        images,
      },
    })

    const galleryItems = wrapper.findAll('.m-gallery__item')

    expect(galleryItems.length).toBe(images.length)
  })

  it('renders NoPhotographyIcon when no images are provided and hasEmptyLayer prop is true', async () => {
    const wrapper = mount(MazGallery, {
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

  it('applies styles based on props', async () => {
    const wrapper = mount(MazGallery, {
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
    expect(gallery.classes()).toContain('maz-rounded')

    await wrapper.setProps({ radius: false })

    const gallery2 = wrapper.find('.m-gallery')

    expect(gallery2.classes()).not.toContain('maz-rounded')
  })

  it('applies remaining layer when noRemaining prop is false and there are more images than shown', () => {
    const images = [
      { src: 'https://via.placeholder.com/500', alt: 'Image 1' },
      { src: 'https://via.placeholder.com/600', alt: 'Image 2' },
      { src: 'https://via.placeholder.com/700', alt: 'Image 3' },
      { src: 'https://via.placeholder.com/700', alt: 'Image 3' },
      { src: 'https://via.placeholder.com/700', alt: 'Image 3' },
      { src: 'https://via.placeholder.com/700', alt: 'Image 3' },
      { src: 'https://via.placeholder.com/700', alt: 'Image 3' },
      { src: 'https://via.placeholder.com/700', alt: 'Image 3' },
    ]

    const wrapper = mount(MazGallery, {
      props: {
        images,
        noRemaining: false,
      },
    })

    const remainingLayer = wrapper.find('.m-gallery__remaining-layer')

    expect(remainingLayer.exists()).toBe(true)
  })

  it('does not apply remaining layer when noRemaining prop is true', () => {
    const images = [
      { src: 'https://via.placeholder.com/500', alt: 'Image 1' },
      { src: 'https://via.placeholder.com/600', alt: 'Image 2' },
      { src: 'https://via.placeholder.com/700', alt: 'Image 3' },
    ]

    const wrapper = mount(MazGallery, {
      props: {
        images,
        noRemaining: true,
      },
    })

    const remainingLayer = wrapper.find('.m-gallery__remaining-layer')

    expect(remainingLayer.exists()).toBe(false)
  })

  it('emits click event when an image is clicked', async () => {
    const images = [
      { src: 'https://via.placeholder.com/500', alt: 'Image 1' },
      { src: 'https://via.placeholder.com/600', alt: 'Image 2' },
    ]

    const wrapper = mount(MazGallery, {
      props: {
        images,
        noZoom: false,
      },
    })

    const firstImage = wrapper.find('.m-gallery__item--1')

    await firstImage.trigger('click')

    expect(wrapper.emitted('click')).toBeTruthy()
  })
})
