import { getKnowledge } from '../../__tests__/helpers'
import { DocSearch, searchIcons } from '../engine'

describe('given a DocSearch on the real bundle', () => {
  const search = new DocSearch(getKnowledge())

  describe('when the query is an exact component name', () => {
    it('then the component comes first', () => {
      expect(search.search('MazBtn')[0].doc.id).toBe('components/maz-btn')
    })
  })

  describe('when the query describes a need', () => {
    it('then the hits contain the matched query terms', () => {
      const [hit] = search.search('phone number input')

      expect(hit.doc.id).toBe('components/maz-input-phone-number')
      expect(hit.matched).toEqual(expect.arrayContaining(['phone', 'number']))
      expect(hit.score).toBeGreaterThan(0)
    })
  })

  describe('when a synonym from another library is used', () => {
    it('then the maz-ui equivalent is found', () => {
      expect(search.search('snackbar', { limit: 3 }).map(hit => hit.doc.id)).toContain('composables/use-toast')
    })
  })

  describe('when a category is given', () => {
    it('then every hit belongs to it', () => {
      const hits = search.search('dialog', { category: 'composable' })

      expect(hits.length).toBeGreaterThan(0)
      expect(hits.every(hit => hit.doc.category === 'composable')).toBe(true)
    })
  })

  describe('when the query hints a category', () => {
    it('then it still returns results', () => {
      expect(search.search('debounce helper').some(hit => hit.doc.category === 'util')).toBe(true)
    })
  })

  describe('when a limit is given', () => {
    it('then the number of hits is limited', () => {
      expect(search.search('input', { limit: 2 })).toHaveLength(2)
    })
  })

  describe('when the query only contains stopwords', () => {
    it('then it returns nothing', () => {
      expect(search.search('how to the')).toEqual([])
      expect(search.search('   ')).toEqual([])
    })
  })
})

describe('given searchIcons', () => {
  const names = getKnowledge().iconNames

  describe('when the query uses a synonym', () => {
    it('then it finds the heroicons name', () => {
      expect(searchIcons(names, 'delete icon', 3)[0]).toBe('MazTrash')
      expect(searchIcons(names, 'close')[0]).toBe('MazXMark')
    })
  })

  describe('when the query is a country', () => {
    it('then it finds its flags', () => {
      expect(searchIcons(names, 'france flag', 2)).toEqual(['MazFlagFR', 'MazFlagSquareFR'])
    })
  })

  describe('when the query is an icon name part', () => {
    it('then it finds the icon', () => {
      expect(searchIcons(names, 'github')).toContain('MazGithub')
    })
  })

  describe('when a limit is given', () => {
    it('then the result is limited', () => {
      expect(searchIcons(names, 'arrow', 4)).toHaveLength(4)
    })
  })

  describe('when the query is empty or unknown', () => {
    it('then it returns nothing', () => {
      expect(searchIcons(names, 'icon')).toEqual([])
      expect(searchIcons(names, 'qwxzv')).toEqual([])
    })
  })

  describe('when the query matches flags without asking for a country', () => {
    it('then flags rank after interface icons', () => {
      const results = searchIcons(['MazFlagFR', 'MazFlag'], 'flag fr')

      expect(results).toEqual(expect.arrayContaining(['MazFlagFR', 'MazFlag']))
    })
  })
})
