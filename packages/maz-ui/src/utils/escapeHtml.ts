const ESCAPES: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', '\'': '&#39;' }

const NAMED_ENTITIES: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', apos: '\'', nbsp: ' ' }

export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, char => ESCAPES[char])
}

export function unescapeHtml(value: string): string {
  return value.replace(/&(#x[\da-f]+|#\d+|[a-z]+);/gi, (entity, code: string) => {
    if (code[0] !== '#')
      return NAMED_ENTITIES[code.toLowerCase()] ?? entity
    const point = code[1].toLowerCase() === 'x' ? Number.parseInt(code.slice(2), 16) : Number.parseInt(code.slice(1), 10)
    return point > 0 && point <= 0x10FFFF ? String.fromCodePoint(point) : entity
  })
}
