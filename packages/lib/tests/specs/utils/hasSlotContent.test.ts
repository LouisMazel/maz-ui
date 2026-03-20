import type { Slot } from 'vue'
import MazCard from '@components/MazCard.vue'
import MazCheckbox from '@components/MazCheckbox.vue'
import MazFullscreenLoader from '@components/MazFullscreenLoader.vue'
import MazSwitch from '@components/MazSwitch.vue'
import { mount } from '@vue/test-utils'
import { Comment, defineComponent, Fragment, h, ref, Text } from 'vue'
import { hasSlotContent } from '@/utils/hasSlotContent'

// ---------------------------------------------------------------------------
// Unit tests — raw VNode structures
// ---------------------------------------------------------------------------
describe('hasSlotContent (unit)', () => {
  describe('undefined / null-ish slots', () => {
    it('returns false for undefined', () => {
      expect(hasSlotContent(undefined)).toBe(false)
    })

    it('returns false for null cast to Slot', () => {
      expect(hasSlotContent(null as unknown as Slot)).toBe(false)
    })
  })

  describe('Comment nodes (v-if="false" placeholders)', () => {
    it('returns false for a single comment', () => {
      const slot: Slot = () => [{ type: Comment, children: 'v-if' } as any]
      expect(hasSlotContent(slot)).toBe(false)
    })

    it('returns false for multiple comments', () => {
      const slot: Slot = () => [
        { type: Comment, children: '' } as any,
        { type: Comment, children: 'v-if' } as any,
        { type: Comment, children: '' } as any,
      ]
      expect(hasSlotContent(slot)).toBe(false)
    })
  })

  describe('Text nodes', () => {
    it('returns false for whitespace-only text', () => {
      const slot: Slot = () => [{ type: Text, children: '   ' } as any]
      expect(hasSlotContent(slot)).toBe(false)
    })

    it('returns false for empty string text', () => {
      const slot: Slot = () => [{ type: Text, children: '' } as any]
      expect(hasSlotContent(slot)).toBe(false)
    })

    it('returns false for newlines/tabs only', () => {
      const slot: Slot = () => [{ type: Text, children: '\n\t  \n' } as any]
      expect(hasSlotContent(slot)).toBe(false)
    })

    it('returns true for non-empty text', () => {
      const slot: Slot = () => [{ type: Text, children: 'hello' } as any]
      expect(hasSlotContent(slot)).toBe(true)
    })

    it('returns true for text with leading/trailing spaces but real content', () => {
      const slot: Slot = () => [{ type: Text, children: '  ok  ' } as any]
      expect(hasSlotContent(slot)).toBe(true)
    })

    it('returns false when children is null', () => {
      const slot: Slot = () => [{ type: Text, children: null } as any]
      expect(hasSlotContent(slot)).toBe(false)
    })

    it('returns false when children is undefined', () => {
      const slot: Slot = () => [{ type: Text, children: undefined } as any]
      expect(hasSlotContent(slot)).toBe(false)
    })
  })

  describe('Element and Component nodes', () => {
    it('returns true for a plain HTML element', () => {
      const slot: Slot = () => [h('div')]
      expect(hasSlotContent(slot)).toBe(true)
    })

    it('returns true for an element with text content', () => {
      const slot: Slot = () => [h('span', 'hello')]
      expect(hasSlotContent(slot)).toBe(true)
    })

    it('returns true for a component VNode', () => {
      const MyComp = defineComponent({ setup: () => () => h('span') })
      const slot: Slot = () => [h(MyComp)]
      expect(hasSlotContent(slot)).toBe(true)
    })

    it('returns true for a functional component', () => {
      const Fn = () => h('b', 'bold')
      const slot: Slot = () => [h(Fn)]
      expect(hasSlotContent(slot)).toBe(true)
    })
  })

  describe('Fragment nodes', () => {
    it('returns false for empty fragment', () => {
      const slot: Slot = () => [{ type: Fragment, children: [] } as any]
      expect(hasSlotContent(slot)).toBe(false)
    })

    it('returns false for fragment with only comments', () => {
      const slot: Slot = () => [{
        type: Fragment,
        children: [
          { type: Comment, children: 'v-if' },
          { type: Comment, children: '' },
        ],
      } as any]
      expect(hasSlotContent(slot)).toBe(false)
    })

    it('returns true for fragment with an element among comments', () => {
      const slot: Slot = () => [{
        type: Fragment,
        children: [
          { type: Comment, children: 'v-if' },
          h('span', 'content'),
        ],
      } as any]
      expect(hasSlotContent(slot)).toBe(true)
    })

    it('returns true for fragment with non-empty text among comments', () => {
      const slot: Slot = () => [{
        type: Fragment,
        children: [
          { type: Comment, children: '' },
          { type: Text, children: 'visible' },
        ],
      } as any]
      expect(hasSlotContent(slot)).toBe(true)
    })

    it('returns false for fragment with only whitespace text and comments', () => {
      const slot: Slot = () => [{
        type: Fragment,
        children: [
          { type: Text, children: '  ' },
          { type: Comment, children: '' },
        ],
      } as any]
      expect(hasSlotContent(slot)).toBe(false)
    })

    it('returns false for fragment with null children', () => {
      const slot: Slot = () => [{ type: Fragment, children: null } as any]
      expect(hasSlotContent(slot)).toBe(false)
    })

    it('handles deeply nested fragments', () => {
      const slot: Slot = () => [{
        type: Fragment,
        children: [{
          type: Fragment,
          children: [{
            type: Fragment,
            children: [{ type: Comment, children: '' }],
          }],
        }],
      } as any]
      expect(hasSlotContent(slot)).toBe(false)
    })

    it('finds content in deeply nested fragment', () => {
      const slot: Slot = () => [{
        type: Fragment,
        children: [{
          type: Fragment,
          children: [{
            type: Fragment,
            children: [h('div', 'deep')],
          }],
        }],
      } as any]
      expect(hasSlotContent(slot)).toBe(true)
    })
  })

  describe('Mixed VNode arrays', () => {
    it('returns true when element is mixed with comments', () => {
      const slot: Slot = () => [
        { type: Comment, children: '' } as any,
        h('div'),
        { type: Comment, children: '' } as any,
      ]
      expect(hasSlotContent(slot)).toBe(true)
    })

    it('returns false when all nodes are non-content (comments + empty text)', () => {
      const slot: Slot = () => [
        { type: Comment, children: '' } as any,
        { type: Text, children: '' } as any,
        { type: Comment, children: '' } as any,
        { type: Text, children: '  ' } as any,
      ]
      expect(hasSlotContent(slot)).toBe(false)
    })

    it('returns true for empty array wrapped in fragment with trailing element', () => {
      const slot: Slot = () => [
        { type: Fragment, children: [] } as any,
        h('br'),
      ]
      expect(hasSlotContent(slot)).toBe(true)
    })
  })

  describe('Scoped slots (try/catch fallback)', () => {
    it('returns true when slot throws TypeError (destructuring failure)', () => {
      const slot: Slot = () => {
        throw new TypeError('Cannot destructure property \'close\' of undefined')
      }
      expect(hasSlotContent(slot)).toBe(true)
    })

    it('returns true when slot throws ReferenceError', () => {
      const slot: Slot = () => {
        throw new ReferenceError('binding is not defined')
      }
      expect(hasSlotContent(slot)).toBe(true)
    })

    it('returns true when slot throws generic Error', () => {
      const slot: Slot = () => {
        throw new Error('unexpected')
      }
      expect(hasSlotContent(slot)).toBe(true)
    })
  })

  describe('Edge cases', () => {
    it('returns true for slot returning a single string via h()', () => {
      const slot: Slot = () => [h('template', 'text')]
      expect(hasSlotContent(slot)).toBe(true)
    })

    it('handles slot returning empty array', () => {
      const slot: Slot = () => []
      expect(hasSlotContent(slot)).toBe(false)
    })
  })
})

