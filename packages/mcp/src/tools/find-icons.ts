import type { ServerContext } from '../context'

import { z } from 'zod'
import { closest } from '../knowledge/resolve'
import { searchIcons } from '../search/engine'
import { defineTool } from './types'

export interface FindIconsArgs {
  query: string
  limit?: number
}

export function findIcons(context: ServerContext, { query, limit = 24 }: FindIconsArgs): string {
  const { iconNames } = context.knowledge
  const exact = [...iconNames].find(name => name.toLowerCase() === query.trim().toLowerCase())
  const names = exact ? [exact, ...searchIcons(iconNames, query, limit).filter(name => name !== exact)].slice(0, limit) : searchIcons(iconNames, query, limit)

  if (names.length === 0) {
    const near = closest(query.startsWith('Maz') ? query : `Maz${query}`, iconNames, { max: 4, limit: 8 })

    return [
      `No icon matches "${query}" in @maz-ui/icons (${iconNames.size} icons).`,
      near.length > 0 ? `Close names: ${near.join(', ')}.` : '',
      'Try another English word (icons follow the heroicons naming: trash, x-mark, magnifying-glass, cog, bars-3, chevron-down...). Full list: `get_doc({ id: "reference/icons" })`.',
    ].filter(Boolean).join('\n')
  }

  const [first] = names

  return [
    `# @maz-ui/icons matching "${query}"`,
    '',
    names.map(name => `- \`${name}\``).join('\n'),
    '',
    '## Import',
    '',
    '```ts',
    `import { ${first} } from '@maz-ui/icons/raw/${first}' // icon props (<MazBtn :start-icon>, <MazIcon :icon>): SVG string, the lightest`,
    `import { ${first} } from '@maz-ui/icons/static/${first}' // directly in a template: <${first} class="size-5 text-primary" />`,
    `import { ${first} } from '@maz-ui/icons/lazy/${first}' // only for icons not visible at first render (v-if, menus, dialogs)`,
    '```',
    '',
    `Size and color come from the text (\`1em\`, \`currentColor\`). For an \`<img>\` (multicolor flags and logos only): \`@maz-ui/icons/svg/<name>.svg\`. Never inline SVG markup nor add another icon library.`,
  ].join('\n')
}

export const findIconsTool = defineTool({
  name: 'find_icons',
  title: 'Find @maz-ui/icons',
  description: 'Find icons in @maz-ui/icons (860+ heroicons-based icons, brand logos and country flags) from what they represent ("delete", "close", "settings", "user", "france flag", "github") and get their import. Use it instead of inline SVG or another icon library.',
  inputSchema: {
    query: z.string().min(1).describe('What the icon represents, in English, or an icon name'),
    limit: z.number().int().min(1).max(60).optional().describe('Maximum number of icons (default 24)'),
  },
  run: findIcons,
})
