import { createFuzzySearch, fuzzySearch, highlightMatches } from '../fuzzySearch'

const countries = [
  { code: 'FR', name: 'France' },
  { code: 'GF', name: 'French Guiana' },
  { code: 'DE', name: 'Germany' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'US', name: 'United States' },
  { code: 'NZ', name: 'New Zealand' },
  { code: 'CI', name: 'Côte d’Ivoire' },
  { code: 'ZA', name: 'South Africa' },
  { code: 'CZ', name: 'Czechia' },
]

function names(query: string, options: Parameters<typeof fuzzySearch<typeof countries[number]>>[2] = {
  keys: ['name'],
}) {
  return fuzzySearch(countries, query, options).map(result => result.item.name)
}

describe('given a list of strings', () => {
  describe('when it is searched without keys', () => {
    it('then the strings are searched as they are', () => {
      expect(fuzzySearch(['apple', 'banana', 'cherry'], 'ban').map(result => result.item)).toEqual(['banana'])
    })
  })

  describe('when it contains numbers, booleans and other values', () => {
    it('then the numbers and booleans are searched as text and the other values are ignored', () => {
      expect(fuzzySearch<unknown>([
        42,
        true,
        null,
        { a: 1 },
      ], '42').map(result => result.item)).toEqual([42])
      expect(fuzzySearch<unknown>([42, true], 'true').map(result => result.item)).toEqual([true])
    })
  })
})

describe('given a list of objects', () => {
  describe('when the query is empty', () => {
    it('then every item is returned in the order of the list', () => {
      expect(names('  ')).toEqual(countries.map(country => country.name))
    })
  })

  describe('when the query is an exact value', () => {
    it('then it is the first result with the score 1', () => {
      const [first] = fuzzySearch(countries, 'france', {
        keys: ['name'],
      })

      expect(first?.item.name).toBe('France')
      expect(first?.score).toBe(1)
    })
  })

  describe('when the query is a prefix', () => {
    it('then the prefixed values are found, the best first', () => {
      expect(names('fr')).toEqual(['France', 'French Guiana', 'South Africa'])
    })
  })

  describe('when the query has words in any order', () => {
    it('then the value with all the words is found', () => {
      expect(names('kingdom united')).toEqual(['United Kingdom'])
    })
  })

  describe('when the query is made of scattered letters starting words', () => {
    it('then the value is found', () => {
      expect(names('nwz')).toEqual(['New Zealand'])
    })
  })

  describe('when a short query is scattered over a value', () => {
    it('then the value is not found', () => {
      expect(names('gn')).toEqual([])
    })
  })

  describe('when the query has a typo', () => {
    it('then the value is found below the fuzzy matches', () => {
      const [result] = fuzzySearch(countries, 'Franse', {
        keys: ['name'],
      })

      expect(result?.item.name).toBe('France')
      expect(result?.score).toBeLessThan(0.5)
      expect(result?.matches).toEqual([
        { key: 'name', value: 'France', indexes: [] },
      ])
    })
  })

  describe('when several keys have the same typo', () => {
    it('then the first key is kept', () => {
      const [result] = fuzzySearch([
        { label: 'France', value: 'France' },
      ], 'Franse', {
        keys: ['label', 'value'],
      })

      expect(result?.matches.map(match => match.key)).toEqual(['label'])
    })
  })

  describe('when the typo tolerance is disabled', () => {
    it('then a typo finds nothing', () => {
      expect(names('Franse', {
        keys: ['name'],
        typoThreshold: 1,
      })).toEqual([])
    })
  })

  describe('when a weak scattered match is also a typo match', () => {
    it('then it is kept as a typo match', () => {
      const [result] = fuzzySearch([
        { name: 'xaxbxc' },
      ], 'abc', {
        keys: ['name'],
        typoThreshold: 0,
      })

      expect(result?.matches[0]?.indexes).toEqual([])
    })
  })

  describe('when the query and the value differ by their accents and case', () => {
    it('then the value is found', () => {
      expect(names('COTE')).toEqual(['Côte d’Ivoire'])
    })
  })

  describe('when the query needs a letter without decomposition', () => {
    it('then the normalized value is found', () => {
      expect(fuzzySearch(['Straße'], 'strasse').map(result => result.item)).toEqual(['Straße'])
    })
  })

  describe('when several keys are searched with weights', () => {
    it('then the key with the best weighted score wins and every matching key is listed', () => {
      const [result] = fuzzySearch(countries, 'fr', {
        keys: [
          { key: 'name', weight: 0.5 },
          {
            key: country => country.code,
            name: 'code',
          },
        ],
      })

      expect(result?.item.name).toBe('France')
      expect(result?.matches.map(match => match.key)).toEqual(['code', 'name'])
    })
  })

  describe('when a getter key has no name', () => {
    it('then the match is named after its index', () => {
      const [result] = fuzzySearch(countries, 'nz', {
        keys: [
          country => country.code,
        ],
      })

      expect(result?.matches[0]?.key).toBe('key-0')
    })
  })

  describe('when the results are sorted in the original order', () => {
    it('then they follow the list', () => {
      expect(names('fr', {
        keys: ['name'],
        sort: 'original',
      })).toEqual(['France', 'French Guiana', 'South Africa'])
      expect(names('ia', {
        keys: ['name'],
        sort: 'original',
      })).toEqual(['French Guiana', 'Czechia'])
    })
  })

  describe('when a limit is set', () => {
    it('then the results are capped', () => {
      expect(names('fr', {
        keys: ['name'],
        limit: 1,
      })).toEqual(['France'])
    })
  })

  describe('when the index is reused', () => {
    it('then each search runs on the same prepared list', () => {
      const { search } = createFuzzySearch(countries, {
        keys: ['name'],
      })

      expect(search('germ').map(result => result.item.code)).toEqual(['DE'])
      expect(search('czech').map(result => result.item.code)).toEqual(['CZ'])
    })
  })
})

describe('given highlightMatches', () => {
  describe('when indexes are matched', () => {
    it('then the text is split into matched and unmatched segments', () => {
      expect(highlightMatches('France', [0, 1, 4])).toEqual([
        { text: 'Fr', match: true },
        { text: 'an', match: false },
        { text: 'c', match: true },
        { text: 'e', match: false },
      ])
    })
  })

  describe('when no index is matched', () => {
    it('then the text is one unmatched segment', () => {
      expect(highlightMatches('France', [])).toEqual([
        { text: 'France', match: false },
      ])
    })
  })

  describe('when the text is empty', () => {
    it('then there is no segment', () => {
      expect(highlightMatches('', [])).toEqual([])
    })
  })
})
