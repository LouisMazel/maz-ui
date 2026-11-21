import { describe, expect, it } from 'vitest'

import { loadCountryFlag } from '../local-flags'

describe('given the loader of the local flags', () => {
  describe('when a flag is loaded', () => {
    it('then it returns the flag of @maz-ui/icons, or undefined for an unknown code', async () => {
      expect(await loadCountryFlag('FR')).toMatch(/^data:image\/svg\+xml/)
      expect(await loadCountryFlag('XX')).toBeUndefined()
    })
  })
})
