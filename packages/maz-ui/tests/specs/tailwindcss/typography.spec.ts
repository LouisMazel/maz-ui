import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { DEFAULT_TYPOGRAPHY } from '@maz-ui/themes/presets/_defaults'

const utilities = readFileSync(resolve(__dirname, '../../../src/tailwindcss/utilities.css'), 'utf8')

const PROPERTIES = {
  size: 'font-size',
  weight: 'font-weight',
  leading: 'line-height',
  tracking: 'letter-spacing',
  color: 'color',
} as const

function utility(name: string): string {
  return utilities.match(new RegExp(String.raw`@utility ${name} \{\n([\s\S]*?)\n\}`))?.[1] ?? ''
}

describe('given the type scale utilities of maz-ui', () => {
  describe('when reading the text-<level> utilities', () => {
    it('then every level falls back to the DEFAULT_TYPOGRAPHY of @maz-ui/themes', () => {
      for (const [level, tokens] of Object.entries(DEFAULT_TYPOGRAPHY)) {
        const body = utility(`text-${level}`)

        for (const [key, value] of Object.entries(tokens))
          expect(body).toContain(`  ${PROPERTIES[key as keyof typeof PROPERTIES]}: var(--maz-typography-${level}-${key}, ${value});`)
      }
    })
  })

  describe('when reading the type-<level> utilities', () => {
    it('then every level has the style of its text-<level> without the font size', () => {
      for (const [level, tokens] of Object.entries(DEFAULT_TYPOGRAPHY)) {
        const body = utility(`type-${level}`)

        expect(body).not.toContain('font-size')
        expect(body).toContain(`--tw-leading: var(--maz-typography-${level}-leading, ${tokens.leading});`)

        for (const [key, value] of Object.entries(tokens).filter(([key]) => key !== 'size'))
          expect(body).toContain(`  ${PROPERTIES[key as keyof typeof PROPERTIES]}: var(--maz-typography-${level}-${key}, ${value});`)
      }
    })
  })
})
