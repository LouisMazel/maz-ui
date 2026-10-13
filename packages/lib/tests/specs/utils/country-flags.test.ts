import { useDisplayNames } from '@/composables/useDisplayNames'
import { countryFlagCodes, loadCountryFlag } from '@/utils/country-flags'

const iconsSquareFlagFiles = Object.keys(import.meta.glob('../../../../icons/flags/1x1/*.svg'))

describe('given the square flags of @maz-ui/icons', () => {
  describe('when listing the codes of the loader', () => {
    it('then every square flag has a loader', () => {
      const iconsCodes = iconsSquareFlagFiles
        .map(file => file.split('/').pop()!.replace('.svg', ''))
        .sort()

      expect(iconsCodes).toHaveLength(256)

      expect([...countryFlagCodes].sort()).toEqual(iconsCodes)
    })
  })

  describe('when loading every flag', () => {
    it('then each loader gives a SVG data URL', async () => {
      const sources = await Promise.all(countryFlagCodes.map(code => loadCountryFlag(code)))

      expect(sources.every(source => source?.startsWith('data:image/svg+xml;charset=utf-8,%3C'))).toBe(true)
      expect(sources.every(source => decodeURIComponent(source!).includes('<svg'))).toBe(true)
    })
  })
})

describe('given the countries of MazSelectCountry', () => {
  describe('when looking for their flag', () => {
    it('then only the user-assigned code AA has no flag', () => {
      const countries = useDisplayNames('en-US').getAllDisplayNames({ type: 'region', codesType: 'country' }).value ?? []
      const codesWithoutFlag = countries
        .map(({ code }) => code)
        .filter(code => !countryFlagCodes.includes(code))

      expect(countries.length).toBeGreaterThan(200)
      expect(codesWithoutFlag.every(code => code === 'AA')).toBe(true)
    })
  })
})

describe('given loadCountryFlag', () => {
  describe('when the code is lowercase', () => {
    it('then it gives the flag of the uppercase code', async () => {
      expect(await loadCountryFlag('fr')).toBe(await loadCountryFlag('FR'))
    })
  })

  describe('when the code is a language with a region', () => {
    it('then it gives the flag of the region', async () => {
      expect(await loadCountryFlag('en-US')).toBe(await loadCountryFlag('US'))
    })
  })

  describe('when the code is a subdivision with its own flag', () => {
    it('then it gives the flag of the subdivision', async () => {
      expect(await loadCountryFlag('GE-AB')).not.toBe(await loadCountryFlag('GE'))
    })
  })

  describe('when the code has no flag', () => {
    it('then it gives undefined', async () => {
      expect(await loadCountryFlag('XX')).toBeUndefined()
      expect(await loadCountryFlag('')).toBeUndefined()
    })
  })
})
