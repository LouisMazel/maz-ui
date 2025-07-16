import MazCarousel from '@components/MazCarousel.vue'
import { shallowMount } from '@vue/test-utils'

describe('mazCarousel', () => {
  it('renders the component', () => {
    const wrapper = shallowMount(MazCarousel, {
      props: {
        noScrollBtn: false,
      },
      slots: {
        default: '<div class="carousel-item">Item 1</div>',
      },
    })

    expect(wrapper.exists()).toBe(true)
  })

  it('updates isScrolled and isScrolledMax when scrolling', async () => {
    const wrapper = shallowMount(MazCarousel, {
      props: {
        noScrollBtn: false,
      },
      slots: {
        default: '<div class="carousel-item">Item 1</div>',
      },
    })

    await vi.dynamicImportSettled()

    const scrollableElement = wrapper.find('.m-carousel__items').element

    scrollableElement.scrollLeft = 30
    scrollableElement.dispatchEvent(new Event('scroll'))

    // @ts-expect-error - test case
    expect(wrapper.vm.isScrolled).toBe(true)

    scrollableElement.scrollLeft = 0
    scrollableElement.dispatchEvent(new Event('scroll'))

    // @ts-expect-error - test case
    expect(wrapper.vm.isScrolled).toBe(false)

    const itemsScrollWidth = scrollableElement.scrollWidth - scrollableElement.clientWidth
    scrollableElement.scrollLeft = itemsScrollWidth - 30
    scrollableElement.dispatchEvent(new Event('scroll'))

    // @ts-expect-error - test case
    expect(wrapper.vm.isScrolledMax).toBe(false)

    scrollableElement.scrollLeft = itemsScrollWidth
    scrollableElement.dispatchEvent(new Event('scroll'))

    // @ts-expect-error - test case
    expect(wrapper.vm.isScrolledMax).toBe(true)
  })

  it('does not render the previous button when noScrollBtn is true', async () => {
    const wrapper = shallowMount(MazCarousel, {
      props: {
        hideScrollButtons: true,
      },
      slots: {
        default: '<div class="carousel-item">Item 1</div>',
      },
    })

    await vi.dynamicImportSettled()

    expect(wrapper.find('.m-carousel__btn.--muted').exists()).toBe(false)
  })

  it('does not render the title when no title slot is provided', () => {
    const wrapper = shallowMount(MazCarousel, {
      props: {
        noScrollBtn: false,
      },
      slots: {
        default: '<div class="carousel-item">Item 1</div>',
      },
    })

    expect(wrapper.find('.m-carousel__header.--has-title').exists()).toBe(false)
  })

  it('renders the title when a title slot is provided', () => {
    const wrapper = shallowMount(MazCarousel, {
      props: {
        noScrollBtn: false,
      },
      slots: {
        default: '<div class="carousel-item">Item 1</div>',
        title: '<div class="carousel-title">Title</div>',
      },
    })

    expect(wrapper.find('.carousel-title').exists()).toBe(true)
  })
})
