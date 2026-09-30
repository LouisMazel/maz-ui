/**
 * Append a "new" badge to a sidebar / navbar item label.
 * Rendered via VitePress `v-html` on `item.text` — styled in `theme/main.css`.
 */
export function withNewBadge(text: string): string {
  return `${text} <span class="docs-new-badge">new</span>`
}
