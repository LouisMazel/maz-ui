import { describe, expect, it } from 'vitest'
import {
  hasFoundationRadius,
  hasMazAvatarBoundSize,
  hasMazBadgeLengthSize,
  hasMazIconLegacyApi,
  hasMazUiDistImport,
  hasMazUiRootImport,
  hasValibotImport,
  transformAvatarSize,
  transformBadgeSize,
  transformBareIconNames,
  transformClassNames,
  transformConfig,
  transformCssVars,
  transformDeps,
  transformFile,
  transformHslVar,
  transformImports,
  transformMazIcon,
  transformPresetColors,
  transformProps,
  transformStyleImports,
} from './transform'

describe('transformImports', () => {
  describe('Given a maz-ui/styles import', () => {
    describe('When transforming', () => {
      it('renames it to maz-ui/style.css', () => {
        expect(transformImports(`import 'maz-ui/styles'`)).toBe(`import 'maz-ui/style.css'`)
        expect(transformImports(`import "maz-ui/styles"`)).toBe(`import "maz-ui/style.css"`)
      })
    })
  })

  describe('Given a maz-ui/aos-styles import', () => {
    describe('When transforming', () => {
      it('renames it to maz-ui/aos.css', () => {
        expect(transformImports(`import 'maz-ui/aos-styles'`)).toBe(`import 'maz-ui/aos.css'`)
      })
    })
  })

  describe('Given an unrelated import', () => {
    describe('When transforming', () => {
      it('leaves it unchanged', () => {
        expect(transformImports(`import { MazBtn } from 'maz-ui/components'`))
          .toBe(`import { MazBtn } from 'maz-ui/components'`)
        expect(transformImports(`import 'tailwindcss/styles'`)).toBe(`import 'tailwindcss/styles'`)
      })
    })
  })

  describe('Given a static named import from "maz-ui"', () => {
    describe('When transforming', () => {
      it('rewrites the source to "@maz-ui/utils"', () => {
        expect(transformImports(`import { sleep } from 'maz-ui'`))
          .toBe(`import { sleep } from '@maz-ui/utils'`)
        expect(transformImports(`import { sleep } from "maz-ui"`))
          .toBe(`import { sleep } from "@maz-ui/utils"`)
      })
    })
  })

  describe('Given a type-only re-export from "maz-ui"', () => {
    describe('When transforming', () => {
      it('rewrites the source to "@maz-ui/utils"', () => {
        expect(transformImports(`export type { DeepPartial } from 'maz-ui'`))
          .toBe(`export type { DeepPartial } from '@maz-ui/utils'`)
      })
    })
  })

  describe('Given a dynamic import("maz-ui")', () => {
    describe('When transforming', () => {
      it('rewrites the specifier to "@maz-ui/utils"', () => {
        expect(transformImports(`const m = await import('maz-ui')`))
          .toBe(`const m = await import('@maz-ui/utils')`)
      })
    })
  })

  describe('Given a require("maz-ui") call', () => {
    describe('When transforming', () => {
      it('rewrites the specifier to "@maz-ui/utils"', () => {
        expect(transformImports(`const m = require('maz-ui')`))
          .toBe(`const m = require('@maz-ui/utils')`)
      })
    })
  })

  describe('Given a subpath specifier', () => {
    describe('When transforming', () => {
      it('leaves it unchanged', () => {
        expect(transformImports(`import { MazBtn } from 'maz-ui/components'`))
          .toBe(`import { MazBtn } from 'maz-ui/components'`)
        expect(transformImports(`import 'maz-ui/style.css'`))
          .toBe(`import 'maz-ui/style.css'`)
        expect(transformImports(`import { useToast } from 'maz-ui/composables'`))
          .toBe(`import { useToast } from 'maz-ui/composables'`)
      })
    })
  })

  describe('Given a bare side-effect import "maz-ui"', () => {
    describe('When transforming', () => {
      it('leaves it unchanged', () => {
        expect(transformImports(`import 'maz-ui'`)).toBe(`import 'maz-ui'`)
      })
    })
  })

  describe('Given a "maz-ui" string literal outside of an import context', () => {
    describe('When transforming', () => {
      it('leaves it unchanged', () => {
        expect(transformImports(`const name = 'maz-ui'`))
          .toBe(`const name = 'maz-ui'`)
        expect(transformImports(`const cfg = { from: 'maz-ui' }`))
          .toBe(`const cfg = { from: 'maz-ui' }`)
      })
    })
  })
})

describe('hasMazUiRootImport', () => {
  describe('Given content with `from \'maz-ui\'`', () => {
    describe('When checked', () => {
      it('returns true', () => {
        expect(hasMazUiRootImport(`import { sleep } from 'maz-ui'`)).toBe(true)
        expect(hasMazUiRootImport(`export * from "maz-ui"`)).toBe(true)
      })
    })
  })

  describe('Given content with a dynamic import or require of "maz-ui"', () => {
    describe('When checked', () => {
      it('returns true', () => {
        expect(hasMazUiRootImport(`await import('maz-ui')`)).toBe(true)
        expect(hasMazUiRootImport(`const m = require('maz-ui')`)).toBe(true)
      })
    })
  })

  describe('Given only subpath specifiers', () => {
    describe('When checked', () => {
      it('returns false', () => {
        expect(hasMazUiRootImport(`import { MazBtn } from 'maz-ui/components'`)).toBe(false)
        expect(hasMazUiRootImport(`import 'maz-ui/style.css'`)).toBe(false)
      })
    })
  })

  describe('Given an unrelated string literal', () => {
    describe('When checked', () => {
      it('returns false', () => {
        expect(hasMazUiRootImport(`const x = 'maz-ui'`)).toBe(false)
        expect(hasMazUiRootImport(`const cfg = { from: 'maz-ui' }`)).toBe(false)
      })
    })
  })
})

describe('hasFoundationRadius', () => {
  describe('Given a preset with radius inside foundation', () => {
    describe('When checked', () => {
      it('returns true', () => {
        const content = `export const preset = { foundation: { radius: '0.5rem', 'border-width': '1px' } }`
        expect(hasFoundationRadius(content)).toBe(true)
      })
    })
  })

  describe('Given a quoted radius key inside foundation', () => {
    describe('When checked', () => {
      it('returns true', () => {
        const content = `foundation: { 'radius': '0.5rem' }`
        expect(hasFoundationRadius(content)).toBe(true)
      })
    })
  })

  describe('Given a preset without radius in foundation', () => {
    describe('When checked', () => {
      it('returns false', () => {
        const content = `foundation: { 'base-font-size': '14px', 'border-width': '1px' }`
        expect(hasFoundationRadius(content)).toBe(false)
      })
    })
  })

  describe('Given a radius key outside any foundation block', () => {
    describe('When checked', () => {
      it('returns false', () => {
        const content = `const chartCfg = { radius: 4 }`
        expect(hasFoundationRadius(content)).toBe(false)
      })
    })
  })

  describe('Given an unrelated key with the substring "radius"', () => {
    describe('When checked', () => {
      it('returns false', () => {
        const content = `foundation: { 'border-radius-fallback': '0.5rem' }`
        expect(hasFoundationRadius(content)).toBe(false)
      })
    })
  })
})

