import type { MazSize } from '@components/types'
import MazBtn from '@components/MazBtn.vue'
import MazInputTags from '@components/MazInputTags.vue'
import { GLOBAL_CONFIG_INJECTION_KEY } from '@composables/useGlobalConfig'
import { mount } from '@vue/test-utils'

describe('mazInputTags', () => {
  it('renders with default props', async () => {
    const wrapper = mount(MazInputTags, {
      props: {
        modelValue: [],
      },
    })

    await wrapper.vm.$nextTick()

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.classes()).toContain('m-input-tags')
    expect(wrapper.find('.m-input-tags__input').exists()).toBe(true)
  })

  it('applies correct buttonSize based on size prop', async () => {
    const sizes = ['mini', 'xs', 'sm', 'md', 'lg', 'xl']
    const expectedButtonSizes = {
      mini: 'mini',
      xs: 'mini',
      sm: 'xs',
      md: 'sm',
      lg: 'md',
      xl: 'lg',
    }

    for (const size of sizes) {
      const wrapper = mount(MazInputTags, {
        props: {
          modelValue: ['tag1'],
          size: size as MazSize,
        },
      })

      await wrapper.vm.$nextTick()

      const tagButton = wrapper.findComponent(MazBtn)
      expect(tagButton.props('size')).toBe(expectedButtonSizes[size as keyof typeof expectedButtonSizes])
    }
  })

  it('renders with tags from modelValue prop', async () => {
    const wrapper = mount(MazInputTags, {
      props: {
        modelValue: ['tag1', 'tag2'],
      },
    })

    await wrapper.vm.$nextTick()

    const tags = wrapper.findAll('.m-input-tags__tag')
    expect(tags.length).toBe(2)
    expect(tags[0].text()).toContain('tag1')
    expect(tags[1].text()).toContain('tag2')
  })

  it('emits update:model-value when tags are added', async () => {
    const wrapper = mount(MazInputTags, {
      props: {
        modelValue: [],
      },
    })

    await wrapper.vm.$nextTick()

    const input = wrapper.find('.m-input-tags__input input')
    await input.setValue('tag1,tag2')
    await input.trigger('keydown.enter')

    expect(wrapper.emitted('update:model-value')).toBeTruthy()
    expect(wrapper.emitted('update:model-value')?.[0][0]).toEqual(['tag1', 'tag2'])
  })

  it('emits update:model-value when tags are removed', async () => {
    const wrapper = mount(MazInputTags, {
      props: {
        modelValue: ['tag1', 'tag2'],
      },
    })

    await wrapper.vm.$nextTick()

    const tag = wrapper.find('.m-input-tags__tag')
    await tag.trigger('click')

    expect(wrapper.emitted('update:model-value')).toBeTruthy()
    expect(wrapper.emitted('update:model-value')?.[0][0]).toEqual(['tag2'])
  })

  it('emits update:model-value when last tag is removed on backspace', async () => {
    const wrapper = mount(MazInputTags, {
      props: {
        modelValue: ['tag1', 'tag2'],
      },
    })

    await wrapper.vm.$nextTick()

    const input = wrapper.find('.m-input-tags__input input')
    await input.setValue('')
    await input.trigger('keydown.delete')
    await input.trigger('keydown.delete')

    expect(wrapper.emitted('update:model-value')).toBeTruthy()
    expect(wrapper.emitted('update:model-value')?.[0][0]).toEqual(['tag1'])
  })

  it('applies error style when error prop is true', async () => {
    const wrapper = mount(MazInputTags, {
      props: {
        modelValue: [],
        error: true,
      },
    })

    await wrapper.vm.$nextTick()

    expect(wrapper.classes()).toContain('maz:border-destructive')
  })

  it('applies success style when success prop is true', async () => {
    const wrapper = mount(MazInputTags, {
      props: {
        modelValue: [],
        success: true,
      },
    })

    await wrapper.vm.$nextTick()

    expect(wrapper.classes()).toContain('maz:border-success')
  })

  it('applies warning style when warning prop is true', async () => {
    const wrapper = mount(MazInputTags, {
      props: {
        modelValue: [],
        warning: true,
      },
    })

    await wrapper.vm.$nextTick()

    expect(wrapper.classes()).toContain('maz:border-warning')
  })
})

describe('given a MazUi global default for size', () => {
  describe('when no size prop is passed', () => {
    it('then the input receives the global size', () => {
      const wrapper = mount(MazInputTags, {
        props: { modelValue: ['a'] },
        global: { provide: { [GLOBAL_CONFIG_INJECTION_KEY as symbol]: { global: { size: 'xl' } } } },
      })

      expect(wrapper.findComponent({ name: 'MazInput' }).props('size')).toBe('xl')
    })

    it('then the tag button receives the mapped button size', () => {
      const wrapper = mount(MazInputTags, {
        props: { modelValue: ['a'] },
        global: { provide: { [GLOBAL_CONFIG_INJECTION_KEY as symbol]: { global: { size: 'xl' } } } },
      })

      expect(wrapper.findComponent(MazBtn).props('size')).toBe('lg')
    })
  })

  describe('when a component-scoped default differs from the global default', () => {
    it('then the input receives the component-scoped size', () => {
      const wrapper = mount(MazInputTags, {
        props: { modelValue: ['a'] },
        global: { provide: { [GLOBAL_CONFIG_INJECTION_KEY as symbol]: { global: { size: 'mini' }, MazInputTags: { size: 'lg' } } } },
      })

      expect(wrapper.findComponent({ name: 'MazInput' }).props('size')).toBe('lg')
    })
  })

  describe('when a size prop is passed', () => {
    it('then the instance prop wins over every configured default', () => {
      const wrapper = mount(MazInputTags, {
        props: { modelValue: ['a'], size: 'sm' },
        global: { provide: { [GLOBAL_CONFIG_INJECTION_KEY as symbol]: { global: { size: 'mini' }, MazInputTags: { size: 'lg' } } } },
      })

      expect(wrapper.findComponent({ name: 'MazInput' }).props('size')).toBe('sm')
    })
  })
})
