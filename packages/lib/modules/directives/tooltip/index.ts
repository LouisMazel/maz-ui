import { type DirectiveBinding, type ObjectDirective, type Plugin } from 'vue'

import './style.css'
import { type Color } from '../../../components/types'

type vTooltipColor = Exclude<Color, 'transparent'> | 'default' | 'light' | 'dark'

type vTooltipOptions = {
  position?: 'top' | 'bottom' | 'left' | 'right'
  color?: vTooltipColor
}

type vTooltipBindingValue =
  | string
  | ({
      text: string
      open?: boolean
    } & vTooltipOptions)

const defaultOptions: vTooltipOptions = {
  position: 'top',
}

export type TooltipBinding = DirectiveBinding<vTooltipBindingValue>

class TooltipHandler {
  options: vTooltipOptions

  constructor(options: vTooltipOptions = {}) {
    this.options = {
      ...defaultOptions,
      ...options,
    }
  }

  getPosition({ modifiers, value }: TooltipBinding): vTooltipOptions['position'] {
    if (modifiers.top) {
      return 'top'
    } else if (modifiers.bottom) {
      return 'bottom'
    } else if (modifiers.left) {
      return 'left'
    } else if (modifiers.right) {
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

  getColor({ value }: TooltipBinding): vTooltipColor {
    return typeof value === 'string' ? 'default' : value.color ?? 'default'
  }

  create(el: HTMLElement, binding: TooltipBinding) {
    el.setAttribute('data-tooltip', this.getText(binding))
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
} satisfies ObjectDirective<HTMLElement, vTooltipBindingValue>

const plugin = {
  install: (app, options = defaultOptions) => {
    const finalOptions = {
      ...defaultOptions,
      ...options,
    } satisfies vTooltipOptions

    const appInstance = new TooltipHandler(finalOptions)

    app.directive('tooltip', {
      beforeMount: appInstance.create.bind(appInstance),
      updated: appInstance.update.bind(appInstance),
      unmounted: appInstance.remove.bind(appInstance),
    })
  },
} satisfies Plugin<vTooltipOptions>

export {
  plugin as vTooltipInstall,
  directive as vTooltip,
  type vTooltipOptions,
  type vTooltipBindingValue,
  type vTooltipColor,
}
