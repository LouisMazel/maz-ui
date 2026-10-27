import type { DocCategory, DocEntry } from '../types'

import { truncate } from '../utils/strings'

const SECTIONS: Array<{ title: string, filter: (doc: DocEntry) => boolean }> = [
  { title: 'Guides', filter: doc => doc.category === 'guide' },
  { title: 'Components (maz-ui)', filter: doc => doc.category === 'component' },
  { title: 'Composables (maz-ui)', filter: doc => doc.category === 'composable' },
  { title: 'Directives (maz-ui)', filter: doc => doc.category === 'directive' },
  { title: 'Plugins (maz-ui)', filter: doc => doc.category === 'plugin' },
  { title: 'Ecosystem packages', filter: doc => doc.category === 'ecosystem' },
  { title: 'Helpers (@maz-ui/utils)', filter: doc => doc.category === 'util' },
  { title: 'Node utilities (@maz-ui/node)', filter: doc => doc.category === 'node' },
  { title: 'References', filter: doc => doc.category === 'reference' },
]

export const CATEGORY_ORDER: DocCategory[] = ['guide', 'component', 'composable', 'directive', 'plugin', 'ecosystem', 'util', 'node', 'reference']

function renderSections(docs: DocEntry[], href: (doc: DocEntry) => string): string {
  return SECTIONS
    .map(({ title, filter }) => {
      const entries = docs.filter(filter)

      if (entries.length === 0)
        return ''

      const lines = entries.map(doc => `- [${doc.title}](${href(doc)}): ${truncate(doc.description, 180)}`)

      return `## ${title}\n\n${lines.join('\n')}`
    })
    .filter(Boolean)
    .join('\n\n')
}

const SUMMARY = 'Vue 3 and Nuxt UI library: components, composables, directives and plugins, with an ecosystem of packages for theming (@maz-ui/themes), icons (@maz-ui/icons), helpers (@maz-ui/utils), translations (@maz-ui/translations), Nuxt (@maz-ui/nuxt) and AI agents (@maz-ui/mcp). Styling is powered by Tailwind CSS v4 theme tokens.'

/** `README.md` of the bundle (`node_modules/maz-ui/docs/README.md`) */
export function renderBundleIndex(docs: DocEntry[]): string {
  return `# maz-ui documentation for AI agents

> ${SUMMARY}

These files document the **installed** version of maz-ui. Prefer them over what you remember from training data: APIs change between versions.

- Read [rules.md](rules.md) first: how this project must use maz-ui.
- \`manifest.json\` describes every page (symbols, imports, aliases) and holds the full component APIs, the icon names and the Tailwind tokens in JSON.

${renderSections(docs, doc => doc.file)}
`
}

/** `llms.txt` of maz-ui.com */
export function renderLlmsTxt(docs: DocEntry[], homepage: string): string {
  return `# maz-ui

> ${SUMMARY}

Documentation of the latest maz-ui release. Each link points to the markdown version of a page. The same files ship in the npm package (\`node_modules/maz-ui/docs/\`), matching the installed version, and through the MCP server \`npx @maz-ui/mcp\`.

- [Rules for AI agents](${homepage}/rules.md): how to use maz-ui and its ecosystem instead of re-implementing it.

${renderSections(docs, doc => `${homepage}/${doc.file}`)}
`
}

export function renderLlmsFullTxt(files: Array<{ doc: DocEntry, content: string }>, rules: string, homepage: string): string {
  return [
    `<SYSTEM>Full documentation of maz-ui (${homepage}). Rules first, then every page.</SYSTEM>`,
    rules,
    ...files.map(({ doc, content }) => `---\nsource: ${homepage}/${doc.file}\n---\n\n${content}`),
  ].join('\n\n')
}