describe('transformProps', () => {
  describe('Given left-icon and right-icon attributes on a Maz component', () => {
    describe('When transforming', () => {
      it('renames to start-icon and end-icon', () => {
        expect(transformProps(`<MazBtn left-icon="/user.svg" right-icon="/arrow.svg">x</MazBtn>`))
          .toBe(`<MazBtn start-icon="/user.svg" end-icon="/arrow.svg">x</MazBtn>`)
      })
    })
  })

  describe('Given bound :left-icon and :right-icon', () => {
    describe('When transforming', () => {
      it('renames to :start-icon and :end-icon', () => {
        expect(transformProps(`<MazBtn :left-icon="MazUser" :right-icon="MazArrow" />`))
          .toBe(`<MazBtn :start-icon="MazUser" :end-icon="MazArrow" />`)
      })
    })
  })

  describe('Given #left-icon and #right-icon slot bindings', () => {
    describe('When transforming', () => {
      it('renames to #start-icon and #end-icon', () => {
        expect(transformProps(`<MazBtn>\n  <template #left-icon>x</template>\n</MazBtn>`))
          .toBe(`<MazBtn>\n  <template #start-icon>x</template>\n</MazBtn>`)
      })
    })
  })

  describe('Given #icon-left and #icon-right MazContainer slots', () => {
    describe('When transforming', () => {
      it('renames to #icon-start and #icon-end', () => {
        expect(transformProps(`<MazContainer>\n  <template #icon-left>x</template>\n  <template #icon-right>y</template>\n</MazContainer>`))
          .toBe(`<MazContainer>\n  <template #icon-start>x</template>\n  <template #icon-end>y</template>\n</MazContainer>`)
      })
    })
  })

  describe('Given footer-align="left" or "right"', () => {
    describe('When transforming', () => {
      it('flips to start or end', () => {
        expect(transformProps(`<MazCard footer-align="left" />`))
          .toBe(`<MazCard footer-align="start" />`)
        expect(transformProps(`<MazCard footer-align="right" />`))
          .toBe(`<MazCard footer-align="end" />`)
      })
    })
  })

  describe('Given variant="left" inside a Maz tag', () => {
    describe('When transforming', () => {
      it('flips to start', () => {
        expect(transformProps(`<MazDrawer variant="right" />`))
          .toBe(`<MazDrawer variant="end" />`)
      })

      it('keeps top and bottom unchanged', () => {
        expect(transformProps(`<MazDrawer variant="top" />`))
          .toBe(`<MazDrawer variant="top" />`)
      })
    })
  })

  describe('Given variant="left" outside a Maz tag', () => {
    describe('When transforming', () => {
      it('leaves it untouched', () => {
        expect(transformProps(`<MyButton variant="left" />`))
          .toBe(`<MyButton variant="left" />`)
      })
    })
  })

  describe('Given color="background" inside a Maz tag', () => {
    describe('When transforming', () => {
      it('renames to surface', () => {
        expect(transformProps(`<MazBtn color="background">x</MazBtn>`))
          .toBe(`<MazBtn color="surface">x</MazBtn>`)
      })
    })
  })

  describe('Given color="background" outside a Maz tag', () => {
    describe('When transforming', () => {
      it('leaves it untouched', () => {
        expect(transformProps(`<MyComp color="background" />`))
          .toBe(`<MyComp color="background" />`)
      })
    })
  })

  describe('Given active-color="background"', () => {
    describe('When transforming', () => {
      it('renames to surface', () => {
        expect(transformProps(`<MazPagination active-color="background" />`))
          .toBe(`<MazPagination active-color="surface" />`)
      })
    })
  })

  describe('Given rounded-size="base"', () => {
    describe('When transforming', () => {
      it('renames to md', () => {
        expect(transformProps(`<MazBtn rounded-size="base" />`))
          .toBe(`<MazBtn rounded-size="md" />`)
      })
    })
  })

  describe('Given a MazPullToRefresh with an on-click prop', () => {
    describe('When transforming', () => {
      it('renames the bound :on-click to :on-refresh', () => {
        expect(transformProps(`<MazPullToRefresh :on-click="refresh" />`))
          .toBe(`<MazPullToRefresh :on-refresh="refresh" />`)
      })

      it('renames the camelCase :onClick to :onRefresh', () => {
        expect(transformProps(`<MazPullToRefresh :onClick="refresh" />`))
          .toBe(`<MazPullToRefresh :onRefresh="refresh" />`)
      })

      it('renames the kebab-case tag variant', () => {
        expect(transformProps(`<maz-pull-to-refresh :on-click="refresh" />`))
          .toBe(`<maz-pull-to-refresh :on-refresh="refresh" />`)
      })
    })
  })

  describe('Given an on-click prop outside a MazPullToRefresh tag', () => {
    describe('When transforming', () => {
      it('leaves it untouched', () => {
        expect(transformProps(`<MyButton :on-click="refresh" />`))
          .toBe(`<MyButton :on-click="refresh" />`)
      })
    })
  })

  describe('Given .--has-left-icon and .--has-right-icon CSS class selectors', () => {
    describe('When transforming', () => {
      it('renames to .--has-start-icon and .--has-end-icon', () => {
        expect(transformProps(`.--has-left-icon { padding-left: 0.5rem; }`))
          .toBe(`.--has-start-icon { padding-left: 0.5rem; }`)
        expect(transformProps(`.--has-right-icon { padding-right: 0.5rem; }`))
          .toBe(`.--has-end-icon { padding-right: 0.5rem; }`)
      })
    })
  })

  describe('Given a MazAvatar with a static unit size', () => {
    describe('When transforming', () => {
      it('multiplies a rem value by 3', () => {
        expect(transformProps(`<MazAvatar size="2rem" />`))
          .toBe(`<MazAvatar size="6rem" />`)
      })

      it('multiplies a px value by 3', () => {
        expect(transformProps(`<MazAvatar size="20px" />`))
          .toBe(`<MazAvatar size="60px" />`)
      })

      it('multiplies a decimal value by 3', () => {
        expect(transformProps(`<MazAvatar size="1.5rem" />`))
          .toBe(`<MazAvatar size="4.5rem" />`)
      })

      it('preserves single quotes', () => {
        expect(transformProps(`<MazAvatar size='2em' />`))
          .toBe(`<MazAvatar size='6em' />`)
      })

      it('supports the kebab-case tag', () => {
        expect(transformProps(`<maz-avatar size="2rem" />`))
          .toBe(`<maz-avatar size="6rem" />`)
      })
    })
  })

  describe('Given a MazAvatar with a modern CSS unit', () => {
    describe('When transforming', () => {
      it('multiplies any alphabetic unit by 3', () => {
        expect(transformAvatarSize(`<MazAvatar size="2dvh" />`))
          .toBe(`<MazAvatar size="6dvh" />`)
        expect(transformAvatarSize(`<MazAvatar size="3cqw" />`))
          .toBe(`<MazAvatar size="9cqw" />`)
        expect(transformAvatarSize(`<MazAvatar size="4svmin" />`))
          .toBe(`<MazAvatar size="12svmin" />`)
      })
    })
  })

  describe('Given a MazAvatar with a MazSize keyword', () => {
    describe('When transforming', () => {
      it('leaves the keyword untouched', () => {
        expect(transformAvatarSize(`<MazAvatar size="md" />`))
          .toBe(`<MazAvatar size="md" />`)
      })
    })
  })

  describe('Given a MazAvatar with a bound size expression', () => {
    describe('When transforming', () => {
      it('leaves the dynamic value untouched', () => {
        expect(transformAvatarSize(`<MazAvatar :size="avatarSize" />`))
          .toBe(`<MazAvatar :size="avatarSize" />`)
      })
    })
  })

  describe('Given a size prop on a non-MazAvatar component', () => {
    describe('When transforming', () => {
      it('leaves the value untouched', () => {
        expect(transformAvatarSize(`<MazBadge size="2rem" />`))
          .toBe(`<MazBadge size="2rem" />`)
      })
    })
  })
})

