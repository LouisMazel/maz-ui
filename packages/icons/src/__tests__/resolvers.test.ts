import type { ComponentResolverObject } from 'unplugin-vue-components/types'
import { MazIconsResolver } from '../resolvers.ts'

describe('given MazIconsResolver', () => {
  const { resolve } = MazIconsResolver() as ComponentResolverObject

  describe('when a template uses an icon component', () => {
    it('then it is imported from its static module', () => {
      expect(resolve('MazStar')).toEqual({ name: 'MazStar', from: '@maz-ui/icons/static/MazStar' })
    })
  })

  describe('when a template uses a lazy icon component', () => {
    it('then it is imported from its lazy module', () => {
      expect(resolve('LazyMazStar')).toEqual({ name: 'MazStar', from: '@maz-ui/icons/lazy/MazStar' })
    })
  })

  describe('when a template uses another component', () => {
    it.each(['MazBtn', 'Star', 'LazyMazBtn'])('then %s is not resolved', (name) => {
      expect(resolve(name)).toBeNull()
    })
  })
})
