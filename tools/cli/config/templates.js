/* eslint-disable sonarjs/anchor-precedence */
/* eslint-disable sonarjs/no-nested-template-literals */
/* eslint-disable sonarjs/cognitive-complexity */

/** @type {import('vue-docgen-cli').Templates['component']} */

// eslint-disable-next-line complexity
export function component(renderedUsage, document_, _config, _fileName, requiresMd, _subs) {
  const { description, tags, functional } = document_
  const { deprecated, author, since, version, see, link } = tags || {}

  return `
  ${deprecated ? `> **Deprecated** ${deprecated[0].title}\n` : ''}
  ${description ? `> ${description}` : ''}

  ${functional ? renderedUsage.functionalTag : ''}
  ${author ? author.map(a => `Author: ${a.title}\n`) : ''}
  ${since ? `Since: ${since[0].title}\n` : ''}
  ${version ? `Version: ${version[0].title}\n` : ''}
  ${see ? see.map(s => `[See](${s.title})\n`) : ''}
  ${link ? link.map(l => `[See](${l.title})\n`) : ''}
  ${renderedUsage.props ? `${renderedUsage.props?.trim()}` : ''}
  ${renderedUsage.methods ? `${renderedUsage.methods?.trim()}` : ''}
  ${renderedUsage.events ? `${renderedUsage.events?.trim()}` : ''}
  ${renderedUsage.slots ? `${renderedUsage.slots?.trim()}` : ''}
  ${renderedUsage.expose ? `${renderedUsage.expose?.trim()}` : ''}
  ${requiresMd.length > 0
      ? `---\n${requiresMd.map(component => component.content).join('\n---\n')}`
      : ''
  }
  `
}

// Helper function pour échapper les caractères spéciaux markdown
function escapeMarkdownTableContent(text) {
  if (!text)
    return text

  return String(text)
    .replace(/\|/g, '\\|') // Échapper les pipes
    .replace(/\n/g, ' ') // Remplacer les retours à la ligne par des espaces
    .trim()
}

// Helper function pour formater les types complexes
function formatComplexType(type) {
  if (!type)
    return 'any'

  // Pour les types d'objet, essayer d'afficher la structure si disponible
  if (type.name === 'object' || type.name === 'Object') {
    // Si on a une signature avec des propriétés, les afficher
    if (type.signature?.properties) {
      const props = type.signature.properties.map(prop =>
        `${prop.key}: ${prop.value?.name || 'any'}`,
      ).join(', ')
      return `{ ${props} }`
    }
    // Si on a un type raw, le retourner
    if (type.raw) {
      return type.raw
    }
    return 'Object'
  }

  // Pour les interfaces et types TypeScript, garder le nom complet
  if (type.name && /^[A-Z]/.test(type.name)) {
    // C'est probablement une interface ou un type custom (commence par une majuscule)
    return type.name
  }

  // Pour les types avec des accolades (types object literals)
  if (type.name && (type.name.includes('{') || type.name.includes('}'))) {
    // Nettoyer le type pour éviter les retours à la ligne
    return type.name.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim()
  }

  // Gérer les types avec des propriétés détaillées qui causent des retours à la ligne
  if (type.name && type.name.includes('\n')) {
    // Remplacer les retours à la ligne par des espaces pour éviter de casser le tableau
    return type.name.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim()
  }

  return type.name || 'any'
}

function toKebabCase(input) {
  return input
    .replaceAll(/([a-z])([A-Z])/g, '$1-$2')
    .replaceAll(/[\s_]+/g, '-')
    .toLowerCase()
}

