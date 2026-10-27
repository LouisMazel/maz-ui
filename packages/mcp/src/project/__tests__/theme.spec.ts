import type { ProjectTheme } from '../theme'

import { execFileSync } from 'node:child_process'
import { symlinkSync } from 'node:fs'
import { join } from 'node:path'
import { cleanTempDirs, createTempDir, getKnowledge, writeFile } from '../../__tests__/helpers'
import { readStylesheet } from '../stylesheet'
import { mazUiThemeVariables, readProjectTheme, renderProjectTheme, stylesheetProblems } from '../theme'

const ENTRY = `@import 'tailwindcss';
@import 'maz-ui/tailwindcss/theme.css';
@import 'maz-ui/tailwindcss/utilities.css';

@custom-variant short (@media (max-height: 50rem));

@theme {
  --color-*: initial;
  /* Figures of the scoreboard */
  --font-display: 'Barlow Condensed', sans-serif;
  --animate-rise: rise 0.5s var(--maz-easing-out) backwards;
  --color-brand: light-dark(#f00, #0f0);
  --radius-card: 12px;
}

@utility scrollbar-none {
  scrollbar-width: none;
}

@keyframes rise {
  from { opacity: 0; }
}

@keyframes reveal {
  from { opacity: 0; }
}

html {
  --maz-container-max-width: 1024px;
}
`

const PRESET = `import { definePreset, mazUi } from '@maz-ui/themes'

export const brandPreset = definePreset({
  base: mazUi,
  overrides: {
    name: 'brand',
    foundation: { 'font-display-stack': 'Barlow, sans-serif', 'space': '0.3rem', 'unknown-key': 'x' },
    scales: { rounded: { md: '4px' }, shadow: { elevation: '0 1px 2px black' } },
    colors: {
      light: { 'primary': '#C7330F', 'primary-foreground': '#FFFFFF', 'shadow': '#000' },
      dark: { primary: '#FF5A36' },
    },
    components: {
      container: { bg: { light: '#FFFFFF', dark: '#141B5E' } },
      btn: { 'font-weight': '700' },
      custom: { size: '2px' },
    },
  },
})
`

function writeProject(directory: string): void {
  writeFile(directory, 'package.json', '{ "name": "project" }')
  writeFile(directory, 'apps/web/src/main.css', ENTRY)
  writeFile(directory, 'apps/web/src/plain.css', '.a { color: red; }')
  writeFile(directory, 'apps/web/config/brand-preset.ts', PRESET)
  writeFile(directory, 'apps/web/src/other.ts', 'export const a = 1')
  writeFile(directory, 'apps/web/node_modules/lib/theme.css', '@theme { --color-lib: red; }')
  writeFile(directory, 'apps/web/.nuxt/app.css', '@theme { --color-nuxt: red; }')
  writeFile(directory, 'apps/web/src/__tests__/fixture.css', '@theme { --color-fixture: red; }')
}

afterEach(() => {
  cleanTempDirs()
})

describe('given readProjectTheme', () => {
  describe('when the project is not a git repository', () => {
    it('then it finds the Tailwind stylesheets and the presets, without dependencies, generated files and tests', () => {
      const directory = createTempDir()

      writeProject(directory)

      const theme = readProjectTheme(directory)

      expect(theme.stylesheets.map(stylesheet => stylesheet.file)).toEqual(['apps/web/src/main.css'])
      expect(theme.presets.map(preset => [preset.file, preset.exportName])).toEqual([['apps/web/config/brand-preset.ts', 'brandPreset']])
    })
  })

  describe('when the project is a git repository', () => {
    it('then it respects the gitignore and reads the untracked files', () => {
      const directory = createTempDir()

      writeProject(directory)
      writeFile(directory, '.gitignore', 'training/\n')
      writeFile(directory, 'training/theme.css', '@theme { --color-ignored: red; }')
      execFileSync('git', ['init', '--quiet'], { cwd: directory })

      expect(readProjectTheme(directory).stylesheets.map(stylesheet => stylesheet.file)).toEqual(['apps/web/src/main.css'])
    })

    it('then the files that cannot be read are skipped', () => {
      const directory = createTempDir()

      writeProject(directory)
      symlinkSync(join(directory, 'missing.css'), join(directory, 'broken.css'))
      execFileSync('git', ['init', '--quiet'], { cwd: directory })

      expect(readProjectTheme(directory).stylesheets.map(stylesheet => stylesheet.file)).toEqual(['apps/web/src/main.css'])
    })
  })

  describe('when the directory has no package.json', () => {
    it('then it is not scanned', () => {
      const directory = createTempDir()

      writeFile(directory, 'main.css', ENTRY)

      expect(readProjectTheme(directory)).toEqual({ stylesheets: [], presets: [] })
    })
  })

  describe('when a file is too big', () => {
    it('then it is skipped', () => {
      const directory = createTempDir()

      writeFile(directory, 'package.json', '{}')
      writeFile(directory, 'big.css', `@theme { --color-big: red; }\n${'.a { color: red; }\n'.repeat(20_000)}`)

      expect(readProjectTheme(directory).stylesheets).toEqual([])
    })
  })
})

