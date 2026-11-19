import * as entry from '../index.ts'

describe('given the entry of the Vite plugin', () => {
  describe('when it is imported', () => {
    it('then it exports the plugin, the helpers of the types and the command', () => {
      expect(Object.keys(entry).toSorted()).toEqual([
        'MazUiIcons',
        'generateIconTypes',
        'loadIconNames',
        'resolveIconTypesModule',
        'runCli',
      ])
    })
  })
})
