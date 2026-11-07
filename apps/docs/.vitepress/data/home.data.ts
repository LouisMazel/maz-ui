import type { ThemePreset } from '@maz-ui/themes'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { iconList } from '@maz-ui/icons/icon-list'
import { folio, mazUi, nova, obsidian, ocean, pristine } from '@maz-ui/themes/presets'
import { BRAND_COLOR_ROLES, generateCSS, getPerceptualColorScale } from '@maz-ui/themes/utils/css-generator'
import { defineLoader } from 'vitepress'
import { components } from '../configs/components.mjs'
import { composables } from '../configs/composables.mjs'
import { directives } from '../configs/directives.mjs'
import { plugins } from '../configs/plugins.mjs'
import { DOCS_COLOR_SCALE } from '../theme/color-scale.ts'

export interface HomeCategory {
  name: string
  count: number
  link: string
}

export interface HomeContributor {
  id: number
  username: string
  contributions: number
  avatar: string
}

export interface HomePresetSwatch {
  name: string
  label: string
  font: string
  radius: string
  light: Record<'surface' | 'foreground' | 'primary' | 'secondary' | 'accent', string>
  dark: Record<'surface' | 'foreground' | 'primary' | 'secondary' | 'accent', string>
}

export interface HomeSnippet {
  lang: string
  code: string
}

export type HomeSnippetName = 'upgrade' | 'standalone' | 'nuxt' | 'typescript' | 'tokens' | 'darkMode' | 'toolbox' | 'mcp' | 'relizy'

export interface HomeData {
  version: string
  year: number
  iconCount: number
  componentCount: number
  categories: HomeCategory[]
  stars: number | null
  forks: number | null
  contributors: HomeContributor[]
  presets: HomePresetSwatch[]
  scopedCss: string
  snippets: Record<HomeSnippetName, HomeSnippet>
}

declare const data: HomeData
export { data }

const _dirname = dirname(fileURLToPath(import.meta.url))
const require = createRequire(import.meta.url)
const REPO = 'LouisMazel/maz-ui'
const IGNORED_CONTRIBUTORS = new Set(['dependabot[bot]', 'renovate[bot]', 'github-actions[bot]'])
const THEME_COLORS_CSS = join(_dirname, '../../../../packages/lib/src/tailwindcss/theme-colors.css')
const PRESETS: { preset: ThemePreset, label: string }[] = [
  { preset: folio, label: 'Folio' },
  { preset: mazUi, label: 'Maz-UI' },
  { preset: pristine, label: 'Pristine' },
  { preset: ocean, label: 'Ocean' },
  { preset: obsidian, label: 'Obsidian' },
  { preset: nova, label: 'Nova' },
]

const SNIPPETS: Record<HomeSnippetName, HomeSnippet> = {
  upgrade: { lang: 'bash', code: 'npx @maz-ui/upgrade ./ --dry-run' },
  standalone: {
    lang: 'ts',
    code: `import MazBtn from 'maz-ui/components/MazBtn'
import { useToast } from 'maz-ui/composables/useToast'
import { vTooltip } from 'maz-ui/directives/vTooltip'`,
  },
  nuxt: {
    lang: 'ts',
    code: `export default defineNuxtConfig({
  modules: ['@maz-ui/nuxt'],
  mazUi: { theme: { preset: 'ocean' } },
})`,
  },
  typescript: {
    lang: 'ts',
    code: `import type { MazBtnProps } from 'maz-ui/components/MazBtn'

const color: MazBtnProps['color'] = 'primary'`,
  },
  tokens: {
    lang: 'ts',
    code: `import { definePreset } from '@maz-ui/themes'
import { mazUi } from '@maz-ui/themes/presets/mazUi'

export const brand = definePreset({
  base: mazUi,
  overrides: {
    colors: { light: { primary: 'oklch(0.55 0.2 150)' } },
    scales: { rounded: { md: '1rem' } },
  },
})`,
  },
  darkMode: {
    lang: 'ts',
    code: `const { isDark, toggleDarkMode } = useTheme()`,
  },
  toolbox: {
    lang: 'ts',
    code: `const toast = useToast()

toast.success('Saved')
formatCurrency(1234.5, 'en-US', { currency: 'EUR' })`,
  },
  mcp: { lang: 'bash', code: 'npx @maz-ui/mcp init' },
  relizy: { lang: 'bash', code: 'npx relizy init' },
}

interface SidebarItem {
  text?: string
  link?: string
  items?: SidebarItem[]
}

function countLinks(item: SidebarItem): number {
  return (item.link ? 1 : 0) + (item.items ?? []).reduce((total, child) => total + countLinks(child), 0)
}

