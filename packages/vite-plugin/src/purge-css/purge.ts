import type { AtRule, ChildNode, Container, Node, Rule } from 'postcss'
import postcss from 'postcss'
import { getRequiredClasses, splitSelectorList } from './selectors'

/** The public utilities of `maz-ui/utilities.css` are compiled in this sub-layer of `utilities` */
export const PUBLIC_UTILITIES_LAYER = 'maz'

export interface PurgeDecision {
  /** `true` when the class belongs to maz-ui and the plugin decides whether it stays */
  isManaged: (className: string, inPublicLayer: boolean) => boolean
  /** `true` when a managed class is used by the app */
  isUsed: (className: string) => boolean
}

export interface PurgeResult {
  css: string
  /** The managed classes whose rules were removed */
  removed: Set<string>
}

function isInPublicLayer(rule: Rule): boolean {
  let node: Node | undefined = rule.parent

  while (node && node.type !== 'root') {
    if (node.type === 'atrule' && (node as AtRule).name === 'layer' && (node as AtRule).params.trim() === PUBLIC_UTILITIES_LAYER)
      return true
    node = node.parent
  }

  return false
}

function isInKeyframes(rule: Rule): boolean {
  return rule.parent?.type === 'atrule' && /keyframes$/i.test((rule.parent as AtRule).name)
}

/** Remove the at-rules (`@media`, `@layer`, `@supports`...) left without content, the statements (`@layer a, b;`) stay */
function removeEmptyAtRules(container: Container) {
  for (const node of [...container.nodes!] as ChildNode[]) {
    if (node.type !== 'atrule' || !node.nodes)
      continue

    removeEmptyAtRules(node)

    if (node.nodes.length === 0)
      node.remove()
  }
}

/**
 * Remove the selectors that need a managed class the app does not use, and the rules left without selector. A
 * selector list keeps its other selectors, the other CSS of the file is untouched.
 */
export function purgeCss(css: string, decision: PurgeDecision): PurgeResult {
  const root = postcss.parse(css)
  const removed = new Set<string>()
  let changed = false

  root.walkRules((rule) => {
    if (isInKeyframes(rule))
      return

    const inPublicLayer = isInPublicLayer(rule)
    const selectors = splitSelectorList(rule.selector)

    const kept = selectors.filter((selector) => {
      const unused = getRequiredClasses(selector).filter(className => decision.isManaged(className, inPublicLayer) && !decision.isUsed(className))
      for (const className of unused)
        removed.add(className)

      return unused.length === 0
    })

    if (kept.length === selectors.length)
      return

    changed = true

    if (kept.length === 0)
      rule.remove()
    else
      rule.selector = kept.join(',')
  })

  if (!changed)
    return { css, removed }

  removeEmptyAtRules(root)
  // Keep the `;` of a statement (`@layer a, b;`) left at the end of the file
  root.raws.semicolon = true

  return {
    css: root.toString(),
    removed,
  }
}
