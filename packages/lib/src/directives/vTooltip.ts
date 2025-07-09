import type { DirectiveBinding, ObjectDirective, Plugin } from 'vue'
import type { MazPopoverProps, PopoverPosition, PopoverTrigger } from '../components/MazPopover.vue'
import { h } from 'vue'
import MazPopover from '../components/MazPopover.vue'
import { useMountComponent } from '../composables/useMountComponent'

interface VTooltipOptions extends Partial<Omit<MazPopoverProps, 'modelValue'>> {
  /**
   * Text to display in the tooltip
   */
  text?: string
  /**
   * HTML content (alternative to text)
   */
  html?: string
  /**
   * Color variant of the tooltip
   * @default default
   */
  color?: MazPopoverProps['color']
  /**
   * Position of the tooltip
   * The preferred position is set to 'top' if no position is provided
   * @default undefined
   */
  position?: PopoverPosition
  /**
   * Trigger of the tooltip
   * @default hover
   */
  trigger?: PopoverTrigger
  /**
   * Close on click outside
   * @default false
   */
  closeOnClickOutside?: boolean
  /**
   * Close on escape
   * @default false
   */
  closeOnEscape?: boolean

  /**
   * Open the tooltip
   * @default false
   */
  open?: boolean
}

type VTooltipBindingValue
  = | string
    | VTooltipOptions

export type TooltipBinding = DirectiveBinding<VTooltipBindingValue, NonNullable<MazPopoverProps['position']>>

// Store pour garder les instances par élément
const tooltipInstances = new WeakMap<HTMLElement, {
  destroy: () => void
  popoverWrapper: HTMLElement
  cleanup: (shouldRestore?: boolean) => void
}>()

class TooltipHandler {
  private defaultProps: Partial<VTooltipOptions>

  constructor(options: Partial<VTooltipOptions> = {}) {
    this.defaultProps = {
      open: false,
      positionDelay: 0,
      preferPosition: 'top',
      trigger: 'hover',
      role: 'tooltip',
      closeOnClickOutside: false,
      closeOnEscape: false,
      color: 'contrast',
      ...options,
    }
  }

  private getPopoverProps(binding: TooltipBinding) {
    const baseOptions = { ...this.defaultProps }

    if (typeof binding.value === 'string') {
      return {
        ...baseOptions,
        text: binding.value,
        position: this.getPositionFromModifiers(binding) || baseOptions.position as PopoverPosition,
      } satisfies VTooltipOptions
    }

    return {
      ...baseOptions,
      ...binding.value,
      position: this.getPositionFromModifiers(binding) || binding.value.position || baseOptions.position as PopoverPosition,
    } satisfies VTooltipOptions
  }

  private getPositionFromModifiers(binding: TooltipBinding): PopoverPosition | undefined {
    if (binding.modifiers.top)
      return 'top'
    if (binding.modifiers.bottom)
      return 'bottom'
    if (binding.modifiers.left)
      return 'left'
    if (binding.modifiers.right)
      return 'right'
    if (binding.modifiers['top-start'])
      return 'top-start'
    if (binding.modifiers['top-end'])
      return 'top-end'
    if (binding.modifiers['bottom-start'])
      return 'bottom-start'
    if (binding.modifiers['bottom-end'])
      return 'bottom-end'
    if (binding.modifiers['left-start'])
      return 'left-start'
    if (binding.modifiers['left-end'])
      return 'left-end'
    if (binding.modifiers['right-start'])
      return 'right-start'
    if (binding.modifiers['right-end'])
      return 'right-end'
    if (binding.modifiers.auto)
      return 'auto'

    return undefined
  }

  mount(el: HTMLElement, binding: TooltipBinding) {
    this.unmount(el)

    const props = this.getPopoverProps(binding)

    if (!props.text && !props.html) {
      console.warn('[maz-ui](vTooltip) No text or html content provided')
      return
    }

    const popoverWrapper = document.createElement('div')
    popoverWrapper.classList.add('m-tooltip-wrapper')
    popoverWrapper.style.display = 'inline-flex'

    if (el.parentNode) {
      el.parentNode.replaceChild(popoverWrapper, el)
    }

    const popoverProps = {
      ...props,
      panelClass: ['m-tooltip-panel', 'maz-text-sm', 'maz-whitespace-pre-wrap', 'maz-break-words', 'maz-p-2', 'maz-max-w-xs', props.panelClass].filter(Boolean).join(' '),
      modelValue: props.open,
    } satisfies MazPopoverProps

    const { destroy } = useMountComponent<typeof MazPopover, MazPopoverProps>(MazPopover, {
      props: popoverProps,
      children: {
        trigger: () => h('div', {
          ref: (triggerDiv) => {
            if (triggerDiv && triggerDiv instanceof HTMLElement && !triggerDiv.contains(el)) {
              triggerDiv.replaceWith(el)
            }
          },
        }),
        default: () => {
          if (props.html) {
            return h('div', { innerHTML: props.html })
          }
          return props.text || ''
        },
      },
      element: popoverWrapper,
    })

    function cleanup(shouldRestore = true) {
      destroy()

      if (shouldRestore && popoverWrapper.parentNode) {
        try {
          popoverWrapper.parentNode.insertBefore(el, popoverWrapper)
          popoverWrapper.parentNode.removeChild(popoverWrapper)
        }
        catch (error) {
          console.warn('[maz-ui](vTooltip) Failed to restore original element:', error)
        }
      }
    }

    tooltipInstances.set(el, {
      destroy,
      popoverWrapper,
      cleanup,
    })
  }

  update(el: HTMLElement, binding: TooltipBinding) {
    const instance = tooltipInstances.get(el)

    if (instance) {
      instance.cleanup(true)
      tooltipInstances.delete(el)
    }

    this.mount(el, binding)
  }

  unmount(el: HTMLElement) {
    const instance = tooltipInstances.get(el)

    if (instance) {
      instance.cleanup(false)
      tooltipInstances.delete(el)
    }
  }
}

let globalHandler: TooltipHandler

const directive = {
  mounted(el: HTMLElement, binding: TooltipBinding) {
    if (!globalHandler) {
      globalHandler = new TooltipHandler()
    }
    return globalHandler.mount(el, binding)
  },

  updated(el: HTMLElement, binding: TooltipBinding) {
    if (!globalHandler) {
      globalHandler = new TooltipHandler()
    }
    return globalHandler.update(el, binding)
  },

  unmounted(el: HTMLElement) {
    if (globalHandler) {
      globalHandler.unmount(el)
    }
  },
} satisfies ObjectDirective<HTMLElement, VTooltipBindingValue, NonNullable<MazPopoverProps['position']>>

const plugin = {
  install: (app, options: Partial<VTooltipOptions> = {}) => {
    const handler = new TooltipHandler(options)

    app.directive('tooltip', {
      beforeMount: handler.mount.bind(handler),
      updated: handler.update.bind(handler),
      unmounted: handler.unmount.bind(handler),
    })
  },
} satisfies Plugin<Partial<VTooltipOptions>>

export {
  directive as vTooltip,
  type VTooltipBindingValue,
  plugin as vTooltipInstall,
  type VTooltipOptions,
}
