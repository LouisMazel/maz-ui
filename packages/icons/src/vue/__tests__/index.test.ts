import * as entry from '../index.ts'

describe('given the entry of the Vue components', () => {
  describe('when it is imported', () => {
    it('then it exports the component and the helpers of the SVG', () => {
      expect(Object.keys(entry).toSorted()).toEqual([
        'MazIconPrimitive',
        'hasIcon',
        'parseSvg',
        'prepareSvgString',
        'stripSvgRootDimensions',
      ])
    })
  })
})
