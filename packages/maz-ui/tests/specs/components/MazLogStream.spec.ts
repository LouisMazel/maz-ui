import type { MazLogStreamLine } from '@components/MazLogStream.vue'
import MazLogStream from '@components/MazLogStream.vue'
import { flushPromises, mount } from '@vue/test-utils'

const clipboard = vi.hoisted(() => ({ writeText: vi.fn().mockResolvedValue(undefined) }))

describe('given MazLogStream component', () => {
  beforeEach(() => {
    Object.defineProperty(globalThis.navigator, 'clipboard', { value: clipboard, configurable: true })
    clipboard.writeText.mockClear()
  })

  describe('when rendered with string and object lines', () => {
    const lines: (string | MazLogStreamLine)[] = [
      'plain',
      { text: 'dimmed', type: 'muted' },
      { text: 'failed', type: 'error' },
      { text: 'src/main.ts', label: 'read', labelColor: 'info' },
    ]
    const wrapper = mount(MazLogStream, { props: { lines } })

    it('then every line renders its text', () => {
      expect(wrapper.findAll('.m-log-stream__line').map(line => line.text())).toEqual(['plain', 'dimmed', 'failed', 'readsrc/main.ts'])
    })

    it('then the type sets the color of the line', () => {
      const rendered = wrapper.findAll('.m-log-stream__line')

      expect(rendered[1]!.classes()).toContain('maz:opacity-60')
      expect(rendered[2]!.classes()).toContain('maz:text-destructive')
    })

    it('then the label renders with its color', () => {
      const label = wrapper.find('.m-log-stream__label')

      expect(label.text()).toBe('read')
      expect(label.classes()).toContain('maz:text-info')
    })

    it('then the block is a log region', () => {
      expect(wrapper.find('[role="log"]').exists()).toBe(true)
    })
  })

  describe('when a line is markdown', () => {
    const lines = [{ text: '**bold**', markdown: true }, 'plain']

    it('then the markdown slot renders it', () => {
      const wrapper = mount(MazLogStream, {
        props: { lines },
        slots: { markdown: `<template #markdown="{ text, index }"><b class="md">{{ text }}-{{ index }}</b></template>` },
      })

      expect(wrapper.find('.md').text()).toBe('**bold**-0')
      expect(wrapper.findAll('.md')).toHaveLength(1)
    })

    it('then it shows the text as is without the slot', () => {
      const wrapper = mount(MazLogStream, { props: { lines } })

      expect(wrapper.find('.m-log-stream__text').text()).toBe('**bold**')
    })
  })

  describe('when there is no line', () => {
    it('then the empty slot shows and the copy button does not', async () => {
      const wrapper = mount(MazLogStream, { slots: { empty: 'Waiting' } })
      await flushPromises()

      expect(wrapper.text()).toContain('Waiting')
      expect(wrapper.find('.m-log-stream__copy-btn').exists()).toBe(false)
    })
  })

  describe('when lines are appended', () => {
    it('then the existing lines are not rendered again', async () => {
      const wrapper = mount(MazLogStream, { props: { lines: ['a', 'b'] } })
      const first = wrapper.findAll('.m-log-stream__line')[0]!.element

      await wrapper.setProps({ lines: ['a', 'b', 'c'] })

      expect(wrapper.findAll('.m-log-stream__line')).toHaveLength(3)
      expect(wrapper.findAll('.m-log-stream__line')[0]!.element).toBe(first)
    })

    it('then a line changed in place renders again', async () => {
      const wrapper = mount(MazLogStream, { props: { lines: [{ text: 'a', id: 1 }] } })

      await wrapper.setProps({ lines: [{ text: 'ab', id: 1 }] })

      expect(wrapper.find('.m-log-stream__line').text()).toBe('ab')
    })
  })

  describe('when maxLines is set', () => {
    it('then only the last lines render and every line is copied', async () => {
      const wrapper = mount(MazLogStream, { props: { lines: ['a', 'b', 'c', 'd'], maxLines: 2 } })
      await flushPromises()

      expect(wrapper.findAll('.m-log-stream__line').map(line => line.text())).toEqual(['c', 'd'])

      await wrapper.find('.m-log-stream__copy-btn').trigger('click')
      expect(clipboard.writeText).toHaveBeenCalledWith('a\nb\nc\nd')
    })
  })

  describe('when copying', () => {
    it('then the labels are in front of their text', async () => {
      const wrapper = mount(MazLogStream, { props: { lines: ['a', { text: 'b', label: 'run' }] } })
      await flushPromises()

      await wrapper.find('.m-log-stream__copy-btn').trigger('click')

      expect(clipboard.writeText).toHaveBeenCalledWith('a\nrun b')
    })

    it('then copyValue wins', async () => {
      const wrapper = mount(MazLogStream, { props: { lines: ['a'], copyValue: 'custom' } })
      await flushPromises()

      await wrapper.find('.m-log-stream__copy-btn').trigger('click')

      expect(clipboard.writeText).toHaveBeenCalledWith('custom')
    })

    it('then copyable false removes the button', async () => {
      const wrapper = mount(MazLogStream, { props: { lines: ['a'], copyable: false } })
      await flushPromises()

      expect(wrapper.find('.m-log-stream__copy-btn').exists()).toBe(false)
    })
  })

  describe('when the display options are set', () => {
    it('then they set the classes and the max height of the frame', () => {
      const wrapper = mount(MazLogStream, { props: { lines: ['a'], size: 'lg', rounded: false, wrap: false, colorMode: 'dark', maxHeight: '8rem' } })
      const root = wrapper.find('.m-log-stream')

      expect(root.classes()).toEqual(expect.arrayContaining(['--size-lg', '--no-rounded', 'dark']))
      expect(root.classes()).not.toContain('--wrap')
      expect(root.attributes('style')).toContain('--m-log-stream-max-height: 8rem')
    })

    it('then the light color mode adds the light class', () => {
      const wrapper = mount(MazLogStream, { props: { lines: ['a'], colorMode: 'light' } })

      expect(wrapper.find('.m-log-stream').classes()).toContain('light')
    })
  })

  describe('when following the stream', () => {
    it('then it sticks to the bottom until the user scrolls up', async () => {
      const tops = new WeakMap<Element, number>()
      const scrollTop = Object.getOwnPropertyDescriptor(Element.prototype, 'scrollTop')!
      const scrollHeight = Object.getOwnPropertyDescriptor(Element.prototype, 'scrollHeight')!
      const clientHeight = Object.getOwnPropertyDescriptor(Element.prototype, 'clientHeight')!
      Object.defineProperty(Element.prototype, 'scrollTop', {
        configurable: true,
        get() { return tops.get(this) ?? 0 },
        set(value: number) { tops.set(this, value) },
      })
      Object.defineProperty(Element.prototype, 'scrollHeight', { configurable: true, get: () => 500 })
      Object.defineProperty(Element.prototype, 'clientHeight', { configurable: true, get: () => 100 })

      try {
        const wrapper = mount(MazLogStream, { props: { lines: ['one'], maxHeight: '4rem' } })
        await flushPromises()
        const content = () => wrapper.find('.m-log-stream__content').element as HTMLElement

        await wrapper.setProps({ lines: ['one', 'two'] })
        await flushPromises()
        expect(content().scrollTop).toBe(500)

        content().scrollTop = 120
        content().dispatchEvent(new Event('scroll'))
        await wrapper.setProps({ lines: ['one', 'two', 'three'] })
        await flushPromises()
        expect(content().scrollTop).toBe(120)

        ;(wrapper.vm as unknown as { scrollToBottom: () => void }).scrollToBottom()
        await wrapper.setProps({ lines: ['one', 'two', 'three', 'four'] })
        await flushPromises()
        expect(content().scrollTop).toBe(500)
        wrapper.unmount()
      }
      finally {
        Object.defineProperty(Element.prototype, 'scrollTop', scrollTop)
        Object.defineProperty(Element.prototype, 'scrollHeight', scrollHeight)
        Object.defineProperty(Element.prototype, 'clientHeight', clientHeight)
      }
    })

    it('then follow false does not scroll', async () => {
      const wrapper = mount(MazLogStream, { props: { lines: ['one'], follow: false } })
      await flushPromises()
      const content = wrapper.find('.m-log-stream__content').element as HTMLElement

      await wrapper.setProps({ lines: ['one', 'two'] })
      await flushPromises()

      expect(content.scrollTop).toBe(0)
    })
  })

  describe('when the color mode changes', () => {
    afterEach(() => {
      document.documentElement.classList.remove('dark')
    })

    it('then colorMode dark sets the dark state', async () => {
      const wrapper = mount(MazLogStream, { props: { lines: ['a'], colorMode: 'dark' } })
      await flushPromises()

      expect(wrapper.classes()).toEqual(expect.arrayContaining(['dark', '--dark']))
    })

    it('then colorMode light sets the light state even in a dark document', async () => {
      document.documentElement.classList.add('dark')
      const wrapper = mount(MazLogStream, { props: { lines: ['a'], colorMode: 'light' } })
      await flushPromises()

      expect(wrapper.classes()).toContain('light')
      expect(wrapper.classes()).not.toContain('--dark')
    })

    it('then auto follows the dark class of an ancestor', async () => {
      const parent = document.createElement('div')
      parent.classList.add('dark')
      document.body.append(parent)
      const wrapper = mount(MazLogStream, { props: { lines: ['a'] }, attachTo: parent })
      await flushPromises()

      expect(wrapper.classes()).toContain('--dark')

      parent.classList.remove('dark')
      await flushPromises()

      expect(wrapper.classes()).not.toContain('--dark')
      wrapper.unmount()
      parent.remove()
    })

    it('then auto follows the dark class of the html element', async () => {
      document.documentElement.classList.add('dark')
      const wrapper = mount(MazLogStream, { props: { lines: ['a'] }, attachTo: document.body })
      await flushPromises()

      expect(wrapper.classes()).toContain('--dark')
      wrapper.unmount()
    })
  })
})
