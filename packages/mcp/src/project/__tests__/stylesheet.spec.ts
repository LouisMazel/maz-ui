import { isTailwindStylesheet, parseCss, readStylesheet, tokenOf } from '../stylesheet'

const ENTRY = `@import 'maz-ui/style.css';
@import "tailwindcss";
@import url('maz-ui/tailwindcss/theme.css');

@layer base {
  html {
    --maz-container-max-width: 1024px;
    background-image: url("data:image/svg+xml;utf8,<svg></svg>");
  }

  @media (width >= 1104px) {
    :root {
      --maz-container-width: var(--maz-container-max-width);
    }
  }
}

@custom-variant short (@media (max-height: 50rem));

@custom-variant hocus {
  &:hover, &:focus {
    @slot;
  }
}

@theme {
  --color-*: initial;
  /* Broadcast type:
     literal names for @nuxt/fonts */
  --font-display: 'Barlow Condensed', sans-serif;
  --font-mono: ui-monospace;
  --text-tiny: 0.625rem;
  --text-tiny--line-height: 1;
  --animate-rise: rise 0.5s var(--maz-easing-out) backwards
}

@theme inline {
  --color-brand-soft: color-mix(in oklab, var(--maz-primary) 15%, transparent);
}

@utility scrollbar-none {
  scrollbar-width: none;
}

@keyframes rise {
  from {
    opacity: 0;
  }
}
`

describe('given parseCss', () => {
  describe('when a stylesheet has nested blocks, strings with semicolons and comments', () => {
    it('then each declaration keeps its block context and its comment', () => {
      const { declarations } = parseCss(ENTRY)
      const font = declarations.find(declaration => declaration.property === '--font-display')
      const image = declarations.find(declaration => declaration.property === 'background-image')

      expect(font?.context).toEqual(['@theme'])
      expect(font?.comment).toBe('Broadcast type: literal names for @nuxt/fonts')
      expect(image?.value).toBe('url("data:image/svg+xml;utf8,<svg></svg>")')
      expect(declarations.find(declaration => declaration.property === '--maz-container-width')?.context).toEqual(['@layer base', '@media (width >= 1104px)', ':root'])
    })

    it('then the last declaration of a block without semicolon is read', () => {
      expect(parseCss(ENTRY).declarations.find(declaration => declaration.property === '--animate-rise')?.value).toBe('rise 0.5s var(--maz-easing-out) backwards')
    })

    it('then the at-rule statements and blocks are listed', () => {
      const { statements, blocks } = parseCss(ENTRY)

      expect(statements).toContain('@custom-variant short (@media (max-height: 50rem))')
      expect(blocks.map(block => block.prelude)).toEqual(['@custom-variant hocus', '@utility scrollbar-none', '@keyframes rise'])
    })
  })
})

describe('given readStylesheet', () => {
  describe('when the Tailwind entry of a project is read', () => {
    const stylesheet = readStylesheet('app/main.css', ENTRY)

    it('then the imports are listed', () => {
      expect(stylesheet.imports).toEqual(['maz-ui/style.css', 'tailwindcss', 'maz-ui/tailwindcss/theme.css'])
    })

    it('then the theme tokens are listed with their classes, without sub-properties', () => {
      expect(stylesheet.tokens.map(token => [token.variable, token.usage, token.inline])).toEqual([
        ['--font-display', 'font-display', false],
        ['--font-mono', 'font-mono', false],
        ['--text-tiny', 'text-tiny', false],
        ['--animate-rise', 'animate-rise', false],
        ['--color-brand-soft', 'bg-brand-soft text-brand-soft border-brand-soft...', true],
      ])
    })

    it('then the resets, variants, utilities and keyframes are listed', () => {
      expect(stylesheet.resets).toEqual(['--color-*'])
      expect(stylesheet.variants).toEqual([
        { name: 'short', definition: '(@media (max-height: 50rem))' },
        { name: 'hocus', definition: '{ &:hover, &:focus { @slot; } }' },
      ])
      expect(stylesheet.utilities).toEqual([{ name: 'scrollbar-none', css: 'scrollbar-width: none;' }])
      expect(stylesheet.keyframes).toEqual(['rise'])
    })

    it('then the maz-ui variables set in CSS are listed with their selector', () => {
      expect(stylesheet.mazVariables).toEqual([
        { variable: '--maz-container-max-width', value: '1024px', selector: 'html' },
        { variable: '--maz-container-width', value: 'var(--maz-container-max-width)', selector: '@media (width >= 1104px) :root' },
      ])
    })
  })
})

describe('given tokenOf', () => {
  describe('when a token belongs to a Tailwind namespace', () => {
    it.each([
      ['--color-brand', 'bg-brand text-brand border-brand...', 'colors'],
      ['--font-weight-heavy', 'font-heavy', 'typography'],
      ['--font-serif', 'font-serif', 'typography'],
      ['--text-huge', 'text-huge', 'typography'],
      ['--tracking-wide', 'tracking-wide', 'typography'],
      ['--leading-tight', 'leading-tight', 'typography'],
      ['--animate-rise', 'animate-rise', 'typography'],
      ['--ease-snap', 'ease-snap', 'typography'],
      ['--inset-shadow-deep', 'inset-shadow-deep', 'shadows'],
      ['--drop-shadow-glow', 'drop-shadow-glow', 'shadows'],
      ['--spacing-gutter', 'p-gutter gap-gutter w-gutter...', 'spacing'],
      ['--aspect-card', 'aspect-card', 'layout'],
      ['--text-shadow-glow', 'text-shadow-glow', 'shadows'],
      ['--radius-card', 'rounded-card', 'radius'],
      ['--shadow-glow', 'shadow-glow', 'shadows'],
      ['--breakpoint-xxl', 'xxl:', 'breakpoints'],
      ['--container-prose', 'max-w-prose @prose:', 'layout'],
      ['--duration-snap', 'duration-(--duration-snap)', 'typography'],
      ['--spacing', 'p-4 gap-2 w-8... (base step)', 'spacing'],
      ['--z-modal', 'z-modal', 'z-index'],
    ])('then %s gives %s', (variable, usage, topic) => {
      expect(tokenOf(variable, '1')).toMatchObject({ usage, topic })
    })
  })

  describe('when a token has no namespace', () => {
    it('then it is a CSS variable', () => {
      expect(tokenOf('--header-height', '4rem')).toMatchObject({ usage: 'var(--header-height)', topic: 'css-variables' })
    })
  })
})

describe('given isTailwindStylesheet', () => {
  describe('when a stylesheet imports Tailwind or uses its at-rules', () => {
    it('then it is a Tailwind stylesheet', () => {
      expect(isTailwindStylesheet('@import \'tailwindcss\';')).toBe(true)
      expect(isTailwindStylesheet('@import "maz-ui/tailwindcss/theme.css";')).toBe(true)
      expect(isTailwindStylesheet('@theme { --color-brand: red; }')).toBe(true)
    })
  })

  describe('when a stylesheet is plain CSS', () => {
    it('then it is not a Tailwind stylesheet', () => {
      expect(isTailwindStylesheet('.a { color: red; }')).toBe(false)
    })
  })
})
