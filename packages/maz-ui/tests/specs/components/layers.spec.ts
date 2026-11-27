import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const ORDER_STATEMENT = '@layer theme, base, components, utilities;'
const componentsDir = join(__dirname, '../../../src/components')

function vueFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap(entry => entry.isDirectory()
    ? vueFiles(join(dir, entry.name))
    : entry.name.endsWith('.vue')
      ? [join(dir, entry.name)]
      : [])
}

describe('given the styles of the components', () => {
  const styled = vueFiles(componentsDir)
    .map(file => ({ file, style: /<style[^>]*>([\s\S]*)<\/style>/.exec(readFileSync(file, 'utf8'))?.[1] }))
    .filter(({ style }) => style && /@layer\s+components\b/.test(style))

  describe('when a style uses the components layer', () => {
    it('then at least one component does', () => {
      expect(styled.length).toBeGreaterThan(0)
    })

    it('then the layer order statement comes before the first layer block', () => {
      for (const { file, style } of styled) {
        const statement = style!.indexOf(ORDER_STATEMENT)
        const block = style!.search(/@layer\s+components\s*\{/)

        expect({ file, ordered: statement !== -1 && statement < block }).toEqual({ file, ordered: true })
      }
    })
  })
})
