import type { VueWrapper } from '@vue/test-utils'
import MazBackdrop from '@components/MazBackdrop.vue'
import MazBottomSheet from '@components/MazBottomSheet.vue'
import MazDialog from '@components/MazDialog.vue'
import MazDrawer from '@components/MazDrawer.vue'
import { useTranslations } from '@maz-ui/translations/composables/useTranslations'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'

const mountedWrappers: VueWrapper[] = []

function track<T extends VueWrapper>(wrapper: T) {
  mountedWrappers.push(wrapper)
  return wrapper
}

function addToBody(html: string) {
  const template = document.createElement('template')
  template.innerHTML = html.trim()
  const element = template.content.firstElementChild as HTMLElement
  document.body.appendChild(element)
  return element
}

beforeEach(() => {
  vi.mocked(useTranslations).mockReturnValue({ t: (key: string) => key, locale: { value: 'en' } } as unknown as ReturnType<typeof useTranslations>)
})

afterEach(() => {
  mountedWrappers.splice(0).forEach(wrapper => wrapper.unmount())
  document.body.innerHTML = ''
  document.documentElement.classList.remove('--backdrop-present')
})

describe('given an open MazBackdrop', () => {
  describe('when it is rendered without variant', () => {
    it('then its container is the modal dialog and the click-outside area is not a button', async () => {
      const wrapper = track(mount(MazBackdrop, { props: { modelValue: true, ariaLabelledby: 'title' }, attachTo: document.body }))
      await nextTick()

      const dialog = wrapper.find('.m-backdrop-container')

      expect(dialog.attributes('role')).toBe('dialog')
      expect(dialog.attributes('aria-modal')).toBe('true')
      expect(dialog.attributes('aria-labelledby')).toBe('title')
      expect(wrapper.find('.m-backdrop-content').attributes('role')).toBeUndefined()
    })
  })

  describe.each(['dialog', 'bottom-sheet'] as const)('when its variant is %s', (variant) => {
    it('then its container leaves the dialog role to the component content', async () => {
      const wrapper = track(mount(MazBackdrop, { props: { modelValue: true, variant, ariaLabelledby: 'title' }, attachTo: document.body }))
      await nextTick()

      const container = wrapper.find('.m-backdrop-container')

      expect(container.attributes('role')).toBeUndefined()
      expect(container.attributes('aria-modal')).toBeUndefined()
      expect(container.attributes('aria-labelledby')).toBeUndefined()
    })
  })
})

