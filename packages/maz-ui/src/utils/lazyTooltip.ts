import type { DirectiveBinding, ObjectDirective } from 'vue'
import type { VTooltipBindingValue } from '../directives/vTooltip.ts'

interface TooltipDirective {
  mounted: (el: HTMLElement, binding: DirectiveBinding<VTooltipBindingValue>) => void
  updated: (el: HTMLElement, binding: DirectiveBinding<VTooltipBindingValue>) => void
  unmounted: (el: HTMLElement) => void
}

let loading: Promise<TooltipDirective> | undefined

function loadTooltip() {
  loading ??= import('../directives/vTooltip.ts').then(module => module.vTooltip as unknown as TooltipDirective)
  return loading
}

/**
 * `v-tooltip` loaded on the first element that has a tooltip: a component using it does not
 * bundle the popover unless a tooltip is really rendered.
 */
export function createLazyTooltipDirective(): ObjectDirective<HTMLElement, VTooltipBindingValue> {
  const active = new WeakSet<HTMLElement>()

  async function mount(el: HTMLElement, binding: DirectiveBinding<VTooltipBindingValue>) {
    if (!binding.value)
      return
    const directive = await loadTooltip()
    if (!el.isConnected || active.has(el))
      return
    active.add(el)
    directive.mounted(el, binding)
  }

  return {
    mounted: mount,
    async updated(el, binding) {
      if (!active.has(el)) {
        await mount(el, binding)
        return
      }
      const directive = await loadTooltip()
      directive.updated(el, binding)
    },
    unmounted(el) {
      if (!active.has(el))
        return
      active.delete(el)
      loading?.then(directive => directive.unmounted(el))
    },
  }
}
