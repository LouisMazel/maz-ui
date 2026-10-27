import type { DocEntry } from '../knowledge/schema'

export interface MarkdownSection {
  title: string
  level: number
  start: number
  end: number
}

const FENCE = /^\s*(?:`{3,}|~{3,})/

export function stripFrontmatter(markdown: string): string {
  return markdown.replace(/^---\n[\s\S]*?\n---\n+/, '')
}

/** Rewrites relative links between bundle files (`../guide/vue.md#x`) to doc ids (`guide/vue#x`) */
export function linksToDocIds(markdown: string, doc: DocEntry): string {
  const base = doc.file.split('/').slice(0, -1)

  return markdown.replaceAll(/\]\((\.{1,2}\/[^)\s]+?\.md)(#[^)\s]*)?\)/g, (_, path: string, anchor = '') => {
    const parts = [...base]

    for (const segment of path.split('/')) {
      if (segment === '..')
        parts.pop()
      else if (segment !== '.')
        parts.push(segment)
    }

    const id = parts.join('/').replace(/\.md$/, '').replace(/\/index$/, '')

    return `](${id}${anchor})`
  })
}

export function listSections(markdown: string): MarkdownSection[] {
  const lines = markdown.split('\n')
  const sections: MarkdownSection[] = []
  let inFence = false

  for (const [index, line] of lines.entries()) {
    if (FENCE.test(line)) {
      inFence = !inFence
      continue
    }

    const match = !inFence && /^(#{2,4})\s+(\S.*)$/.exec(line)

    if (match)
      sections.push({ title: match[2].trim(), level: match[1].length, start: index, end: lines.length })
  }

  for (const [index, section] of sections.entries()) {
    const next = sections.slice(index + 1).find(candidate => candidate.level <= section.level)

    section.end = next ? next.start : lines.length
  }

  return sections
}

function normalize(value: string): string {
  return value.toLowerCase().replaceAll(/[^a-z\d]+/g, ' ').trim()
}

/** Finds the section whose title matches best (exact, then prefix, then contains) */
export function findSection(markdown: string, title: string): MarkdownSection | undefined {
  const sections = listSections(markdown)
  const wanted = normalize(title)

  return sections.find(section => normalize(section.title) === wanted)
    ?? sections.find(section => normalize(section.title).startsWith(wanted))
    ?? sections.find(section => normalize(section.title).includes(wanted))
}

export function sectionContent(markdown: string, section: MarkdownSection): string {
  return markdown.split('\n').slice(section.start, section.end).join('\n').trim()
}

export function outline(markdown: string): string {
  return listSections(markdown)
    .filter(section => section.level <= 3)
    .map(section => `${section.level === 3 ? '  ' : ''}- ${section.title}`)
    .join('\n')
}

export function truncateText(value: string, max: number): string {
  return value.length <= max ? value : `${value.slice(0, max - 3).trimEnd()}...`
}
