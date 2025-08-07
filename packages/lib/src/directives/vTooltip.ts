import type { DirectiveBinding, ObjectDirective, Plugin } from 'vue'
import type { MazPopoverPosition, MazPopoverProps, MazPopoverTrigger } from '../components/MazPopover.vue'
import { h, nextTick, ref, watch } from 'vue'
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
   * @default contrast
   */
  color?: MazPopoverProps['color']
  /**
   * Position of the tooltip
   * The preferred position is set to 'top' if no position is provided
   * @default top
   */
  position?: MazPopoverPosition
  /**
   * Trigger of the tooltip
   * @default hover
   */
  trigger?: MazPopoverTrigger
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

type VTooltipBindingValue = string | VTooltipOptions

export type TooltipBinding = DirectiveBinding<VTooltipBindingValue, NonNullable<MazPopoverProps['position']>>

// Store instances by element
const tooltipInstances = new WeakMap<HTMLElement, {
  destroy: () => void
  updateProps: (props: VTooltipOptions) => void
  isOpen: ReturnType<typeof ref<boolean>>
}>()

class TooltipHandler {
  private defaultProps: Partial<VTooltipOptions>

  constructor(options: Partial<VTooltipOptions> = {}) {
    this.defaultProps = {
      open: false,
      position: 'top',
      trigger: 'hover',
      role: 'tooltip',
      closeOnClickOutside: false,
      closeOnEscape: false,
      color: 'contrast',
      ...options,
    }
  }

  private getTooltipProps(binding: TooltipBinding): VTooltipOptions {
    const baseOptions = { ...this.defaultProps }

    if (typeof binding.value === 'string') {
      return {
        ...baseOptions,
        text: binding.value,
        position: this.getPositionFromModifiers(binding) || baseOptions.position || 'top',
      }
    }

    return {
      ...baseOptions,
      ...binding.value,
      position: this.getPositionFromModifiers(binding) || binding.value.position || baseOptions.position || 'top',
    }
  }

  private getPositionFromModifiers(binding: TooltipBinding) {
    const modifiers = Object.keys(binding.modifiers)
    const validPositions: MazPopoverPosition[] = [
      'top',
      'bottom',
      'left',
      'right',
      'top-start',
      'top-end',
      'bottom-start',
      'bottom-end',
      'left-start',
      'left-end',
      'right-start',
      'right-end',
      'auto',
    ]

    for (const modifier of modifiers) {
      if (validPositions.includes(modifier as MazPopoverPosition)) {
        return modifier as MazPopoverPosition
      }
    }

    return undefined
  }

