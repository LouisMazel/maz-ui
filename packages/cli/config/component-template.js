/** @type {import('vue-docgen-cli').Templates['component']} */

// eslint-disable-next-line sonarjs/cognitive-complexity
export function component(renderedUsage, document_, _config, _fileName, requiresMd, _subs) {
  const { description, tags, functional } = document_
  const { deprecated, author, since, version, see, link } = tags || {}

  const hasEvents = !!renderedUsage.events
  const hasSlots = !!renderedUsage.slots
  const hasExpose = !!renderedUsage.expose

  const parts = []
  if (renderedUsage.props)
    parts.push('Props')
  if (hasEvents)
    parts.push('Events')
  if (hasSlots)
    parts.push('Slots')
  if (hasExpose)
    parts.push('Exposed methods')

  const title = parts.length > 0
    ? `## ${parts.join(', ')}`
    : '## Component API'

  return `
  ${title}

  ${deprecated ? `> **Deprecated** ${deprecated[0].title}\n` : ''}
  ${description ? `> ${description}` : ''}

  ${functional ? renderedUsage.functionalTag : ''}
  ${author ? author.map(a => `Author: ${a.title}\n`) : ''}
  ${since ? `Since: ${since[0].title}\n` : ''}
  ${version ? `Version: ${version[0].title}\n` : ''}
  ${see ? see.map(s => `[See](${s.title})\n`) : ''}
  ${link ? link.map(l => `[See](${l.title})\n`) : ''}
  ${renderedUsage.props ? `#${renderedUsage.props?.trim()}` : ''}
  ${renderedUsage.methods ? `#${renderedUsage.methods?.trim()}` : ''}
  ${renderedUsage.events ? `#${renderedUsage.events?.trim()}` : ''}
  ${renderedUsage.slots ? `#${renderedUsage.slots?.trim()}` : ''}
  ${renderedUsage.expose ? `#${renderedUsage.expose?.trim()}` : ''}
  ${requiresMd.length > 0
      ? `---\n${requiresMd.map(component => component.content).join('\n---\n')}`
      : ''
  }
  `
}