// eslint-disable-next-line complexity
function extractTagInfo(tags) {
  const result = {
    description: '',
    default: '-',
    values: '-',
    example: '',
    additionalInfo: [],
    isModel: false,
    type: undefined,
  }

  // 1. Extraire @description
  if (tags.description && tags.description.length > 0) {
    result.description = tags.description[0].description || tags.description[0].title
  }

  // 2. Extraire @default
  if (tags.default && tags.default.length > 0) {
    result.default = tags.default[0].description || tags.default[0].title
    result.default = result.default.replace(/^["']|['"]$/g, '')
  }

  // 3. Extraire @values
  if (tags.values && tags.values.length > 0) {
    result.values = tags.values[0].description || tags.values[0].title
    result.values = result.values.replace(/^[`"']|[`"']$/g, '')
  }

  // 4. Extraire @example
  if (tags.example && tags.example.length > 0) {
    result.example = tags.example[0].description || tags.example[0].title
    result.example = result.example.replace(/^`|`$/g, '')
  }

  // 5. Extraire @model (pour v-model two-way binding)
  if (tags.model && tags.model.length > 0) {
    result.isModel = true
  }

  // 5. Extraire @type
  if (tags.type && tags.type.length > 0) {
    result.type = tags.type[0].type?.name
  }

  // 6. Autres tags supportés
  if (tags.author && tags.author.length > 0) {
    result.additionalInfo.push(`**Author:** ${tags.author[0].description || tags.author[0].title}`)
  }

  if (tags.since && tags.since.length > 0) {
    result.additionalInfo.push(`**Since:** ${tags.since[0].description || tags.since[0].title}`)
  }

  if (tags.version && tags.version.length > 0) {
    result.additionalInfo.push(`**Version:** ${tags.version[0].description || tags.version[0].title}`)
  }

  if (tags.see && tags.see.length > 0) {
    const seeLinks = tags.see.map(s => `[${s.title || s.description}](${s.description || s.title})`).join(', ')
    result.additionalInfo.push(`**See:** ${seeLinks}`)
  }

  if (tags.link && tags.link.length > 0) {
    const links = tags.link.map(l => `[${l.title || l.description}](${l.description || l.title})`).join(', ')
    result.additionalInfo.push(`**Link:** ${links}`)
  }

  return result
}

// Fonction pour formater le type d'affichage
function formatTypeDisplay(type) {
  if (!type)
    return 'any'

  if (type.name === 'union') {
    const elements = type.elements?.map(el => formatComplexType(el)) || []
    return elements.join(' | ') || 'union'
  }
  else if (type.name === 'Array') {
    const elementType = formatComplexType(type.elements?.[0])
    return `${elementType}[]`
  }
  else if (type.name === 'TSIndexedAccessType') {
    return 'Native type'
  }
  else {
    return formatComplexType(type)
  }
}

/** @type {import('vue-docgen-cli').Templates['props']} */
export function props(props) {
  if (!props || !Array.isArray(props)) {
    return ''
  }

  // Première passe : analyser toutes les props pour déterminer quelles colonnes sont vides
  const columnAnalysis = {
    hasDefault: false,
    hasValues: false,
  }

  // Analyser chaque prop pour voir si les colonnes ont du contenu
  props.forEach((prop) => {
    const { defaultValue, tags = {} } = prop
    const tagInfo = extractTagInfo(tags)

    const extractedDefault = defaultValue?.value || tagInfo.default
    const extractedValues = tagInfo.values

    if (extractedDefault && extractedDefault !== '-') {
      columnAnalysis.hasDefault = true
    }

    if (extractedValues && extractedValues !== '-') {
      columnAnalysis.hasValues = true
    }
  })

  const rows = props.map((prop) => {
    const { name, type, required, defaultValue, description, tags = {} } = prop

    // Extraire toutes les informations depuis les tags JSDoc
    const tagInfo = extractTagInfo(tags)

    let finalDescription = description || ''
    let extractedDefault = defaultValue?.value || tagInfo.default
    const extractedValues = tagInfo.values

    // Concaténer @description avec la description de base
    if (finalDescription && tagInfo.description) {
      finalDescription = `**${finalDescription}** <br/> <br/>${tagInfo.description}<br/>`
    }
    else {
      finalDescription = tagInfo.description || finalDescription
    }

    // Construire la description finale avec toutes les informations
    let completeDescription = finalDescription

    // Ajouter l'indicateur v-model si c'est une prop model
    if (tagInfo.isModel) {
      const modelName = toKebabCase(name)
      completeDescription = `\`v-model${modelName === 'model-value' ? '' : `:${modelName}`}\` <br/>${completeDescription}`
    }

    // Ajouter l'exemple si disponible
    if (tagInfo.example) {
      completeDescription += `<br/>**Example:** \`${escapeMarkdownTableContent(tagInfo.example)}\``
    }

    // Ajouter les informations additionnelles
    if (tagInfo.additionalInfo.length > 0) {
      completeDescription += `<br/>${tagInfo.additionalInfo.map(info => escapeMarkdownTableContent(info)).join('<br/>')}`
    }

    if (extractedDefault === '-') {
      extractedDefault = 'undefined'
    }

    // Formater le type en gérant les cas complexes
    const typeDisplay = tagInfo.type ?? formatTypeDisplay(type)

    // Échapper et nettoyer tous les contenus pour le tableau markdown
    const cleanDescription = escapeMarkdownTableContent(completeDescription)
    const cleanTypeDisplay = escapeMarkdownTableContent(typeDisplay)
    const cleanDefault = escapeMarkdownTableContent(extractedDefault)
    const cleanValues = extractedValues !== '-' ? `\`${escapeMarkdownTableContent(extractedValues)}\`` : '-'

    const requiredText = required ? 'Yes' : 'No'

    // Construire la ligne en fonction des colonnes à afficher
    const columns = [
      `**${toKebabCase(name)}**`,
      cleanDescription,
      `\`${cleanTypeDisplay}\``,
    ]

    columns.push(requiredText)

    if (columnAnalysis.hasDefault) {
      columns.push(`\`${cleanDefault}\``)
    }

    if (columnAnalysis.hasValues) {
      columns.push(cleanValues)
    }

    return `| ${columns.join(' | ')} |`
  })

  // Construire l'en-tête en fonction des colonnes à afficher
  const headers = ['Name', 'Description', 'Type']
  const separators = ['------', '-------------', '------']

  headers.push('Required')

  if (columnAnalysis.hasDefault) {
    headers.push('Default')
    separators.push('---------')
  }

  separators.push('----------')

  if (columnAnalysis.hasValues) {
    headers.push('Possible values')
    separators.push('---------------')
  }

  return `
## Props

| ${headers.join(' | ')} |
|${separators.join('|')}|
${rows.join('\n')}
`
}