function firstLink(item: SidebarItem): string {
  return item.link ?? (item.items ?? []).map(firstLink).find(Boolean) ?? ''
}

function getCategories(): HomeCategory[] {
  const componentGroups = (components.items as SidebarItem[]).map(group => ({
    name: group.text ?? '',
    count: countLinks(group),
    link: firstLink(group),
  }))

  return [
    ...componentGroups,
    ...([plugins, composables, directives] as SidebarItem[]).map(section => ({
      name: section.text ?? '',
      count: countLinks(section),
      link: firstLink(section),
    })),
  ]
}

async function fetchJson<T>(url: string): Promise<T | null> {
  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(8000),
    })

    return response.ok
      ? await response.json() as T
      : null
  }
  catch {
    return null
  }
}

function getFontName(stack: string | undefined): string {
  const first = stack?.split(',')[0]?.trim().replaceAll(/['"]/g, '') ?? ''

  return first.startsWith('-apple-system')
    ? 'System UI'
    : first
}

function getSwatch({ preset, label }: { preset: ThemePreset, label: string }): HomePresetSwatch {
  const pick = (mode: 'light' | 'dark') => ({
    surface: preset.colors[mode].surface,
    foreground: preset.colors[mode].foreground,
    primary: preset.colors[mode].primary,
    secondary: preset.colors[mode].secondary,
    accent: preset.colors[mode].accent,
  })

  return {
    name: preset.name,
    label,
    font: getFontName(preset.foundation['font-display-stack'] ?? preset.foundation['font-family']),
    radius: preset.scales.rounded.md,
    light: pick('light'),
    dark: pick('dark'),
  }
}

/**
 * The theme of maz-ui is injected on `:root` and its color scales are resolved there, so a preset cannot be applied to a subtree.
 * Each chapter of the home page gets its own preset: the variables of every preset are scoped to `[data-preset]`,
 * with the Tailwind color bridge declared again so the scales are computed from the variables of the chapter.
 */
function getScopedCss(): string {
  const bridge = [
    ...readFileSync(THEME_COLORS_CSS, 'utf8').matchAll(/^\s*--color-([\w-]+): ([^;]+);$/gm),
  ]
    .map(([, name, value]) => `--maz-color-${name}: ${value};`)
    .join('')
  const perceptualScales = DOCS_COLOR_SCALE === 'perceptual'
    ? BRAND_COLOR_ROLES.flatMap(role => Object.entries(getPerceptualColorScale(`var(--maz-${role})`))
        .map(([step, value]) => `--maz-color-${role}-${step}: ${value};`))
        .join('')
    : ''

  const presets = PRESETS.map(({ preset }) => {
    const css = generateCSS(preset, { mode: 'both', darkSelectorStrategy: 'class', darkClass: 'dark' })
    const variables = css
      .slice(css.indexOf(':root {') + ':root {'.length, css.indexOf('}'))
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.startsWith('--'))
      .join('')

    return `[data-preset="${preset.name}"]{${variables}}`
  })

  return `${presets.join('')}[data-preset]{${bridge}${perceptualScales}}`
}

export default defineLoader({
  watch: [
    THEME_COLORS_CSS,
    join(_dirname, '../../../../packages/themes/src/presets/*.ts'),
  ],
  async load(): Promise<HomeData> {
    const { version } = require('maz-ui/package.json') as { version: string }
    const categories = getCategories()

    const [repo, contributors] = await Promise.all([
      fetchJson<{ repo: { stars: number, forks: number } }>(`https://ungh.cc/repos/${REPO}`),
      fetchJson<{ contributors: { id: number, username: string, contributions: number }[] }>(`https://ungh.cc/repos/${REPO}/contributors`),
    ])

    return {
      version,
      year: new Date().getFullYear(),
      iconCount: iconList.filter(name => !name.startsWith('Lazy')).length,
      componentCount: categories.slice(0, (components.items as SidebarItem[]).length).reduce((total, category) => total + category.count, 0),
      categories,
      stars: repo?.repo.stars ?? null,
      forks: repo?.repo.forks ?? null,
      contributors: (contributors?.contributors ?? [])
        .filter(contributor => !IGNORED_CONTRIBUTORS.has(contributor.username))
        .map(contributor => ({
          ...contributor,
          avatar: `https://avatars.githubusercontent.com/u/${contributor.id}?s=96&v=4`,
        })),
      presets: PRESETS.map(getSwatch),
      scopedCss: getScopedCss(),
      snippets: SNIPPETS,
    }
  },
})