describe('transformAvatarSize', () => {
  describe('Given a MazAvatar spanning multiple lines', () => {
    describe('When transforming', () => {
      it('multiplies the unit size by 3', () => {
        expect(transformAvatarSize(`<MazAvatar\n  caption="Louis Mazel"\n  size="2rem"\n/>`))
          .toBe(`<MazAvatar\n  caption="Louis Mazel"\n  size="6rem"\n/>`)
      })
    })
  })

  describe('Given a calc() size value', () => {
    describe('When transforming', () => {
      it('leaves it untouched', () => {
        expect(transformAvatarSize(`<MazAvatar size="calc(2rem + 4px)" />`))
          .toBe(`<MazAvatar size="calc(2rem + 4px)" />`)
      })
    })
  })
})

describe('hasMazAvatarBoundSize', () => {
  describe('Given a MazAvatar with a bound :size', () => {
    describe('When detecting', () => {
      it('returns true', () => {
        expect(hasMazAvatarBoundSize(`<MazAvatar :size="avatarSize" />`)).toBe(true)
      })
    })
  })

  describe('Given a MazAvatar with a static size', () => {
    describe('When detecting', () => {
      it('returns false', () => {
        expect(hasMazAvatarBoundSize(`<MazAvatar size="2rem" />`)).toBe(false)
      })
    })
  })

  describe('Given a bound :size on a non-MazAvatar component', () => {
    describe('When detecting', () => {
      it('returns false', () => {
        expect(hasMazAvatarBoundSize(`<MazBadge :size="badgeSize" />`)).toBe(false)
      })
    })
  })
})

describe('transformCssVars', () => {
  describe('Given --maz-background and shades', () => {
    describe('When transforming', () => {
      it('renames to --maz-surface', () => {
        expect(transformCssVars(`color: var(--maz-background);`))
          .toBe(`color: var(--maz-surface);`)
        expect(transformCssVars(`color: var(--maz-background-700);`))
          .toBe(`color: var(--maz-surface-700);`)
        expect(transformCssVars(`color: var(--maz-background-foreground);`))
          .toBe(`color: var(--maz-surface-foreground);`)
      })
    })
  })

  describe('Given --maz-border and shades', () => {
    describe('When transforming', () => {
      it('renames the color var to --maz-divider', () => {
        expect(transformCssVars(`border-color: var(--maz-border);`))
          .toBe(`border-color: var(--maz-divider);`)
        expect(transformCssVars(`border-color: var(--maz-border-700);`))
          .toBe(`border-color: var(--maz-divider-700);`)
      })
    })
  })

  describe('Given the unrelated --maz-border-width foundation token', () => {
    describe('When transforming', () => {
      it('leaves it unchanged', () => {
        expect(transformCssVars(`border-width: var(--maz-border-width);`))
          .toBe(`border-width: var(--maz-border-width);`)
        expect(transformCssVars(`border: var(--maz-border-radius);`))
          .toBe(`border: var(--maz-border-radius);`)
      })
    })
  })
})

describe('transformHslVar', () => {
  describe('Given hsl(var(--maz-X)) without alpha', () => {
    describe('When transforming', () => {
      it('collapses to var(--maz-X)', () => {
        expect(transformHslVar(`color: hsl(var(--maz-primary));`))
          .toBe(`color: var(--maz-primary);`)
      })
    })
  })

  describe('Given hsl(var(--maz-X) / 0.5)', () => {
    describe('When transforming', () => {
      it('rewrites to color-mix in srgb with transparent', () => {
        expect(transformHslVar(`border-color: hsl(var(--maz-primary) / 0.5);`))
          .toBe(`border-color: color-mix(in srgb, var(--maz-primary) 50%, transparent);`)
      })
    })
  })

  describe('Given a derived --m-X variable wrapped in hsl', () => {
    describe('When transforming', () => {
      it('also collapses', () => {
        expect(transformHslVar(`color: hsl(var(--m-toast-bg));`))
          .toBe(`color: var(--m-toast-bg);`)
      })
    })
  })
})