describe('given renderProjectTheme', () => {
  const tailwind = getKnowledge().manifest.tailwind

  function projectTheme(): ProjectTheme {
    const directory = createTempDir()

    writeProject(directory)

    return readProjectTheme(directory)
  }

  describe('when the project has no Tailwind stylesheet nor preset', () => {
    it('then there is nothing to render', () => {
      expect(renderProjectTheme({ stylesheets: [], presets: [] }, tailwind)).toBeUndefined()
    })
  })

  describe('when the project has a preset and a Tailwind entry', () => {
    it('then it explains how the project theme combines with maz-ui', () => {
      const output = renderProjectTheme(projectTheme(), tailwind) as string

      expect(output).toContain('## Your project theme')
      expect(output).toContain('**The preset**')
    })

    it('then it lists the preset values with the classes that use them', () => {
      const output = renderProjectTheme(projectTheme(), tailwind) as string

      expect(output).toContain('### Preset `brand` - `apps/web/config/brand-preset.ts` (`brandPreset`, base `mazUi`)')
      expect(output).toContain('| `primary` | `bg-primary` `text-primary` | `#C7330F` | `#FF5A36` |')
      expect(output).toContain('| `primary-foreground` | `text-primary-foreground` | `#FFFFFF` | - |')
      expect(output).toContain('| `shadow` | `shadow-shadow/20` | `#000` | - |')
      expect(output).toContain('| `font-display-stack` | `--maz-font-display-stack` | `font-display` | `Barlow, sans-serif` |')
      expect(output).toContain('| `unknown-key` | `--maz-unknown-key` | - | `x` |')
      expect(output).toContain('| `rounded-md` | `4px` |')
      expect(output).toContain('| `shadow-elevation` | `0 1px 2px black` |')
      expect(output).toContain('| `components.container.bg` | `bg-container`: MazCard')
      expect(output).toContain('`{"light":"#FFFFFF","dark":"#141B5E"}`')
      expect(output).toContain('| `components.custom.size` | - | `2px` |')
    })

    it('then it lists the project tokens, variants, utilities, keyframes and maz-ui variables', () => {
      const output = renderProjectTheme(projectTheme(), tailwind) as string

      expect(output).toContain('### Tailwind `apps/web/src/main.css`')
      expect(output).toContain('| `animate-rise` | `--animate-rise` |')
      expect(output).toContain('| `rounded-card` | `--radius-card` | `12px` | - |')
      expect(output).toContain('Figures of the scoreboard Redefines the maz-ui token (maz-ui: `var(--maz-font-display-stack)`)')
      expect(output).toContain('| `short:` | `(@media (max-height: 50rem))` |')
      expect(output).toContain('| `scrollbar-none` | `scrollbar-width: none;` |')
      expect(output).toContain('Keyframes without `animate-*` token: `reveal`.')
      expect(output).toContain('| `--maz-container-max-width` | `1024px` | `html` |')
      expect(output).toContain('Reset namespaces: `--color-*`')
    })

    it('then a preset without colors only shows what it sets', () => {
      const output = renderProjectTheme({ stylesheets: [], presets: [{ file: 'preset.ts', overrides: { foundation: { space: '0.3rem' } } }] }, tailwind) as string

      expect(output).toContain('### Preset - `preset.ts`\n')
      expect(output).toContain('| `space` | `--maz-space` | every spacing utility')
      expect(output).not.toContain('| Color |')
    })
  })

  describe('when topics are given', () => {
    it('then only the matching parts of the project theme are rendered', () => {
      const output = renderProjectTheme(projectTheme(), tailwind, ['radius']) as string

      expect(output).toContain('| `rounded-md` | `4px` |')
      expect(output).toContain('`rounded-card`')
      expect(output).not.toContain('`#C7330F`')
      expect(output).not.toContain('| `animate-rise`')
      expect(output).not.toContain('`short:`')
      expect(output).not.toContain('Keyframes')
      expect(output).not.toContain('shadow-elevation')
    })

    it('then the parts without matching content are left out', () => {
      const output = renderProjectTheme(projectTheme(), tailwind, ['z-index']) as string

      expect(output).not.toContain('### Preset')
      expect(output).not.toContain('### Tailwind')
    })
  })
})

describe('given stylesheetProblems', () => {
  describe('when a Tailwind entry does not import the maz-ui theme', () => {
    it('then it says the maz-ui classes do not exist', () => {
      expect(stylesheetProblems(readStylesheet('a.css', '@import \'tailwindcss\';'))[0]).toContain('The maz-ui theme is not imported')
    })
  })

  describe('when a Tailwind entry imports the theme without the utilities', () => {
    it('then it says the utilities do not exist', () => {
      expect(stylesheetProblems(readStylesheet('a.css', '@import \'tailwindcss\';\n@import \'maz-ui/tailwindcss/theme.css\';'))[0]).toContain('utilities.css` is not imported')
    })
  })

  describe('when the stylesheet is not an entry', () => {
    it('then nothing is reported', () => {
      expect(stylesheetProblems(readStylesheet('a.css', '@theme { --color-a: red; }'))).toEqual([])
    })
  })

  describe('when the problems are rendered', () => {
    it('then they are quoted under the stylesheet', () => {
      const output = renderProjectTheme({ stylesheets: [readStylesheet('a.css', '@import \'tailwindcss\';')], presets: [] }, getKnowledge().manifest.tailwind)

      expect(output).toContain('> The maz-ui theme is not imported')
    })
  })
})

describe('given mazUiThemeVariables', () => {
  describe('when the maz-ui tokens are mapped to their Tailwind variables', () => {
    it('then each namespace has its variable', () => {
      const variables = mazUiThemeVariables(getKnowledge().manifest.tailwind)

      expect(variables.get('--color-primary')).toBe('var(--maz-primary)')
      expect(variables.get('--font-display')).toBe('var(--maz-font-display-stack)')
      expect(variables.get('--radius-md')).toBe('var(--maz-rounded-md)')
      expect(variables.has('--shadow-elevation')).toBe(true)
      expect(variables.get('--breakpoint-mob-s')).toBe('320px')
      expect(variables.has('--ease-out')).toBe(true)
      expect(variables.has('--duration-fast')).toBe(true)
      expect(variables.has('--z-1')).toBe(true)
    })
  })
})
