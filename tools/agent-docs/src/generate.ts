import type { CleanMarkdownContext } from './markdown/clean'
import type { SourcePaths } from './paths'
import type { NuxtAutoImports } from './sources/nuxt'
import type { SourcePage } from './sources/pages'
import type { AgentDocsManifest, ComponentApi, DocEntry, OutputFile, TailwindManifest } from './types'

import { existsSync, readFileSync } from 'node:fs'
import { dirname, join, posix, resolve } from 'node:path'
import { COMPONENT_DESCRIPTIONS, DOC_ALIASES, ECOSYSTEM_SYMBOLS, RELATED_DOCS } from './aliases'
import { cleanMarkdown, extractHeadings, normalizeDashes, stripLeadingTitle } from './markdown/clean'
import { stringifyFrontmatter } from './markdown/frontmatter'
import { getSourcePaths } from './paths'
import { loadAgentContent, renderAgentsMdSection, renderClaudeRule, renderRulesDoc, renderSkill } from './render/agents'
import { renderComponentApi } from './render/api'
import { CATEGORY_ORDER, renderBundleIndex, renderLlmsFullTxt, renderLlmsTxt } from './render/index'
import { renderIconsReference, renderTailwindReference } from './render/references'
import { renderVitepressApis } from './render/vitepress'
import { collectComponentApis } from './sources/components'
import { collectIconNames, groupIcons } from './sources/icons'
import { collectNuxtAutoImports } from './sources/nuxt'
import { collectSourcePages, sourcePathToId } from './sources/pages'
import { resolvePageSymbols } from './sources/symbols'
import { collectTailwindTokens } from './sources/tokens'
import { AGENT_DOCS_SCHEMA_VERSION } from './types'
import { kebabToPascal, pascalToKebab, splitWords, unique } from './utils/strings'

export const HOMEPAGE = 'https://maz-ui.com'

const REFERENCE_IDS = ['reference/tailwind-tokens', 'reference/icons']

export interface GeneratedKnowledge {
  manifest: AgentDocsManifest
  /** Bundle files: markdown pages, references, rules, agent files and `manifest.json` */
  bundle: OutputFile[]
  /** Extra files published on maz-ui.com (`llms.txt`, `llms-full.txt`) */
  site: OutputFile[]
  /** Claude Code plugin skill */
  skill: OutputFile[]
  /** API tables of the component pages of maz-ui.com (`.vitepress/generated-docs`) */
  vitepress: OutputFile[]
  warnings: string[]
}

interface PageDraft {
  entry: DocEntry
  content: string
}

function readVersion(paths: SourcePaths): string {
  return (JSON.parse(readFileSync(join(paths.libRoot, 'package.json'), 'utf8')) as { version: string }).version
}

function relativeLink(fromFile: string, toFile: string, anchor: string): string {
  const relativePath = posix.relative(posix.dirname(fromFile), toFile)

  return `${relativePath.startsWith('.') ? relativePath : `./${relativePath}`}${anchor}`
}

