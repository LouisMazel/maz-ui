import { MazGallery } from '@components/index'
import MazCard from '@components/MazCard.vue'
import { GLOBAL_CONFIG_INJECTION_KEY } from '@composables/useGlobalConfig'
import { mount } from '@vue/test-utils'

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
        title: '<div>Card Header</div>',
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
    // @ts-expect-error - private
    expect(wrapper.vm.collapseOpenModel).toBe(true)

    await header.trigger('click')
    // @ts-expect-error - private
    expect(wrapper.vm.collapseOpenModel).toBe(false)
  })

  it('renders with gallery images', async () => {
    const images = [
      { src: 'image1.jpg', alt: 'Image 1' },
      { src: 'image2.jpg', alt: 'Image 2' },
      { src: 'image3.jpg', alt: 'Image 3' },
    ]

    const wrapper = mount(MazCard, {
      props: {
        gallery: {
          images,
        },
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

    expect(wrapper.classes()).toContain('maz:drop-shadow-md')
    expect(wrapper.classes()).toContain('maz:shadow-elevation')
    expect(wrapper.classes()).toContain('maz:rounded-md')
    expect(wrapper.classes()).toContain('maz:border')
    expect(wrapper.classes()).toContain('m-card--linked')
    expect(wrapper.classes()).toContain('m-card--no-scale')

    expect(wrapper.find('button').classes()).toContain('--is-collapsible')
    expect(wrapper.find('.m-card__header').classes()).toContain('maz:border-b')
    expect(wrapper.find('.m-card__wrapper').classes()).toContain('m-card__wrapper--row')
  })
})

function mountWithGlobalConfig(config: unknown, props: Record<string, unknown> = {}) {
  return mount(MazCard, {
    props,
    global: { provide: { [GLOBAL_CONFIG_INJECTION_KEY as symbol]: config } },
  })
}

describe('given a MazUi global default applied to MazCard', () => {
  describe('when no elevation prop is passed', () => {
    it('then the component default enables the elevation', () => {
      const wrapper = mountWithGlobalConfig({ MazCard: { elevation: true } })
      expect(wrapper.classes()).toContain('maz:shadow-elevation')
    })
  })

  describe('when no bordered prop is passed', () => {
    it('then the component default disables the border', () => {
      const wrapper = mountWithGlobalConfig({ MazCard: { bordered: false } })
      expect(wrapper.classes()).not.toContain('maz:border')
    })
  })

  describe('when a bordered prop is passed', () => {
    it('then the instance prop wins over the component default', () => {
      const wrapper = mountWithGlobalConfig({ MazCard: { bordered: false } }, { bordered: true })
      expect(wrapper.classes()).toContain('maz:border')
    })
  })
})