describe('given a page with content behind a MazBackdrop', () => {
  describe('when the backdrop opens', () => {
    it('then the content is inert, except the toasts, the popover panels and the live regions', async () => {
      const app = addToBody('<div id="app"><button>Outside</button></div>')
      const toasts = addToBody('<div class="m-toast-container"></div>')
      const panel = addToBody('<div class="m-popover-panel"></div>')
      const liveRegion = addToBody('<div aria-live="polite"></div>')
      const script = addToBody('<script type="application/json">{}</script>')

      const wrapper = track(mount(MazBackdrop, { props: { modelValue: false }, attachTo: document.body }))
      await wrapper.setProps({ modelValue: true })
      await nextTick()

      expect(app.hasAttribute('inert')).toBe(true)
      expect(toasts.hasAttribute('inert')).toBe(false)
      expect(panel.hasAttribute('inert')).toBe(false)
      expect(liveRegion.hasAttribute('inert')).toBe(false)
      expect(script.hasAttribute('inert')).toBe(false)
      expect(wrapper.find('.m-backdrop').element.closest('[inert]')).toBeNull()
    })
  })

  describe('when the backdrop closes', () => {
    it('then the content is interactive again', async () => {
      const app = addToBody('<div id="app"></div>')

      const wrapper = track(mount(MazBackdrop, { props: { modelValue: false }, attachTo: document.body }))
      await wrapper.setProps({ modelValue: true })
      await nextTick()
      await wrapper.setProps({ modelValue: false })
      await nextTick()

      expect(app.hasAttribute('inert')).toBe(false)
    })
  })

  describe('when an element was already inert', () => {
    it('then it stays inert after the backdrop closes', async () => {
      const app = addToBody('<div id="app" inert></div>')

      const wrapper = track(mount(MazBackdrop, { props: { modelValue: false }, attachTo: document.body }))
      await wrapper.setProps({ modelValue: true })
      await nextTick()
      await wrapper.setProps({ modelValue: false })
      await nextTick()

      expect(app.hasAttribute('inert')).toBe(true)
    })
  })

  describe('when the backdrop is mounted open', () => {
    it('then the content is inert from the mount', async () => {
      const app = addToBody('<div id="app"></div>')

      track(mount(MazBackdrop, { props: { modelValue: true }, attachTo: document.body }))
      await nextTick()

      expect(app.hasAttribute('inert')).toBe(true)
    })
  })

  describe('when a second backdrop opens over the first one', () => {
    it('then the first one is inert until the second one closes', async () => {
      const first = track(mount(MazBackdrop, { props: { modelValue: true }, attachTo: document.body }))
      await nextTick()

      const second = track(mount(MazBackdrop, { props: { modelValue: false }, attachTo: document.body }))
      await second.setProps({ modelValue: true })
      await nextTick()

      const firstRoot = first.element.parentElement === document.body ? first.element : first.find('.m-backdrop').element.closest('body > *')

      expect((firstRoot as HTMLElement).hasAttribute('inert')).toBe(true)

      await second.setProps({ modelValue: false })
      await nextTick()

      expect((firstRoot as HTMLElement).hasAttribute('inert')).toBe(false)
    })
  })

  describe('when the first of two open backdrops closes before the second one', () => {
    it('then the page stays inert until the second one closes', async () => {
      const app = addToBody('<div id="app"></div>')

      const first = track(mount(MazBackdrop, { props: { modelValue: false }, attachTo: document.body }))
      await first.setProps({ modelValue: true })
      await nextTick()
      const second = track(mount(MazBackdrop, { props: { modelValue: false }, attachTo: document.body }))
      await second.setProps({ modelValue: true })
      await nextTick()

      await first.setProps({ modelValue: false })
      await nextTick()
      expect(app.hasAttribute('inert')).toBe(true)

      await second.setProps({ modelValue: false })
      await nextTick()
      expect(app.hasAttribute('inert')).toBe(false)
    })
  })

  describe('when the open backdrop is unmounted', () => {
    it('then the content is released, the page scroll is unlocked and Escape is no longer listened', async () => {
      const app = addToBody('<div id="app"></div>')

      const wrapper = mount(MazBackdrop, { props: { modelValue: true }, attachTo: document.body })
      await nextTick()

      expect(document.documentElement.classList.contains('--backdrop-present')).toBe(true)

      wrapper.unmount()
      document.dispatchEvent(new KeyboardEvent('keyup', { key: 'Escape' }))

      expect(app.hasAttribute('inert')).toBe(false)
      expect(document.documentElement.classList.contains('--backdrop-present')).toBe(false)
      expect(wrapper.emitted('before-close')).toBeUndefined()
    })
  })
})

describe('given two open MazDialog with a title', () => {
  describe('when they are rendered', () => {
    it('then each dialog is labelled by its own title and described by its own content', async () => {
      const wrapper = track(mount({
        components: { MazDialog },
        template: '<div><MazDialog :model-value="true" title="First" /><MazDialog :model-value="true" title="Second" /></div>',
      }, { attachTo: document.body }))
      await vi.dynamicImportSettled()
      await nextTick()

      const dialogs = wrapper.findAll('.m-dialog[role="dialog"]')
      const titleIds = dialogs.map(dialog => dialog.attributes('aria-labelledby'))

      expect(dialogs).toHaveLength(2)
      expect(new Set(titleIds).size).toBe(2)
      expect(titleIds.map(id => document.getElementById(id as string)?.textContent?.trim())).toEqual(['First', 'Second'])
      expect(dialogs.map(dialog => document.getElementById(dialog.attributes('aria-describedby') as string)?.classList.contains('m-dialog-content'))).toEqual([true, true])
    })
  })
})