  mount(el: HTMLElement, binding: TooltipBinding) {
    // this.unmount(el)

    const tooltipProps = this.getTooltipProps(binding)

    if (!tooltipProps.text && !tooltipProps.html) {
      console.warn('[maz-ui](vTooltip) No text or html content provided')
      return
    }

    // Create reactive state for the tooltip
    const isOpen = ref(!!tooltipProps.open)

    let vNodeInstance: ReturnType<typeof useMountComponent> | null = null

    const createTooltip = () => {
      const popoverProps: MazPopoverProps & { onAfterCloseAnimation?: () => void } = {
        ...tooltipProps,
        panelClass: [
          'm-tooltip-panel',
          'maz-text-sm',
          'maz-whitespace-pre-wrap',
          'maz-break-words',
          'maz-p-2',
          'maz-max-w-xs',
          tooltipProps.panelClass,
        ].filter(Boolean).join(' '),
        modelValue: isOpen.value,
        positionReference: el,
        onAfterCloseAnimation: () => {
          vNodeInstance?.destroy()
          vNodeInstance = null
        },
      }

      // Create new instance
      vNodeInstance = useMountComponent<typeof MazPopover, MazPopoverProps>(MazPopover, {
        props: popoverProps,
        children: {
          default: () => {
            if (tooltipProps.html) {
              return h('div', { innerHTML: tooltipProps.html })
            }
            return tooltipProps.text || ''
          },
        },
        element: el,
      })
    }

    // Detect touch device for adaptive mode
    function isTouchDevice() {
      return 'ontouchstart' in globalThis || navigator.maxTouchPoints > 0
    }

    // Get effective trigger based on adaptive mode
    function getEffectiveTrigger() {
      if (tooltipProps.trigger === 'adaptive') {
        return isTouchDevice() ? 'click' : 'hover'
      }
      return tooltipProps.trigger || 'hover'
    }

    // Store event handlers for cleanup
    let mouseEnterHandler: (() => void) | null = null
    let mouseLeaveHandler: (() => void) | null = null
    let clickHandler: (() => void) | null = null

    // Setup event listeners on original element
    function setupTriggers() {
      // Clean up existing listeners
      cleanupTriggers()

      const effectiveTrigger = getEffectiveTrigger()

      if (effectiveTrigger === 'hover') {
        mouseEnterHandler = () => {
          isOpen.value = true
        }
        mouseLeaveHandler = () => {
          isOpen.value = false
        }
        el.addEventListener('mouseenter', mouseEnterHandler)
        el.addEventListener('mouseleave', mouseLeaveHandler)
      }
      else if (effectiveTrigger === 'click') {
        clickHandler = () => {
          isOpen.value = !isOpen.value
        }
        el.addEventListener('click', clickHandler)
      }
    }

    // Clean up event listeners
    function cleanupTriggers() {
      if (mouseEnterHandler) {
        el.removeEventListener('mouseenter', mouseEnterHandler)
        mouseEnterHandler = null
      }
      if (mouseLeaveHandler) {
        el.removeEventListener('mouseleave', mouseLeaveHandler)
        mouseLeaveHandler = null
      }
      if (clickHandler) {
        el.removeEventListener('click', clickHandler)
        clickHandler = null
      }
    }

    nextTick(() => {
      setupTriggers()
    })

    watch(isOpen, (value) => {
      if (value) {
        createTooltip()
      }
      else if (vNodeInstance) {
        const instance = vNodeInstance
        instance?.vNode.component?.exposed?.close()
      }
    }, { immediate: true })

    function destroy() {
      cleanupTriggers()
      if (vNodeInstance) {
        vNodeInstance.destroy()
        vNodeInstance = null
      }
    }

    function updateProps(newProps: VTooltipOptions) {
      const oldTrigger = tooltipProps.trigger
      Object.assign(tooltipProps, newProps)
      isOpen.value = !!newProps.open

      // If trigger changed, reconfigure event listeners
      if (oldTrigger !== newProps.trigger) {
        setupTriggers()
      }

      createTooltip()
    }

    tooltipInstances.set(el, {
      destroy,
      updateProps,
      isOpen,
    })
  }

  update(el: HTMLElement, binding: TooltipBinding) {
    const instance = tooltipInstances.get(el)

    if (instance) {
      const newProps = this.getTooltipProps(binding)
      instance.updateProps(newProps)
    }
    else {
      this.mount(el, binding)
    }
  }

  unmount(el: HTMLElement) {
    const instance = tooltipInstances.get(el)

    if (instance) {
      instance.destroy()
      tooltipInstances.delete(el)
    }
  }
}

let globalHandler: TooltipHandler

export type VTooltipDirective = ObjectDirective<HTMLElement, VTooltipBindingValue, NonNullable<MazPopoverProps['position']>>

const directive: VTooltipDirective = {
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
}

const plugin: Plugin<[Partial<VTooltipOptions>?]> = {
  install: (app, options) => {
    const handler = new TooltipHandler(options)

    app.directive('tooltip', {
      beforeMount: handler.mount.bind(handler),
      updated: handler.update.bind(handler),
      unmounted: handler.unmount.bind(handler),
    })
  },
}

export {
  directive as vTooltip,
  type VTooltipBindingValue,
  plugin as vTooltipInstall,
  type VTooltipOptions,
}

declare module 'vue' {
  interface GlobalDirectives {
    vTooltip: VTooltipDirective
  }
}