describe('transformConfig', () => {
  describe('Given Nuxt injectMainCss key', () => {
    describe('When transforming', () => {
      it('renames to injectCss', () => {
        expect(transformConfig(`{ css: { injectMainCss: true } }`))
          .toBe(`{ css: { injectCss: true } }`)
      })
    })
  })

  describe('Given theme strategy: "hybrid"', () => {
    describe('When transforming', () => {
      it('renames to runtime', () => {
        expect(transformConfig(`import { MazUi } from 'maz-ui/plugins/maz-ui'\nstrategy: 'hybrid',`)).toBe(`import { MazUi } from 'maz-ui/plugins/maz-ui'\nstrategy: 'runtime',`)
        expect(transformConfig(`mazUi: { theme: { strategy: "hybrid" } }`)).toBe(`mazUi: { theme: { strategy: "runtime" } }`)
      })
    })
  })

  describe('Given an unrelated strategy value', () => {
    describe('When transforming', () => {
      it('leaves it unchanged', () => {
        expect(transformConfig(`strategy: 'runtime',`)).toBe(`strategy: 'runtime',`)
        expect(transformConfig(`strategy: 'buildtime',`)).toBe(`strategy: 'buildtime',`)
      })
    })
  })

  describe('Given dropped theme injection options', () => {
    describe('When transforming', () => {
      it('removes injectCriticalCSS, injectFullCSS and injectAllCSSOnServer lines', () => {
        const input = `app.use(MazUiTheme, {
  preset: mazUi,
  strategy: 'hybrid',
  injectCriticalCSS: true,
  injectFullCSS: true,
})`
        const expected = `app.use(MazUiTheme, {
  preset: mazUi,
  strategy: 'runtime',
})`
        expect(transformConfig(input)).toBe(expected)
      })

      it('removes injectAllCSSOnServer in Nuxt config', () => {
        const input = `mazUi: {
  theme: {
    strategy: 'hybrid',
    injectAllCSSOnServer: true,
  },
},`
        const expected = `mazUi: {
  theme: {
    strategy: 'runtime',
  },
},`
        expect(transformConfig(input)).toBe(expected)
      })
    })
  })
})

describe('transformPresetColors', () => {
  describe('Given a preset with light/dark color blocks', () => {
    describe('When transforming', () => {
      it('renames background to surface and border to divider', () => {
        const input = `import { definePreset } from '@maz-ui/themes'
{
  colors: {
    light: { background: '0 0% 100%', border: '220 13% 91%', primary: '210 100% 56%' },
    dark:  { background: '235 16% 15%', border: '238 17% 25%', primary: '210 100% 56%' },
  },
}`
        const expected = `import { definePreset } from '@maz-ui/themes'
{
  colors: {
    light: { surface: '0 0% 100%', divider: '220 13% 91%', primary: '210 100% 56%' },
    dark:  { surface: '235 16% 15%', divider: '238 17% 25%', primary: '210 100% 56%' },
  },
}`
        expect(transformPresetColors(input)).toBe(expected)
      })
    })
  })

  describe('Given quoted keys', () => {
    describe('When transforming', () => {
      it('preserves the quoting', () => {
        expect(transformPresetColors(`import type { ThemePreset } from '@maz-ui/themes'\nlight: { 'background': '0 0% 100%', 'border': '220 13% 91%' }`))
          .toBe(`import type { ThemePreset } from '@maz-ui/themes'\nlight: { 'surface': '0 0% 100%', 'divider': '220 13% 91%' }`)
      })
    })
  })

  describe('Given a multiline light block', () => {
    describe('When transforming', () => {
      it('handles values across multiple lines', () => {
        const input = `const preset = definePreset({ colors: { light: {
  background: '0 0% 100%',
  border: '220 13% 91%',
} } })`
        const expected = `const preset = definePreset({ colors: { light: {
  surface: '0 0% 100%',
  divider: '220 13% 91%',
} } })`
        expect(transformPresetColors(input)).toBe(expected)
      })
    })
  })

  describe('Given a generic CSS-in-JS object outside a light/dark block', () => {
    describe('When transforming', () => {
      it('leaves it unchanged', () => {
        expect(transformPresetColors(`const style = { background: '#fff', border: '1px solid #000' }`))
          .toBe(`const style = { background: '#fff', border: '1px solid #000' }`)
      })
    })
  })
})

describe('transformDeps', () => {
  describe('Given a package.json with maz-ui v4 entries', () => {
    describe('When transforming', () => {
      it('bumps maz-ui and every @maz-ui/* dep to ^5.0.0', () => {
        const input = JSON.stringify({
          name: 'my-app',
          dependencies: {
            'maz-ui': '^4.9.3',
            '@maz-ui/icons': '^4.9.3',
            '@maz-ui/themes': '~4.9.0',
          },
          devDependencies: {
            '@maz-ui/nuxt': '4.5.0',
          },
          peerDependencies: {
            '@maz-ui/utils': '4.x',
          },
        }, null, 2)

        const out = JSON.parse(transformDeps(input))
        expect(out.dependencies).toStrictEqual({
          'maz-ui': '^5.0.0',
          '@maz-ui/icons': '^5.0.0',
          '@maz-ui/themes': '^5.0.0',
        })
        expect(out.devDependencies).toStrictEqual({ '@maz-ui/nuxt': '^5.0.0' })
        expect(out.peerDependencies).toStrictEqual({ '@maz-ui/utils': '^5.0.0' })
      })
    })
  })

  describe('Given unrelated dependencies', () => {
    describe('When transforming', () => {
      it('leaves them untouched', () => {
        const input = JSON.stringify({
          dependencies: {
            'vue': '^3.5.0',
            'vue-chartjs': '^5.3.0',
            'maz-ui': '^4.9.3',
          },
        }, null, 2)
        const out = JSON.parse(transformDeps(input))
        expect(out.dependencies.vue).toBe('^3.5.0')
        expect(out.dependencies['vue-chartjs']).toBe('^5.3.0')
        expect(out.dependencies['maz-ui']).toBe('^5.0.0')
      })
    })
  })

  describe('Given workspace, link, file, npm, url and dist-tag specs', () => {
    describe('When transforming', () => {
      it('leaves protected specs untouched', () => {
        const input = JSON.stringify({
          dependencies: {
            'maz-ui': 'workspace:*',
            '@maz-ui/icons': 'link:../icons',
            '@maz-ui/themes': 'file:./vendor/themes',
            '@maz-ui/utils': 'latest',
            '@maz-ui/nuxt': 'next',
            '@maz-ui/translations': 'https://example.com/maz.tgz',
          },
        }, null, 2)
        const out = JSON.parse(transformDeps(input))
        expect(out.dependencies).toStrictEqual({
          'maz-ui': 'workspace:*',
          '@maz-ui/icons': 'link:../icons',
          '@maz-ui/themes': 'file:./vendor/themes',
          '@maz-ui/utils': 'latest',
          '@maz-ui/nuxt': 'next',
          '@maz-ui/translations': 'https://example.com/maz.tgz',
        })
      })
    })
  })

  describe('Given a package.json with no maz-ui deps', () => {
    describe('When transforming', () => {
      it('returns the input unchanged byte-for-byte', () => {
        const input = JSON.stringify({
          name: 'my-app',
          dependencies: { vue: '^3.5.0' },
        }, null, 2)
        expect(transformDeps(input)).toBe(input)
      })
    })
  })

  describe('Given an indented input with a trailing newline', () => {
    describe('When transforming', () => {
      it('preserves the indent and the trailing newline', () => {
        const input = `{\n    "dependencies": {\n        "maz-ui": "^4.9.3"\n    }\n}\n`
        const out = transformDeps(input)
        expect(out).toBe(`{\n    "dependencies": {\n        "maz-ui": "^5.0.0"\n    }\n}\n`)
      })
    })
  })

  describe('Given malformed JSON', () => {
    describe('When transforming', () => {
      it('returns the input unchanged', () => {
        expect(transformDeps('{ not json')).toBe('{ not json')
      })
    })
  })

  describe('Given addUtils=true and a package.json with maz-ui but no @maz-ui/utils', () => {
    describe('When transforming', () => {
      it('adds @maz-ui/utils next to maz-ui in the same field', () => {
        const input = JSON.stringify({
          dependencies: { 'maz-ui': '^4.9.3' },
        }, null, 2)
        const out = JSON.parse(transformDeps(input, { addUtils: true }))
        expect(out.dependencies).toStrictEqual({
          'maz-ui': '^5.0.0',
          '@maz-ui/utils': '^5.0.0',
        })
      })
    })
  })

  describe('Given addUtils=true and only a scoped @maz-ui/* dep', () => {
    describe('When transforming', () => {
      it('adds @maz-ui/utils to the same field as the scoped dep', () => {
        const input = JSON.stringify({
          devDependencies: { '@maz-ui/icons': '^4.9.3' },
        }, null, 2)
        const out = JSON.parse(transformDeps(input, { addUtils: true }))
        expect(out.devDependencies).toStrictEqual({
          '@maz-ui/icons': '^5.0.0',
          '@maz-ui/utils': '^5.0.0',
        })
      })
    })
  })

  describe('Given addUtils=true and @maz-ui/utils already declared', () => {
    describe('When transforming', () => {
      it('leaves the existing entry untouched', () => {
        const input = JSON.stringify({
          dependencies: { 'maz-ui': '^4.9.3', '@maz-ui/utils': '^4.5.0' },
        }, null, 2)
        const out = JSON.parse(transformDeps(input, { addUtils: true }))
        expect(out.dependencies).toStrictEqual({
          'maz-ui': '^5.0.0',
          '@maz-ui/utils': '^5.0.0',
        })
      })
    })
  })

  describe('Given addUtils=true but no maz-ui or @maz-ui/* dep', () => {
    describe('When transforming', () => {
      it('does not add @maz-ui/utils', () => {
        const input = JSON.stringify({
          dependencies: { vue: '^3.5.0' },
        }, null, 2)
        expect(transformDeps(input, { addUtils: true })).toBe(input)
      })
    })
  })

  describe('Given addUtils=false (default)', () => {
    describe('When transforming a package.json with maz-ui only', () => {
      it('does not add @maz-ui/utils', () => {
        const input = JSON.stringify({
          dependencies: { 'maz-ui': '^4.9.3' },
        }, null, 2)
        const out = JSON.parse(transformDeps(input))
        expect(out.dependencies).toStrictEqual({ 'maz-ui': '^5.0.0' })
      })
    })
  })
})