describe('given an open MazDialog', () => {
  describe('when it has no title', () => {
    it('then it is not labelled by a missing title', async () => {
      const wrapper = track(mount(MazDialog, { props: { modelValue: true }, attachTo: document.body }))
      await vi.dynamicImportSettled()

      expect(wrapper.find('.m-dialog').attributes('aria-labelledby')).toBeUndefined()
    })
  })

  describe('when aria-labelledby and aria-describedby props are set', () => {
    it('then they label and describe the dialog', async () => {
      const wrapper = track(mount(MazDialog, { props: { modelValue: true, title: 'Title', ariaLabelledby: 'custom-title', ariaDescribedby: 'custom-description' }, attachTo: document.body }))
      await vi.dynamicImportSettled()

      expect(wrapper.find('.m-dialog').attributes('aria-labelledby')).toBe('custom-title')
      expect(wrapper.find('.m-dialog').attributes('aria-describedby')).toBe('custom-description')
    })
  })

  describe('when the close button is rendered', () => {
    it('then it has a translated label', async () => {
      const wrapper = track(mount(MazDialog, { props: { modelValue: true, title: 'Title' }, attachTo: document.body }))
      await vi.dynamicImportSettled()

      expect(wrapper.find('.m-dialog-header button').attributes('aria-label')).toBe('aria.close')
    })
  })
})

describe('given an open MazBottomSheet', () => {
  describe('when it has a title', () => {
    it('then its dialog is labelled by its own title and described by its content', async () => {
      const wrapper = track(mount(MazBottomSheet, { props: { modelValue: true, title: 'Sheet' }, attachTo: document.body }))
      await vi.dynamicImportSettled()

      const dialog = wrapper.find('.m-bottom-sheet[role="dialog"]')

      expect(document.getElementById(dialog.attributes('aria-labelledby') as string)?.textContent?.trim()).toBe('Sheet')
      expect(document.getElementById(dialog.attributes('aria-describedby') as string)?.classList.contains('m-bottom-sheet__content')).toBe(true)
      expect(wrapper.find('.m-bottom-sheet__close button').attributes('aria-label')).toBe('aria.close')
    })
  })

  describe('when it has no title', () => {
    it('then it is not labelled by a missing title', async () => {
      const wrapper = track(mount(MazBottomSheet, { props: { modelValue: true }, attachTo: document.body }))
      await vi.dynamicImportSettled()

      expect(wrapper.find('.m-bottom-sheet').attributes('aria-labelledby')).toBeUndefined()
    })
  })
})

describe('given an open MazDrawer', () => {
  describe('when it has a title', () => {
    it('then the modal dialog is labelled by the title and the close button is labelled', async () => {
      const wrapper = track(mount(MazDrawer, { props: { title: 'Menu' }, attrs: { modelValue: true }, attachTo: document.body }))
      await vi.dynamicImportSettled()

      const dialog = wrapper.find('.m-backdrop-container')

      expect(dialog.attributes('role')).toBe('dialog')
      expect(dialog.attributes('aria-modal')).toBe('true')
      expect(document.getElementById(dialog.attributes('aria-labelledby') as string)?.textContent?.trim()).toBe('Menu')
      expect(wrapper.find('.m-drawer-header__close button').attributes('aria-label')).toBe('aria.close')
    })
  })

  describe('when it has no title', () => {
    it('then the dialog is not labelled by a missing title', async () => {
      const wrapper = track(mount(MazDrawer, { attrs: { modelValue: true }, attachTo: document.body }))
      await vi.dynamicImportSettled()

      expect(wrapper.find('.m-backdrop-container').attributes('aria-labelledby')).toBeUndefined()
      expect(wrapper.find('.m-drawer-header__title').attributes('id')).toBeUndefined()
    })
  })
})
