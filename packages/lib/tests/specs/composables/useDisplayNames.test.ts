import { useDisplayNames } from '@composables/useDisplayNames'
import { describe, expect, it } from 'vitest'
import { ref } from 'vue'

describe('useDisplayNames', () => {
  const { getDisplayName, getAllDisplayNames } = useDisplayNames()

  it('should return the display name for a given ISO code and locale', () => {
    const code = ref('en-US')
    const locale = ref('fr-FR')
    const displayName = getDisplayName(code, { type: 'language', locale })

    expect(displayName.value).toBe('anglais américain')
  })

  it('should return the ISO code if locale is not provided', () => {
    const code = ref('en-US')
    const displayName = getDisplayName(code, { type: 'language' })

    expect(displayName.value).toBe('en-US')
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

    expect(languages.value).toContainEqual({ language: 'vietnamien (Viêt Nam)', code: 'vi-VN' })
  })

  it('should return an empty array if locale is not provided for ISO codes', () => {
    const languages = getAllDisplayNames({ type: 'language' })

    expect(languages.value).toEqual([])
  })

  it('should handle invalid ISO codes gracefully', () => {
    const code = ref('invalid-code')
    const locale = ref('fr-FR')
    const displayName = getDisplayName(code, { type: 'language', locale })

    expect(displayName.value).toBe('invalid (Code)')
  })

  it('should handle invalid locales gracefully', () => {
    const code = ref('en-US')
    const locale = ref('invalid-locale')
    const displayName = getDisplayName(code, { type: 'language', locale })

    expect(displayName.value).toBe('American English')
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
