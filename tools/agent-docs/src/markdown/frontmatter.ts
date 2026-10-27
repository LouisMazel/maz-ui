import { parse } from 'yaml'

export interface Frontmatter {
  title?: string
  description?: string
  layout?: string
  [key: string]: unknown
}

export interface ParsedMarkdown {
  frontmatter: Frontmatter
  body: string
}

const FRONTMATTER_REGEX = /^---\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)/

export function parseFrontmatter(source: string): ParsedMarkdown {
  const match = FRONTMATTER_REGEX.exec(source)

  if (!match) {
    return { frontmatter: {}, body: source }
  }

  const data = parse(match[1]) as unknown

  return {
    frontmatter: data && typeof data === 'object' ? data as Frontmatter : {},
    body: source.slice(match[0].length),
  }
}

export function stringifyFrontmatter(data: Record<string, string | string[] | undefined>): string {
  const lines = ['---']

  for (const [key, value] of Object.entries(data)) {
    if (value === undefined)
      continue

    if (Array.isArray(value)) {
      lines.push(`${key}:`)
      for (const item of value) {
        lines.push(`  - ${quoteYaml(item)}`)
      }
    }
    else {
      lines.push(`${key}: ${quoteYaml(value)}`)
    }
  }

  lines.push('---')

  return lines.join('\n')
}

function quoteYaml(value: string): string {
  return JSON.stringify(value)
}
