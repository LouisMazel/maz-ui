import MazNavigationMenu from '@components/MazNavigationMenu.vue'
import { flushPromises, mount } from '@vue/test-utils'

vi.mock('@maz-ui/translations/composables/useTranslations', async () => ({
  useTranslations: (await import('../../helpers/translations.ts')).useEnglishTranslations,
}))

const items = [
  {
    value: 'products',
    label: 'Products',
    items: [
      { label: 'Components', description: 'Vue components', href: '#components' },
      { label: 'Themes', href: '#themes' },
    ],
  },
  { value: 'resources', label: 'Resources', panel: true },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Soon', panel: true, disabled: true },
]

const slots = {
  content: '<template #content="{ item, close }"><div class="content"><a href="#guide">Guide {{ item.label }}</a><button class="inner-close" @click="close">x</button></div></template>',
}

describe('given a MazNavigationMenu', () => {
  async function mountMenu(props: Record<string, unknown> = {}, extraSlots: Record<string, unknown> = slots) {
    const wrapper = mount(MazNavigationMenu, { props: { items, ...props }, slots: extraSlots as any, attachTo: document.body })

    await flushPromises()

    return wrapper
  }

  function trigger(wrapper: ReturnType<typeof mount>, label: string) {
    return wrapper.findAll('button').find(button => button.text().includes(label))!
  }

  async function settle() {
    await flushPromises()
    await flushPromises()
  }

  afterEach(() => {
    document.body.innerHTML = ''
    vi.useRealTimers()
  })

  describe('when the links are rendered', () => {
    it('then none of them underlines on hover', async () => {
      const wrapper = await mountMenu({ modelValue: 'products' })

      await settle()

      const links = wrapper.findAll('a.m-link')

      expect(links.length).toBeGreaterThan(2)

      for (const link of links) {
        expect(link.classes()).not.toContain('--underline-hover')
        expect(link.classes().join(' ')).not.toContain('hover:underline')
      }

      wrapper.unmount()
    })
  })

  describe('when it renders', () => {
    it('then it is a labelled navigation with triggers and links', async () => {
      const wrapper = await mountMenu()

      expect(wrapper.element.tagName).toBe('NAV')
      expect(wrapper.attributes('aria-label')).toBe('Main navigation')
      expect(trigger(wrapper, 'Products').attributes('aria-expanded')).toBe('false')
      expect(wrapper.findAll('li a').some(link => link.text() === 'Pricing')).toBe(true)

      wrapper.unmount()
    })

    it('then a custom label is used', async () => {
      const wrapper = await mountMenu({ label: 'Site' })

      expect(wrapper.attributes('aria-label')).toBe('Site')

      wrapper.unmount()
    })

    it('then the triggers control the shared panel', async () => {
      const wrapper = await mountMenu()
      const panelId = wrapper.find('[role="group"]').attributes('id')

      expect(trigger(wrapper, 'Products').attributes('aria-controls')).toBe(panelId)
      expect(trigger(wrapper, 'Resources').attributes('aria-controls')).toBe(panelId)

      wrapper.unmount()
    })

    it('then the item slot replaces the labels', async () => {
      const wrapper = await mountMenu({}, { item: '<template #item="{ item }">[{{ item.label }}]</template>' })

      expect(wrapper.text()).toContain('[Products]')

      wrapper.unmount()
    })
  })

  describe('when the user clicks a trigger', () => {
    it('then the panel opens with its links and the model is emitted', async () => {
      const wrapper = await mountMenu()

      await trigger(wrapper, 'Products').trigger('click')
      await settle()

      expect(trigger(wrapper, 'Products').attributes('aria-expanded')).toBe('true')
      expect(wrapper.find('[data-content="products"]').text()).toContain('Components')
      expect(wrapper.find('[data-content="products"]').text()).toContain('Vue components')
      expect(wrapper.emitted('update:model-value')![0]).toEqual(['products'])

      wrapper.unmount()
    })

    it('then a second click closes it', async () => {
      const wrapper = await mountMenu()

      await trigger(wrapper, 'Products').trigger('click')
      await trigger(wrapper, 'Products').trigger('click')

      expect(trigger(wrapper, 'Products').attributes('aria-expanded')).toBe('false')

      wrapper.unmount()
    })

    it('then the content slot fills the panel of an item with panel', async () => {
      const wrapper = await mountMenu()

      await trigger(wrapper, 'Resources').trigger('click')
      await settle()

      expect(wrapper.find('[data-content="resources"] .content').text()).toContain('Guide Resources')

      await wrapper.find('.inner-close').trigger('click')

      expect(trigger(wrapper, 'Resources').attributes('aria-expanded')).toBe('false')

      wrapper.unmount()
    })

    it('then a content-<value> slot wins over the content slot', async () => {
      const wrapper = await mountMenu({}, {
        ...slots,
        'content-resources': '<template #content-resources><p class="specific">Specific</p></template>',
      })

      await trigger(wrapper, 'Resources').trigger('click')
      await settle()

      expect(wrapper.find('.specific').exists()).toBe(true)

      wrapper.unmount()
    })

    it('then moving to another item switches the panel and sets the direction', async () => {
      const wrapper = await mountMenu()

      await trigger(wrapper, 'Products').trigger('click')
      await settle()
      await trigger(wrapper, 'Resources').trigger('click')
      await settle()

      expect(wrapper.find('[data-content="resources"]').exists()).toBe(true)
      expect(wrapper.find('.m-navigation-menu__panel').classes()).toContain('--forward')

      await trigger(wrapper, 'Products').trigger('click')
      await settle()

      expect(wrapper.find('.m-navigation-menu__panel').classes()).toContain('--backward')

      wrapper.unmount()
    })

    it('then a link of the panel closes it', async () => {
      const wrapper = await mountMenu()

      await trigger(wrapper, 'Products').trigger('click')
      await settle()
      await wrapper.find('[data-content="products"] a').trigger('click')

      expect(trigger(wrapper, 'Products').attributes('aria-expanded')).toBe('false')

      wrapper.unmount()
    })

    it('then a disabled item does not open', async () => {
      const wrapper = await mountMenu()

      expect(trigger(wrapper, 'Soon').attributes('disabled')).toBeDefined()

      wrapper.unmount()
    })
  })

  describe('when the user hovers', () => {
    it('then the panel opens after the delay and switches at once', async () => {
      vi.useFakeTimers()
      const wrapper = await mountMenu({ openDelay: 100 })
      const enter = (element: any) => element.trigger('pointerenter', { pointerType: 'mouse' })

      await enter(trigger(wrapper, 'Products').element.closest('li') === null ? trigger(wrapper, 'Products') : wrapper.findAll('li')[0]!)
      expect(trigger(wrapper, 'Products').attributes('aria-expanded')).toBe('false')

      await vi.advanceTimersByTimeAsync(120)

      expect(trigger(wrapper, 'Products').attributes('aria-expanded')).toBe('true')

      await enter(wrapper.findAll('li')[1]!)

      expect(trigger(wrapper, 'Resources').attributes('aria-expanded')).toBe('true')

      wrapper.unmount()
    })

    it('then leaving the menu closes a panel opened by hover after the delay', async () => {
      vi.useFakeTimers()
      const wrapper = await mountMenu({ openDelay: 0, closeDelay: 200 })

      await wrapper.findAll('li')[0]!.trigger('pointerenter', { pointerType: 'mouse' })
      await vi.advanceTimersByTimeAsync(10)
      await wrapper.trigger('pointerleave', { pointerType: 'mouse' })
      await vi.advanceTimersByTimeAsync(250)

      expect(trigger(wrapper, 'Products').attributes('aria-expanded')).toBe('false')

      wrapper.unmount()
    })

    it('then entering the menu again cancels the closing', async () => {
      vi.useFakeTimers()
      const wrapper = await mountMenu({ openDelay: 0, closeDelay: 200 })

      await wrapper.findAll('li')[0]!.trigger('pointerenter', { pointerType: 'mouse' })
      await vi.advanceTimersByTimeAsync(10)
      await wrapper.trigger('pointerleave', { pointerType: 'mouse' })
      await wrapper.trigger('pointerenter', { pointerType: 'mouse' })
      await vi.advanceTimersByTimeAsync(250)

      expect(trigger(wrapper, 'Products').attributes('aria-expanded')).toBe('true')

      wrapper.unmount()
    })

    it('then a panel opened by click stays open when the pointer leaves', async () => {
      vi.useFakeTimers()
      const wrapper = await mountMenu({ closeDelay: 50 })

      await trigger(wrapper, 'Products').trigger('click')
      await wrapper.trigger('pointerleave', { pointerType: 'mouse' })
      await vi.advanceTimersByTimeAsync(100)

      expect(trigger(wrapper, 'Products').attributes('aria-expanded')).toBe('true')

      wrapper.unmount()
    })

    it('then hovering a plain link closes a panel opened by hover', async () => {
      vi.useFakeTimers()
      const wrapper = await mountMenu({ openDelay: 0 })

      await wrapper.findAll('li')[0]!.trigger('pointerenter', { pointerType: 'mouse' })
      await vi.advanceTimersByTimeAsync(10)
      await wrapper.findAll('li')[2]!.trigger('pointerenter', { pointerType: 'mouse' })

      expect(trigger(wrapper, 'Products').attributes('aria-expanded')).toBe('false')

      wrapper.unmount()
    })

    it('then a touch pointer does not open on hover', async () => {
      vi.useFakeTimers()
      const wrapper = await mountMenu({ openDelay: 0 })

      await wrapper.findAll('li')[0]!.trigger('pointerenter', { pointerType: 'touch' })
      await vi.advanceTimersByTimeAsync(50)

      expect(trigger(wrapper, 'Products').attributes('aria-expanded')).toBe('false')

      wrapper.unmount()
    })

    it('then leaving the list without panel hides the pill', async () => {
      const wrapper = await mountMenu()

      await wrapper.findAll('li')[2]!.trigger('pointerenter', { pointerType: 'mouse' })

      expect(wrapper.find('.m-navigation-menu__pill-fill').classes()).toContain('maz:opacity-100')

      await wrapper.find('.maz\\:relative.maz\\:inline-block').trigger('pointerleave')

      expect(wrapper.find('.m-navigation-menu__pill-fill').classes()).toContain('maz:opacity-0')

      wrapper.unmount()
    })
  })

  describe('when the user uses the keyboard', () => {
    it('then Escape closes the panel and returns the focus to the trigger', async () => {
      const wrapper = await mountMenu()

      await trigger(wrapper, 'Products').trigger('click')
      await settle()
      ;(wrapper.find('[data-content="products"] a').element as HTMLElement).focus()
      await wrapper.find('[data-content="products"] a').trigger('keydown', { key: 'Escape' })

      expect(trigger(wrapper, 'Products').attributes('aria-expanded')).toBe('false')
      expect(document.activeElement).toBe(trigger(wrapper, 'Products').element)

      wrapper.unmount()
    })

    it('then ArrowDown opens the panel and focuses its first link', async () => {
      const wrapper = await mountMenu()

      await trigger(wrapper, 'Products').trigger('keydown', { key: 'ArrowDown' })
      await settle()

      expect(trigger(wrapper, 'Products').attributes('aria-expanded')).toBe('true')
      expect(document.activeElement?.textContent).toContain('Components')

      wrapper.unmount()
    })

    it('then Tab on an open trigger goes into the panel', async () => {
      const wrapper = await mountMenu()

      await trigger(wrapper, 'Products').trigger('click')
      await settle()
      await trigger(wrapper, 'Products').trigger('keydown', { key: 'Tab' })

      expect(document.activeElement?.textContent).toContain('Components')

      wrapper.unmount()
    })

    it('then Shift+Tab on the first link goes back to the trigger', async () => {
      const wrapper = await mountMenu()

      await trigger(wrapper, 'Products').trigger('click')
      await settle()
      ;(wrapper.find('[data-content="products"] a').element as HTMLElement).focus()
      await wrapper.find('[role="group"]').trigger('keydown', { key: 'Tab', shiftKey: true })

      expect(document.activeElement).toBe(trigger(wrapper, 'Products').element)

      wrapper.unmount()
    })

    it('then Tab on the last link goes to the next item and closes the panel', async () => {
      const wrapper = await mountMenu()

      await trigger(wrapper, 'Products').trigger('click')
      await settle()
      const links = wrapper.findAll('[data-content="products"] a')

      ;(links.at(-1)!.element as HTMLElement).focus()
      await wrapper.find('[role="group"]').trigger('keydown', { key: 'Tab' })

      expect(document.activeElement).toBe(trigger(wrapper, 'Resources').element)
      expect(trigger(wrapper, 'Products').attributes('aria-expanded')).toBe('false')

      wrapper.unmount()
    })

    it('then the arrows move the focus between the top level items', async () => {
      const wrapper = await mountMenu()

      ;(trigger(wrapper, 'Products').element as HTMLElement).focus()
      await trigger(wrapper, 'Products').trigger('keydown', { key: 'ArrowRight' })

      expect(document.activeElement).toBe(trigger(wrapper, 'Resources').element)

      await trigger(wrapper, 'Resources').trigger('keydown', { key: 'ArrowLeft' })

      expect(document.activeElement).toBe(trigger(wrapper, 'Products').element)

      wrapper.unmount()
    })

    it('then the arrows are swapped in RTL', async () => {
      document.documentElement.dir = 'rtl'
      const wrapper = await mountMenu()

      ;(trigger(wrapper, 'Products').element as HTMLElement).focus()
      await trigger(wrapper, 'Products').trigger('keydown', { key: 'ArrowLeft' })

      expect(document.activeElement).toBe(trigger(wrapper, 'Resources').element)

      document.documentElement.dir = ''
      wrapper.unmount()
    })
  })

  describe('when the focus or the pointer goes outside', () => {
    it('then a pointerdown outside closes the panel', async () => {
      const wrapper = await mountMenu()

      await trigger(wrapper, 'Products').trigger('click')
      await settle()
      document.body.dispatchEvent(new Event('pointerdown', { bubbles: true }))
      await flushPromises()

      expect(trigger(wrapper, 'Products').attributes('aria-expanded')).toBe('false')

      wrapper.unmount()
    })

    it('then a pointerdown inside does not close it', async () => {
      const wrapper = await mountMenu()

      await trigger(wrapper, 'Products').trigger('click')
      await settle()
      trigger(wrapper, 'Products').element.dispatchEvent(new Event('pointerdown', { bubbles: true }))
      await flushPromises()

      expect(trigger(wrapper, 'Products').attributes('aria-expanded')).toBe('true')

      wrapper.unmount()
    })

    it('then the focus leaving the menu closes the panel', async () => {
      const wrapper = await mountMenu()

      await trigger(wrapper, 'Products').trigger('click')
      await wrapper.trigger('focusout', { relatedTarget: null })

      expect(trigger(wrapper, 'Products').attributes('aria-expanded')).toBe('false')

      wrapper.unmount()
    })

    it('then the focus moving inside the menu keeps the panel', async () => {
      const wrapper = await mountMenu()

      await trigger(wrapper, 'Products').trigger('click')
      await wrapper.trigger('focusout', { relatedTarget: trigger(wrapper, 'Resources').element })

      expect(trigger(wrapper, 'Products').attributes('aria-expanded')).toBe('true')

      wrapper.unmount()
    })
  })

  describe('when it is controlled and exposed', () => {
    it('then the exposed close closes the panel', async () => {
      const wrapper = await mountMenu()

      await trigger(wrapper, 'Products').trigger('click')
      ;(wrapper.vm as any).close()
      await flushPromises()

      expect(trigger(wrapper, 'Products').attributes('aria-expanded')).toBe('false')

      wrapper.unmount()
    })

    it('then it opens an item from the model', async () => {
      const wrapper = await mountMenu({ modelValue: 'products' })

      await settle()

      expect(trigger(wrapper, 'Products').attributes('aria-expanded')).toBe('true')

      wrapper.unmount()
    })
  })
})
