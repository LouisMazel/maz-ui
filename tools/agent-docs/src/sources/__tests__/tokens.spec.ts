import { getSourcePaths } from '../../paths'
import {
  collectTailwindTokens,
  parseColors,
  parseCustomVariants,
  parseDeclarations,
  parseTransitions,
  parseUtilities,
  stripCssComments,
} from '../tokens'

describe('given stripCssComments', () => {
  describe('when the css has block comments', () => {
    it('then removes them', () => {
      expect(stripCssComments('/* a\n --x: 1; */ .a { color: red; } /* b */')).toBe(' .a { color: red; } ')
    })
  })
})

describe('given parseDeclarations', () => {
  describe('when the css declares custom properties', () => {
    it('then returns names and collapsed values, ignoring commented ones', () => {
      const css = '@theme {\n  /* --hidden: 1; */\n  --spacing: var(--maz-space);\n  --shadow-xs: 0 1px 2px\n    0 red;\n}'

      expect(parseDeclarations(css)).toEqual([
        { name: '--spacing', value: 'var(--maz-space)' },
        { name: '--shadow-xs', value: '0 1px 2px 0 red' },
      ])
    })
  })
})

describe('given parseColors', () => {
  describe('when the css declares base colors, foregrounds and scales', () => {
    it('then groups them by color', () => {
      const css = [
        '--color-primary: var(--maz-primary);',
        '--color-primary-foreground: var(--maz-primary-foreground);',
        '--color-primary-50: oklch(from var(--maz-primary) l c h);',
        '--color-primary-950: oklch(from var(--maz-primary) l c h);',
        '--color-custom-500: var(--maz-custom);',
        '--radius-md: 1rem;',
      ].join('\n')

      expect(parseColors(css)).toEqual([
        { name: 'primary', variable: '--maz-primary', foreground: true, scale: ['50', '950'], usage: 'Brand primary: main actions, links, focus' },
        { name: 'custom', variable: '--maz-custom', foreground: false, scale: ['500'], usage: '' },
      ])
    })
  })

  describe('when a scale step is declared before the base color', () => {
    it('then takes the variable of the base color', () => {
      const css = '--color-muted-50: oklch(from var(--maz-other) l c h);\n--color-muted: var(--maz-muted);\n--color-plain: red;'

      expect(parseColors(css).map(color => [color.name, color.variable])).toEqual([['muted', '--maz-muted'], ['plain', '']])
    })
  })
})

describe('given parseUtilities', () => {
  describe('when the css declares utilities', () => {
    it('then returns their name and css', () => {
      const css = '/* @utility hidden { } */\n@utility flex-center {\n  align-items: center;\n  justify-content: center;\n}\n\n@utility cap-f {\n  &::first-letter {\n    text-transform: capitalize;\n  }\n}'

      expect(parseUtilities(css)).toEqual([
        { name: 'flex-center', css: 'align-items: center; justify-content: center;' },
        { name: 'cap-f', css: '&::first-letter { text-transform: capitalize; }' },
      ])
    })
  })
})

describe('given parseCustomVariants', () => {
  describe('when the css declares custom variants', () => {
    it('then returns their selector', () => {
      expect(parseCustomVariants('@custom-variant dark (&:where(.dark, .dark *));\n@custom-variant short (@media (max-height: 50rem));')).toEqual([
        { name: 'dark', value: '&:where(.dark, .dark *)' },
        { name: 'short', value: '@media (max-height: 50rem)' },
      ])
    })
  })
})

describe('given parseTransitions', () => {
  describe('when the css declares Vue transition classes', () => {
    it('then returns the unique sorted transition names', () => {
      const css = '.maz-slide-enter-active {} .maz-slide-leave-active {} .maz-fade-enter-active, .maz-scale-fade-enter-active {}'

      expect(parseTransitions(css)).toEqual(['maz-fade', 'maz-scale-fade', 'maz-slide'])
    })
  })
})

describe('given collectTailwindTokens', () => {
  describe('when reading the maz-ui sources', () => {
    const paths = getSourcePaths()
    const tokens = collectTailwindTokens(paths.libTailwind, paths.libCss)

    it('then exposes the primary color with foreground and full scale', () => {
      const primary = tokens.colors.find(color => color.name === 'primary')

      expect(primary?.foreground).toBe(true)
      expect(primary?.variable).toBe('--maz-primary')
      expect(primary?.scale).toHaveLength(11)
    })

    it('then exposes the component surfaces', () => {
      expect(tokens.colors.find(color => color.name === 'container')?.variable).toBe('--maz-container-bg')
      expect(tokens.colors.find(color => color.name === 'input')?.variable).toBe('--maz-input-bg')
    })

    it('then exposes breakpoints, radius, shadows and z-index', () => {
      expect(tokens.breakpoints).toContainEqual({ name: 'mob-s:', value: '320px' })
      expect(tokens.radius.map(token => token.name)).toContain('rounded')
      expect(tokens.radius.map(token => token.name)).toContain('rounded-md')
      expect(tokens.shadows.map(token => token.name)).toContain('shadow-elevation')
      expect(tokens.zIndex).toContainEqual({ name: 'z-default-backdrop', value: '1050' })
    })

    it('then exposes typography, durations, easings and spacing', () => {
      expect(tokens.fonts.map(token => token.name)).toEqual(expect.arrayContaining(['font-sans', 'font-mono', 'font-display']))
      expect(tokens.durations.map(token => token.name)).toContain('duration-(--duration-fast)')
      expect(tokens.easings.map(token => token.name)).toContain('ease-out')
      expect(tokens.spacing[0].value).toBe('var(--maz-space)')
    })

    it('then exposes utilities, variants, layout variables, transitions and entries', () => {
      expect(tokens.utilities.map(utility => utility.name)).toContain('flex-center')
      expect(tokens.variants.map(variant => variant.name)).toContain('dark')
      expect(tokens.containerVariables.map(token => token.name)).toContain('--maz-container-max-width')
      expect(new Set(tokens.containerVariables.map(token => token.name)).size).toBe(tokens.containerVariables.length)
      expect(tokens.transitions).toContain('maz-scale-fade')
      expect(tokens.entries.map(entry => entry.path)).toContain('maz-ui/tailwindcss/theme.css')
    })
  })
})
