import type { VueWrapper } from '@vue/test-utils'
import MazMarkdownEditor from '@components/MazMarkdownEditor.vue'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'

const mountedWrappers: VueWrapper[] = []

afterEach(() => {
  mountedWrappers.splice(0).forEach(wrapper => wrapper.unmount())
})

async function mountEditor(props: Record<string, unknown> = {}) {
  const wrapper = mount(MazMarkdownEditor, { props: { label: 'Content', name: 'content', ...props }, attachTo: document.body })
  mountedWrappers.push(wrapper)
  await vi.dynamicImportSettled()
  await nextTick()
  return wrapper
}

function getTabs(wrapper: VueWrapper) {
  return wrapper.findAll<HTMLButtonElement>('[role="tab"]')
}

describe('given a MazMarkdownEditor', () => {
  describe('when it is rendered', () => {
    it('then the button group is a labelled tablist of tabs', async () => {
      const wrapper = await mountEditor()
      const tablist = wrapper.find('[role="tablist"]')

      expect(tablist.classes()).toContain('m-button-group')
      expect(tablist.attributes('aria-label')).toBe('content')
      expect(tablist.findAll('[role="tab"]')).toHaveLength(3)
      expect(wrapper.findAll('[role="group"]')).toHaveLength(0)
    })

    it('then each tab controls an existing panel and the textarea is a plain field', async () => {
      const wrapper = await mountEditor()
      const [writeTab, previewTab] = getTabs(wrapper)
      const writePanel = wrapper.find(`#${writeTab.attributes('aria-controls')}`)
      const previewPanel = wrapper.find(`#${previewTab.attributes('aria-controls')}`)

      expect(writePanel.attributes('role')).toBe('tabpanel')
      expect(writePanel.attributes('aria-labelledby')).toBe(writeTab.attributes('id'))
      expect(writePanel.find('textarea').exists()).toBe(true)
      expect(previewPanel.attributes('role')).toBe('tabpanel')
      expect(previewPanel.attributes('aria-labelledby')).toBe(previewTab.attributes('id'))
      expect(wrapper.find('textarea').attributes('role')).toBeUndefined()
    })

    it('then only the selected tab is in the tab sequence', async () => {
      const wrapper = await mountEditor()

      expect(getTabs(wrapper).map(tab => tab.attributes('tabindex'))).toEqual(['0', '-1', '-1'])
    })
  })

  describe('when ArrowRight is pressed on the selected tab', () => {
    it('then the next mode is selected and its tab is focused', async () => {
      const wrapper = await mountEditor()

      await getTabs(wrapper)[0].trigger('keydown', { key: 'ArrowRight' })
      await nextTick()

      expect(wrapper.emitted('update:mode')?.[0]).toEqual(['preview'])
      expect(document.activeElement).toBe(getTabs(wrapper)[1].element)
      expect(getTabs(wrapper).map(tab => tab.attributes('tabindex'))).toEqual(['-1', '0', '-1'])
    })
  })

  describe('when ArrowLeft is pressed on the first tab', () => {
    it('then the last mode is selected', async () => {
      const wrapper = await mountEditor()

      await getTabs(wrapper)[0].trigger('keydown', { key: 'ArrowLeft' })

      expect(wrapper.emitted('update:mode')?.[0]).toEqual(['split'])
    })
  })

  describe('when End then Home are pressed', () => {
    it('then the last then the first mode are selected', async () => {
      const wrapper = await mountEditor()

      await getTabs(wrapper)[0].trigger('keydown', { key: 'End' })
      await getTabs(wrapper)[2].trigger('keydown', { key: 'Home' })

      expect(wrapper.emitted('update:mode')).toEqual([['split'], ['write']])
    })
  })

  describe('when the direction is right-to-left', () => {
    it('then ArrowLeft selects the next mode', async () => {
      const wrapper = await mountEditor()
      getTabs(wrapper)[0].element.style.direction = 'rtl'

      await getTabs(wrapper)[0].trigger('keydown', { key: 'ArrowLeft' })

      expect(wrapper.emitted('update:mode')?.[0]).toEqual(['preview'])
    })
  })

  describe('when another key is pressed', () => {
    it('then the mode does not change', async () => {
      const wrapper = await mountEditor()

      await getTabs(wrapper)[0].trigger('keydown', { key: 'ArrowDown' })

      expect(wrapper.emitted('update:mode')).toBeUndefined()
    })
  })
})
