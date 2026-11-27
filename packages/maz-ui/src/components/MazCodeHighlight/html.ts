import type { ThemedToken } from 'shiki/core'
import { escapeHtml } from '../../utils/escapeHtml.ts'

export function tokenStyle(token: ThemedToken): string {
  if (token.htmlStyle)
    return Object.entries(token.htmlStyle).map(([key, value]) => `${key}:${value}`).join(';')
  const style: string[] = []
  if (token.color)
    style.push(`color:${token.color}`)
  if (token.bgColor)
    style.push(`background-color:${token.bgColor}`)
  const fontStyle = token.fontStyle ?? 0
  if (fontStyle & 1)
    style.push('font-style:italic')
  if (fontStyle & 2)
    style.push('font-weight:bold')
  const decorations = [
    fontStyle & 4
      ? 'underline'
      : '',
    fontStyle & 8
      ? 'line-through'
      : '',
  ].filter(Boolean)
  if (decorations.length > 0)
    style.push(`text-decoration:${decorations.join(' ')}`)
  return style.join(';')
}

/** The tokens of a line as styled spans. */
export function tokensHtml(tokens: ThemedToken[] = []): string {
  return tokens.map(token => `<span style="${escapeHtml(tokenStyle(token))}">${escapeHtml(token.content)}</span>`).join('')
}
