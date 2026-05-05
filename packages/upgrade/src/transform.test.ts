import { describe, expect, it } from 'vitest'
import {
  transformConfig,
  transformCssVars,
  transformDeps,
  transformFile,
  transformHslVar,
  transformImports,
  transformPresetColors,
  transformProps,
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
})

describe('transformProps', () => {
  describe('Given left-icon and right-icon attributes on a Maz component', () => {
    describe('When transforming', () => {
      it('renames to start-icon and end-icon', () => {
        expect(transformProps(`<MazBtn left-icon="user" right-icon="arrow">x</MazBtn>`))
          .toBe(`<MazBtn start-icon="user" end-icon="arrow">x</MazBtn>`)
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
          .toBe(`border-color: color-mix(in srgb, var(--maz-primary) 0.5, transparent);`)
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
        expect(transformConfig(`strategy: 'hybrid',`)).toBe(`strategy: 'runtime',`)
        expect(transformConfig(`strategy: "hybrid",`)).toBe(`strategy: "runtime",`)
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
        const input = `theme: {
  strategy: 'hybrid',
  injectAllCSSOnServer: true,
},`
        const expected = `theme: {
  strategy: 'runtime',
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
        const input = `{
  colors: {
    light: { background: '0 0% 100%', border: '220 13% 91%', primary: '210 100% 56%' },
    dark:  { background: '235 16% 15%', border: '238 17% 25%', primary: '210 100% 56%' },
  },
}`
        const expected = `{
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
        expect(transformPresetColors(`light: { 'background': '0 0% 100%', 'border': '220 13% 91%' }`))
          .toBe(`light: { 'surface': '0 0% 100%', 'divider': '220 13% 91%' }`)
      })
    })
  })

  describe('Given a multiline light block', () => {
    describe('When transforming', () => {
      it('handles values across multiple lines', () => {
        const input = `light: {
  background: '0 0% 100%',
  border: '220 13% 91%',
}`
        const expected = `light: {
  surface: '0 0% 100%',
  divider: '220 13% 91%',
}`
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
  <MazBtn start-icon="user" color="surface" rounded-size="md">x</MazBtn>
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
