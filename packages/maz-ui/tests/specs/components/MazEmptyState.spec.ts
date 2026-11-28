import MazEmptyState from '@components/MazEmptyState.vue'
import { mount } from '@vue/test-utils'
import { createSSRApp, ref } from 'vue'
import { renderToString } from 'vue/server-renderer'

const reduced = ref(false)
const hover = ref(true)

vi.mock('@composables/useReducedMotion', () => ({
  useReducedMotion: () => ({ shouldReduceMotion: reduced }),
}))

vi.mock('@composables/useMediaQuery', () => ({
  useMediaQuery: () => ({ matches: hover }),
}))

function rect(element: Element) {
  vi.spyOn(element, 'getBoundingClientRect').mockReturnValue({ left: 0, top: 0, width: 100, height: 100, right: 100, bottom: 100, x: 0, y: 0, toJSON: () => ({}) })
}

describe('given a MazEmptyState', () => {
  beforeEach(() => {
    reduced.value = false
    hover.value = true
  })

  describe('when it renders with the default variant', () => {
    it('then it shows the title, the description and the actions', () => {
      const wrapper = mount(MazEmptyState, {
        props: { title: 'No project', description: 'Create one' },
        slots: { actions: '<button>Create</button>' },
      })

      expect(wrapper.find('.m-empty-state__title').text()).toBe('No project')
      expect(wrapper.find('.m-empty-state__description').text()).toBe('Create one')
      expect(wrapper.find('.m-empty-state__actions button').exists()).toBe(true)
      expect(wrapper.attributes('role')).toBeUndefined()
      expect(wrapper.classes()).toContain('m-empty-state--default')
    })

    it('then it hides the empty parts', () => {
      const wrapper = mount(MazEmptyState)

      expect(wrapper.find('.m-empty-state__title').exists()).toBe(false)
      expect(wrapper.find('.m-empty-state__description').exists()).toBe(false)
      expect(wrapper.find('.m-empty-state__actions').exists()).toBe(false)
      expect(wrapper.find('.m-empty-state__query').exists()).toBe(false)
    })

    it('then the slots replace the illustration, the title and the description', () => {
      const wrapper = mount(MazEmptyState, {
        slots: { illustration: '<i class="art" />', title: 'Custom title', description: 'Custom text', default: '<p class="extra" />' },
      })

      expect(wrapper.find('.art').exists()).toBe(true)
      expect(wrapper.find('.m-empty-state__badge').exists()).toBe(false)
      expect(wrapper.find('.m-empty-state__title').text()).toBe('Custom title')
      expect(wrapper.find('.m-empty-state__description').text()).toBe('Custom text')
      expect(wrapper.find('.extra').exists()).toBe(true)
    })

    it('then it applies the size and the color', () => {
      const wrapper = mount(MazEmptyState, { props: { size: 'lg', color: 'success' } })

      expect(wrapper.classes()).toContain('m-empty-state--lg')
      expect(wrapper.attributes('style')).toContain('var(--maz-success)')
    })

    it('then it renders on the server', async () => {
      const html = await renderToString(createSSRApp(MazEmptyState, { title: 'Empty' }))

      expect(html).toContain('Empty')
    })
  })

  describe('when it renders the search variant', () => {
    it('then it is a status with a title and the query', () => {
      const wrapper = mount(MazEmptyState, { props: { variant: 'search', query: 'unicorn' } })

      expect(wrapper.attributes('role')).toBe('status')
      expect(wrapper.find('.m-empty-state__title').exists()).toBe(true)
      expect(wrapper.find('.m-empty-state__query').exists()).toBe(true)
    })

    it('then the title prop replaces the default title', () => {
      const wrapper = mount(MazEmptyState, { props: { variant: 'search', title: 'Nothing' } })

      expect(wrapper.find('.m-empty-state__title').text()).toBe('Nothing')
    })
  })

  describe('when the pointer moves', () => {
    it('then the illustration moves toward the pointer', async () => {
      const wrapper = mount(MazEmptyState, { props: { title: 'x' } })
      rect(wrapper.find('.m-empty-state__illustration').element)

      await wrapper.trigger('pointermove', { clientX: 300, clientY: 50, pointerType: 'mouse' })

      expect(wrapper.find('.m-empty-state__illustration').attributes('style')).toContain('--m-empty-state-x: 8px')
      expect(wrapper.find('.m-empty-state__illustration').classes()).toContain('m-empty-state__illustration--follow')
    })

    it('then it goes back to the center when the pointer leaves', async () => {
      const wrapper = mount(MazEmptyState)
      rect(wrapper.find('.m-empty-state__illustration').element)

      await wrapper.trigger('pointermove', { clientX: 300, clientY: 50, pointerType: 'mouse' })
      await wrapper.trigger('pointerleave')

      expect(wrapper.find('.m-empty-state__illustration').attributes('style')).toContain('--m-empty-state-x: 0px')
    })

    it('then nothing moves on a touch screen', async () => {
      hover.value = false
      const wrapper = mount(MazEmptyState)
      rect(wrapper.find('.m-empty-state__illustration').element)

      await wrapper.trigger('pointermove', { clientX: 300, clientY: 50, pointerType: 'mouse' })

      expect(wrapper.find('.m-empty-state__illustration').attributes('style')).toContain('--m-empty-state-x: 0px')
      expect(wrapper.find('.m-empty-state__illustration').classes()).not.toContain('m-empty-state__illustration--follow')
    })

    it('then nothing moves with the reduced motion or when animated is false', async () => {
      reduced.value = true
      const wrapper = mount(MazEmptyState)
      rect(wrapper.find('.m-empty-state__illustration').element)

      await wrapper.trigger('pointermove', { clientX: 300, clientY: 50, pointerType: 'mouse' })
      expect(wrapper.find('.m-empty-state__illustration').attributes('style')).toContain('--m-empty-state-x: 0px')

      reduced.value = false
      await wrapper.setProps({ animated: false })
      await wrapper.trigger('pointermove', { clientX: 300, clientY: 50, pointerType: 'mouse' })
      expect(wrapper.find('.m-empty-state__illustration').attributes('style')).toContain('--m-empty-state-x: 0px')
    })

    it('then a touch pointer is ignored', async () => {
      const wrapper = mount(MazEmptyState)
      rect(wrapper.find('.m-empty-state__illustration').element)

      await wrapper.trigger('pointermove', { clientX: 300, clientY: 50, pointerType: 'touch' })

      expect(wrapper.find('.m-empty-state__illustration').attributes('style')).toContain('--m-empty-state-x: 0px')
    })
  })
})
