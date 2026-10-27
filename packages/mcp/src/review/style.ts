import type { ReviewContext } from './types'

import { checkClassList } from './classes'

const COLOR_LITERAL = /#[\da-f]{3,8}\b|\b(?:rgba?|hsla?|oklch|oklab|lab|lch)\(/i
const COLOR_PROPERTIES = /^(?:color|background(?:-color)?|border(?:-[a-z]+)*-color|border(?:-(?:top|right|bottom|left|inline|block)(?:-(?:start|end))?)?|outline(?:-color)?|fill|stroke|box-shadow|text-shadow|caret-color|accent-color|text-decoration-color|column-rule-color)$/

function blankComments(css: string): string {
  return css.replaceAll(/\/\*[\s\S]*?\*\//g, match => match.replaceAll(/[^\n]/g, ' '))
}

/** Checks `property: value` declarations (style attribute or CSS rules) for hard-coded colors */
export function checkStyleDeclarations(css: string, offset: number, context: ReviewContext): void {
  for (const match of css.matchAll(/(^|[;{\s])([a-z-]+)\s*:\s*([^;{}]+)/g)) {
    const [, prefix, property, value] = match

    if (property.startsWith('--') || !COLOR_PROPERTIES.test(property) || /var\(--/.test(value))
      continue

    const color = COLOR_LITERAL.exec(value)

    if (color) {
      context.report({
        rule: 'hardcoded-color',
        severity: 'warning',
        message: `\`${property}\` uses a hard-coded color (\`${color[0].replace('(', '')}\`): it ignores the theme and dark mode.`,
        suggestion: 'Use a theme variable: `var(--maz-primary)`, `var(--maz-surface)`, `var(--maz-foreground)`, `var(--maz-muted)`, `var(--maz-divider)`... (`color-mix(in oklab, var(--maz-primary) 20%, transparent)` for tints).',
      }, offset + (match.index ?? 0) + prefix.length)
    }
  }
}

export function reviewStyle(source: string, offset: number, context: ReviewContext, { sfc = false } = {}): void {
  const css = blankComments(source)
  const applies = [...css.matchAll(/@apply\s+([^;]+);/g)]

  for (const apply of applies) {
    checkClassList(apply[1], offset + (apply.index ?? 0) + apply[0].indexOf(apply[1]), context)
  }

  if (sfc && applies.length > 0 && !/@reference\s/.test(css)) {
    context.report({
      rule: 'missing-reference',
      severity: 'error',
      message: '`@apply` in a Vue SFC `<style>` block needs a `@reference` to your Tailwind entry with Tailwind v4.',
      suggestion: 'Start the block with `@reference "<relative path to your Tailwind entry css>";`.',
    }, offset + (applies[0].index ?? 0))
  }

  const withoutThemeBlocks = css.replaceAll(/@theme[^{]*\{[^}]*\}/g, match => match.replaceAll(/[^\n]/g, ' '))

  checkStyleDeclarations(withoutThemeBlocks, offset, context)
}
