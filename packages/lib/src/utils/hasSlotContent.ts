import type { Slot, VNode } from 'vue'
import { Comment, Fragment, Text } from 'vue'

/**
 * Check if a slot renders meaningful content.
 *
 * `$slots.foo` is truthy as soon as the parent declares `<template #foo>`,
 * even when that template renders nothing (e.g. via `v-if="false"`).
 * This helper invokes the slot function and walks the returned VNodes
 * to detect whether any real DOM or component will be produced.
 *
 * For scoped slots that require bindings, the function falls back to
 * a simple existence check since they cannot be safely invoked without
 * the expected arguments.
 *
 * @example
 * ```vue
 * <div v-if="hasSlotContent($slots.footer)">
 *   <slot name="footer" />
 * </div>
 * ```
 */
export function hasSlotContent(slot: Slot | undefined): boolean {
  if (!slot)
    return false

  try {
    return hasContent(slot())
  }
  catch {
    // Scoped slots may throw when called without their expected bindings.
    // In that case, the slot is declared so we consider it as having content.
    return true
  }
}

function hasContent(vnodes: VNode[]): boolean {
  return vnodes.some((node) => {
    if (node.type === Comment)
      return false
    if (node.type === Text)
      return !!(node.children as string)?.trim()
    if (node.type === Fragment)
      return Array.isArray(node.children) && hasContent(node.children as VNode[])
    return true
  })
}
