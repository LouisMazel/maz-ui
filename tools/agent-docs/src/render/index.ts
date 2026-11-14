import type { PackageDefinition } from '../packages'
import type { DocCategory, DocEntry } from '../types'

import { truncate } from '../utils/strings'

const SECTIONS: Array<{ title: string, filter: (doc: DocEntry) => boolean }> = [
  {
    title: 'Guides',
    filter: doc => doc.category === 'guide',
  },
  {
    title: 'Components (maz-ui)',
    filter: doc => doc.category === 'component',
  },
  {
    title: 'Composables (maz-ui)',
    filter: doc => doc.category === 'composable',
  },
  {
    title: 'Directives (maz-ui)',
    filter: doc => doc.category === 'directive',
  },
  {
    title: 'Plugins (maz-ui)',
    filter: doc => doc.category === 'plugin',
  },
  {
    title: 'Ecosystem packages',
    filter: doc => doc.category === 'ecosystem',
  },
  {
    title: 'Helpers (@maz-ui/utils)',
    filter: doc => doc.category === 'util',
  },
  {
    title: 'Node utilities (@maz-ui/node)',
    filter: doc => doc.category === 'node',
  },
  {
    title: 'References',
    filter: doc => doc.category === 'reference',
  },
]

export const CATEGORY_ORDER: DocCategory[] = [
  'guide',
  'component',
  'composable',
  'directive',
  'plugin',
  'ecosystem',
  'util',
  'node',
  'reference',
]

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

const SUMMARY = 'Vue 3 and Nuxt UI library: components, composables, directives and plugins, with an ecosystem of packages for theming (@maz-ui/themes), icons (@maz-ui/icons), helpers (@maz-ui/utils), translations (@maz-ui/translations), Nuxt (@maz-ui/nuxt), CSS purge for Vite (@maz-ui/vite-plugin) and AI agents (@maz-ui/mcp). Styling is powered by Tailwind CSS v4 theme tokens.'

/** `README.md` of maz-ui.com: every page of the ecosystem */
export function renderBundleIndex(docs: DocEntry[]): string {
  return `# maz-ui documentation for AI agents

> ${SUMMARY}

Read [rules.md](rules.md) first: how a project must use maz-ui. In a project, prefer the files of the **installed** versions (\`node_modules/maz-ui/agent-docs\`, \`node_modules/@maz-ui/<package>/agent-docs\`) over what you remember from training data: APIs change between versions.

${renderSections(docs, doc => doc.file)}
`
}

interface FragmentIndexOptions {
  definition: PackageDefinition
  docs: DocEntry[]
  /** Every package of the ecosystem, listed in the index of maz-ui to discover the others without the MCP server */
  packages?: PackageDefinition[]
  homepage: string
}

function renderOtherPackages(options: Required<Pick<FragmentIndexOptions, 'packages' | 'homepage'>>): string {
  const lines = options.packages.map(({ name, description, mainDocId }) => `- \`${name}\`: ${description} Docs: \`node_modules/${name}/agent-docs/README.md\` when installed, else ${options.homepage}/${mainDocId} or the MCP server.`)

  return `## Other packages of the ecosystem\n\nEach package ships its own docs, matching its installed version. When a package is not installed, read its page on maz-ui.com or use the MCP server (\`npx @maz-ui/mcp\`).\n\n${lines.join('\n')}`
}

/** `README.md` of a package fragment (`node_modules/<package>/agent-docs/README.md`) */
export function renderFragmentIndex({ definition, docs, packages, homepage }: FragmentIndexOptions): string {
  const isLibrary = definition.name === 'maz-ui'
  const intro = isLibrary
    ? '- Read [rules.md](rules.md) first: how this project must use maz-ui.'
    : '- Rules for the whole ecosystem: `node_modules/maz-ui/agent-docs/rules.md` when maz-ui is installed.'
  const others = isLibrary && packages
    ? `\n\n${renderOtherPackages({
      packages: packages.filter(other => other.name !== definition.name),
      homepage,
    })}`
    : ''

  return `# ${definition.name} documentation for AI agents

> ${definition.description}

These files document the **installed** version of ${definition.name}. Prefer them over what you remember from training data: APIs change between versions.

${intro}
- \`manifest.json\` describes every page (symbols, imports, aliases)${isLibrary
  ? ', and holds the full component APIs and the Tailwind tokens in JSON'
  : ''}.

${renderSections(docs, doc => doc.file)}${others}
`
}

/** `llms.txt` of maz-ui.com */
export function renderLlmsTxt(docs: DocEntry[], homepage: string): string {
  return `# maz-ui

> ${SUMMARY}

Documentation of the latest maz-ui release. Each link points to the markdown version of a page. The same files ship in the npm packages (\`node_modules/maz-ui/agent-docs/\`, \`node_modules/@maz-ui/<package>/agent-docs/\`), matching the installed versions, and through the MCP server \`npx @maz-ui/mcp\`.

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
