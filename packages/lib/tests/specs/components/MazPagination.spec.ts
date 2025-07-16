import MazPagination from '@components/MazPagination.vue'
import { mount } from '@vue/test-utils'

describe('mazPagination.vue', () => {
  // Test rendering with default props
  it('renders with default props', async () => {
    const wrapper = mount(MazPagination, {
      props: {
        totalPages: 10,
      },
    })
    await wrapper.vm.$nextTick()

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.props('buttonProps')).toBeUndefined()
    expect(wrapper.props('pageRange')).toBe(1)
    expect(wrapper.props('resultsSize')).toBeUndefined()
    expect(wrapper.props('activeColor')).toBe('background')
  })

  // Test rendering with custom props
  it('renders with custom props', async () => {
    const wrapper = mount(MazPagination, {
      props: {
        totalPages: 15,
        buttonProps: {
          size: 'sm',
          color: 'secondary',
          outlined: false,
          fab: false,
        },
        pageRange: 3,
        resultsSize: 50,
        activeColor: 'secondary',
      },
    })

    await wrapper.vm.$nextTick()

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.props('buttonProps')).toEqual({
      size: 'sm',
      color: 'secondary',
      outlined: false,
      fab: false,
    })
    expect(wrapper.props('pageRange')).toBe(3)
    expect(wrapper.props('resultsSize')).toBe(50)
    expect(wrapper.props('activeColor')).toBe('secondary')
  })

  // Test clicking on page buttons
  it('updates current page when a page button is clicked', async () => {
    const wrapper = mount(MazPagination, {
      props: {
        totalPages: 10,
      },
    })
    await wrapper.vm.$nextTick()

    const pageButtons = wrapper.findAll('.m-pagination li button')

    await pageButtons[3].trigger('click') // Click the fourth page button

    expect(wrapper.emitted('update:model-value')).toBeTruthy()
    expect(wrapper.emitted('update:model-value')).toEqual([[2]])
  })

  // Test pagination button visibility based on totalPages
  it('disables next/last buttons when currentPage is equal to totalPages', async () => {
    const wrapper = mount(MazPagination, {
      props: {
        totalPages: 10,
        modelValue: 1,
        resultsSize: 100,
      },
    })
    await wrapper.vm.$nextTick()

    const getPreviousPageButton = () => wrapper.find('.m-pagination li:nth-child(2) button')
    const getLastPageButton = () => wrapper.find('.m-pagination li:last-child button')

    expect(getPreviousPageButton().attributes('disabled')).toBe('')

    // Move to the last page
    await wrapper.setProps({ modelValue: 10 })
    await wrapper.vm.$nextTick()

    // Expect last and next page buttons to be disabled
    expect(getLastPageButton().attributes('disabled')).toBe('')
  })

  // Add more test cases as needed
})