// ---------------------------------------------------------------------------
// Integration tests — real Vue components mounted with @vue/test-utils
// ---------------------------------------------------------------------------
describe('hasSlotContent (integration with real components)', () => {
  describe('MazCard', () => {
    it('renders footer when slot has content', () => {
      const wrapper = mount(MazCard, {
        slots: { footer: '<button>Save</button>' },
      })
      expect(wrapper.find('.m-card__footer').exists()).toBe(true)
    })

    it('hides footer when slot is not provided', () => {
      const wrapper = mount(MazCard)
      expect(wrapper.find('.m-card__footer').exists()).toBe(false)
    })

    it('hides footer when slot content is conditionally hidden (v-if=false)', () => {
      const Parent = defineComponent({
        components: { MazCard },
        setup() {
          const show = ref(false)
          return { show }
        },
        template: `
          <MazCard>
            <template #footer>
              <button v-if="show">Save</button>
            </template>
          </MazCard>
        `,
      })
      const wrapper = mount(Parent)
      expect(wrapper.find('.m-card__footer').exists()).toBe(false)
    })

    it('shows footer when slot content is conditionally shown (v-if=true)', () => {
      const Parent = defineComponent({
        components: { MazCard },
        setup() {
          const show = ref(true)
          return { show }
        },
        template: `
          <MazCard>
            <template #footer>
              <button v-if="show">Save</button>
            </template>
          </MazCard>
        `,
      })
      const wrapper = mount(Parent)
      expect(wrapper.find('.m-card__footer').exists()).toBe(true)
      expect(wrapper.find('.m-card__footer button').text()).toBe('Save')
    })

    it('reacts to v-if toggling from false to true', async () => {
      const Parent = defineComponent({
        components: { MazCard },
        setup() {
          const show = ref(false)
          return { show }
        },
        template: `
          <MazCard>
            <template #footer>
              <button v-if="show">Save</button>
            </template>
          </MazCard>
        `,
      })
      const wrapper = mount(Parent)
      expect(wrapper.find('.m-card__footer').exists()).toBe(false)

      wrapper.vm.show = true
      await wrapper.vm.$nextTick()
      expect(wrapper.find('.m-card__footer').exists()).toBe(true)
    })

    it('reacts to v-if toggling from true to false', async () => {
      const Parent = defineComponent({
        components: { MazCard },
        setup() {
          const show = ref(true)
          return { show }
        },
        template: `
          <MazCard>
            <template #footer>
              <button v-if="show">Save</button>
            </template>
          </MazCard>
        `,
      })
      const wrapper = mount(Parent)
      expect(wrapper.find('.m-card__footer').exists()).toBe(true)

      wrapper.vm.show = false
      await wrapper.vm.$nextTick()
      expect(wrapper.find('.m-card__footer').exists()).toBe(false)
    })

    it('hides header when title slot has only v-if=false content', () => {
      const Parent = defineComponent({
        components: { MazCard },
        setup() {
          return { show: ref(false) }
        },
        template: `
          <MazCard>
            <template #title>
              <span v-if="show">Title</span>
            </template>
          </MazCard>
        `,
      })
      const wrapper = mount(Parent)
      expect(wrapper.find('.m-card__header').exists()).toBe(false)
    })

    it('shows header when title prop is set even without slot', () => {
      const wrapper = mount(MazCard, { props: { title: 'Hello' } })
      expect(wrapper.find('.m-card__header').exists()).toBe(true)
      expect(wrapper.find('.m-card__header').text()).toContain('Hello')
    })

    it('hides content-title wrapper when slot has v-if=false', () => {
      const Parent = defineComponent({
        components: { MazCard },
        setup: () => ({ show: ref(false) }),
        template: `
          <MazCard>
            <template #content-title>
              <h2 v-if="show">Title</h2>
            </template>
          </MazCard>
        `,
      })
      const wrapper = mount(Parent)
      expect(wrapper.find('.m-card__title').exists()).toBe(false)
    })
  })

  describe('MazSwitch', () => {
    it('shows label area when default slot has content', () => {
      const wrapper = mount(MazSwitch, {
        slots: { default: 'Toggle me' },
      })
      expect(wrapper.find('.m-switch__text').exists()).toBe(true)
    })

    it('hides label area when default slot is empty (v-if=false)', () => {
      const Parent = defineComponent({
        components: { MazSwitch },
        setup: () => ({ show: ref(false) }),
        template: `
          <MazSwitch>
            <span v-if="show">Label</span>
          </MazSwitch>
        `,
      })
      const wrapper = mount(Parent)
      expect(wrapper.find('.m-switch__text').exists()).toBe(false)
    })

    it('shows label area when label prop is set', () => {
      const wrapper = mount(MazSwitch, {
        props: { label: 'My switch' },
      })
      expect(wrapper.find('.m-switch__text').exists()).toBe(true)
    })
  })

  describe('MazCheckbox', () => {
    it('shows text wrapper when default slot has content', () => {
      const wrapper = mount(MazCheckbox, {
        slots: { default: 'Accept terms' },
      })
      expect(wrapper.find('.m-checkbox__text').exists()).toBe(true)
    })

    it('hides text wrapper when default slot content is hidden', () => {
      const Parent = defineComponent({
        components: { MazCheckbox },
        setup: () => ({ show: ref(false) }),
        template: `
          <MazCheckbox>
            <span v-if="show">Label</span>
          </MazCheckbox>
        `,
      })
      const wrapper = mount(Parent)
      expect(wrapper.find('.m-checkbox__text').exists()).toBe(false)
    })
  })

  describe('MazFullscreenLoader', () => {
    it('shows text span when default slot has content', () => {
      mount(MazFullscreenLoader, {
        slots: { default: 'Loading...' },
        props: { teleportSelector: 'body' },
      })
      const loader = document.querySelector('.m-fullscreen-loader')
      expect(loader?.querySelector('span')).not.toBeNull()
    })

    it('hides text span when default slot is conditionally empty', () => {
      const Parent = defineComponent({
        components: { MazFullscreenLoader },
        setup: () => ({ show: ref(false) }),
        template: `
          <MazFullscreenLoader teleport-selector="body">
            <span v-if="show">Loading</span>
          </MazFullscreenLoader>
        `,
      })
      mount(Parent)
      const loader = document.querySelector('.m-fullscreen-loader')
      const spans = loader?.querySelectorAll('span')
      // Should not have an extra span wrapper for empty content
      const hasTextSpan = [...spans ?? []].some(s => s.textContent?.includes('Loading'))
      expect(hasTextSpan).toBe(false)
    })
  })

  describe('v-for rendered slots', () => {
    it('renders footer when v-for produces items', () => {
      const Parent = defineComponent({
        components: { MazCard },
        setup: () => ({ items: ref(['a', 'b']) }),
        template: `
          <MazCard>
            <template #footer>
              <span v-for="item in items" :key="item">{{ item }}</span>
            </template>
          </MazCard>
        `,
      })
      const wrapper = mount(Parent)
      expect(wrapper.find('.m-card__footer').exists()).toBe(true)
      expect(wrapper.findAll('.m-card__footer span')).toHaveLength(2)
    })

    it('hides footer when v-for produces zero items', () => {
      const Parent = defineComponent({
        components: { MazCard },
        setup: () => ({ items: ref([]) }),
        template: `
          <MazCard>
            <template #footer>
              <span v-for="item in items" :key="item">{{ item }}</span>
            </template>
          </MazCard>
        `,
      })
      const wrapper = mount(Parent)
      expect(wrapper.find('.m-card__footer').exists()).toBe(false)
    })

    it('reacts when v-for items change from empty to filled', async () => {
      const Parent = defineComponent({
        components: { MazCard },
        setup: () => ({ items: ref<string[]>([]) }),
        template: `
          <MazCard>
            <template #footer>
              <span v-for="item in items" :key="item">{{ item }}</span>
            </template>
          </MazCard>
        `,
      })
      const wrapper = mount(Parent)
      expect(wrapper.find('.m-card__footer').exists()).toBe(false)

      wrapper.vm.items = ['x', 'y']
      await wrapper.vm.$nextTick()
      expect(wrapper.find('.m-card__footer').exists()).toBe(true)
    })
  })

  describe('multiple slots combined', () => {
    it('shows footer but hides header when only footer has content', () => {
      const Parent = defineComponent({
        components: { MazCard },
        setup: () => ({ showTitle: ref(false) }),
        template: `
          <MazCard>
            <template #title>
              <span v-if="showTitle">Title</span>
            </template>
            <template #footer>
              <button>Action</button>
            </template>
          </MazCard>
        `,
      })
      const wrapper = mount(Parent)
      expect(wrapper.find('.m-card__header').exists()).toBe(false)
      expect(wrapper.find('.m-card__footer').exists()).toBe(true)
    })
  })
})
