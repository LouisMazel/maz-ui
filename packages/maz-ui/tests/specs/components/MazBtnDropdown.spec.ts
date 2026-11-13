import type { MazBtnDropdownProps } from '@components/MazBtnDropdown.vue'
import MazBtnDropdown from '@components/MazBtnDropdown.vue'
import { GLOBAL_CONFIG_INJECTION_KEY } from '@composables/useGlobalConfig'
import { runAxe } from '@tests/helpers/axe'
import { mount } from '@vue/test-utils'

const draftSpy = vi.fn()
const publishSpy = vi.fn()

const items: MazBtnDropdownProps['items'] = [
  { label: 'Save as draft', onClick: draftSpy },
  { label: 'Save and publish', onClick: publishSpy },
]

async function mountBtnDropdown({ props = {}, slots = {}, provide = {} }: { props?: Partial<MazBtnDropdownProps>, slots?: Record<string, string>, provide?: Record<symbol, unknown> } = {}) {
  const wrapper = mount(MazBtnDropdown, {
    props: {
      items,
      menuLabel: 'Other save options',
      ...props,
    },
    slots: {
      default: 'Save',
      ...slots,
    },
    global: {
      stubs: { teleport: true },
      provide,
    },
    attachTo: document.body,
  })

  await vi.dynamicImportSettled()

  return wrapper
}

function getToggle(wrapper: Awaited<ReturnType<typeof mountBtnDropdown>>) {
  return wrapper.find('.m-btn-dropdown__toggle')
}

async function openMenu(wrapper: Awaited<ReturnType<typeof mountBtnDropdown>>) {
  await getToggle(wrapper).trigger('click')
  await vi.dynamicImportSettled()
}

afterEach(() => {
  draftSpy.mockClear()
  publishSpy.mockClear()
  document.body.innerHTML = ''
})

