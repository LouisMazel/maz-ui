export interface SectionMetadata {
  title: string
  level: number
  content: string
}

export interface DocumentMetadata {
  name: string
  displayName: string
  type: string
  description: string
  tags: string[]
  props?: string[]
  slots?: string[]
  events?: string[]
  sections: SectionMetadata[]
}

interface FrontmatterData {
  title?: string
  description?: string
}

export class MetadataExtractor {
  extract(name: string, type: string, content: string, manualTags: string[] = []): DocumentMetadata {
    const frontmatter = this.extractFrontmatter(content)
    const sections = this.extractSections(content)
    const props = this.extractProps(content)
    const slots = this.extractSlots(content)
    const events = this.extractEvents(content)

    const displayName = frontmatter.title ?? this.nameToDisplayName(name)
    const description = frontmatter.description ?? this.extractFirstParagraph(content)

    const extractedTags = this.buildTags(name, displayName, props, slots, events)
    const tags = this.mergeTags(manualTags, extractedTags)

    return {
      name,
      displayName,
      type,
      description,
      tags,
      ...(props.length > 0 && { props }),
      ...(slots.length > 0 && { slots }),
      ...(events.length > 0 && { events }),
      sections,
    }
  }

  extractFrontmatter(content: string): FrontmatterData {
    const match = content.match(/^---\n([\s\S]*?)\n---/)
    if (!match) {
      return {}
    }

    const result: FrontmatterData = {}
    const yaml = match[1]

    for (const line of yaml.split('\n')) {
      const trimmed = line.trim()
      if (trimmed.startsWith('title:')) {
        result.title = trimmed.slice('title:'.length).trim()
      }
      else if (trimmed.startsWith('description:')) {
        result.description = trimmed.slice('description:'.length).trim()
      }
    }

    return result
  }

