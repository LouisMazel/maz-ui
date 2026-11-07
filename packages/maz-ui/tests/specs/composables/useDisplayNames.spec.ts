import { useDisplayNames } from '@composables/useDisplayNames'
import { describe, expect, it } from 'vitest'
import { ref } from 'vue'

describe('useDisplayNames', () => {
  const { getDisplayName, getAllDisplayNames } = useDisplayNames('en-US')

  it.each([
    ['en-US', 'fr-FR', 'anglais américain'],
    ['invalid-code', 'fr-FR', 'invalid (Code)'],
    ['en-US', 'invalid-locale', 'American English'],
  ])('resolves display name for code %s and locale %s', (code, locale, expected) => {
    const codeRef = ref(code)
    const localeRef = ref(locale)
    const displayName = getDisplayName(codeRef, { type: 'language', locale: localeRef })

    expect(displayName.value).toBe(expected)
  })

  it('should return the ISO code if locale is not provided', () => {
    const code = ref('en-US')
    const displayName = getDisplayName(code, { type: 'language' })

    expect(displayName.value).toBe('American English')
  })

  it('should return the ISO code if ISO code is not provided', () => {
    const locale = ref('fr-FR')
    // @ts-expect-error - test undefined value
    const displayName = getDisplayName(undefined, { type: 'language', locale })

    expect(displayName.value).toBeUndefined()
  })

  it('should return display names for all ISO codes for a given locale', () => {
    const locale = ref('fr-FR')
    const languages = getAllDisplayNames({ type: 'language', locale })

    expect(languages.value).toContainEqual({ name: 'vietnamien (Viêt Nam)', code: 'vi-VN' })
  })

  it('should return an empty array if locale is not provided for ISO codes', () => {
    const languages = getAllDisplayNames({ type: 'language' })

    expect(languages.value?.some(language => language.name === 'French' && language.code === 'fr')).toBe(true)
  })

  it('should return consistent results for reactive updates to code', () => {
    const code = ref('en-US')
    const locale = ref('fr-FR')
    const displayName = getDisplayName(code, { type: 'language', locale })

    expect(displayName.value).toBe('anglais américain')

    code.value = 'es-ES'
    expect(displayName.value).toBe('espagnol d’Espagne')
  })

  it('should return consistent results for reactive updates to locale', () => {
    const code = ref('en-US')
    const locale = ref('fr-FR')
    const displayName = getDisplayName(code, { type: 'language', locale })

    expect(displayName.value).toBe('anglais américain')

    locale.value = 'es-ES'
    expect(displayName.value).toBe('inglés estadounidense')
  })

  it('should handle null and undefined values', () => {
    const code = ref(null)
    const locale = ref('fr-FR')
    // @ts-expect-error - test null and undefined values
    const displayName = getDisplayName(code, { type: 'language', locale })

    expect(displayName.value).toBeNull()
  })
})