describe('transformFile', () => {
  describe('Given a Vue SFC with multiple v4 patterns', () => {
    describe('When transforming', () => {
      it('applies imports, props, css and config groups', () => {
        const input = `<script setup lang="ts">
import 'maz-ui/styles'
</script>

<template>
  <MazBtn left-icon="user" color="background" rounded-size="base">x</MazBtn>
  <MazDrawer variant="left" />
  <MazCard footer-align="right" />
</template>

<style scoped>
.x {
  color: hsl(var(--maz-primary));
  background: var(--maz-background);
}
</style>`
        const expected = `<script setup lang="ts">
import 'maz-ui/style.css'
</script>

<template>
  <MazBtn start-icon="/user.svg" color="surface" rounded-size="md">x</MazBtn>
  <MazDrawer variant="start" />
  <MazCard footer-align="end" />
</template>

<style scoped>
.x {
  color: var(--maz-primary);
  background: var(--maz-surface);
}
</style>`
        expect(transformFile('foo.vue', input)).toBe(expected)
      })
    })
  })

  describe('Given a CSS file', () => {
    describe('When transforming', () => {
      it('applies css group transforms', () => {
        const input = `.x {
  color: hsl(var(--maz-primary));
  background: var(--maz-background);
  border: 1px solid var(--maz-border);
}`
        const expected = `.x {
  color: var(--maz-primary);
  background: var(--maz-surface);
  border: 1px solid var(--maz-divider);
}`
        expect(transformFile('foo.css', input)).toBe(expected)
      })
    })
  })

  describe('Given a TypeScript file', () => {
    describe('When transforming', () => {
      it('applies imports and config groups', () => {
        const input = `import 'maz-ui/styles'

export default {
  mazUi: {
    css: { injectMainCss: true },
    theme: { strategy: 'hybrid' },
  },
}`
        const expected = `import 'maz-ui/style.css'

export default {
  mazUi: {
    css: { injectCss: true },
    theme: { strategy: 'runtime' },
  },
}`
        expect(transformFile('nuxt.config.ts', input)).toBe(expected)
      })
    })
  })

  describe('Given a package.json file', () => {
    describe('When transforming with the deps group', () => {
      it('bumps the maz-ui deps to ^5.0.0', () => {
        const input = JSON.stringify({ dependencies: { 'maz-ui': '^4.9.3' } }, null, 2)
        const out = JSON.parse(transformFile('package.json', input))
        expect(out.dependencies['maz-ui']).toBe('^5.0.0')
      })

      it('targets nested package.json paths too', () => {
        const input = JSON.stringify({ dependencies: { 'maz-ui': '^4.9.3' } }, null, 2)
        const out = JSON.parse(transformFile('apps/web/package.json', input))
        expect(out.dependencies['maz-ui']).toBe('^5.0.0')
      })

      it('skips the deps transform when filtered out', () => {
        const input = JSON.stringify({ dependencies: { 'maz-ui': '^4.9.3' } }, null, 2)
        expect(transformFile('package.json', input, { groups: ['imports'] })).toBe(input)
      })
    })
  })

  describe('Given a package.json with addUtilsDep=true', () => {
    describe('When transforming', () => {
      it('bumps maz-ui and adds @maz-ui/utils', () => {
        const input = JSON.stringify({ dependencies: { 'maz-ui': '^4.9.3' } }, null, 2)
        const out = JSON.parse(transformFile('package.json', input, { addUtilsDep: true }))
        expect(out.dependencies).toStrictEqual({
          'maz-ui': '^5.0.0',
          '@maz-ui/utils': '^5.0.0',
        })
      })
    })
  })

  describe('Given the --only filter', () => {
    describe('When transforming with groups=["imports"]', () => {
      it('only applies the imports transform', () => {
        const input = `<script setup>
import 'maz-ui/styles'
</script>

<template>
  <MazBtn left-icon="x" />
</template>`
        const expected = `<script setup>
import 'maz-ui/style.css'
</script>

<template>
  <MazBtn left-icon="x" />
</template>`
        expect(transformFile('foo.vue', input, { groups: ['imports'] })).toBe(expected)
      })
    })
  })
})

