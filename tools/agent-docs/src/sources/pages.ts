import type { Frontmatter } from '../markdown/frontmatter'
import type { DocCategory } from '../types'

import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative, sep } from 'node:path'
import { parseFrontmatter } from '../markdown/frontmatter'

export interface SourcePage {
  /** Absolute path of the source markdown file */
  file: string
  /** Path relative to the docs source root, with `/` separators */
  sourcePath: string
  id: string
  category: DocCategory
  slug: string
  package: string
  frontmatter: Frontmatter
  body: string
}

/** Pages that are not useful to agents (marketing, history, v3-only content) */
const EXCLUDED_PAGES = new Set([
  'index.md',
  'changelog.md',
  'made-with-maz-ui.md',
  'theme-editor.md',
  'components/index.md',
  'guide/cli.md',
  'guide/migration-v4.md',
])

const EXCLUDED_DIRECTORIES = ['blog/', 'public/', 'assets/']

const ECOSYSTEM_PACKAGES: Record<string, string> = {
  'ecosystem/themes': '@maz-ui/themes',
  'ecosystem/translations': '@maz-ui/translations',
  'ecosystem/nuxt': '@maz-ui/nuxt',
  'ecosystem/mcp': '@maz-ui/mcp',
  'ecosystem/eslint-config': '@maz-ui/eslint-config',
  'ecosystem/stylelint-config': '@maz-ui/stylelint-config',
}

function walk(directory: string): string[] {
  return readdirSync(directory).flatMap((entry) => {
    const path = join(directory, entry)

    return statSync(path).isDirectory() ? walk(path) : [path]
  })
}

export function sourcePathToId(sourcePath: string): string {
  return sourcePath.replace(/\.md$/, '').replace(/\/index$/, '')
}

export function classifyPage(sourcePath: string): { category: DocCategory, package: string } | undefined {
  const id = sourcePathToId(sourcePath)
  const [section] = id.split('/')

  if (section === 'components')
    return { category: 'component', package: 'maz-ui' }
  if (section === 'composables')
    return { category: 'composable', package: 'maz-ui' }
  if (section === 'directives')
    return { category: 'directive', package: 'maz-ui' }
  if (section === 'plugins')
    return { category: 'plugin', package: 'maz-ui' }
  if (section === 'guide')
    return { category: 'guide', package: 'maz-ui' }

  if (id.startsWith('ecosystem/utils'))
    return { category: id === 'ecosystem/utils' ? 'ecosystem' : 'util', package: '@maz-ui/utils' }
  if (id.startsWith('ecosystem/node'))
    return { category: id === 'ecosystem/node' ? 'ecosystem' : 'node', package: '@maz-ui/node' }
  if (id.startsWith('ecosystem/icons'))
    return { category: 'ecosystem', package: '@maz-ui/icons' }
  if (ECOSYSTEM_PACKAGES[id])
    return { category: 'ecosystem', package: ECOSYSTEM_PACKAGES[id] }

  return undefined
}

export function collectSourcePages(docsSrc: string): SourcePage[] {
  return walk(docsSrc)
    .filter(file => file.endsWith('.md'))
    .map(file => ({ file, sourcePath: relative(docsSrc, file).split(sep).join('/') }))
    .filter(({ sourcePath }) => !EXCLUDED_PAGES.has(sourcePath) && !EXCLUDED_DIRECTORIES.some(directory => sourcePath.startsWith(directory)))
    .flatMap(({ file, sourcePath }) => {
      const classification = classifyPage(sourcePath)

      if (!classification)
        return []

      const { frontmatter, body } = parseFrontmatter(readFileSync(file, 'utf8'))
      const id = sourcePathToId(sourcePath)

      return [{
        file,
        sourcePath,
        id,
        category: classification.category,
        slug: id.split('/').at(-1) as string,
        package: classification.package,
        frontmatter,
        body,
      }]
    })
    .sort((a, b) => a.id.localeCompare(b.id))
}
