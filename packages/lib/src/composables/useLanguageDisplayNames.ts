import type { MaybeRefOrGetter } from 'vue'
import { computed, toValue } from 'vue'

const bcp47Codes = [
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

const iso6391Codes = [
  'aa',
  'ab',
  'ae',
  'af',
  'ak',
  'am',
  'an',
  'ar',
  'as',
  'av',
  'ay',
  'az',
  'ba',
  'be',
  'bg',
  'bh',
  'bi',
  'bm',
  'bn',
  'bo',
  'br',
  'bs',
  'ca',
  'ce',
  'ch',
  'co',
  'cr',
  'cs',
  'cu',
  'cv',
  'cy',
  'da',
  'de',
  'dv',
  'dz',
  'ee',
  'el',
  'en',
  'eo',
  'es',
  'et',
  'eu',
  'fa',
  'ff',
  'fi',
  'fj',
  'fo',
  'fr',
  'fy',
  'ga',
  'gd',
  'gl',
  'gn',
  'gu',
  'gv',
  'ha',
  'he',
  'hi',
  'ho',
  'hr',
  'ht',
  'hu',
  'hy',
  'hz',
  'ia',
  'id',
  'ie',
  'ig',
  'ii',
  'ik',
  'io',
  'is',
  'it',
  'iu',
  'ja',
  'jv',
  'ka',
  'kg',
  'ki',
  'kj',
  'kk',
  'kl',
  'km',
  'kn',
  'ko',
  'kr',
  'ks',
  'ku',
  'kv',
  'kw',
  'ky',
  'la',
  'lb',
  'lg',
  'li',
  'ln',
  'lo',
  'lt',
  'lu',
  'lv',
  'mg',
  'mh',
  'mi',
  'mk',
  'ml',
  'mn',
  'mr',
  'ms',
  'mt',
  'my',
  'na',
  'nb',
  'nd',
  'ne',
  'ng',
  'nl',
  'nn',
  'no',
  'nr',
  'nv',
  'ny',
  'oc',
  'oj',
  'om',
  'or',
  'os',
  'pa',
  'pi',
  'pl',
  'ps',
  'pt',
  'qu',
  'rm',
  'rn',
  'ro',
  'ru',
  'rw',
  'sa',
  'sc',
  'sd',
  'se',
  'sg',
  'si',
  'sk',
  'sl',
  'sm',
  'sn',
  'so',
  'sq',
  'sr',
  'ss',
  'st',
  'su',
  'sv',
  'sw',
  'ta',
  'te',
  'tg',
  'th',
  'ti',
  'tk',
  'tl',
  'tn',
  'to',
  'tr',
  'ts',
  'tt',
  'tw',
  'ty',
  'ug',
  'uk',
  'ur',
  'uz',
  've',
  'vi',
  'vo',
  'wa',
  'wo',
  'xh',
  'yi',
  'yo',
  'za',
  'zh',
  'zu',
] as const

const languageCodes = [...iso6391Codes, ...bcp47Codes]

export type IsoCode = (typeof bcp47Codes)[number]
export type Iso6391Code = (typeof iso6391Codes)[number]
export type LanguageCode = (typeof languageCodes)[number]

let languageInstance: Intl.DisplayNames | undefined

function isSameLanguageThanCode(language: string, code: string) {
  return !language || language?.toLocaleLowerCase() === code.toLocaleLowerCase()
}

function getLanguageDisplayName(code?: MaybeRefOrGetter<string | LanguageCode>, locale?: MaybeRefOrGetter<string | LanguageCode>) {
  return computed(() => {
    const resolvedLocale = toValue(locale)
    const resolvedIsoCode = toValue(code)

    try {
      if (!resolvedLocale || !resolvedIsoCode) {
        return resolvedIsoCode
      }

      if (!languageInstance || resolvedLocale !== languageInstance.resolvedOptions().locale) {
        languageInstance = new Intl.DisplayNames([resolvedLocale], { type: 'language' })
      }

      const language = languageInstance.of(resolvedIsoCode)

      return !language || isSameLanguageThanCode(language, resolvedIsoCode) ? undefined : language
    }
    catch {
      return resolvedIsoCode
    }
  })
}

function getAllLanguageDisplayNames(locale?: MaybeRefOrGetter<string | LanguageCode>) {
  return computed(() => {
    const resolvedLocale = toValue(locale)

    if (!resolvedLocale) {
      return []
    }

    if (!languageInstance || resolvedLocale !== languageInstance.resolvedOptions().locale) {
      languageInstance = new Intl.DisplayNames([resolvedLocale], {
        type: 'language',
      })
    }

    return languageCodes
      .map((code) => {
        try {
          const language = languageInstance?.of(code)

          if (!language || isSameLanguageThanCode(language, code)) {
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

export function useLanguageDisplayNames(mainLocale?: MaybeRefOrGetter<string | LanguageCode>) {
  return {
    getLanguageDisplayName: ({ code, locale }: { code?: MaybeRefOrGetter<string | LanguageCode>, locale?: MaybeRefOrGetter<string | LanguageCode> }) => getLanguageDisplayName(code, locale || mainLocale),
    getAllLanguageDisplayNames: (locale?: MaybeRefOrGetter<string | LanguageCode>) => getAllLanguageDisplayNames(locale || mainLocale),
  }
}