/** Maps a docs href (relative, absolute site path, with or without `.md`) to a known doc id */
export function resolveHrefToId(href: string, fromSourcePath: string, knownIds: Set<string>): { id: string, anchor: string } | undefined {
  if (/^(?:[a-z]+:)?\/\//i.test(href) || href.startsWith('mailto:') || href.startsWith('#'))
    return undefined

  const [rawPath, rawAnchor] = href.split('#')
  const anchor = rawAnchor ? `#${rawAnchor}` : ''
  const target = rawPath.startsWith('/')
    ? rawPath.slice(1)
    : posix.join(posix.dirname(fromSourcePath), rawPath)
  const id = sourcePathToId(target.replace(/\.html$/, '').replace(/\/$/, '/index').replace(/(?<!\.md)$/, '.md'))

  return knownIds.has(id) ? { id, anchor } : undefined
}

/** Links to pages deliberately left out of the bundle (blog, changelog, home...) are not broken */
function isExcludedTarget(href: string, fromSourcePath: string): boolean {
  const [path] = href.split('#')
  const target = path.startsWith('/') ? path.slice(1) : posix.join(posix.dirname(fromSourcePath), path)

  return /^(?:blog\/|changelog|made-with-maz-ui|theme-editor|index|guide\/cli|guide\/migration-v4|$)/.test(target.replace(/\.md$/, '')) || /\.(?:png|jpe?g|svg|gif|webp|zip)$/.test(path)
}

function nuxtNote(symbols: string[], category: DocEntry['category'], autoImports: ReturnType<typeof collectNuxtAutoImports>): string | undefined {
  if (category === 'component' && symbols.length > 0 && symbols.every(symbol => autoImports.components.includes(symbol)))
    return 'auto-imported by `@maz-ui/nuxt`, no import needed in a Nuxt app'

  if (category === 'composable' && symbols[0]) {
    if (autoImports.composables.includes(symbols[0]))
      return 'auto-imported by `@maz-ui/nuxt`, no import needed in a Nuxt app'

    const plugin = autoImports.pluginComposables[symbols[0]]

    if (plugin)
      return `auto-imported by \`@maz-ui/nuxt\` when \`mazUi.plugins.${plugin}\` is enabled`
  }

  return undefined
}

function renderPageHeader(entry: DocEntry, nuxt: string | undefined): string {
  const lines = [
    stringifyFrontmatter({ title: entry.title, description: entry.description, package: entry.package, url: entry.url }),
    '',
    `# ${entry.title}`,
    '',
    `> ${entry.description}`,
    '',
    `- Package: \`${entry.package}\``,
  ]

  if (entry.imports.length > 0)
    lines.push(`- Import: ${entry.imports.map(statement => `\`${statement}\``).join(' or ')}`)
  if (nuxt)
    lines.push(`- Nuxt: ${nuxt}`)
  if (entry.url)
    lines.push(`- Web: ${entry.url}`)

  return lines.join('\n')
}

function buildAliases(id: string, title: string, symbols: string[]): string[] {
  return unique([
    ...(DOC_ALIASES[id] ?? []),
    splitWords(title.replace(/^Maz/, '')).join(' '),
    ...symbols.map(symbol => symbol.toLowerCase()),
  ].map(alias => alias.toLowerCase().trim()).filter(Boolean))
}

function relatedMap(): Map<string, Set<string>> {
  const map = new Map<string, Set<string>>()
  const link = (a: string, b: string): void => {
    if (!map.has(a))
      map.set(a, new Set())
    map.get(a)?.add(b)
  }

  for (const [a, b] of RELATED_DOCS) {
    link(a, b)
    link(b, a)
  }

  return map
}

interface GenerationContext {
  paths: SourcePaths
  version: string
  warnings: string[]
  components: ComponentApi[]
  componentsByKebab: Map<string, ComponentApi>
  pages: SourcePage[]
  autoImports: NuxtAutoImports
  knownIds: Set<string>
  titles: Map<string, string>
  /** Sub-component name to parent component name, filled while reading the pages */
  parentOf: Map<string, string>
  fileOf: (id: string) => string
}

async function createGenerationContext(paths: SourcePaths): Promise<GenerationContext> {
  const components = await collectComponentApis(paths.libComponents, join(paths.libRoot, 'tsconfig.json'))
  const pages = collectSourcePages(paths.docsSrc)
  const indexPages = new Set(pages.filter(page => page.sourcePath.endsWith('/index.md')).map(page => page.id))

  return {
    paths,
    version: readVersion(paths),
    warnings: [],
    components,
    componentsByKebab: new Map(components.map(api => [pascalToKebab(api.name), api])),
    pages,
    autoImports: collectNuxtAutoImports(join(paths.root, 'packages/nuxt/src/module.ts')),
    knownIds: new Set([...pages.map(page => page.id), ...components.map(api => api.docId), ...REFERENCE_IDS]),
    titles: new Map([
      ...pages.map(page => [page.id, page.frontmatter.title ?? kebabToPascal(page.slug)] as [string, string]),
      ...components.map(api => [api.docId, api.name] as [string, string]),
    ]),
    parentOf: new Map(),
    fileOf: id => (indexPages.has(id) ? `${id}/index.md` : `${id}.md`),
  }
}

function toSitePath(href: string): string {
  return href.startsWith(`${HOMEPAGE}/`) ? href.slice(HOMEPAGE.length) : href
}

function createCleanContext(context: GenerationContext, page: SourcePage, title: string, description: string, includedApis: ComponentApi[]): CleanMarkdownContext {
  const file = context.fileOf(page.id)

  return {
    frontmatter: { title, description },
    resolveInclude: (includePath) => {
      const generated = /([\w-]+)\.doc\.md$/.exec(includePath)

      if (generated) {
        const api = context.componentsByKebab.get(generated[1])

        if (!api) {
          context.warnings.push(`${page.sourcePath}: no component API for include ${includePath}`)
          return ''
        }

        includedApis.push(api)
        return `\n${renderComponentApi(api, 2)}\n`
      }

      const absolute = resolve(dirname(page.file), includePath)

      if (!existsSync(absolute)) {
        context.warnings.push(`${page.sourcePath}: include not found ${includePath}`)
        return ''
      }

      return readFileSync(absolute, 'utf8')
    },
    resolveLink: (href) => {
      const sitePath = toSitePath(href)

      if (/^https?:\/\//.test(sitePath))
        return href

      const target = resolveHrefToId(sitePath, page.sourcePath, context.knownIds)

      if (target)
        return relativeLink(file, context.fileOf(target.id), target.anchor)

      if (sitePath !== href && /\.(?:txt|json|xml)$/.test(sitePath))
        return href

      if (!/^(?:#|mailto:|[a-z]+:\/\/)/i.test(sitePath) && !isExcludedTarget(sitePath, page.sourcePath))
        context.warnings.push(`${page.sourcePath}: broken internal link "${href}"`)

      return undefined
    },
    linkTitle: (href) => {
      const target = resolveHrefToId(toSitePath(href), page.sourcePath, context.knownIds)

      return target ? context.titles.get(target.id) : undefined
    },
  }
}

function pageDraft(context: GenerationContext, page: SourcePage): PageDraft {
  const includedApis: ComponentApi[] = []
  const title = page.frontmatter.title ?? kebabToPascal(page.slug)
  const description = normalizeDashes(page.frontmatter.description ?? '')
  const body = cleanMarkdown(page.body, createCleanContext(context, page, title, description, includedApis))
  const isComponent = page.category === 'component'
  const mainComponent = isComponent ? context.componentsByKebab.get(page.slug) : undefined

  if (isComponent && !mainComponent)
    context.warnings.push(`${page.sourcePath}: no component named ${kebabToPascal(page.slug)}`)

  for (const api of includedApis) {
    if (mainComponent && api.name !== mainComponent.name)
      context.parentOf.set(api.name, mainComponent.name)
  }

  const componentApis = unique([mainComponent, ...includedApis].filter((api): api is ComponentApi => !!api))
  const { symbols, imports } = isComponent
    ? { symbols: componentApis.map(api => api.name), imports: componentApis.map(api => api.import) }
    : resolvePageSymbols(page, context.paths)

  const entry: DocEntry = {
    id: page.id,
    category: page.category,
    slug: page.slug,
    title,
    description,
    package: page.package,
    file: context.fileOf(page.id),
    url: `${HOMEPAGE}/${page.id}${page.sourcePath.endsWith('/index.md') ? '/' : ''}`,
    symbols,
    imports,
    aliases: buildAliases(page.id, title, symbols),
    headings: [],
    related: [],
    chars: 0,
  }

  return {
    entry,
    content: `${renderPageHeader(entry, nuxtNote(symbols, page.category, context.autoImports))}\n\n${stripLeadingTitle(body, description)}`,
  }
}

/** Page of a component that has no page on maz-ui.com (building blocks like MazSidebarGroup) */
function componentOnlyDraft(context: GenerationContext, api: ComponentApi): PageDraft {
  const parentApi = api.parent ? context.components.find(candidate => candidate.name === api.parent) : undefined
  const entry: DocEntry = {
    id: api.docId,
    category: 'component',
    slug: pascalToKebab(api.name),
    title: api.name,
    description: api.description ?? COMPONENT_DESCRIPTIONS[api.name] ?? (parentApi ? `${api.name} is a building block of ${parentApi.name}.` : `${api.name} component.`),
    package: 'maz-ui',
    file: `${api.docId}.md`,
    symbols: [api.name],
    imports: [api.import],
    aliases: buildAliases(api.docId, api.name, [api.name]),
    headings: [],
    related: parentApi ? [parentApi.docId] : [],
    chars: 0,
  }
  const parentLine = parentApi ? `\nUsed inside [${parentApi.name}](./${pascalToKebab(parentApi.name)}.md): read its page for complete examples.\n` : ''

  return {
    entry,
    content: `${renderPageHeader(entry, nuxtNote([api.name], 'component', context.autoImports))}\n${parentLine}\n${renderComponentApi(api, 2)}\n`,
  }
}

function referenceEntry(id: string, title: string, description: string, packageName: string, imports: string[] = []): DocEntry {
  return {
    id,
    category: 'reference',
    slug: id.split('/').at(-1) as string,
    title,
    description,
    package: packageName,
    file: `${id}.md`,
    symbols: [],
    imports,
    aliases: buildAliases(id, title, []),
    headings: [],
    related: [],
    chars: 0,
  }
}

function referenceDrafts(tailwind: TailwindManifest, iconNames: string[]): PageDraft[] {
  return [
    {
      entry: referenceEntry('reference/tailwind-tokens', 'Tailwind CSS theme reference', 'Every Tailwind class, variant and CSS variable of the maz-ui theme: colors, radius, shadows, spacing, breakpoints, typography, z-index, custom utilities.', 'maz-ui'),
      content: renderTailwindReference(tailwind),
    },
    {
      entry: referenceEntry('reference/icons', 'Icons reference', `The ${iconNames.length} icon names of @maz-ui/icons (interface icons, logos, country flags) and how to import them.`, '@maz-ui/icons', [`import { MazTrash } from '@maz-ui/icons/static/MazTrash'`]),
      content: renderIconsReference(groupIcons(iconNames), iconNames.length),
    },
  ]
}

/** Component pages related to a component page: its parent and its building blocks */
function componentRelations(context: GenerationContext, entry: DocEntry): string[] {
  if (entry.category !== 'component')
    return []

  const parent = context.components.find(api => api.name === entry.title)?.parent
  const children = context.components.filter(api => api.parent === entry.title).map(api => api.docId)
  const parentDocId = parent ? context.components.find(api => api.name === parent)?.docId : undefined

  return [...(parentDocId ? [parentDocId] : []), ...children].filter(id => id !== entry.id)
}

function finalizeDrafts(context: GenerationContext, drafts: PageDraft[]): PageDraft[] {
  const related = relatedMap()

  return drafts
    .map(({ entry, content }) => {
      const headings = extractHeadings(content)
        .filter(heading => heading.level === 2 || heading.level === 3)
        .map(heading => heading.title)
      const relatedIds = unique([...entry.related, ...(related.get(entry.id) ?? []), ...componentRelations(context, entry)])
        .filter(id => context.knownIds.has(id) && id !== entry.id)

      return { entry: { ...entry, headings, related: relatedIds, chars: content.length }, content }
    })
    .sort((a, b) => CATEGORY_ORDER.indexOf(a.entry.category) - CATEGORY_ORDER.indexOf(b.entry.category) || a.entry.id.localeCompare(b.entry.id))
}

/** Descriptions are what agents read first in search results: they must say what the feature does */
const MIN_DESCRIPTION_LENGTH = 30
const VAGUE_DESCRIPTION = /is a (?:standalone )?component\.?$|^\w+ component\.$|is a building block of \w+\.$/i

export function descriptionProblems(entry: DocEntry): string[] {
  const problems: string[] = []

  if (entry.description.length < MIN_DESCRIPTION_LENGTH || VAGUE_DESCRIPTION.test(entry.description))
    problems.push(`${entry.id}: vague description "${entry.description}"`)

  if (['composable', 'directive'].includes(entry.category) && entry.symbols[0] && !entry.symbols.includes(entry.title))
    problems.push(`${entry.id}: the title "${entry.title}" is not the documented symbol (${entry.symbols[0]})`)

  return problems
}

function validate(context: GenerationContext, drafts: PageDraft[]): void {
  for (const { entry } of drafts) {
    if (entry.category !== 'guide' && entry.category !== 'reference')
      context.warnings.push(...descriptionProblems(entry))
  }

  for (const id of [...Object.keys(DOC_ALIASES), ...Object.keys(ECOSYSTEM_SYMBOLS), ...RELATED_DOCS.flat()]) {
    if (!context.knownIds.has(id))
      context.warnings.push(`aliases.ts references the unknown doc "${id}"`)
  }
}

export async function generateKnowledge(paths: SourcePaths = getSourcePaths()): Promise<GeneratedKnowledge> {
  const context = await createGenerationContext(paths)
  const { version, components } = context
  const tailwind = collectTailwindTokens(paths.libTailwind, paths.libCss)
  const iconNames = collectIconNames(paths.iconList)
  const agentContent = loadAgentContent(paths.content)
  const pageDrafts = context.pages.map(page => pageDraft(context, page))

  for (const api of components) {
    const parent = context.parentOf.get(api.name)

    if (parent)
      api.parent = parent
  }

  const componentDrafts = components
    .filter(api => !pageDrafts.some(draft => draft.entry.id === api.docId))
    .map(api => componentOnlyDraft(context, api))
  const all = finalizeDrafts(context, [...pageDrafts, ...componentDrafts, ...referenceDrafts(tailwind, iconNames)])

  validate(context, all)

  const docs = all.map(item => item.entry)
  const manifest: AgentDocsManifest = {
    schemaVersion: AGENT_DOCS_SCHEMA_VERSION,
    name: 'maz-ui',
    version,
    homepage: HOMEPAGE,
    packages: docs
      .filter(doc => doc.category === 'ecosystem' && !doc.id.includes('/icons/'))
      .map(doc => ({ name: doc.package, description: doc.description, docId: doc.id })),
    docs,
    components,
    icons: { package: '@maz-ui/icons', names: iconNames },
    tailwind,
  }
  const rulesDoc = renderRulesDoc(agentContent)

  return {
    manifest,
    bundle: [
      ...all.map(item => ({ path: item.entry.file, content: item.content })),
      { path: 'README.md', content: renderBundleIndex(docs) },
      { path: 'rules.md', content: rulesDoc },
      { path: 'agents/claude-rule.md', content: renderClaudeRule(agentContent) },
      { path: 'agents/agents-md.md', content: renderAgentsMdSection(agentContent) },
      { path: 'manifest.json', content: `${JSON.stringify(manifest)}\n` },
    ],
    site: [
      { path: 'llms.txt', content: renderLlmsTxt(docs, HOMEPAGE) },
      { path: 'llms-full.txt', content: renderLlmsFullTxt(all.map(item => ({ doc: item.entry, content: item.content })), rulesDoc, HOMEPAGE) },
    ],
    skill: [{ path: 'skills/maz-ui/SKILL.md', content: renderSkill(agentContent) }],
    vitepress: renderVitepressApis(components),
    warnings: context.warnings,
  }
}
