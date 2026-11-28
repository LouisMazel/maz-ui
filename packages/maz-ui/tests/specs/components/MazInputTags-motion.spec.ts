import MazInputTags from '@components/MazInputTags.vue'
import { enableAutoUnmount, mount } from '@vue/test-utils'

enableAutoUnmount(afterEach)

function mountTags(props: Record<string, unknown> = {}) {
  return mount(MazInputTags, { props, attachTo: document.body })
}

async function typeAndEnter(wrapper: ReturnType<typeof mountTags>, value: string) {
  const input = wrapper.find('input')

  await input.setValue(value)
  await input.trigger('keydown', { key: 'Enter' })
}

describe('given MazInputTags with motion', () => {
  const animate = vi.fn()
  const cancel = vi.fn()

  beforeEach(() => {
    animate.mockReset()
    cancel.mockReset()
    animate.mockReturnValue({ cancel })
    Object.defineProperty(HTMLElement.prototype, 'animate', { value: animate, configurable: true, writable: true })
  })

  afterEach(() => {
    Reflect.deleteProperty(HTMLElement.prototype, 'animate')
  })

  describe('when a duplicate is typed', () => {
    it('then the twin tag shakes and nothing is emitted', async () => {
      const wrapper = mountTags({ modelValue: ['vue', 'nuxt'] })

      await typeAndEnter(wrapper, 'nuxt')

      expect(animate).toHaveBeenCalledTimes(1)
      expect(animate.mock.instances[0]).toBe(wrapper.findAll('.m-input-tags__tag')[1].element)
      expect(animate.mock.calls[0][0].some((frame: Keyframe) => frame.transform === 'translateX(-4px)')).toBe(true)
      expect(wrapper.emitted('update:model-value')).toBeUndefined()
    })

    it('then a second duplicate cancels the running shake of the same tag', async () => {
      const wrapper = mountTags({ modelValue: ['vue'] })

      await typeAndEnter(wrapper, 'vue')
      await typeAndEnter(wrapper, 'vue')

      expect(cancel).toHaveBeenCalledTimes(1)
    })

    it('then a new tag typed with a duplicate is still added', async () => {
      const wrapper = mountTags({ modelValue: ['vue'] })

      await typeAndEnter(wrapper, 'vue, vite')

      expect(animate).toHaveBeenCalledTimes(1)
      expect(wrapper.emitted('update:model-value')?.at(-1)?.[0]).toEqual(['vue', 'vite'])
    })

    it('then animated false does not shake', async () => {
      const wrapper = mountTags({ modelValue: ['vue'], animated: false })

      await typeAndEnter(wrapper, 'vue')

      expect(animate).not.toHaveBeenCalled()
    })

    it('then a new tag does not shake anything', async () => {
      const wrapper = mountTags({ modelValue: ['vue'] })

      await typeAndEnter(wrapper, 'vite')

      expect(animate).not.toHaveBeenCalled()
    })

    it('then unmounting cancels the running shake', async () => {
      const wrapper = mountTags({ modelValue: ['vue'] })

      await typeAndEnter(wrapper, 'vue')
      wrapper.unmount()

      expect(cancel).toHaveBeenCalledTimes(1)
    })
  })

  describe('when a tag is removed', () => {
    it('then the leaving tag is pinned where it stands', async () => {
      const wrapper = mount(MazInputTags, {
        props: { modelValue: ['vue', 'nuxt'] },
        attachTo: document.body,
        global: { stubs: { TransitionGroup: false } },
      })
      const leaving = wrapper.findAll('.m-input-tags__tag')[0].element as HTMLElement

      await wrapper.setProps({ modelValue: ['nuxt'] })

      expect(leaving.style.top).toBe('0px')
      expect(leaving.style.left).toBe('0px')
    })
  })
})
