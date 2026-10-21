import type { MazPopoverProps } from '@components/MazPopover.vue'
import MazPopover from '@components/MazPopover.vue'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'

async function mountPopover(props: Partial<MazPopoverProps> = {}, trigger = '<button>Open</button>') {
  const wrapper = mount(MazPopover, {
    props,
    slots: {
      trigger,
      default: '<div>Content</div>',
    },
    attachTo: document.body,
  })

  await nextTick()

  return wrapper
}

describe('given a MazPopover with an interactive element in the trigger slot', () => {
  describe('when it is mounted', () => {
    it('then the wrapper has no role and the button carries the trigger ARIA', async () => {
      const wrapper = await mountPopover()

      const trigger = wrapper.find('.m-popover-trigger')
      const button = wrapper.find('.m-popover-trigger button')

      expect(trigger.attributes('role')).toBeUndefined()
      expect(trigger.attributes('aria-expanded')).toBeUndefined()
      expect(trigger.attributes('tabindex')).toBeUndefined()
      expect(button.attributes('aria-expanded')).toBe('false')
      expect(button.attributes('aria-haspopup')).toBe('dialog')
      expect(button.attributes('aria-controls')).toBeUndefined()

      wrapper.unmount()
    })
  })

  describe('when the popover opens', () => {
    it('then the button is expanded and controls the panel', async () => {
      const wrapper = await mountPopover()

      await wrapper.find('.m-popover-trigger button').trigger('click')
      await nextTick()

      const button = wrapper.find('.m-popover-trigger button')
      const panel = wrapper.find('.m-popover-panel')

      expect(button.attributes('aria-expanded')).toBe('true')
      expect(button.attributes('aria-controls')).toBe(panel.attributes('id'))
      expect(panel.attributes('aria-labelledby')).toBe(wrapper.find('.m-popover-trigger').attributes('id'))

      wrapper.unmount()
    })
  })

  describe('when the popover closes again', () => {
    it('then aria-controls is removed from the button', async () => {
      const wrapper = await mountPopover()
      const button = wrapper.find('.m-popover-trigger button')

      await button.trigger('click')
      await nextTick()
      await button.trigger('click')
      await nextTick()

      expect(button.attributes('aria-expanded')).toBe('false')
      expect(button.attributes('aria-controls')).toBeUndefined()

      wrapper.unmount()
    })
  })

  describe('when the role is menu', () => {
    it('then the button announces a menu popup and the panel is labelled by the trigger', async () => {
      const wrapper = await mountPopover({ role: 'menu', modelValue: true })
      await nextTick()

      expect(wrapper.find('.m-popover-trigger button').attributes('aria-haspopup')).toBe('menu')
      expect(wrapper.find('.m-popover-panel').attributes('aria-labelledby')).toBe(wrapper.find('.m-popover-trigger').attributes('id'))

      wrapper.unmount()
    })
  })

  describe('when the role is tooltip', () => {
    it('then the button is described by the panel while it is open', async () => {
      const wrapper = await mountPopover({ role: 'tooltip', trigger: 'hover' })
      const button = wrapper.find('.m-popover-trigger button')

      expect(button.attributes('aria-describedby')).toBeUndefined()
      expect(button.attributes('aria-expanded')).toBeUndefined()

      await wrapper.find('.m-popover-trigger').trigger('mouseenter')
      await nextTick()

      expect(button.attributes('aria-describedby')).toBe(wrapper.find('.m-popover-panel').attributes('id'))

      wrapper.unmount()
    })
  })

  describe('when aria-labelledby and aria-describedby props are set', () => {
    it('then they go on the button', async () => {
      const wrapper = await mountPopover({ ariaLabelledby: 'label-id', ariaDescribedby: 'description-id' })
      const button = wrapper.find('.m-popover-trigger button')

      expect(button.attributes('aria-labelledby')).toBe('label-id')
      expect(button.attributes('aria-describedby')).toBe('description-id')

      wrapper.unmount()
    })
  })

  describe('when the slot content sets an ARIA attribute itself', () => {
    it('then the attribute of the slot content is kept', async () => {
      const wrapper = await mountPopover({ ariaLabelledby: 'popover-label' }, '<button aria-haspopup="listbox" aria-labelledby="own-label">Open</button>')
      const button = wrapper.find('.m-popover-trigger button')

      expect(button.attributes('aria-haspopup')).toBe('listbox')
      expect(button.attributes('aria-labelledby')).toBe('own-label')
      expect(button.attributes('aria-expanded')).toBe('false')

      wrapper.unmount()
    })
  })

  describe('when the interactive element is a combobox', () => {
    it('then the popover leaves its ARIA to the combobox', async () => {
      const wrapper = await mountPopover({ modelValue: true }, '<input role="combobox" aria-label="Search">')
      await nextTick()

      const input = wrapper.find('.m-popover-trigger input')

      expect(input.attributes('aria-expanded')).toBeUndefined()
      expect(input.attributes('aria-controls')).toBeUndefined()
      expect(wrapper.find('.m-popover-trigger').attributes('role')).toBeUndefined()

      wrapper.unmount()
    })
  })

  describe('when a button comes before a combobox in the trigger slot', () => {
    it('then the combobox is the trigger and the button gets no popup ARIA', async () => {
      const wrapper = await mountPopover({}, '<div><button aria-label="Icon">i</button><input role="combobox" aria-label="Search"></div>')

      expect(wrapper.find('.m-popover-trigger button').attributes('aria-expanded')).toBeUndefined()
      expect(wrapper.find('.m-popover-trigger').attributes('role')).toBeUndefined()

      wrapper.unmount()
    })
  })

  describe('when the interactive element is a text field without role', () => {
    it('then it gets no aria-expanded, which a textbox does not allow', async () => {
      const wrapper = await mountPopover({ modelValue: true }, '<input type="text" aria-label="Date">')
      await nextTick()

      const input = wrapper.find('.m-popover-trigger input')

      expect(input.attributes('aria-expanded')).toBeUndefined()
      expect(input.attributes('aria-controls')).toBe(wrapper.find('.m-popover-panel').attributes('id'))

      wrapper.unmount()
    })
  })

  describe('when the interactive element is a textarea without role', () => {
    it('then it gets no aria-expanded', async () => {
      const wrapper = await mountPopover({}, '<textarea aria-label="Note"></textarea>')

      expect(wrapper.find('.m-popover-trigger textarea').attributes('aria-expanded')).toBeUndefined()

      wrapper.unmount()
    })
  })

  describe('when the interactive element is a checkbox input', () => {
    it('then it gets aria-expanded', async () => {
      const wrapper = await mountPopover({}, '<input type="checkbox" aria-label="Toggle">')

      expect(wrapper.find('.m-popover-trigger input').attributes('aria-expanded')).toBe('false')

      wrapper.unmount()
    })
  })

  describe('when the interactive element of the slot is replaced', () => {
    it('then the ARIA moves to the new element and is removed from the previous one', async () => {
      const wrapper = mount({
        components: { MazPopover },
        data: () => ({ useLink: false }),
        template: `
          <MazPopover>
            <template #trigger>
              <a v-if="useLink" href="#">Link</a>
              <button v-else>Button</button>
            </template>
            <div>Content</div>
          </MazPopover>
        `,
      }, { attachTo: document.body })
      await nextTick()

      const button = wrapper.find('button').element

      await wrapper.setData({ useLink: true })
      await nextTick()

      expect(button.hasAttribute('aria-expanded')).toBe(false)
      expect(wrapper.find('a').attributes('aria-expanded')).toBe('false')

      wrapper.unmount()
    })
  })

  describe('when the interactive element renders after the mount', () => {
    it('then the ARIA moves from the wrapper to the element', async () => {
      const wrapper = await mountPopover({}, '<span class="slot-root"></span>')

      expect(wrapper.find('.m-popover-trigger').attributes('role')).toBe('button')

      const button = document.createElement('button')
      wrapper.find('.slot-root').element.appendChild(button)
      await nextTick()
      await nextTick()

      expect(button.getAttribute('aria-expanded')).toBe('false')
      expect(wrapper.find('.m-popover-trigger').attributes('role')).toBeUndefined()

      wrapper.unmount()
    })
  })

  describe('when it is unmounted', () => {
    it('then the ARIA set on the button is removed', async () => {
      const wrapper = await mountPopover()
      const button = wrapper.find('.m-popover-trigger button').element

      wrapper.unmount()

      expect(button.hasAttribute('aria-expanded')).toBe(false)
      expect(button.hasAttribute('aria-haspopup')).toBe(false)
    })
  })
})

