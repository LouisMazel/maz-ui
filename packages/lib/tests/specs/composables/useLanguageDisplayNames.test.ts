import { useLanguageDisplayNames } from '@modules/composables/useLanguageDisplayNames'
import { describe, expect, it } from 'vitest'
import { ref } from 'vue'

describe('useLanguageDisplayNames', () => {
  const { getLanguageDisplayName, getAllPossibleLanguages, getLanguageDisplayNamesForIsoCodes } = useLanguageDisplayNames()

  it('should return the display name for a given ISO code and locale', () => {
    const isoCode = ref('en-US')
    const locale = ref('fr-FR')
    const displayName = getLanguageDisplayName({ isoCode, locale })

    expect(displayName.value).toBe('anglais américain')
  })

  it('should return the ISO code if locale is not provided', () => {
    const isoCode = ref('en-US')
    const displayName = getLanguageDisplayName({ isoCode })

    expect(displayName.value).toBe('en-US')
  })

  it('should return the ISO code if ISO code is not provided', () => {
    const locale = ref('fr-FR')
    const displayName = getLanguageDisplayName({ locale })

    expect(displayName.value).toBeUndefined()
  })

  it('should return all possible languages for a given locale', () => {
    const locale = ref('fr-FR')
    const languages = getAllPossibleLanguages(locale)

    expect(languages.value).toContainEqual({ language: 'anglais', code: 'EN' })
  })

  it('should return an empty array if locale is not provided for all possible languages', () => {
    const languages = getAllPossibleLanguages()

    expect(languages.value).toEqual([])
  })

  it('should return display names for all ISO codes for a given locale', () => {
    const locale = ref('fr-FR')
    const languages = getLanguageDisplayNamesForIsoCodes(locale)

    expect(languages.value).toContainEqual({ language: 'vietnamien (Viêt Nam)', code: 'vi-VN' })
  })

  it('should return an empty array if locale is not provided for ISO codes', () => {
    const languages = getLanguageDisplayNamesForIsoCodes()

    expect(languages.value).toEqual([])
  })
})
