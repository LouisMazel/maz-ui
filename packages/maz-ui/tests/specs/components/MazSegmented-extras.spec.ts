import MazSegmented from '@components/MazSegmented.vue'
import { flushPromises, mount } from '@vue/test-utils'

afterEach(() => {
  document.body.innerHTML = ''
})

const options = [
  { label: 'Inbox', value: 'inbox', badge: { content: 4 }, tooltip: 'Incoming', owner: 'Ana' },
  { label: 'Sent', value: 'sent', badge: { content: true } },
  { label: 'Draft', value: 'draft', badge: { content: false } },
]

function mountSegmented(slots: Record<string, unknown> = {}) {
  return mount(MazSegmented, {
    props: { options, modelValue: 'inbox', ariaLabel: 'Mailbox' },
    slots: slots as never,
    attachTo: document.body,
  })
}

describe('given MazSegmented with a badge per option', () => {
  describe('when a badge has a content', () => {
    it('then the content is not rendered as a DOM attribute', async () => {
      const wrapper = mountSegmented()
      await vi.dynamicImportSettled()
      await flushPromises()

      expect(wrapper.findAll('[role="radio"]')[0].find('.m-segmented__badge').attributes('content')).toBeUndefined()
    })
  })

  describe('when rendered', () => {
    it('then the counter and the dot are shown and a false content hides the badge', async () => {
      const wrapper = mountSegmented()
      await vi.dynamicImportSettled()
      await flushPromises()

      const segments = wrapper.findAll('[role="radio"]')

      expect(segments[0].find('.m-segmented__badge').text()).toBe('4')
      expect(segments[1].find('.m-segmented__badge').classes()).toContain('--dot')
      expect(segments[1].find('.m-segmented__badge').text()).toBe('')
      expect(segments[2].find('.m-segmented__badge').exists()).toBe(false)
    })
  })

  describe('when the badge-content slot is used', () => {
    it('then it replaces the content of the counter and receives the option', async () => {
      const wrapper = mountSegmented({
        'badge-content': '<template #badge-content="{ content, option }">{{ option.label }}:{{ content }}</template>',
      })
      await vi.dynamicImportSettled()
      await flushPromises()

      expect(wrapper.find('.m-segmented__badge').text()).toBe('Inbox:4')
    })
  })
})

describe('given MazSegmented with a tooltip per option', () => {
  describe('when an option has a tooltip', () => {
    it('then its segment is rendered and the others stay plain', async () => {
      const wrapper = mountSegmented()
      await vi.dynamicImportSettled()
      await flushPromises()

      expect(wrapper.findAll('[role="radio"]')).toHaveLength(3)
    })
  })
})

describe('given MazSegmented with extra fields on the options', () => {
  describe('when the item slot is used', () => {
    it('then it receives the whole option and its index', () => {
      const wrapper = mountSegmented({
        item: '<template #item="{ option, index }">{{ index }}-{{ option.owner ?? "none" }}</template>',
      })

      expect(wrapper.findAll('[role="radio"]').map(segment => segment.text())).toEqual(['0-Ana', '1-none', '2-none'])
    })
  })
})
