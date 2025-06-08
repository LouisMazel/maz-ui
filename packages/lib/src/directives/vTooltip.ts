import type { DirectiveBinding, ObjectDirective, Plugin } from 'vue'

import type { MazColor } from '../components/types'
import './vTooltip/style.css'

type VTooltipColor = Exclude<MazColor, 'transparent'> | 'default' | 'light' | 'dark'

interface VTooltipOptions {
  /**
   * Position of the tooltip
   * @default 'top'
   */
  position?: 'top' | 'bottom' | 'left' | 'right'
  /**
   * Color of the tooltip
   * @default 'default'
   */
  color?: VTooltipColor
}

type VTooltipBindingValue
  = | string
    | ({
    /**
     * Text to display in the tooltip
     * @default ''
     */
      text: string
      /**
       * Open the tooltip
       * @default false
       */
      open?: boolean
      /**
       * Offset of the tooltip
       * @default '1rem'
       */
      offset?: string
    } & VTooltipOptions)

const defaultOptions: VTooltipOptions = {
  position: 'top',
}

export type TooltipBinding = DirectiveBinding<VTooltipBindingValue>

class TooltipHandler {
  options: VTooltipOptions

  constructor(options: VTooltipOptions = {}) {
    this.options = {
      ...defaultOptions,
      ...options,
    }
  }

  getPosition({ modifiers, value }: TooltipBinding): VTooltipOptions['position'] {
    if (modifiers.top) {
      return 'top'
    }
    else if (modifiers.bottom) {
      return 'bottom'
    }
    else if (modifiers.left) {
      return 'left'
    }
    else if (modifiers.right) {
      return 'right'
    }

    return typeof value === 'string' ? 'top' : value.position ?? this.options.position
  }

  getText({ value }: TooltipBinding): string {
    return typeof value === 'string' ? value : value.text
  }

  getOpen({ value }: TooltipBinding): boolean {
    return typeof value === 'string' ? false : value.open ?? false
  }

  getColor({ value }: TooltipBinding): VTooltipColor {
    return typeof value === 'string' ? 'default' : value.color ?? 'default'
  }

  getOffset({ value }: TooltipBinding) {
    return typeof value === 'string' ? '1rem' : value.offset ?? '1rem'
  }

  create(el: HTMLElement, binding: TooltipBinding) {
    el.setAttribute('data-tooltip', this.getText(binding))
    const offset = this.getOffset(binding)
    if (offset) {
      el.style.setProperty('--tooltip-offset', offset)
    }
    el.classList.add('m-tooltip')

    const position = this.getPosition(binding)
    el.classList.add(`m-tooltip--${position}`)
    el.classList.add(`m-tooltip--${this.getColor(binding)}`)

    if (this.getOpen(binding)) {
      el.classList.add('m-tooltip--open')
    }
  }

  update(el: HTMLElement, binding: TooltipBinding) {
    this.remove(el, binding)
    this.create(el, binding)
  }

  remove(el: HTMLElement, binding: TooltipBinding) {
    el.removeAttribute('data-tooltip')
    el.classList.remove('m-tooltip')
    el.classList.remove('m-tooltip--top')
    el.classList.remove('m-tooltip--bottom')
    el.classList.remove('m-tooltip--left')
    el.classList.remove('m-tooltip--right')
    el.classList.remove('m-tooltip--open')
    el.classList.remove(`m-tooltip--${this.getColor(binding)}`)
  }
}

let instance: TooltipHandler

const directive = {
  beforeMount(el: HTMLElement, binding) {
    const options = typeof binding.value === 'object' ? binding.value : {}
    instance = new TooltipHandler(options)
    return instance.create(el, binding)
  },
  updated(el: HTMLElement, binding) {
    return instance.update(el, binding)
  },
  unmounted(el: HTMLElement, binding) {
    return instance.remove(el, binding)
  },
} satisfies ObjectDirective<HTMLElement, VTooltipBindingValue>

const plugin = {
  install: (app, options = defaultOptions) => {
    const finalOptions = {
      ...defaultOptions,
      ...options,
    } satisfies VTooltipOptions

    const appInstance = new TooltipHandler(finalOptions)

    app.directive('tooltip', {
      beforeMount: appInstance.create.bind(appInstance),
      updated: appInstance.update.bind(appInstance),
      unmounted: appInstance.remove.bind(appInstance),
    })
  },
} satisfies Plugin<VTooltipOptions>

export {
  directive as vTooltip,
  type VTooltipBindingValue,
  type VTooltipColor,
  plugin as vTooltipInstall,
  type VTooltipOptions,
}