describe('given a MazPopover without interactive element in the trigger slot', () => {
  describe('when the trigger is click', () => {
    it('then the wrapper is a focusable button carrying the trigger ARIA', async () => {
      const wrapper = await mountPopover({}, '<span>Open</span>')
      const trigger = wrapper.find('.m-popover-trigger')

      expect(trigger.attributes('role')).toBe('button')
      expect(trigger.attributes('tabindex')).toBe('0')
      expect(trigger.attributes('aria-expanded')).toBe('false')
      expect(trigger.attributes('aria-haspopup')).toBe('dialog')

      wrapper.unmount()
    })
  })

  describe('when Enter is pressed on the wrapper', () => {
    it('then the popover opens', async () => {
      const wrapper = await mountPopover({}, '<span>Open</span>')

      await wrapper.find('.m-popover-trigger').trigger('keydown', { key: 'Enter' })

      expect(wrapper.find('.m-popover-panel').exists()).toBe(true)
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true])

      wrapper.unmount()
    })
  })

  describe('when Space is pressed twice on the wrapper', () => {
    it('then the popover opens and closes', async () => {
      const wrapper = await mountPopover({}, '<span>Open</span>')
      const trigger = wrapper.find('.m-popover-trigger')

      await trigger.trigger('keydown', { key: ' ' })
      await trigger.trigger('keydown', { key: ' ' })

      expect(wrapper.emitted('update:modelValue')).toEqual([[true], [false]])

      wrapper.unmount()
    })
  })

  describe('when another key is pressed on the wrapper', () => {
    it('then the popover stays closed', async () => {
      const wrapper = await mountPopover({}, '<span>Open</span>')

      await wrapper.find('.m-popover-trigger').trigger('keydown', { key: 'a' })

      expect(wrapper.find('.m-popover-panel').exists()).toBe(false)

      wrapper.unmount()
    })
  })

  describe('when Enter is pressed on an element inside the wrapper', () => {
    it('then the wrapper does not toggle the popover', async () => {
      const wrapper = await mountPopover({}, '<span class="inner">Open</span>')

      await wrapper.find('.inner').trigger('keydown', { key: 'Enter' })

      expect(wrapper.find('.m-popover-panel').exists()).toBe(false)

      wrapper.unmount()
    })
  })

  describe('when the trigger is hover', () => {
    it('then the wrapper has no button role and is not focusable', async () => {
      const wrapper = await mountPopover({ trigger: 'hover', role: 'tooltip' }, '<span>Info</span>')
      const trigger = wrapper.find('.m-popover-trigger')

      expect(trigger.attributes('role')).toBeUndefined()
      expect(trigger.attributes('tabindex')).toBeUndefined()

      wrapper.unmount()
    })
  })

  describe('when the popover is disabled', () => {
    it('then the wrapper is not focusable', async () => {
      const wrapper = await mountPopover({ disabled: true }, '<span>Open</span>')

      expect(wrapper.find('.m-popover-trigger').attributes('tabindex')).toBeUndefined()

      wrapper.unmount()
    })
  })
})