describe('transformImports with the v5 root types', () => {
  describe('Given a type-only import of v5 root types from "maz-ui"', () => {
    describe('When transforming', () => {
      it('keeps it on maz-ui', () => {
        const input = `import type { MazColor, MazSize as Size } from 'maz-ui'`
        expect(transformImports(input)).toBe(input)
      })
    })
  })

  describe('Given an inline type import of v5 root types from "maz-ui"', () => {
    describe('When transforming', () => {
      it('keeps it on maz-ui', () => {
        const input = `import { type MazUiOptions } from "maz-ui"`
        expect(transformImports(input)).toBe(input)
      })
    })
  })

  describe('Given an import mixing root types and utils', () => {
    describe('When transforming', () => {
      it('moves it to @maz-ui/utils', () => {
        expect(transformImports(`import { sleep, type MazColor } from 'maz-ui'`))
          .toBe(`import { sleep, type MazColor } from '@maz-ui/utils'`)
      })
    })
  })

  describe('Given a file with only root type imports', () => {
    describe('When checked for a maz-ui root import', () => {
      it('does not report it', () => {
        expect(hasMazUiRootImport(`import type { MazSize } from 'maz-ui'`)).toBe(false)
      })
    })
  })
})

describe('transformImports with the removed dist paths', () => {
  describe('Given maz-ui/dist/css imports', () => {
    describe('When transforming', () => {
      it('rewrites them to the v5 CSS entries', () => {
        expect(transformImports(`import 'maz-ui/dist/css/main.css'\nimport "maz-ui/dist/css/aos.css"`))
          .toBe(`import 'maz-ui/style.css'\nimport "maz-ui/aos.css"`)
      })
    })
  })

  describe('Given a stylesheet importing maz-ui CSS entries', () => {
    describe('When transforming', () => {
      it('rewrites them to the v5 CSS entries', () => {
        expect(transformStyleImports(`@import 'maz-ui/dist/css/main.css';\n@import 'maz-ui/styles';`))
          .toBe(`@import 'maz-ui/style.css';\n@import 'maz-ui/style.css';`)
      })
    })
  })

  describe('Given another deep maz-ui/dist import', () => {
    describe('When checked', () => {
      it('reports it', () => {
        expect(hasMazUiDistImport(`import x from 'maz-ui/dist/components/MazBtn.js'`)).toBe(true)
      })
    })
  })

  describe('Given only the rewritten CSS dist imports or subpaths', () => {
    describe('When checked', () => {
      it('does not report them', () => {
        expect(hasMazUiDistImport(`import 'maz-ui/dist/css/main.css'\nimport 'maz-ui/components'`)).toBe(false)
      })
    })
  })
})

describe('hasValibotImport', () => {
  describe('Given a valibot import, dynamic import or require', () => {
    describe('When checked', () => {
      it('reports it', () => {
        expect(hasValibotImport(`import * as v from 'valibot'`)).toBe(true)
        expect(hasValibotImport(`await import("valibot")`)).toBe(true)
        expect(hasValibotImport(`require('valibot')`)).toBe(true)
      })
    })
  })

  describe('Given an unrelated import', () => {
    describe('When checked', () => {
      it('does not report it', () => {
        expect(hasValibotImport(`import { z } from 'zod'\nconst name = 'valibot'`)).toBe(false)
      })
    })
  })
})

describe('transformProps with scoped icon props', () => {
  describe('Given left-icon on a component of another library', () => {
    describe('When transforming', () => {
      it('leaves it unchanged', () => {
        const input = `<van-field left-icon="search" right-icon="warning-o" />`
        expect(transformProps(input)).toBe(input)
      })
    })
  })

  describe('Given a left-icon class name', () => {
    describe('When transforming', () => {
      it('leaves it unchanged', () => {
        const input = `<i class="btn left-icon" />`
        expect(transformProps(input)).toBe(input)
      })
    })
  })

  describe('Given camelCase and v-bind icon props on a Maz component', () => {
    describe('When transforming', () => {
      it('renames them', () => {
        expect(transformProps(`<MazBtn :leftIcon="MazUser" v-bind:right-icon="MazArrow" rightIcon="/a.svg" />`))
          .toBe(`<MazBtn :startIcon="MazUser" v-bind:end-icon="MazArrow" endIcon="/a.svg" />`)
      })
    })
  })

  describe('Given a kebab-case maz tag', () => {
    describe('When transforming', () => {
      it('renames its props', () => {
        expect(transformProps(`<maz-drawer variant="left" color="background" />`))
          .toBe(`<maz-drawer variant="start" color="surface" />`)
      })
    })
  })

  describe('Given an arrow function in an attribute before the prop', () => {
    describe('When transforming', () => {
      it('still renames the prop', () => {
        expect(transformProps(`<MazBtn @click="() => go()" color="background">x</MazBtn>`))
          .toBe(`<MazBtn @click="() => go()" color="surface">x</MazBtn>`)
      })
    })
  })

  describe('Given v-slot icon slots', () => {
    describe('When transforming', () => {
      it('renames them', () => {
        expect(transformProps(`<template v-slot:left-icon>a</template><template v-slot:icon-right>b</template>`))
          .toBe(`<template v-slot:start-icon>a</template><template v-slot:icon-end>b</template>`)
      })
    })
  })

  describe('Given camelCase footerAlign, roundedSize and activeColor', () => {
    describe('When transforming', () => {
      it('renames their values', () => {
        expect(transformProps(`<MazCard footerAlign="left" roundedSize="base" activeColor="background" />`))
          .toBe(`<MazCard footerAlign="start" roundedSize="md" activeColor="surface" />`)
      })
    })
  })
})

describe('transformBareIconNames', () => {
  describe('Given bare icon names on the icon components', () => {
    describe('When transforming', () => {
      it('rewrites them to relative SVG URLs', () => {
        expect(transformBareIconNames(`<MazBtn start-icon="user" end-icon="arrow-right" icon="cog-6-tooth" />`))
          .toBe(`<MazBtn start-icon="/user.svg" end-icon="/arrow-right.svg" icon="/cog-6-tooth.svg" />`)
        expect(transformBareIconNames(`<MazDropdown dropdown-icon="chevron" /><maz-alert icon="info" />`))
          .toBe(`<MazDropdown dropdown-icon="/chevron.svg" /><maz-alert icon="/info.svg" />`)
      })
    })
  })

  describe('Given URLs, raw SVG and bound values', () => {
    describe('When transforming', () => {
      it('leaves them unchanged', () => {
        const input = `<MazBtn start-icon="/user.svg" end-icon="https://cdn.x/a.svg" :icon="'user'" />`
        expect(transformBareIconNames(input)).toBe(input)
      })
    })
  })

  describe('Given an icon prop on another component', () => {
    describe('When transforming', () => {
      it('leaves it unchanged', () => {
        const input = `<MazStepper icon="user" /><v-icon icon="mdi-home" />`
        expect(transformBareIconNames(input)).toBe(input)
      })
    })
  })

  describe('Given already rewritten values', () => {
    describe('When transforming again', () => {
      it('is a no-op', () => {
        const once = transformBareIconNames(`<MazBtn start-icon="user" />`)
        expect(transformBareIconNames(once)).toBe(once)
      })
    })
  })
})

