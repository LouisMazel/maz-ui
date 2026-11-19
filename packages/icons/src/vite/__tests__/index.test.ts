import * as entry from '../index.ts'

describe('given the entry of the Vite plugin', () => {
  describe('when it is imported', () => {
    it('then it exports the plugin and the helpers of the types', () => {
      expect(Object.keys(entry).toSorted()).toEqual([
        'MazUiIcons',
        'generateIconTypes',
        'loadIconNames',
        'resolveIconTypesModule',
      ])
    })
  })
})
