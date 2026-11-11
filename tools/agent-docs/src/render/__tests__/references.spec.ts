import type { TailwindManifest } from '../../types'

import { renderIconsReference, renderTailwindReference } from '../references'

const tokens: TailwindManifest = {
  entries: [
    { path: 'maz-ui/tailwindcss/theme.css', description: 'Every token' },
  ],
  colors: [
    {
      name: 'primary',
      variable: '--maz-primary',
      foreground: true,
      scale: ['50', '500', '950'],
      usage: 'Brand',
    },
    {
      name: 'shadow',
      variable: '--maz-shadow',
      foreground: false,
      scale: ['50'],
      usage: 'Shadow tint',
    },
    {
      name: 'overlay',
      variable: '--maz-overlay',
      foreground: false,
      scale: [],
      usage: 'Scrims',
    },
    {
      name: 'container',
      variable: '--maz-container-bg',
      foreground: false,
      scale: [],
      usage: 'Cards',
    },
    {
      name: 'elevation',
      variable: '--maz-shadow',
      foreground: false,
      scale: [],
      usage: 'Alias',
    },
    {
      name: 'plain',
      variable: '',
      foreground: false,
      scale: [],
      usage: 'Pipe | inside',
    },
  ],
  radius: [
    { name: 'rounded-md', value: 'var(--maz-rounded-md)' },
  ],
  shadows: [
    { name: 'shadow-elevation', value: 'var(--maz-shadow-style-elevation)' },
  ],
  breakpoints: [
    { name: 'tab-m:', value: '768px' },
    { name: 'custom:', value: '1px' },
  ],
  containers: [
    { name: '@tab-m:', value: '768px' },
  ],
  zIndex: [
    { name: 'z-15', value: '15' },
  ],
  fonts: [
    { name: 'font-sans', value: 'var(--maz-font-family)' },
  ],
  durations: [
    { name: 'duration-(--duration-fast)', value: 'var(--maz-motion-fast, 100ms)' },
  ],
  easings: [
    { name: 'ease-out', value: 'var(--maz-easing-out)' },
  ],
  spacing: [],
  utilities: [
    { name: 'flex-center', css: 'align-items: center;', description: 'Centers the children' },
    { name: 'cap-f', css: 'text-transform: capitalize;' },
    { name: 'text-title-1', css: 'font-size: var(--maz-typography-title-1-size, 2rem); font-weight: var(--maz-typography-title-1-weight, 700);', description: 'Page title' },
    { name: 'text-code', css: 'font-size: 0.875em;' },
    { name: 'rich-text', css: 'color: red;', description: 'Raw HTML' },
    { name: 'rich-text-sm', css: '--maz-rich-text-size: 0.875rem;' },
  ],
  variants: [
    { name: 'dark', value: '&:where(.dark, .dark *)' },
  ],
  containerVariables: [
    { name: '--maz-container-max-width', value: '1440px' },
  ],
  transitions: ['maz-fade', 'maz-slide'],
}

describe('given renderTailwindReference', () => {
  describe('when rendering the theme tokens', () => {
    const markdown = renderTailwindReference(tokens)

    it('then states the setup without prefix and no version number', () => {
      expect(markdown).toContain('provided by the maz-ui theme')
      expect(markdown).toContain('@import \'maz-ui/tailwindcss/theme.css\';')
      expect(markdown).toContain('**without prefix**')
    })

    it('then renders one row per color with its utilities and skips the elevation alias', () => {
      expect(markdown).toContain('| `primary` | `bg-primary` `text-primary` `border-primary` | `text-primary-foreground` | `-50` to `-950` | `--maz-primary` | Brand |')
      expect(markdown).toContain('| `shadow` | `shadow-shadow/20` `bg-shadow` | - |')
      expect(markdown).toContain('| `overlay` | `bg-overlay` `bg-overlay/60` | - | - |')
      expect(markdown).toContain('| `container` | `bg-container` | - | - | `--maz-container-bg` | Cards |')
      expect(markdown).not.toContain('`elevation`')
    })

    it('then escapes pipes in table cells', () => {
      expect(markdown).toContain('| - | Pipe \\| inside |')
      expect(markdown).toContain('`&:where(.dark, .dark *)`')
    })

    it('then falls back to the default spacing variable and lists every other token', () => {
      expect(markdown).toContain('`--spacing` is `var(--maz-space)`')
      expect(markdown).toContain('| `tab-m:` | 768px | tablets portrait (Tailwind `md`) |')
      expect(markdown).toContain('| `custom:` | 1px | - |')
      expect(markdown).toContain('| `@tab-m:` | 768px |')
      expect(markdown).toContain('| `z-15` | `15` |')
      expect(markdown).toContain('| `duration-(--duration-fast)` | `var(--maz-motion-fast, 100ms)` |')
      expect(markdown).toContain('| `flex-center` | Centers the children | `align-items: center;` |')
      expect(markdown).toContain('| `cap-f` | - | `text-transform: capitalize;` |')
      expect(markdown).toContain('| `--maz-container-max-width` | `1440px` |')
      expect(markdown).toContain('`maz-fade`, `maz-slide`')
    })
  })

  describe('when rendering the type scale and the rich text', () => {
    const markdown = renderTailwindReference(tokens)

    it('then lists each level with its defaults, apart from the other utilities', () => {
      expect(markdown).toContain('| `text-title-1` | Page title | `2rem` | `700` | `-` |')
      expect(markdown).toContain('| `text-code` | - | `-` | `-` | `-` |')
      expect(markdown).toContain('| `rich-text` | Raw HTML |')
      expect(markdown).toContain('| `rich-text-sm` | - |')
      expect(markdown).not.toContain('| `text-title-1` | Page title | `font-size')
    })

    it('then documents the layout without the legacy variables', () => {
      const tokensWithLegacy = {
        ...tokens,
        containerVariables: [
          ...tokens.containerVariables,
          { name: '--maz-container-width', value: 'x' },
          { name: '--maz-container-padding', value: 'y' },
        ],
      }
      const layout = renderTailwindReference(tokensWithLegacy)

      expect(layout).toContain('## Layout')
      expect(layout).toContain('### Action hierarchy')
      expect(layout).not.toContain('`--maz-container-width`')
      expect(layout).not.toContain('| `--maz-container-padding` |')
    })
  })

  describe('when the spacing token is known', () => {
    it('then renders its value', () => {
      expect(renderTailwindReference({
        ...tokens,
        spacing: [
          { name: 'p-*', value: 'var(--custom-space)' },
        ],
      })).toContain('`--spacing` is `var(--custom-space)`')
    })
  })
})

describe('given renderIconsReference', () => {
  describe('when rendering icon groups', () => {
    it('then lists non empty groups with their count and the import patterns', () => {
      const markdown = renderIconsReference([
        {
          title: 'Interface icons',
          description: 'Outline icons',
          names: ['MazTrash', 'MazXMark'],
        },
        { title: 'Logos', description: 'Brands', names: [] },
      ], 2)

      expect(markdown).toContain('The 2 icons of `@maz-ui/icons`')
      expect(markdown).toContain('## Interface icons (2)\n\nOutline icons\n\nMazTrash, MazXMark')
      expect(markdown).not.toContain('## Logos')
      expect(markdown).toContain('@maz-ui/icons/static/MazTrash')
    })
  })
})
