import { computed, type MaybeRefOrGetter, toValue } from 'vue'

export const isoCodes = [
  'af-ZA',
  'sq-AL',
  'ar-DZ',
  'ar-BH',
  'ar-EG',
  'ar-IQ',
  'ar-JO',
  'ar-KW',
  'ar-LB',
  'ar-LY',
  'ar-MA',
  'ar-OM',
  'ar-QA',
  'ar-SA',
  'ar-SY',
  'ar-TN',
  'ar-AE',
  'ar-YE',
  'hy-AM',
  'Cy-az-AZ',
  'Lt-az-AZ',
  'eu-ES',
  'be-BY',
  'bg-BG',
  'ca-ES',
  'zh-CN',
  'zh-HK',
  'zh-MO',
  'zh-SG',
  'zh-TW',
  'zh-CHS',
  'zh-CHT',
  'hr-HR',
  'cs-CZ',
  'da-DK',
  'div-MV',
  'nl-BE',
  'nl-NL',
  'en-AU',
  'en-BZ',
  'en-CA',
  'en-CB',
  'en-IE',
  'en-JM',
  'en-NZ',
  'en-PH',
  'en-ZA',
  'en-TT',
  'en-GB',
  'en-US',
  'en-ZW',
  'et-EE',
  'fo-FO',
  'fa-IR',
  'fi-FI',
  'fr-BE',
  'fr-CA',
  'fr-FR',
  'fr-LU',
  'fr-MC',
  'fr-CH',
  'gl-ES',
  'ka-GE',
  'de-AT',
  'de-DE',
  'de-LI',
  'de-LU',
  'de-CH',
  'el-GR',
  'gu-IN',
  'he-IL',
  'hi-IN',
  'hu-HU',
  'is-IS',
  'id-ID',
  'it-IT',
  'it-CH',
  'ja-JP',
  'kn-IN',
  'kk-KZ',
  'kok-IN',
  'ko-KR',
  'ky-KZ',
  'lv-LV',
  'lt-LT',
  'mk-MK',
  'ms-BN',
  'ms-MY',
  'mr-IN',
  'mn-MN',
  'nb-NO',
  'nn-NO',
  'pl-PL',
  'pt-BR',
  'pt-PT',
  'pa-IN',
  'ro-RO',
  'ru-RU',
  'sa-IN',
  'Cy-sr-SP',
  'Lt-sr-SP',
  'sk-SK',
  'sl-SI',
  'es-AR',
  'es-BO',
  'es-CL',
  'es-CO',
  'es-CR',
  'es-DO',
  'es-EC',
  'es-SV',
  'es-GT',
  'es-HN',
  'es-MX',
  'es-NI',
  'es-PA',
  'es-PY',
  'es-PE',
  'es-PR',
  'es-ES',
  'es-UY',
  'es-VE',
  'sw-KE',
  'sv-FI',
  'sv-SE',
  'syr-SY',
  'ta-IN',
  'tt-RU',
  'te-IN',
  'th-TH',
  'tr-TR',
  'uk-UA',
  'ur-PK',
  'Cy-uz-UZ',
  'Lt-uz-UZ',
  'vi-VN',
] as const

export type IsoCode = (typeof isoCodes)[number]

function getLanguageDisplayName(isoCode?: MaybeRefOrGetter<string>, locale?: MaybeRefOrGetter<string>) {
  return computed(() => {
    const resolvedLocale = toValue(locale)
    const resolvedIsoCode = toValue(isoCode)

    try {
      if (!resolvedLocale || !resolvedIsoCode) {
        return resolvedIsoCode
      }

      const languageInstance = new Intl.DisplayNames([resolvedLocale], { type: 'language' })

      return languageInstance.of(resolvedIsoCode) || resolvedIsoCode
    }
    catch {
      return resolvedIsoCode
    }
  })
}

function getAllPossibleLanguages(locale?: MaybeRefOrGetter<string>) {
  return computed(() => {
    const resolvedLocale = toValue(locale)

    if (!resolvedLocale) {
      return []
    }

    const A = 65
    const Z = 90
    const languageInstance = new Intl.DisplayNames([resolvedLocale], { type: 'language' })

    const languages: {
      language: string
      code: string
    }[] = []

    for (let index = A; index <= Z; ++index) {
      for (let index_ = A; index_ <= Z; ++index_) {
        const code = String.fromCodePoint(index) + String.fromCodePoint(index_)
        const language = languageInstance.of(code)
        if (
          language
          && code.toLocaleLowerCase() !== language.toLocaleLowerCase()
        ) {
          languages.push({
            language,
            code,
          })
        }
      }
    }

    return languages
  })
}

function getLanguageDisplayNamesForIsoCodes(locale?: MaybeRefOrGetter<string>) {
  return computed(() => {
    const resolvedLocale = toValue(locale)

    if (!resolvedLocale) {
      return []
    }

    const languageInstance = new Intl.DisplayNames([resolvedLocale], {
      type: 'language',
    })

    return isoCodes
      .map((code) => {
        try {
          const language = languageInstance.of(code)
          if (!language || code.toLocaleLowerCase() === language.toLocaleLowerCase()) {
            return undefined
          }

          return {
            language,
            code,
          }
        }
        catch {
          return undefined
        }
      })
      .filter(Boolean)
  })
}

export function useLanguageDisplayNames(mainLocale?: MaybeRefOrGetter<string>) {
  return {
    getLanguageDisplayName: ({ isoCode, locale }: { isoCode?: MaybeRefOrGetter<string>, locale?: MaybeRefOrGetter<string> }) => getLanguageDisplayName(isoCode, locale || mainLocale),
    getAllPossibleLanguages: (locale?: MaybeRefOrGetter<string>) => getAllPossibleLanguages(locale || mainLocale),
    getLanguageDisplayNamesForIsoCodes: (locale?: MaybeRefOrGetter<string>) => getLanguageDisplayNamesForIsoCodes(locale || mainLocale),
  }
}
