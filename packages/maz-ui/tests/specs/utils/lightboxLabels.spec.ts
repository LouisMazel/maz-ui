import { useTranslations } from '@maz-ui/translations/composables/useTranslations'
import { getLightboxLabel } from '@/utils/lightboxLabels'

describe('given getLightboxLabel', () => {
  describe('when the translation exists', () => {
    it('then it returns the translation', () => {
      vi.mocked(useTranslations).mockReturnValue({ t: () => 'Fermer' } as never)

      expect(getLightboxLabel('lightbox.close')).toBe('Fermer')
    })
  })

  describe('when the translation is missing and returns the key', () => {
    it('then it returns the english fallback', () => {
      vi.mocked(useTranslations).mockReturnValue({ t: (key: string) => key } as never)

      expect(getLightboxLabel('lightbox.next')).toBe('Next image')
    })
  })

  describe('when the translation is empty', () => {
    it('then it returns the english fallback', () => {
      vi.mocked(useTranslations).mockReturnValue({ t: () => '' } as never)

      expect(getLightboxLabel('lightbox.loading')).toBe('Loading...')
    })
  })

  describe('when no translations plugin is installed', () => {
    it('then it returns the english fallback', () => {
      vi.mocked(useTranslations).mockImplementation(() => {
        throw new Error('no plugin')
      })

      expect(getLightboxLabel('lightbox.open')).toBe('Enlarge image')
    })
  })
})
