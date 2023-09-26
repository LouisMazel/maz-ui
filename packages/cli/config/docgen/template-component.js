// @ts-check

// eslint-disable-next-line sonarjs/cognitive-complexity
module.exports = function component(
  renderedUsage,
  document_,
  config,
  fileName,
  requiresMd,
  { isSubComponent, hasSubComponents },
) {
  const { description, tags, functional } = document_

  const { deprecated, author, since, version, see, link } = tags || {}

  const hasEvents = !!renderedUsage.events
  const hasSlots = !!renderedUsage.slots

  return `
  ${!hasEvents && !hasSlots ? '## Component informations' : '## Props'}${
    hasEvents && hasSlots ? ', ' : hasSlots || hasEvents ? ' & ' : ''
  } ${hasEvents ? 'Event' : ''} ${hasEvents && hasSlots ? '& ' : ''}${hasSlots ? 'Slots' : ''}

  ${deprecated ? `> **Deprecated** ${deprecated[0].description}\n` : ''}
  ${description ? '> ' + description : ''}

  ${functional ? renderedUsage.functionalTag : ''}
  ${author ? author.map((a) => `Author: ${a.description}\n`) : ''}
  ${since ? `Since: ${since[0].description}\n` : ''}
  ${version ? `Version: ${version[0].description}\n` : ''}
  ${see ? see.map((s) => `[See](${s.description})\n`) : ''}
  ${link ? link.map((l) => `[See](${l.description})\n`) : ''}
  ${renderedUsage.props ? `#${renderedUsage.props?.trim()}` : ''}
  ${renderedUsage.methods ? `#${renderedUsage.methods?.trim()}` : ''}
  ${renderedUsage.events ? `#${renderedUsage.events?.trim()}` : ''}
  ${renderedUsage.slots ? `#${renderedUsage.slots?.trim()}` : ''}
  ${renderedUsage.expose ? `#${renderedUsage.expose?.trim()}` : ''}
  ${
    requiresMd.length > 0
      ? '---\n' + requiresMd.map((component) => component.content).join('\n---\n')
      : ''
  }
  `
}
