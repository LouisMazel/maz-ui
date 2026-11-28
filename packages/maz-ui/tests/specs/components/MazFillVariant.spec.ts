import MazAlert from '@components/MazAlert.vue'
import MazBadge from '@components/MazBadge.vue'
import MazBtn from '@components/MazBtn.vue'
import MazBtnClipboard from '@components/MazBtnClipboard.vue'
import MazBtnDropdown from '@components/MazBtnDropdown.vue'
import MazBtnGroup from '@components/MazBtnGroup.vue'
import { GLOBAL_CONFIG_INJECTION_KEY } from '@composables/useGlobalConfig.ts'
import { flushPromises, mount } from '@vue/test-utils'

function fillClasses(classes: string[]) {
  return classes.filter(name => ['--outlined', '--pastel', '--ghost'].includes(name)).sort()
}

describe.each([
  ['MazBtn', MazBtn],
  ['MazBadge', MazBadge],
] as const)('given %s with a fill variant', (_name, Component) => {
  describe('when no fill prop is set', () => {
    it('then it renders the solid style', () => {
      const wrapper = mount(Component)

      expect(fillClasses(wrapper.classes())).toEqual([])
    })
  })

  describe('when variant is outline', () => {
    it('then it renders exactly like outlined', () => {
      const withVariant = mount(Component, { props: { variant: 'outline' } })
      const withBoolean = mount(Component, { props: { outlined: true } })

      expect(withVariant.classes().sort()).toEqual(withBoolean.classes().sort())
      expect(withVariant.classes()).toContain('--outlined')
    })
  })

  describe('when variant is soft', () => {
    it('then it renders exactly like pastel', () => {
      const withVariant = mount(Component, { props: { variant: 'soft' } })
      const withBoolean = mount(Component, { props: { pastel: true } })

      expect(withVariant.classes().sort()).toEqual(withBoolean.classes().sort())
      expect(withVariant.classes()).toContain('--pastel')
    })
  })

  describe('when variant is solid', () => {
    it('then it renders the solid style', () => {
      const wrapper = mount(Component, { props: { variant: 'solid' } })

      expect(fillClasses(wrapper.classes())).toEqual([])
    })
  })

  describe('when variant is ghost', () => {
    it('then it renders the ghost class only', () => {
      const wrapper = mount(Component, { props: { variant: 'ghost' } })

      expect(fillClasses(wrapper.classes())).toEqual(['--ghost'])
    })
  })

  describe('when variant and the deprecated booleans are both set', () => {
    it('then the explicit variant wins', () => {
      const wrapper = mount(Component, { props: { variant: 'solid', outlined: true, pastel: true } })

      expect(fillClasses(wrapper.classes())).toEqual([])
    })

    it('then a soft variant wins over outlined', () => {
      const wrapper = mount(Component, { props: { variant: 'soft', outlined: true } })

      expect(fillClasses(wrapper.classes())).toEqual(['--pastel'])
    })
  })

  describe('when only the deprecated booleans are set', () => {
    it('then both keep rendering', () => {
      const wrapper = mount(Component, { props: { outlined: true, pastel: true } })

      expect(fillClasses(wrapper.classes())).toEqual(['--outlined', '--pastel'])
    })
  })
})

describe.each([
  ['MazBtn', MazBtn],
  ['MazBadge', MazBadge],
  ['MazBtnDropdown', MazBtnDropdown],
] as const)('given a MazUi global default variant for %s', (name, Component) => {
  const provide = { [GLOBAL_CONFIG_INJECTION_KEY as symbol]: { [name]: { variant: 'soft' } } }

  describe('when no variant is passed', () => {
    it('then the global default is applied', () => {
      const wrapper = mount(Component as any, { global: { provide } })

      expect(wrapper.html()).toContain('--pastel')
    })
  })

  describe('when a variant is passed', () => {
    it('then the instance prop wins over the global default', () => {
      const wrapper = mount(Component as any, { props: { variant: 'outline' }, global: { provide } })

      expect(wrapper.html()).toContain('--outlined')
      expect(wrapper.html()).not.toContain('--pastel')
    })
  })
})

