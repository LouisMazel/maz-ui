import type { DirectiveBinding, ObjectDirective, Plugin } from 'vue'
import type { RevealEffect, RevealOptions } from '../utils/reveal.ts'
import { reveal, unreveal } from '../utils/reveal.ts'

export type { RevealEffect, RevealOptions as VRevealOptions }

/** An effect, its options, or `false` to turn the reveal off */
export type VRevealBindingValue = RevealEffect | RevealOptions | false | undefined

function apply(el: HTMLElement, binding: DirectiveBinding<VRevealBindingValue>) {
  if (binding.value === false) {
    unreveal(el, { restore: true })
    return
  }

  reveal(el, typeof binding.value === 'string' ? { effect: binding.value } : binding.value)
}

export type VRevealDirective = ObjectDirective<HTMLElement, VRevealBindingValue>

const directive: VRevealDirective = {
  mounted: apply,
  updated: apply,
  unmounted: el => unreveal(el),
}

const plugin: Plugin = {
  install: (app) => {
    app.directive('reveal', directive)
  },
}

export {
  directive as vReveal,
  plugin as vRevealInstall,
}

declare module 'vue' {
  interface GlobalDirectives {
    vReveal: VRevealDirective
  }
}
