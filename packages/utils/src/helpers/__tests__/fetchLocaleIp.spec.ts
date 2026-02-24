import { fetchLocaleIp } from '../fetchLocaleIp'

describe('given fetchLocaleIp function', () => {
  describe('when the API returns a successful response', () => {
    it('then it should return the country code', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        json: vi.fn().mockResolvedValue({ country_code: 'FR' }),
      })

      const result = await fetchLocaleIp()
      expect(result).toBe('FR')
      expect(globalThis.fetch).toHaveBeenCalledWith('https://ipwho.is')
    })
  })

  describe('when the API call fails', () => {
    it('then it should return undefined and log an error', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      globalThis.fetch = vi.fn().mockRejectedValue(new Error('Network error'))

      const result = await fetchLocaleIp()
      expect(result).toBeUndefined()
      expect(consoleSpy).toHaveBeenCalled()
    })
  })
})
