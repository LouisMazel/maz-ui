import type { App, DirectiveBinding, ObjectDirective, Plugin } from 'vue'
import type { MazPopoverProps, PopoverPosition } from '../components/MazPopover.vue'
import { createApp, h, ref } from 'vue'
import MazPopover from '../components/MazPopover.vue'

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
   * @default 'default'
   */
  color?: MazPopoverProps['color']
}

type VTooltipBindingValue
  = | string
    | VTooltipOptions

export type TooltipBinding = DirectiveBinding<VTooltipBindingValue>

// Store pour garder les instances par élément
const tooltipInstances = new WeakMap<HTMLElement, {
  app: App
  wrapper: HTMLElement
  originalElement: HTMLElement
  cleanup: (isBeingDestroyed?: boolean) => void
}>()

class TooltipHandler {
  private defaultOptions: Partial<VTooltipOptions>

  constructor(options: Partial<VTooltipOptions> = {}) {
    this.defaultOptions = {
      position: 'top',
      trigger: 'hover',
      role: 'tooltip',
      transition: 'maz-popover',
      offset: 8,
      delay: 100,
      closeOnClickOutside: false,
      closeOnEscapeKey: false,
      color: 'default',
      ...options,
    }
  }

  private getOptions(binding: TooltipBinding): VTooltipOptions {
    const baseOptions = { ...this.defaultOptions }

    if (typeof binding.value === 'string') {
      return {
        ...baseOptions,
        text: binding.value,
        position: this.getPositionFromModifiers(binding) || baseOptions.position as PopoverPosition,
      }
    }

    return {
      ...baseOptions,
      ...binding.value,
      position: this.getPositionFromModifiers(binding) || binding.value.position || baseOptions.position as PopoverPosition,
    }
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

  create(el: HTMLElement, binding: TooltipBinding) {
    const options = this.getOptions(binding)

    if (!options.text && !options.html) {
      console.warn('[vTooltip] No text or html content provided')
      return
    }

    // Créer un wrapper qui va remplacer l'élément original dans le DOM
    const wrapper = document.createElement('div')
    wrapper.style.display = 'inline-block'
    wrapper.style.position = 'relative'
    // Cloner l'élément original
    const originalElement = el.cloneNode(true) as HTMLElement

    // Remplacer l'élément original par le wrapper dans le DOM
    if (el.parentNode) {
      el.parentNode.insertBefore(wrapper, el)
      el.parentNode.removeChild(el)
    }

    // État réactif pour contrôler l'ouverture du popover
    const isOpen = ref(false)

    let openTimeout: NodeJS.Timeout | null = null
    let closeTimeout: NodeJS.Timeout | null = null

    const clearOpenTimeout = () => {
      if (openTimeout) {
        clearTimeout(openTimeout)
        openTimeout = null
      }
    }

    const clearCloseTimeout = () => {
      if (closeTimeout) {
        clearTimeout(closeTimeout)
        closeTimeout = null
      }
    }

    const open = () => {
      if (options.disabled)
        return
      clearCloseTimeout()

      if (options.delay && options.delay > 0) {
        openTimeout = setTimeout(() => {
          isOpen.value = true
        }, options.delay)
      }
      else {
        isOpen.value = true
      }
    }

    const close = () => {
      clearOpenTimeout()

      if (options.delay && options.delay > 0 && options.trigger === 'hover') {
        closeTimeout = setTimeout(() => {
          isOpen.value = false
        }, options.delay)
      }
      else {
        isOpen.value = false
      }
    }

    // Créer une app Vue pour le popover
    const app = createApp({
      setup() {
        return { isOpen, originalElement, open, close }
      },
      render() {
        const popover = h(MazPopover, {
          'modelValue': isOpen.value,
          'onUpdate:modelValue': (value: boolean) => {
            isOpen.value = value
          },
          'position': options.position || 'top',
          'trigger': options.trigger || 'hover',
          'role': 'tooltip',
          'disabled': options.disabled || false,
          'offset': options.offset || 8,
          'delay': options.delay || 100,
          'transition': options.transition || 'maz-popover',
          'closeOnClickOutside': options.closeOnClickOutside || false,
          'closeOnEscapeKey': options.closeOnEscapeKey || false,
          'persistent': options.persistent || false,
          'color': options.color || 'default',
          'panelClass': ['m-tooltip-panel', options.panelClass].filter(Boolean).join(' '),
          'panelStyle': {
            maxWidth: '20rem',
            padding: '0.5rem 0.75rem',
            fontSize: '0.875rem',
            lineHeight: '1.4',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            ...options.panelStyle as Record<string, string> || {},
          },
          'ariaLabelledby': options.ariaLabelledby,
          'ariaDescribedby': options.ariaDescribedby,
        }, {
          trigger: () => h('div', {
            ref: (el) => {
              if (el && originalElement && el instanceof HTMLElement) {
                el.innerHTML = ''
                el.appendChild(originalElement)
              }
            },
          }),
          default: () => {
            if (options.html) {
              return h('div', { innerHTML: options.html })
            }
            return options.text || ''
          },
        })

        // watch(isOpen, (value) => {
        //   if (value) {
        //     setTimeout(() => {
        //       popover.component?.exposed?.updatePosition?.()
        //     }, 50)
        //   }
        // })

        return popover
      },
    })

    // Monter l'app sur le wrapper
    app.mount(wrapper)

    // Fonction de nettoyage
    const cleanup = (isBeingDestroyed = false) => {
      clearOpenTimeout()
      clearCloseTimeout()

      // Démonter l'app
      try {
        app.unmount()
      }
      catch (error) {
        // L'app peut déjà être démontée
        console.warn('Failed to unmount tooltip app:', error)
      }

      if (!isBeingDestroyed && wrapper.parentNode) {
        try {
          wrapper.parentNode.insertBefore(el, wrapper)
          wrapper.parentNode.removeChild(wrapper)
        }
        catch (error) {
          console.warn('Failed to restore original element:', error)
        }
      }
    }

    // Stocker l'instance
    tooltipInstances.set(el, {
      app,
      wrapper,
      originalElement,
      cleanup,
    })
  }

  update(el: HTMLElement, binding: TooltipBinding) {
    this.remove(el)
    this.create(el, binding)
  }

  remove(el: HTMLElement) {
    const instance = tooltipInstances.get(el)

    if (instance) {
      instance.cleanup(true)
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
    return globalHandler.create(el, binding)
  },

  updated(el: HTMLElement, binding: TooltipBinding) {
    if (!globalHandler) {
      globalHandler = new TooltipHandler()
    }
    return globalHandler.update(el, binding)
  },

  unmounted(el: HTMLElement) {
    if (globalHandler) {
      globalHandler.remove(el)
    }
  },
} satisfies ObjectDirective<HTMLElement, VTooltipBindingValue>

const plugin = {
  install: (app, options: Partial<VTooltipOptions> = {}) => {
    const handler = new TooltipHandler(options)

    app.directive('tooltip', {
      beforeMount: handler.create.bind(handler),
      updated: handler.update.bind(handler),
      unmounted: handler.remove.bind(handler),
    })
  },
} satisfies Plugin<Partial<VTooltipOptions>>

export {
  directive as vTooltip,
  type VTooltipBindingValue,
  plugin as vTooltipInstall,
  type VTooltipOptions,
}
