import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const directory = resolve(__dirname, '../../../src/tailwindcss')
const utilities = readFileSync(resolve(directory, 'utilities.css'), 'utf8')
const entry = readFileSync(resolve(directory, 'utilities-entry.css'), 'utf8')

describe('given the entry of maz-ui/utilities.css', () => {
  describe('when comparing its inline source with the utilities of maz-ui', () => {
    it('then it lists every @utility', () => {
      const declared = [
        ...utilities.matchAll(/^@utility (\S+) \{/gm),
      ].map(match => match[1]).sort()
      const listed = entry.match(/@source inline\("([^"]*)"\)/)?.[1]?.split(/\s+/).filter(Boolean).sort()

      expect(listed).toEqual(declared)
    })
  })
})