describe('given MazBtnDropdown component', () => {
  describe('when rendered with items', () => {
    it('then it renders the main action and a named chevron in a group', async () => {
      const wrapper = await mountBtnDropdown()

      expect(wrapper.attributes('role')).toBe('group')
      expect(wrapper.find('.m-btn-dropdown__action').text()).toBe('Save')
      expect(getToggle(wrapper).attributes('aria-label')).toBe('Other save options')
      expect(getToggle(wrapper).attributes('title')).toBe('Other save options')
    })

    it('then the inner corners of both parts are square', async () => {
      const wrapper = await mountBtnDropdown()

      expect(wrapper.find('.m-btn-dropdown__action').classes()).toContain('maz:rounded-e-none!')
      expect(getToggle(wrapper).classes()).toContain('maz:rounded-s-none!')
    })

    it('then it has no accessibility violations', async () => {
      const wrapper = await mountBtnDropdown()

      expect(await runAxe(wrapper)).toHaveNoViolations()
    })
  })

  describe('when rendered without items', () => {
    it('then only the main action is rendered, with its rounded corners', async () => {
      const wrapper = await mountBtnDropdown({
        props: { items: [] },
      })

      expect(getToggle(wrapper).exists()).toBe(false)
      expect(wrapper.find('.m-dropdown').exists()).toBe(false)
      expect(wrapper.find('.m-btn-dropdown__action').classes()).not.toContain('maz:rounded-e-none!')
    })
  })

  describe('when the main action is clicked', () => {
    it('then it emits click with the event and keeps the menu closed', async () => {
      const wrapper = await mountBtnDropdown()

      await wrapper.find('.m-btn-dropdown__action').trigger('click')

      expect(wrapper.emitted('click')).toHaveLength(1)
      expect(wrapper.emitted('click')?.[0][0]).toBeInstanceOf(MouseEvent)
      expect(wrapper.find('.m-dropdown__menu').exists()).toBe(false)
    })
  })

  describe('when the chevron is clicked', () => {
    it('then the menu opens with the items and the toggle is expanded', async () => {
      const wrapper = await mountBtnDropdown()

      await openMenu(wrapper)

      expect(wrapper.findAll('.menuitem').map(item => item.text())).toEqual(['Save as draft', 'Save and publish'])
      expect(getToggle(wrapper).attributes('aria-expanded')).toBe('true')
      expect(wrapper.emitted('click')).toBeUndefined()
    })
  })

  describe('when a menu item is clicked', () => {
    it('then its action runs and the menu closes', async () => {
      const wrapper = await mountBtnDropdown()
      await openMenu(wrapper)

      await wrapper.findAll('.menuitem')[1].trigger('click')
      await vi.dynamicImportSettled()

      expect(publishSpy).toHaveBeenCalledTimes(1)
      expect(draftSpy).not.toHaveBeenCalled()
      expect(wrapper.find('.m-dropdown__menu').exists()).toBe(false)
    })
  })

  describe('when trigger is hover', () => {
    it('then the menu opens on mouseenter', async () => {
      const wrapper = await mountBtnDropdown({
        props: { trigger: 'hover' },
      })

      await wrapper.find('.m-popover-trigger').trigger('mouseenter')

      expect(wrapper.find('.m-dropdown__menu').exists()).toBe(true)
    })
  })

  describe('when disabled', () => {
    it('then both parts are disabled', async () => {
      const wrapper = await mountBtnDropdown({
        props: { disabled: true },
      })

      expect(wrapper.find('.m-btn-dropdown__action').attributes('disabled')).toBeDefined()
      expect(getToggle(wrapper).attributes('disabled')).toBeDefined()
    })
  })

  describe('when actionDisabled', () => {
    it('then only the main action is disabled and the menu still opens', async () => {
      const wrapper = await mountBtnDropdown({
        props: { actionDisabled: true },
      })

      await getToggle(wrapper).trigger('click')

      expect(wrapper.find('.m-btn-dropdown__action').attributes('disabled')).toBeDefined()
      expect(getToggle(wrapper).attributes('disabled')).toBeUndefined()
      expect(wrapper.find('.m-dropdown__menu').exists()).toBe(true)
    })
  })

  describe('when menuDisabled', () => {
    it('then only the chevron is disabled', async () => {
      const wrapper = await mountBtnDropdown({
        props: { menuDisabled: true },
      })

      expect(wrapper.find('.m-btn-dropdown__action').attributes('disabled')).toBeUndefined()
      expect(getToggle(wrapper).attributes('disabled')).toBeDefined()
    })
  })

  describe('when loading', () => {
    it('then only the main action shows the loader', async () => {
      const wrapper = await mountBtnDropdown({
        props: { loading: true },
      })

      expect(wrapper.find('.m-btn-dropdown__action .m-btn-loader-container').exists()).toBe(true)
      expect(getToggle(wrapper).find('.m-btn-loader-container').exists()).toBe(false)
    })
  })

  describe('when the menuitem-label slot is provided', () => {
    it('then it renders the custom label of each item', async () => {
      const wrapper = await mountBtnDropdown({
        slots: { 'menuitem-label': '<template #menuitem-label="{ item }">Custom {{ item.label }}</template>' },
      })

      await openMenu(wrapper)

      expect(wrapper.findAll('.menuitem')[0].text()).toBe('Custom Save as draft')
    })
  })

  describe('when a global config sets size and roundedSize', () => {
    it('then both parts use them unless a prop overrides them', async () => {
      const wrapper = await mountBtnDropdown({
        props: { size: 'lg' },
        provide: {
          [GLOBAL_CONFIG_INJECTION_KEY]: {
            MazBtnDropdown: { size: 'sm', roundedSize: 'full' },
          },
        },
      })
      const parts = wrapper.findAllComponents({ name: 'MazBtn' }).slice(0, 2)

      expect(parts.map(part => part.props('size'))).toEqual(['lg', 'lg'])
      expect(parts.map(part => part.props('roundedSize'))).toEqual(['full', 'full'])
    })
  })

  describe('when type, startIcon and block are set', () => {
    it('then the main action receives them and grows in a full width group', async () => {
      const wrapper = await mountBtnDropdown({
        props: { type: 'submit', startIcon: 'star', block: true },
      })
      const action = wrapper.findAllComponents({ name: 'MazBtn' })[0]

      expect(action.props('type')).toBe('submit')
      expect(action.props('startIcon')).toBe('star')
      expect(action.classes()).toContain('maz:flex-1')
      expect(wrapper.classes()).toContain('maz:w-full')
      expect(getToggle(wrapper).attributes('type')).toBe('button')
    })
  })

  describe('when tooltip is set', () => {
    it('then the tooltip is attached to the main action only', async () => {
      await mountBtnDropdown({
        props: {
          tooltip: { text: 'Save the document', open: true },
        },
      })
      await vi.dynamicImportSettled()

      const panels = document.querySelectorAll('.m-tooltip-panel')

      expect(panels).toHaveLength(1)
      expect(panels[0].textContent).toContain('Save the document')
    })
  })

  describe('when tooltip is not set', () => {
    it('then no tooltip is rendered', async () => {
      await mountBtnDropdown()

      expect(document.querySelector('.m-tooltip-panel')).toBeNull()
    })
  })

  describe('when rendered in each size', () => {
    it('then the chevron has a narrower padding than a text button', async () => {
      const wrapper = await mountBtnDropdown({
        props: { size: 'xl' },
      })

      expect(getToggle(wrapper).classes()).toContain('maz:px-3!')
    })
  })
})
