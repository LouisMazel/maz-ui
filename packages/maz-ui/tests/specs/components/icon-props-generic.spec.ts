import { readdirSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const directory = resolve(__dirname, '../../../src/components')
const ICON_PROP = /^ {2}\w+\??: .*\b(?:MazIconValue|MazIconLike|MazIconString|MazBtnProps\['(?:startIcon|endIcon|icon)'\])/m

function getPropsBodies(source: string): string[] {
  const names = /defineProps<([^>]+)>\(\)/.exec(source)?.[1]?.split('&').map(name => name.trim()).filter(name => /^\w+$/.test(name)) ?? []

  return names.map(name => new RegExp(`^export interface ${name}\\b[^\\n]*\\{\\n([\\s\\S]*?)^\\}`, 'm').exec(source)?.[1] ?? '')
}

const sources = Object.fromEntries(readdirSync(directory)
  .filter(file => file.endsWith('.vue'))
  .map(file => [
    file,
    readFileSync(resolve(directory, file), 'utf8'),
  ]))

const withIconProps = Object.keys(sources).filter(file => getPropsBodies(sources[file]).some(body => ICON_PROP.test(body)))

describe('given the components with an icon prop', () => {
  describe('when reading their script setup', () => {
    it('then they are generic, a DefineComponent exceeds the union limit of TypeScript with the icon names when passed as a Component', () => {
      expect(withIconProps).toContain('MazBtn.vue')
      expect(withIconProps.filter(file => !/<script[^>]* generic="/.test(sources[file]))).toEqual([])
    })
  })
})