describe('transformMazIcon', () => {
  describe('Given a MazIcon with src or :src', () => {
    describe('When transforming', () => {
      it('renames them to icon', () => {
        expect(transformMazIcon(`<MazIcon src="/a.svg" /><maz-icon :src="url" />`))
          .toBe(`<MazIcon icon="/a.svg" /><maz-icon :icon="url" />`)
      })
    })
  })

  describe('Given a MazIcon with a static name', () => {
    describe('When transforming', () => {
      it('rewrites it to the matching URL', () => {
        expect(transformMazIcon(`<MazIcon name="home" size="1.5rem" />`))
          .toBe(`<MazIcon icon="/home.svg" size="1.5rem" />`)
      })
    })
  })

  describe('Given a MazIcon with a static name and path', () => {
    describe('When transforming', () => {
      it('joins them in the URL', () => {
        expect(transformMazIcon(`<MazIcon path="/icons/" name="home" />`))
          .toBe(`<MazIcon icon="/icons/home.svg" />`)
      })
    })
  })

  describe('Given a MazIcon with a bound name or path', () => {
    describe('When transforming', () => {
      it('leaves it unchanged', () => {
        const input = `<MazIcon :name="iconName" /><MazIcon name="home" :path="base" />`
        expect(transformMazIcon(input)).toBe(input)
      })
    })
  })

  describe('Given a name attribute on another tag', () => {
    describe('When transforming', () => {
      it('leaves it unchanged', () => {
        const input = `<input name="email" src="x">`
        expect(transformMazIcon(input)).toBe(input)
      })
    })
  })
})

describe('hasMazIconLegacyApi', () => {
  describe('Given a bound name or path on a MazIcon', () => {
    describe('When checked', () => {
      it('reports it', () => {
        expect(hasMazIconLegacyApi(`<MazIcon :name="n" />`)).toBe(true)
        expect(hasMazIconLegacyApi(`<maz-icon v-bind:path="p" name="x" />`)).toBe(true)
      })
    })
  })

  describe('Given the removed loaded and unloaded events', () => {
    describe('When checked', () => {
      it('reports them', () => {
        expect(hasMazIconLegacyApi(`<MazIcon icon="/a.svg" @loaded="onLoad" />`)).toBe(true)
        expect(hasMazIconLegacyApi(`<MazIcon icon="/a.svg" v-on:unloaded="onUnload" />`)).toBe(true)
      })
    })
  })

  describe('Given a v5 MazIcon', () => {
    describe('When checked', () => {
      it('does not report it', () => {
        expect(hasMazIconLegacyApi(`<MazIcon :icon="MazStar" @error="onError" /><input :name="n">`)).toBe(false)
      })
    })
  })
})

describe('transformClassNames', () => {
  describe('Given the v4 internal class names', () => {
    describe('When transforming', () => {
      it('renames them', () => {
        expect(transformClassNames(`.m-input-wrapper-left, .m-input-wrapper-right {}\n.drawer-anim-left-enter-active, .drawer-anim-right-leave-to {}\n.--has-left-icon {}`))
          .toBe(`.m-input-wrapper-start, .m-input-wrapper-end {}\n.drawer-anim-start-enter-active, .drawer-anim-end-leave-to {}\n.--has-start-icon {}`)
      })
    })
  })
})

describe('transformHslVar with complex alpha values', () => {
  describe('Given a percentage alpha', () => {
    describe('When transforming', () => {
      it('keeps the percentage', () => {
        expect(transformHslVar(`color: hsl(var(--maz-primary) / 40%);`))
          .toBe(`color: color-mix(in srgb, var(--maz-primary) 40%, transparent);`)
      })
    })
  })

  describe('Given a leading-dot alpha', () => {
    describe('When transforming', () => {
      it('converts it to a percentage', () => {
        expect(transformHslVar(`color: hsl(var(--maz-primary) / .25);`))
          .toBe(`color: color-mix(in srgb, var(--maz-primary) 25%, transparent);`)
      })
    })
  })

  describe('Given a var() or calc() alpha', () => {
    describe('When transforming', () => {
      it('converts it with calc and keeps the parentheses balanced', () => {
        expect(transformHslVar(`color: hsl(var(--maz-primary) / var(--o));`))
          .toBe(`color: color-mix(in srgb, var(--maz-primary) calc(var(--o) * 100%), transparent);`)
        expect(transformHslVar(`color: hsl(var(--maz-primary) / calc(0.5 + 0.1));`))
          .toBe(`color: color-mix(in srgb, var(--maz-primary) calc(calc(0.5 + 0.1) * 100%), transparent);`)
      })
    })
  })

  describe('Given hsl() of a non maz value or an unclosed hsl', () => {
    describe('When transforming', () => {
      it('leaves it unchanged', () => {
        const input = `color: hsl(210 100% 56%); background: hsl(var(--other)); border: hsl(var(--maz-primary)`
        expect(transformHslVar(input)).toBe(input)
      })
    })
  })
})

describe('transformConfig with the removed theme options', () => {
  describe('Given generateCSS options on their own lines', () => {
    describe('When transforming', () => {
      it('removes them, array values included', () => {
        const input = `generateCSS(preset, {
  mode: 'both',
  onlyCritical: true,
  criticalColors: ['primary', 'secondary'],
  criticalFoundation: ['radius'],
  includeColorScales: false,
})`
        const expected = `generateCSS(preset, {
  mode: 'both',
})`
        expect(transformConfig(input)).toBe(expected)
      })
    })
  })

  describe('Given inline removed options', () => {
    describe('When transforming', () => {
      it('removes them', () => {
        expect(transformConfig(`app.use(MazUi, { theme: { preset: mazUi, injectCriticalCSS: true } })`))
          .toBe(`app.use(MazUi, { theme: { preset: mazUi } })`)
        expect(transformConfig(`buildThemeCSS({ onlyCritical: true, prefix: 'maz' })`))
          .toBe(`buildThemeCSS({ prefix: 'maz' })`)
      })
    })
  })

  describe('Given strategy: "hybrid" in a file unrelated to maz-ui', () => {
    describe('When transforming', () => {
      it('leaves it unchanged', () => {
        const input = `const cache = { strategy: 'hybrid' }`
        expect(transformConfig(input)).toBe(input)
      })
    })
  })
})

