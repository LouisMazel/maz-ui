import { mount } from '@vue/test-utils'
import MazCard from '@components/MazCard.vue'
import { MazGallery } from '@components/index'

describe('components/MazCard.vue', () => {
  it('renders with default props', async () => {
    const wrapper = mount(MazCard)

    await vi.dynamicImportSettled()

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.classes()).toContain('m-card')
  })

  it('renders with header slot content', async () => {
    const wrapper = mount(MazCard, {
      slots: {
        header: '<div>Card Header</div>',
      },
    })

    await vi.dynamicImportSettled()

    const header = wrapper.find('.m-card__header')
    expect(header.exists()).toBe(true)
    expect(header.text()).toContain('Card Header')
  })

  it('toggles collapsible state on header click', async () => {
    const wrapper = mount(MazCard, {
      props: {
        collapsible: true,
      },
    })

    await vi.dynamicImportSettled()

    const header = wrapper.find('.m-card__header')

    await header.trigger('click')

    expect(wrapper.vm.isOpen).toBe(true)

    await header.trigger('click')

    expect(wrapper.vm.isOpen).toBe(false)
  })

  it('renders with gallery images', async () => {
    const images = [
      { src: 'image1.jpg', alt: 'Image 1' },
      { src: 'image2.jpg', alt: 'Image 2' },
      { src: 'image3.jpg', alt: 'Image 3' },
    ]

    const wrapper = mount(MazCard, {
      props: {
        images,
      },
    })

    await vi.dynamicImportSettled()

    const gallery = wrapper.findComponent(MazGallery)
    expect(gallery.exists()).toBe(true)
    expect(gallery.props('images')).toEqual(images)
  })

  it('applies correct styles based on props', async () => {
    const wrapper = mount(MazCard, {
      props: {
        radius: true,
        bordered: true,
        elevation: true,
        orientation: 'row',
        collapsible: true,
        collapseOpen: false,
        scale: false,
        href: './',
      },
    })

    await vi.dynamicImportSettled()

    expect(wrapper.classes()).toContain('maz-elevation')
    expect(wrapper.classes()).toContain('maz-rounded')
    expect(wrapper.find('button').classes()).toContain('--is-collapsible')
    expect(wrapper.classes()).toContain('maz-border')
    expect(wrapper.classes()).toContain('m-card--linked')
    expect(wrapper.classes()).toContain('m-card--no-scale')
    expect(wrapper.find('.m-card__header').classes()).toContain('maz-border-b')
    expect(wrapper.find('.m-card__wrapper').classes()).toContain('m-card__wrapper--row')
  })
})
