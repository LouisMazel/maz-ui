import type { VueWrapper } from '@vue/test-utils'
import { axe } from 'vitest-axe'

type AxeRuleOverrides = Record<string, { enabled: boolean }>

/**
 * Rules that cannot run meaningfully under jsdom (no layout engine, no real
 * paint). `color-contrast` needs rendered pixels; `region` flags a component
 * mounted in isolation without a landmark wrapper. Everything else runs.
 */
const jsdomSafeRules: AxeRuleOverrides = {
  'color-contrast': { enabled: false },
  'region': { enabled: false },
}

function toElement(target: VueWrapper<any> | Element): Element {
  return target instanceof Element ? target : (target.element as Element)
}

/**
 * Runs axe-core against a mounted component (or a raw element) and returns the
 * audit results. Assert with the `toHaveNoViolations` matcher:
 *
 * ```ts
 * expect(await runAxe(wrapper)).toHaveNoViolations()
 * ```
 *
 * @param target A mounted `VueWrapper` or a DOM `Element`.
 * @param rules Per-rule overrides merged on top of the jsdom-safe defaults.
 */
export function runAxe(target: VueWrapper<any> | Element, rules: AxeRuleOverrides = {}) {
  return axe(toElement(target), { rules: { ...jsdomSafeRules, ...rules } })
}