describe('transformPresetColors in a file unrelated to maz-ui', () => {
  describe('Given a light block with background and border keys', () => {
    describe('When transforming', () => {
      it('leaves it unchanged', () => {
        const input = `const palette = { light: { background: '#fff', border: '1px solid #000' } }`
        expect(transformPresetColors(input)).toBe(input)
      })
    })
  })
})

describe('transformDeps with the v5 package changes', () => {
  describe('Given @maz-ui/cli, unpublished in v5', () => {
    describe('When transforming', () => {
      it('keeps its range', () => {
        const input = `${JSON.stringify({ devDependencies: { '@maz-ui/cli': '^4.7.3', 'maz-ui': '^4.9.0' } }, null, 2)}\n`
        const output = JSON.parse(transformDeps(input))

        expect(output.devDependencies).toEqual({ '@maz-ui/cli': '^4.7.3', 'maz-ui': '^5.0.0' })
      })
    })
  })

  describe('Given addValibot and a package without valibot', () => {
    describe('When transforming', () => {
      it('adds valibot next to maz-ui', () => {
        const input = `${JSON.stringify({ dependencies: { 'maz-ui': '^5.0.0' } }, null, 2)}\n`
        const output = JSON.parse(transformDeps(input, { addValibot: true }))

        expect(output.dependencies).toEqual({ 'maz-ui': '^5.0.0', 'valibot': '^1.3.1' })
      })
    })
  })

  describe('Given addValibot and a package already declaring valibot', () => {
    describe('When transforming', () => {
      it('keeps its range', () => {
        const input = `${JSON.stringify({ dependencies: { 'maz-ui': '^5.0.0' }, devDependencies: { valibot: '^1.0.0' } }, null, 2)}\n`
        expect(transformDeps(input, { addValibot: true })).toBe(input)
      })
    })
  })
})

describe('transformFile with stylesheets and scripts', () => {
  describe('Given a SCSS file', () => {
    describe('When transforming', () => {
      it('applies the style imports, class names and css variables', () => {
        expect(transformFile('a.scss', `@import 'maz-ui/dist/css/main.css';\n.--has-left-icon { color: hsl(var(--maz-background) / 0.5); }`))
          .toBe(`@import 'maz-ui/style.css';\n.--has-start-icon { color: color-mix(in srgb, var(--maz-surface) 50%, transparent); }`)
      })
    })
  })

  describe('Given a TS file using css variables', () => {
    describe('When transforming', () => {
      it('renames them', () => {
        expect(transformFile('a.ts', `const color = 'var(--maz-background)'\nconst width = 'var(--maz-border-width)'`))
          .toBe(`const color = 'var(--maz-surface)'\nconst width = 'var(--maz-border-width)'`)
      })
    })
  })

  describe('Given addValibotDep on a package.json', () => {
    describe('When transforming', () => {
      it('adds valibot', () => {
        const input = `${JSON.stringify({ dependencies: { 'maz-ui': '^4.0.0' } }, null, 2)}\n`
        const output = JSON.parse(transformFile('package.json', input, { addValibotDep: true }))

        expect(output.dependencies).toEqual({ 'maz-ui': '^5.0.0', 'valibot': '^1.3.1' })
      })
    })
  })
})

describe('transformBadgeSize', () => {
  describe.each([
    ['0.6rem', 'mini'],
    ['0.65rem', 'mini'],
    ['0.7rem', 'xs'],
    ['0.75rem', 'sm'],
    ['0.8rem', 'sm'],
    ['0.85rem', 'md'],
    ['0.9rem', 'md'],
    ['1rem', 'lg'],
    ['1.1rem', 'lg'],
    ['1.125rem', 'xl'],
    ['1.5rem', 'xl'],
    ['.875rem', 'md'],
  ])('Given a MazBadge with size="%s"', (value, keyword) => {
    describe('When transforming', () => {
      it(`maps it to "${keyword}"`, () => {
        expect(transformBadgeSize(`<MazBadge size="${value}">New</MazBadge>`))
          .toBe(`<MazBadge size="${keyword}">New</MazBadge>`)
      })
    })
  })

  describe('Given a kebab-case maz-badge with other attributes', () => {
    describe('When transforming', () => {
      it('maps the size only', () => {
        expect(transformBadgeSize(`<maz-badge color="info" size='0.8rem' :data-size="x">1</maz-badge>`))
          .toBe(`<maz-badge color="info" size='sm' :data-size="x">1</maz-badge>`)
      })
    })
  })

  describe('Given keyword, bound, px and em sizes', () => {
    describe('When transforming', () => {
      it('leaves them unchanged', () => {
        const input = `<MazBadge size="sm" /><MazBadge :size="badgeSize" /><MazBadge size="12px" /><MazBadge size="0.8em" />`
        expect(transformBadgeSize(input)).toBe(input)
      })
    })
  })

  describe('Given a rem size on another component', () => {
    describe('When transforming', () => {
      it('leaves it unchanged', () => {
        const input = `<MazIcon size="0.8rem" /><MazBadgeGroup size="0.8rem" />`
        expect(transformBadgeSize(input)).toBe(input)
      })
    })
  })

  describe('Given an already migrated badge', () => {
    describe('When transforming again', () => {
      it('is a no-op', () => {
        const once = transformBadgeSize(`<MazBadge size="0.8rem" />`)
        expect(transformBadgeSize(once)).toBe(once)
      })
    })
  })

  describe('Given a Vue SFC', () => {
    describe('When transforming the props group', () => {
      it('maps the badge size', () => {
        expect(transformProps(`<MazBadge size="1rem">x</MazBadge>`)).toBe(`<MazBadge size="lg">x</MazBadge>`)
      })
    })
  })
})

describe('hasMazBadgeLengthSize', () => {
  describe('Given px or em sizes on a MazBadge', () => {
    describe('When checked', () => {
      it('reports them', () => {
        expect(hasMazBadgeLengthSize(`<MazBadge size="12px" />`)).toBe(true)
        expect(hasMazBadgeLengthSize(`<maz-badge size="0.8em" />`)).toBe(true)
      })
    })
  })

  describe('Given keyword, rem and bound sizes', () => {
    describe('When checked', () => {
      it('does not report them', () => {
        expect(hasMazBadgeLengthSize(`<MazBadge size="md" /><MazBadge size="0.8rem" /><MazBadge :size="s" /><MazBadge />`)).toBe(false)
      })
    })
  })
})