describe('given MazBtnGroup with a variant', () => {
  async function renderGroup(props: Record<string, unknown>) {
    const wrapper = mount(MazBtnGroup, { props })
    await flushPromises()

    return wrapper.findAll('.m-btn').map(button => button.classes())
  }

  describe('when the group has a variant', () => {
    it('then every button of the items renders it', async () => {
      const buttons = await renderGroup({ variant: 'outline', items: [{ text: 'A' }, { text: 'B' }] })

      expect(buttons).toHaveLength(2)
      expect(buttons.every(classes => classes.includes('--outlined'))).toBe(true)
    })

    it('then the variant of an item wins', async () => {
      const [first, second] = await renderGroup({ variant: 'outline', items: [{ text: 'A', variant: 'soft' }, { text: 'B' }] })

      expect(first).toContain('--pastel')
      expect(first).not.toContain('--outlined')
      expect(second).toContain('--outlined')
    })
  })

  describe('when an item uses the deprecated booleans', () => {
    it('then it keeps rendering', async () => {
      const [first, second] = await renderGroup({ items: [{ text: 'A', outlined: true }, { text: 'B', pastel: true }] })

      expect(first).toContain('--outlined')
      expect(second).toContain('--pastel')
    })
  })
})

describe('given MazBtnDropdown with a variant', () => {
  const items = [{ label: 'Item', action: () => undefined }]

  describe.each([
    ['outline', 'outlined', '--outlined'],
    ['soft', 'pastel', '--pastel'],
  ] as const)('when variant is %s', (variant, boolean, className) => {
    it(`then both parts render like ${boolean}`, () => {
      const withVariant = mount(MazBtnDropdown, { props: { variant, items } })
      const withBoolean = mount(MazBtnDropdown, { props: { [boolean]: true, items } })

      const variantButtons = withVariant.findAllComponents(MazBtn)
      const booleanButtons = withBoolean.findAllComponents(MazBtn)
      expect(variantButtons.length).toBeGreaterThanOrEqual(2)
      expect(variantButtons.map(button => button.classes().sort())).toEqual(booleanButtons.map(button => button.classes().sort()))
      expect(variantButtons.every(button => button.classes().includes(className))).toBe(true)
    })
  })

  describe('when the variant and a boolean are set', () => {
    it('then the variant wins on both parts', () => {
      const wrapper = mount(MazBtnDropdown, { props: { variant: 'solid', outlined: true, items } })

      expect(wrapper.findAllComponents(MazBtn).every(button => !button.classes().includes('--outlined'))).toBe(true)
    })
  })
})

describe('given MazAlert with the outline variant', () => {
  describe('when variant is outline', () => {
    it('then it renders the outline class with the soft text color', () => {
      const wrapper = mount(MazAlert, { props: { variant: 'outline', content: 'Text' } })

      expect(wrapper.classes()).toContain('--outline')
      expect(wrapper.classes()).toContain('maz:text-(--m-alert-color)')
      expect(wrapper.classes()).not.toContain('maz:bg-(--m-alert-bg)')
    })
  })

  describe('when variant is soft or solid', () => {
    it('then it renders as before', () => {
      expect(mount(MazAlert, { props: { content: 'Text' } }).classes()).toContain('--soft')
      expect(mount(MazAlert, { props: { variant: 'solid', content: 'Text' } }).classes()).toContain('maz:bg-(--m-alert-bg)')
    })
  })
})

describe('given MazBtnClipboard with the outline variant', () => {
  describe.each(['outline', 'outlined'] as const)('when variant is %s', (variant) => {
    it('then it renders the outlined style', () => {
      const wrapper = mount(MazBtnClipboard, { props: { value: 'text', variant } })

      expect(wrapper.classes()).toContain('--outlined')
    })
  })

  describe('when variant is outline', () => {
    it('then it renders exactly like outlined', () => {
      const withOutline = mount(MazBtnClipboard, { props: { value: 'text', variant: 'outline' } })
      const withOutlined = mount(MazBtnClipboard, { props: { value: 'text', variant: 'outlined' } })

      expect(withOutline.classes().sort()).toEqual(withOutlined.classes().sort())
    })
  })
})

describe('given a global variant in the defaults', () => {
  describe('when a MazBtn sets the deprecated outlined prop', () => {
    it('then the prop of the instance wins over the global variant', () => {
      const wrapper = mount(MazBtn, {
        props: { outlined: true },
        global: { provide: { [GLOBAL_CONFIG_INJECTION_KEY as symbol]: { MazBtn: { variant: 'soft' } } } },
      })

      expect(wrapper.classes()).toContain('--outlined')
      expect(wrapper.classes()).not.toContain('--pastel')
    })
  })

  describe('when a MazBtn sets no fill prop', () => {
    it('then the global variant applies', () => {
      const wrapper = mount(MazBtn, {
        global: { provide: { [GLOBAL_CONFIG_INJECTION_KEY as symbol]: { MazBtn: { variant: 'soft' } } } },
      })

      expect(wrapper.classes()).toContain('--pastel')
    })
  })
})
