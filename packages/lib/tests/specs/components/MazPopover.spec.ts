import type { MazPopoverProps } from '@components/MazPopover.vue'
import type { MazColor } from '@/components/types'
import MazPopover from '@components/MazPopover.vue'
import { mount } from '@vue/test-utils'
import { getColor } from '@/components/types'

describe('given MazPopover component', () => {
  describe('when rendered with default props', () => {
    it('then it should render with default configuration', () => {
      const wrapper = mount(MazPopover, {
        slots: {
          trigger: '<button>Click me</button>',
          default: '<div>Popover content</div>',
        },
      })

      expect(wrapper.find('.m-popover').exists()).toBe(true)
      expect(wrapper.find('.m-popover-trigger').exists()).toBe(true)
      expect(wrapper.find('.m-popover-trigger').html()).toContain('<button>Click me</button>')
    })
  })

  describe('when rendered with modelValue true', () => {
    it('then it should show the popover panel', () => {
      const wrapper = mount(MazPopover, {
        props: { modelValue: true },
        slots: {
          trigger: '<button>Click me</button>',
          default: '<div>Popover content</div>',
        },
      })

      expect(wrapper.find('.m-popover-panel').exists()).toBe(true)
      expect(wrapper.find('.m-popover-panel').html()).toContain('<div>Popover content</div>')
    })
  })

  describe('when rendered with different positions', () => {
    it('then it should apply the correct position classes', () => {
      const positions: MazPopoverProps['position'][] = ['top', 'bottom', 'left', 'right', 'top-start', 'bottom-end']

      positions.forEach((position) => {
        const wrapper = mount(MazPopover, {
          props: {
            modelValue: true,
            position,
          },
          slots: {
            trigger: '<button>Click me</button>',
            default: '<div>Content</div>',
          },
        })

        expect(wrapper.find('.m-popover-panel').classes()).toContain(`--position-${position}`)
      })
    })
  })

  describe('when rendered with different colors', () => {
    it.each(
      ['primary', 'secondary', 'accent', 'info', 'success', 'warning', 'destructive', 'contrast', 'background'] as MazColor[],
    )('then it should apply the correct color classes', (color) => {
      const wrapper = mount(MazPopover, {
        props: {
          modelValue: true,
          color,
        },
        slots: {
          trigger: '<button>Click me</button>',
          default: '<div>Content</div>',
        },
      })

      const panel = wrapper.find('.m-popover-panel')

      expect(panel.classes()).toContain(`--${getColor(color)}`)
    })
  })

  describe('when rendered with different triggers', () => {
    it('then it should handle click trigger', () => {
      const wrapper = mount(MazPopover, {
        props: { trigger: 'click' },
        slots: {
          trigger: '<button>Click me</button>',
          default: '<div>Content</div>',
        },
      })

      const trigger = wrapper.find('.m-popover-trigger')
      expect(trigger.exists()).toBe(true)
    })

    it('then it should handle hover trigger', () => {
      const wrapper = mount(MazPopover, {
        props: { trigger: 'hover' },
        slots: {
          trigger: '<button>Hover me</button>',
          default: '<div>Content</div>',
        },
      })

      const trigger = wrapper.find('.m-popover-trigger')
      expect(trigger.exists()).toBe(true)
    })

    it('then it should handle manual trigger', () => {
      const wrapper = mount(MazPopover, {
        props: { trigger: 'manual' },
        slots: {
          trigger: '<button>Manual</button>',
          default: '<div>Content</div>',
        },
      })

      const trigger = wrapper.find('.m-popover-trigger')
      expect(trigger.exists()).toBe(true)
    })
  })

  describe('when rendered with different roles', () => {
    it.each(['dialog', 'tooltip', 'menu'] as MazPopoverProps['role'][])('then it should apply the correct role attribute', (role) => {
      const wrapper = mount(MazPopover, {
        props: {
          modelValue: true,
          role,
        },
        slots: {
          trigger: '<button>Click me</button>',
          default: '<div>Content</div>',
        },
      })

      expect(wrapper.find('.m-popover-panel').attributes('role')).toBe(role)
    })
  })

  describe('when rendered with disabled prop', () => {
    it('then it should apply disabled class', () => {
      const wrapper = mount(MazPopover, {
        props: { disabled: true },
        slots: {
          trigger: '<button>Click me</button>',
          default: '<div>Content</div>',
        },
      })

      expect(wrapper.find('.m-popover').classes()).toContain('--disabled')
    })
  })

  describe('when rendered with block prop', () => {
    it('then it should apply block class', () => {
      const wrapper = mount(MazPopover, {
        props: { block: true },
        slots: {
          trigger: '<button>Click me</button>',
          default: '<div>Content</div>',
        },
      })

      expect(wrapper.find('.m-popover').classes()).toContain('--block')
    })
  })

  describe('when rendered with custom aria attributes', () => {
    it('then it should apply aria-label', () => {
      const wrapper = mount(MazPopover, {
        props: {
          modelValue: true,
          ariaLabel: 'Custom aria label',
        },
        slots: {
          trigger: '<button>Click me</button>',
          default: '<div>Content</div>',
        },
      })

      expect(wrapper.find('.m-popover-panel').attributes('aria-label')).toBe('Custom aria label')
    })

    it('then it should apply aria-labelledby', () => {
      const wrapper = mount(MazPopover, {
        props: {
          modelValue: true,
          ariaLabelledby: 'custom-label',
        },
        slots: {
          trigger: '<button>Click me</button>',
          default: '<div>Content</div>',
        },
      })

      expect(wrapper.find('.m-popover-panel').attributes('aria-labelledby')).toContain('custom-label')
    })

    it('then it should apply aria-describedby', () => {
      const wrapper = mount(MazPopover, {
        props: {
          modelValue: true,
          ariaDescribedby: 'custom-description',
        },
        slots: {
          trigger: '<button>Click me</button>',
          default: '<div>Content</div>',
        },
      })

      expect(wrapper.find('.m-popover-panel').attributes('aria-describedby')).toBe('custom-description')
    })
  })

  describe('when rendered with custom offset', () => {
    it('then it should accept custom offset value', () => {
      const wrapper = mount(MazPopover, {
        props: {
          modelValue: true,
          offset: 16,
        },
        slots: {
          trigger: '<button>Click me</button>',
          default: '<div>Content</div>',
        },
      })

      expect(wrapper.find('.m-popover-panel').exists()).toBe(true)
    })
  })

  describe('when rendered with custom delay', () => {
    it('then it should accept custom delay value', () => {
      const wrapper = mount(MazPopover, {
        props: {
          delay: 500,
        },
        slots: {
          trigger: '<button>Click me</button>',
          default: '<div>Content</div>',
        },
      })

      expect(wrapper.find('.m-popover-trigger').exists()).toBe(true)
    })
  })

  describe('when rendered with custom transition', () => {
    it('then it should use custom transition name', () => {
      const wrapper = mount(MazPopover, {
        props: {
          modelValue: true,
          transition: 'custom-transition',
        },
        slots: {
          trigger: '<button>Click me</button>',
          default: '<div>Content</div>',
        },
        global: {
          stubs: {
            Transition: true,
          },
        },
      })

      const transition = wrapper.findComponent({ name: 'Transition' })
      expect(transition.props('name')).toBe('custom-transition')
    })
  })

  describe('when rendered with custom teleport target', () => {
    it('then it should use custom teleport target', () => {
      const wrapper = mount(MazPopover, {
        props: {
          modelValue: true,
          teleportTo: '#custom-target',
        },
        slots: {
          trigger: '<button>Click me</button>',
          default: '<div>Content</div>',
        },
      })

      const teleport = wrapper.findComponent({ name: 'Teleport' })

      expect(teleport.attributes('to')).toBe('#custom-target')
    })
  })

  describe('when rendered with custom panel classes', () => {
    it('then it should apply custom panel classes', () => {
      const wrapper = mount(MazPopover, {
        props: {
          modelValue: true,
          panelClass: 'custom-panel-class',
        },
        slots: {
          trigger: '<button>Click me</button>',
          default: '<div>Content</div>',
        },
      })

      expect(wrapper.find('.m-popover-panel').classes()).toContain('custom-panel-class')
    })

    it('then it should apply custom overlay classes', () => {
      const wrapper = mount(MazPopover, {
        props: {
          modelValue: true,
          overlayClass: 'custom-overlay-class',
        },
        slots: {
          trigger: '<button>Click me</button>',
          default: '<div>Content</div>',
        },
      })

      expect(wrapper.find('.m-popover-panel').classes()).toContain('custom-overlay-class')
    })
  })

  describe('when rendered with custom panel style', () => {
    it('then it should apply custom panel style', () => {
      const wrapper = mount(MazPopover, {
        props: {
          modelValue: true,
          panelStyle: { backgroundColor: 'red' },
        },
        slots: {
          trigger: '<button>Click me</button>',
          default: '<div>Content</div>',
        },
      })

      expect(wrapper.find('.m-popover-panel').attributes('style')).toContain('background-color: red')
    })
  })

  describe('when closed', () => {
    it('then it should not render the panel', () => {
      const wrapper = mount(MazPopover, {
        props: { modelValue: false },
        slots: {
          trigger: '<button>Click me</button>',
          default: '<div>Content</div>',
        },
      })

      expect(wrapper.find('.m-popover-panel').exists()).toBe(false)
    })
  })

  describe('when trigger slot provides scope', () => {
    it('then it should provide helper functions to trigger slot', () => {
      const wrapper = mount(MazPopover, {
        slots: {
          trigger: '<button>Click me</button>',
          default: '<div>Content</div>',
        },
      })

      const trigger = wrapper.find('.m-popover-trigger')
      expect(trigger.exists()).toBe(true)
    })
  })

  describe('when default slot provides scope', () => {
    it('then it should provide helper functions to default slot', () => {
      const wrapper = mount(MazPopover, {
        props: { modelValue: true },
        slots: {
          trigger: '<button>Click me</button>',
          default: '<div>Content</div>',
        },
      })

      const panel = wrapper.find('.m-popover-panel')
      expect(panel.exists()).toBe(true)
    })
  })

  describe('when rendered with announceChanges', () => {
    it('then it should set aria-live attribute', () => {
      const wrapper = mount(MazPopover, {
        props: {
          modelValue: true,
          announceChanges: true,
        },
        slots: {
          trigger: '<button>Click me</button>',
          default: '<div>Content</div>',
        },
      })

      expect(wrapper.find('.m-popover-panel').attributes('aria-live')).toBe('polite')
    })
  })
})
