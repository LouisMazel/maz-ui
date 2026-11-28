import MazKbd from '@components/MazKbd.vue'
import { mount } from '@vue/test-utils'
import { createSSRApp, nextTick } from 'vue'
import { renderToString } from 'vue/server-renderer'

function keys(wrapper: ReturnType<typeof mount>) {
  return wrapper.findAll('kbd').map(key => key.text())
}

function press(init: KeyboardEventInit, type: 'keydown' | 'keyup' = 'keydown') {
  globalThis.dispatchEvent(new KeyboardEvent(type, { bubbles: true, ...init }))
}

describe('given a MazKbd', () => {
  describe('when keys is a string', () => {
    it('then it renders one kbd per key with the Apple symbols', () => {
      const wrapper = mount(MazKbd, { props: { keys: 'mod+shift+k', platform: 'apple' } })

      expect(keys(wrapper)).toEqual(['⌘', '⇧', 'K'])
      expect(wrapper.find('.m-kbd__separator').exists()).toBe(false)
    })

    it('then it renders the names and the separators elsewhere', () => {
      const wrapper = mount(MazKbd, { props: { keys: 'Ctrl + Shift + P', platform: 'other' } })

      expect(keys(wrapper)).toEqual(['Ctrl', 'Shift', 'P'])
      expect(wrapper.findAll('.m-kbd__separator')).toHaveLength(2)
    })

    it('then mod is Ctrl on other platforms', () => {
      const wrapper = mount(MazKbd, { props: { keys: 'mod+k', platform: 'other' } })

      expect(keys(wrapper)).toEqual(['Ctrl', 'K'])
    })

    it('then it keeps a plus key', () => {
      const wrapper = mount(MazKbd, { props: { keys: 'mod++', platform: 'other' } })

      expect(keys(wrapper)).toEqual(['Ctrl', '+'])
    })

    it('then it names the symbol keys for screen readers', () => {
      const wrapper = mount(MazKbd, { props: { keys: 'alt+enter', platform: 'apple' } })

      expect(wrapper.findAll('kbd')[0]!.attributes('aria-label')).toBeTruthy()
      expect(wrapper.findAll('kbd')[1]!.attributes('aria-label')).toBeUndefined()
      expect(keys(wrapper)).toEqual(['⌥', '↵'])
    })

    it('then an unknown multi-letter key is kept as is', () => {
      const wrapper = mount(MazKbd, { props: { keys: 'F2', platform: 'other' } })

      expect(keys(wrapper)).toEqual(['F2'])
    })
  })

  describe('when keys is an array', () => {
    it('then it renders each entry', () => {
      const wrapper = mount(MazKbd, { props: { keys: ['mod', 'k'], platform: 'apple' } })

      expect(keys(wrapper)).toEqual(['⌘', 'K'])
    })
  })

  describe('when the platform is auto', () => {
    it('then it renders the neutral form then follows the browser once mounted', async () => {
      const wrapper = mount(MazKbd, { props: { keys: 'mod+k' } })
      await nextTick()

      expect(keys(wrapper)[0]).toMatch(/^(⌘|Ctrl)$/)
    })

    it('then the server renders the neutral form', async () => {
      const html = await renderToString(createSSRApp(MazKbd, { keys: 'mod+k' }))

      expect(html).toContain('Ctrl')
    })
  })

  describe('when there are no keys', () => {
    it('then the default slot is a single key', () => {
      const wrapper = mount(MazKbd, { slots: { default: 'Esc' } })

      expect(keys(wrapper)).toEqual(['Esc'])
    })
  })

  describe('when live is set', () => {
    it('then the keys press down while the shortcut is typed', async () => {
      const wrapper = mount(MazKbd, { props: { keys: 'mod+k', platform: 'other', live: true } })

      press({ key: 'k', code: 'KeyK', ctrlKey: true })
      await nextTick()
      expect(wrapper.classes()).toContain('--pressed')
      expect(wrapper.emitted('press')).toHaveLength(1)

      press({ key: 'k', code: 'KeyK' }, 'keyup')
      await nextTick()
      expect(wrapper.classes()).not.toContain('--pressed')
      wrapper.unmount()
    })

    it('then another shortcut does not press the keys', async () => {
      const wrapper = mount(MazKbd, { props: { keys: 'mod+k', platform: 'other', live: true } })

      press({ key: 'j', code: 'KeyJ', ctrlKey: true })
      await nextTick()

      expect(wrapper.classes()).not.toContain('--pressed')
      wrapper.unmount()
    })

    it('then a repeated keydown is ignored', async () => {
      const wrapper = mount(MazKbd, { props: { keys: 'mod+k', platform: 'other', live: true } })

      press({ key: 'k', code: 'KeyK', ctrlKey: true, repeat: true })
      await nextTick()

      expect(wrapper.classes()).not.toContain('--pressed')
      wrapper.unmount()
    })

    it('then the keys are released when the window loses focus', async () => {
      const wrapper = mount(MazKbd, { props: { keys: 'mod+k', platform: 'other', live: true } })

      press({ key: 'k', code: 'KeyK', ctrlKey: true })
      await nextTick()
      globalThis.dispatchEvent(new Event('blur'))
      await nextTick()

      expect(wrapper.classes()).not.toContain('--pressed')
      wrapper.unmount()
    })

    it('then nothing is listened without live', async () => {
      const wrapper = mount(MazKbd, { props: { keys: 'mod+k', platform: 'other' } })

      press({ key: 'k', code: 'KeyK', ctrlKey: true })
      await nextTick()

      expect(wrapper.classes()).not.toContain('--pressed')
    })
  })
})