  extractSections(content: string): SectionMetadata[] {
    const sections: SectionMetadata[] = []
    const contentWithoutFrontmatter = this.stripFrontmatter(content)
    const lines = contentWithoutFrontmatter.split('\n')

    let currentSection: { title: string, level: number, contentLines: string[] } | undefined
    const flushSection = (): void => {
      if (currentSection) {
        const sectionContent = currentSection.contentLines.join('\n').trim()
        sections.push({
          title: currentSection.title,
          level: currentSection.level,
          content: this.extractSectionLeadText(sectionContent),
        })
      }
    }

    for (const line of lines) {
      const headingMatch = line.match(/^(#{2,3}) +(\S.*)$/)
      if (headingMatch) {
        flushSection()
        currentSection = {
          level: headingMatch[1].length,
          title: this.cleanHeadingText(headingMatch[2]),
          contentLines: [],
        }
      }
      else if (currentSection) {
        currentSection.contentLines.push(line)
      }
    }

    flushSection()
    return sections
  }

  extractProps(content: string): string[] {
    return this.extractTableColumn(content, 'Props', 'Name')
  }

  extractSlots(content: string): string[] {
    return this.extractTableColumn(content, 'Slots', 'Name')
  }

  extractEvents(content: string): string[] {
    return this.extractTableColumn(content, 'Events', 'Event name')
  }

  mergeTags(manualTags: string[], extractedTags: string[]): string[] {
    const tagSet = new Set<string>()
    for (const tag of manualTags) {
      tagSet.add(tag.toLowerCase())
    }
    for (const tag of extractedTags) {
      tagSet.add(tag.toLowerCase())
    }
    return Array.from(tagSet)
  }

  private extractTableColumn(content: string, sectionName: string, columnName: string): string[] {
    const sectionRegex = new RegExp(`## ${sectionName} *\\n`, 'i')
    const sectionMatch = content.match(sectionRegex)
    if (!sectionMatch || sectionMatch.index === undefined) {
      return []
    }

    const afterSection = content.slice(sectionMatch.index + sectionMatch[0].length)
    const lines = afterSection.split('\n')

    const headerLine = lines.find(l => l.includes('|') && l.toLowerCase().includes(columnName.toLowerCase()))
    if (!headerLine) {
      return []
    }

    const headerIndex = lines.indexOf(headerLine)
    const columns = headerLine.split('|').map(c => c.trim()).filter(Boolean)
    const nameColumnIndex = columns.findIndex(c => c.toLowerCase().includes(columnName.toLowerCase()))
    if (nameColumnIndex === -1) {
      return []
    }

    const results: string[] = []
    for (let i = headerIndex + 2; i < lines.length; i++) {
      const line = lines[i]
      if (!line.includes('|') || line.match(/^#{1,6}\s/)) {
        break
      }
      if (line.match(/^ *\|[-\s|]+\| *$/)) {
        continue
      }
      const cells = line.split('|').map(c => c.trim()).filter(Boolean)
      if (cells[nameColumnIndex]) {
        const name = cells[nameColumnIndex].replace(/\*\*/g, '').trim()
        if (name) {
          results.push(name)
        }
      }
    }

    return results
  }

  private stripFrontmatter(content: string): string {
    return content.replace(/^---\n[\s\S]*?\n---\n?/, '')
  }

  private cleanHeadingText(text: string): string {
    let result = this.removeTemplateTags(text)
    result = this.resolveMarkdownLinks(result)
    return result.trim()
  }

  private removeTemplateTags(text: string): string {
    let result = ''
    let i = 0
    while (i < text.length) {
      if (text[i] === '{' && text[i + 1] === '{') {
        const end = text.indexOf('}}', i + 2)
        i = end === -1 ? text.length : end + 2
      }
      else {
        result += text[i]
        i++
      }
    }
    return result
  }

  private resolveMarkdownLinks(text: string): string {
    let result = ''
    let i = 0
    while (i < text.length) {
      if (text[i] === '[') {
        const closeBracket = text.indexOf(']', i + 1)
        if (closeBracket !== -1 && text[closeBracket + 1] === '(') {
          const closeParen = text.indexOf(')', closeBracket + 2)
          if (closeParen !== -1) {
            result += text.slice(i + 1, closeBracket)
            i = closeParen + 1
            continue
          }
        }
      }
      result += text[i]
      i++
    }
    return result
  }

  private extractSectionLeadText(content: string): string {
    const lines = content.split('\n')
    const paragraphLines: string[] = []

    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed) {
        if (paragraphLines.length > 0) {
          break
        }
        continue
      }
      if (trimmed.startsWith('#') || trimmed.startsWith('<') || trimmed.startsWith('```') || trimmed.startsWith(':::') || trimmed.startsWith('|')) {
        if (paragraphLines.length > 0) {
          break
        }
        continue
      }
      paragraphLines.push(trimmed)
    }

    return paragraphLines.join(' ')
  }

  private extractFirstParagraph(content: string): string {
    const stripped = this.stripFrontmatter(content)
    const lines = stripped.split('\n')
    const paragraphLines: string[] = []

    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed) {
        if (paragraphLines.length > 0) {
          break
        }
        continue
      }
      if (trimmed.startsWith('#') || trimmed.startsWith('<') || trimmed.startsWith('```') || trimmed.startsWith(':::') || trimmed.startsWith('|') || trimmed.startsWith('{{')) {
        if (paragraphLines.length > 0) {
          break
        }
        continue
      }
      paragraphLines.push(trimmed)
    }

    return paragraphLines.join(' ')
  }

  private nameToDisplayName(name: string): string {
    return name
      .split('-')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join('')
  }

  private buildTags(name: string, displayName: string, props: string[], slots: string[], events: string[]): string[] {
    const tags: string[] = [name, displayName.toLowerCase()]

    for (const prop of props.slice(0, 10)) {
      tags.push(`prop:${prop}`)
    }
    for (const slot of slots.slice(0, 10)) {
      tags.push(`slot:${slot}`)
    }
    for (const event of events.slice(0, 10)) {
      tags.push(`event:${event}`)
    }

    return tags
  }
}
