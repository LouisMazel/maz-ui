import type { MaybeRefOrGetter } from 'vue'
import { truthyFilter } from '@maz-ui/utils/helpers/truthyFilter'
import { computed, toValue } from 'vue'

const bcp47Codes = ['af-ZA', 'sq-AL', 'ar-DZ', 'ar-BH', 'ar-EG', 'ar-IQ', 'ar-JO', 'ar-KW', 'ar-LB', 'ar-LY', 'ar-MA', 'ar-OM', 'ar-QA', 'ar-SA', 'ar-SY', 'ar-TN', 'ar-AE', 'ar-YE', 'hy-AM', 'Cy-az-AZ', 'Lt-az-AZ', 'eu-ES', 'be-BY', 'bg-BG', 'ca-ES', 'zh-CN', 'zh-HK', 'zh-MO', 'zh-SG', 'zh-TW', 'zh-CHS', 'zh-CHT', 'hr-HR', 'cs-CZ', 'da-DK', 'div-MV', 'nl-BE', 'nl-NL', 'en-AU', 'en-BZ', 'en-CA', 'en-CB', 'en-IE', 'en-JM', 'en-NZ', 'en-PH', 'en-ZA', 'en-TT', 'en-GB', 'en-US', 'en-ZW', 'et-EE', 'fo-FO', 'fa-IR', 'fi-FI', 'fr-BE', 'fr-CA', 'fr-FR', 'fr-LU', 'fr-MC', 'fr-CH', 'gl-ES', 'ka-GE', 'de-AT', 'de-DE', 'de-LI', 'de-LU', 'de-CH', 'el-GR', 'gu-IN', 'he-IL', 'hi-IN', 'hu-HU', 'is-IS', 'id-ID', 'it-IT', 'it-CH', 'ja-JP', 'kn-IN', 'kk-KZ', 'kok-IN', 'ko-KR', 'ky-KZ', 'lv-LV', 'lt-LT', 'mk-MK', 'ms-BN', 'ms-MY', 'mr-IN', 'mn-MN', 'nb-NO', 'nn-NO', 'pl-PL', 'pt-BR', 'pt-PT', 'pa-IN', 'ro-RO', 'ru-RU', 'sa-IN', 'Cy-sr-SP', 'Lt-sr-SP', 'sk-SK', 'sl-SI', 'es-AR', 'es-BO', 'es-CL', 'es-CO', 'es-CR', 'es-DO', 'es-EC', 'es-SV', 'es-GT', 'es-HN', 'es-MX', 'es-NI', 'es-PA', 'es-PY', 'es-PE', 'es-PR', 'es-ES', 'es-UY', 'es-VE', 'sw-KE', 'sv-FI', 'sv-SE', 'syr-SY', 'ta-IN', 'tt-RU', 'te-IN', 'th-TH', 'tr-TR', 'uk-UA', 'ur-PK', 'Cy-uz-UZ', 'Lt-uz-UZ', 'vi-VN'] as const

const countryCodes = ['AA', 'AC', 'AD', 'AE', 'AF', 'AG', 'AI', 'AL', 'AM', 'AO', 'AR', 'AS', 'AT', 'AU', 'AW', 'AX', 'AZ', 'BA', 'BB', 'BD', 'BE', 'BF', 'BG', 'BH', 'BI', 'BJ', 'BL', 'BM', 'BN', 'BO', 'BQ', 'BR', 'BS', 'BT', 'BW', 'BY', 'BZ', 'CA', 'CC', 'CD', 'CF', 'CG', 'CH', 'CI', 'CK', 'CL', 'CM', 'CN', 'CO', 'CR', 'CU', 'CV', 'CW', 'CX', 'CY', 'CZ', 'DE', 'DJ', 'DK', 'DM', 'DO', 'DZ', 'EC', 'EE', 'EG', 'EH', 'ER', 'ES', 'ET', 'FI', 'FJ', 'FK', 'FM', 'FO', 'FR', 'GA', 'GB', 'GD', 'GE', 'GF', 'GG', 'GH', 'GI', 'GL', 'GM', 'GN', 'GP', 'GQ', 'GR', 'GT', 'GU', 'GW', 'GY', 'HK', 'HN', 'HR', 'HT', 'HU', 'ID', 'IE', 'IL', 'IM', 'IN', 'IO', 'IQ', 'IR', 'IS', 'IT', 'JE', 'JM', 'JO', 'JP', 'KE', 'KG', 'KH', 'KI', 'KM', 'KN', 'KP', 'KR', 'KW', 'KY', 'KZ', 'LA', 'LB', 'LC', 'LI', 'LK', 'LR', 'LS', 'LT', 'LU', 'LV', 'LY', 'MA', 'MC', 'MD', 'ME', 'MF', 'MG', 'MH', 'MK', 'ML', 'MM', 'MN', 'MO', 'MP', 'MQ', 'MR', 'MS', 'MT', 'MU', 'MV', 'MW', 'MX', 'MY', 'MZ', 'NA', 'NC', 'NE', 'NF', 'NG', 'NI', 'NL', 'NO', 'NP', 'NR', 'NU', 'NZ', 'OM', 'PA', 'PE', 'PF', 'PG', 'PH', 'PK', 'PL', 'PM', 'PR', 'PS', 'PT', 'PW', 'PY', 'QA', 'RE', 'RO', 'RS', 'RU', 'RW', 'SA', 'SB', 'SC', 'SD', 'SE', 'SG', 'SH', 'SI', 'SJ', 'SK', 'SL', 'SM', 'SN', 'SO', 'SR', 'SS', 'ST', 'SV', 'SX', 'SY', 'SZ', 'TA', 'TC', 'TD', 'TG', 'TH', 'TJ', 'TK', 'TL', 'TM', 'TN', 'TO', 'TR', 'TT', 'TV', 'TW', 'TZ', 'UA', 'UG', 'US', 'UY', 'UZ', 'VA', 'VC', 'VE', 'VG', 'VI', 'VN', 'VU', 'WF', 'WS', 'XK', 'YE', 'YT', 'ZA', 'ZM', 'ZW'] as const

const iso6391Codes = ['aa', 'ab', 'ae', 'af', 'ak', 'am', 'an', 'ar', 'as', 'av', 'ay', 'az', 'ba', 'be', 'bg', 'bh', 'bi', 'bm', 'bn', 'bo', 'br', 'bs', 'ca', 'ce', 'ch', 'co', 'cr', 'cs', 'cu', 'cv', 'cy', 'da', 'de', 'dv', 'dz', 'ee', 'el', 'en', 'eo', 'es', 'et', 'eu', 'fa', 'ff', 'fi', 'fj', 'fo', 'fr', 'fy', 'ga', 'gd', 'gl', 'gn', 'gu', 'gv', 'ha', 'he', 'hi', 'ho', 'hr', 'ht', 'hu', 'hy', 'hz', 'ia', 'id', 'ie', 'ig', 'ii', 'ik', 'io', 'is', 'it', 'iu', 'ja', 'jv', 'ka', 'kg', 'ki', 'kj', 'kk', 'kl', 'km', 'kn', 'ko', 'kr', 'ks', 'ku', 'kv', 'kw', 'ky', 'la', 'lb', 'lg', 'li', 'ln', 'lo', 'lt', 'lu', 'lv', 'mg', 'mh', 'mi', 'mk', 'ml', 'mn', 'mr', 'ms', 'mt', 'my', 'na', 'nb', 'nd', 'ne', 'ng', 'nl', 'nn', 'no', 'nr', 'nv', 'ny', 'oc', 'oj', 'om', 'or', 'os', 'pa', 'pi', 'pl', 'ps', 'pt', 'qu', 'rm', 'rn', 'ro', 'ru', 'rw', 'sa', 'sc', 'sd', 'se', 'sg', 'si', 'sk', 'sl', 'sm', 'sn', 'so', 'sq', 'sr', 'ss', 'st', 'su', 'sv', 'sw', 'ta', 'te', 'tg', 'th', 'ti', 'tk', 'tl', 'tn', 'to', 'tr', 'ts', 'tt', 'tw', 'ty', 'ug', 'uk', 'ur', 'uz', 've', 'vi', 'vo', 'wa', 'wo', 'xh', 'yi', 'yo', 'za', 'zh', 'zu'] as const

const displayNamesCodes = [...iso6391Codes, ...bcp47Codes, ...countryCodes]

export type Bcp47Code = (typeof bcp47Codes)[number]
export type Iso6391Code = (typeof iso6391Codes)[number]
export type CountryCode = (typeof countryCodes)[number]
export type DisplayNameCode = (typeof displayNamesCodes)[number]
export type DisplayNamesOptions = Omit<Intl.DisplayNamesOptions, 'type'> & {
  type?: 'region' | 'language'
}

const DEFAULT_DISPLAY_NAMES_OPTIONS: Required<DisplayNamesOptions> = {
  type: 'region',
  languageDisplay: 'standard',
  fallback: 'code',
  style: 'long',
  localeMatcher: 'lookup',
}

const displayNamesCache = new Map<string, Intl.DisplayNames>()

// Optional: Clear cache periodically to prevent memory leaks in long-running apps
let cacheCleanupTimer: ReturnType<typeof setTimeout> | null = null

function scheduleCacheCleanup() {
  // Skip cleanup during SSR/SSG to avoid timers
  if (typeof globalThis.window === 'undefined')
    return

  if (cacheCleanupTimer)
    clearTimeout(cacheCleanupTimer)

  cacheCleanupTimer = setTimeout(() => {
    if (displayNamesCache.size > 50) { // Arbitrary limit
      displayNamesCache.clear()
    }
    cacheCleanupTimer = null
  }, 5 * 60 * 1000) // 5 minutes
}

function isSameLanguageThanCode(language: string, code: string) {
  return !language || language?.toLocaleLowerCase() === code.toLocaleLowerCase()
}

function normalizeCode(code: string, type: DisplayNamesOptions['type']) {
  if (type === 'region')
    return code.toUpperCase()
  if (type === 'language')
    return code.toLowerCase()
  return code
}

function getDisplayNamesInstance(
  locale: string,
  options: DisplayNamesOptions = DEFAULT_DISPLAY_NAMES_OPTIONS,
) {
  const cacheKey = `${locale}-${JSON.stringify(options)}`

  if (!displayNamesCache.has(cacheKey)) {
    try {
      const instance = new Intl.DisplayNames([locale], {
        ...options,
        type: options.type ?? DEFAULT_DISPLAY_NAMES_OPTIONS.type,
      })
      displayNamesCache.set(cacheKey, instance)
      scheduleCacheCleanup()
    }
    catch (error) {
      console.warn(`[maz-ui] (useDisplayNames) Failed to create DisplayNames instance for locale ${locale}:`, error)
      return null
    }
  }

  return displayNamesCache.get(cacheKey) || null
}

interface DynamicDisplayNamesOptions {
  /**
   * The type of display names to use.
   * @property 'region' | 'language'
   * @default 'region'
   */
  type?: MaybeRefOrGetter<DisplayNamesOptions['type']>
  /**
   * The language display to use.
   * @property 'standard' | 'narrow' | 'short'
   * @default 'standard'
   */
  languageDisplay?: MaybeRefOrGetter<DisplayNamesOptions['languageDisplay']>
  /**
   * The fallback to use.
   * @property 'code' | 'none'
   * @default 'code'
   */
  fallback?: MaybeRefOrGetter<DisplayNamesOptions['fallback']>
  /**
   * The style to use.
   * @property 'long' | 'short' | 'narrow'
   * @default 'long'
   */
  style?: MaybeRefOrGetter<DisplayNamesOptions['style']>
  /**
   * The locale matcher to use.
   * @property 'lookup' | 'best fit'
   * @default 'lookup'
   */
  localeMatcher?: MaybeRefOrGetter<DisplayNamesOptions['localeMatcher']>
}

type GetDisplayNameOptions = MaybeRefOrGetter<{ locale?: MaybeRefOrGetter<DisplayNameCode | string> } & DynamicDisplayNamesOptions>

export type CodesType = 'iso' | 'bcp' | 'country' | 'all'

function getDisplayNamesCodes<T extends CodesType>(codesType: T) {
  if (codesType === 'iso')
    return iso6391Codes
  if (codesType === 'bcp')
    return bcp47Codes
  if (codesType === 'country')
    return countryCodes

  return displayNamesCodes
}

function getName(code: string, locale: string, options?: Partial<DisplayNamesOptions>) {
  const opts = {
    ...DEFAULT_DISPLAY_NAMES_OPTIONS,
    ...options,
    type: options?.type ?? DEFAULT_DISPLAY_NAMES_OPTIONS.type,
  }

  const displayNamesInstance = getDisplayNamesInstance(locale, opts)

  const normalizedCode = normalizeCode(code, opts.type)

  return displayNamesInstance?.of(normalizedCode)
}

function getDisplayName(code: MaybeRefOrGetter<DisplayNameCode | string>, options?: GetDisplayNameOptions) {
  return computed(() => {
    const resolvedOptions = toValue(options)
    const resolvedLocale = toValue(resolvedOptions?.locale)
    const resolvedType = toValue(resolvedOptions?.type) ?? DEFAULT_DISPLAY_NAMES_OPTIONS.type
    const resolvedCode = toValue(code)
    const resolvedLanguageDisplay = toValue(resolvedOptions?.languageDisplay)
    const resolvedFallback = toValue(resolvedOptions?.fallback)
    const resolvedStyle = toValue(resolvedOptions?.style)
    const resolvedLocaleMatcher = toValue(resolvedOptions?.localeMatcher)

    if (!resolvedLocale) {
      return resolvedCode
    }

    try {
      const name = getName(resolvedCode, resolvedLocale, {
        type: resolvedType,
        languageDisplay: resolvedLanguageDisplay,
        fallback: resolvedFallback,
        style: resolvedStyle,
        localeMatcher: resolvedLocaleMatcher,
      })

      return name
    }
    catch {
      return resolvedCode
    }
  })
}

type GetAllDisplayNamesOptions<T extends CodesType> = MaybeRefOrGetter<{
  /**
   * The locale to use.
   * @property string | DisplayNameCode
   * @default undefined
   */
  locale?: MaybeRefOrGetter<DisplayNameCode | string>
  /**
   * The codes to include.
   * @property string[] | undefined
   * @default undefined
   */
  onlyCodes?: MaybeRefOrGetter<DisplayNameCode[] | string[] | undefined>
  /**
   * The codes to exclude.
   * @property string[] | undefined
   * @default undefined
   */
  excludedCodes?: MaybeRefOrGetter<DisplayNameCode[] | string[] | undefined>
  /**
   * The codes to prefer.
   * @property string[] | undefined
   * @default undefined
   */
  preferredCodes?: MaybeRefOrGetter<DisplayNameCode[] | string[] | undefined>
  /**
   * The type of codes to use.
   * @property 'iso' | 'bcp' | 'country' | 'all'
   * @default 'all'
   */
  codesType?: MaybeRefOrGetter<T>
  /**
   * Remove duplicates from the result.
   * @property 'name' | 'code' | false
   * @default 'name'
   */
  removeDuplicates?: MaybeRefOrGetter<'name' | 'code' | false>
  /**
   * Remove unmatched codes from the result.
   * @default true
   */
  removeUnmatched?: MaybeRefOrGetter<boolean>
} & DynamicDisplayNamesOptions>

type CodeResult<T extends CodesType> = T extends 'iso' ? Iso6391Code : T extends 'bcp' ? Bcp47Code : T extends 'country' ? CountryCode : DisplayNameCode | string

function getAllDisplayNames<T extends CodesType>(options: GetAllDisplayNamesOptions<T>) {
  return computed(() => {
    const resolvedOptions = toValue(options)

    const resolvedLocale = toValue(resolvedOptions?.locale)
    const resolvedCodesType = toValue(resolvedOptions?.codesType) ?? 'all' as T
    const resolvedOnlyCodes = toValue(resolvedOptions.onlyCodes)
    const resolvedExcludedCodes = toValue(resolvedOptions.excludedCodes)
    const resolvedPreferredCodes = toValue(resolvedOptions.preferredCodes)
    const resolvedRemoveDuplicates = toValue(resolvedOptions.removeDuplicates) ?? 'name'
    const resolvedRemoveUnmatched = toValue(resolvedOptions.removeUnmatched) ?? true
    const resolvedType = toValue(resolvedOptions.type) ?? DEFAULT_DISPLAY_NAMES_OPTIONS.type
    const resolvedLanguageDisplay = toValue(resolvedOptions.languageDisplay)
    const resolvedFallback = toValue(resolvedOptions.fallback)
    const resolvedStyle = toValue(resolvedOptions.style)
    const resolvedLocaleMatcher = toValue(resolvedOptions.localeMatcher)

    if (!resolvedLocale) {
      console.warn('[maz-ui] (useDisplayNames) locale is required')
      return undefined
    }

    const codeArray = resolvedOnlyCodes ?? getDisplayNamesCodes<T>(resolvedCodesType)

    const filteredCodes = codeArray.filter(code => !resolvedExcludedCodes?.includes(code as DisplayNameCode))

    const mappedResults: Array<{ name: string, code: CodeResult<T> } | undefined> = []

    for (const code of filteredCodes) {
      try {
        const name = getName(code, resolvedLocale, {
          type: resolvedType,
          languageDisplay: resolvedLanguageDisplay,
          fallback: resolvedFallback,
          style: resolvedStyle,
          localeMatcher: resolvedLocaleMatcher,
        })

        if (resolvedRemoveUnmatched && (!name || isSameLanguageThanCode(name, code))) {
          continue
        }

        mappedResults.push({
          name: name ?? (code as CodeResult<T>),
          code: code as CodeResult<T>,
        })
      }
      catch {
        // Skip invalid codes
      }
    }

    const result = mappedResults
      .filter(truthyFilter)
      .sort((a, b) => {
        if (a.name && b.name) {
          return a.name.localeCompare(b.name)
        }
        return 0
      })
      .sort((a, b) => {
        const aIndex = resolvedPreferredCodes?.indexOf(a.code as DisplayNameCode) ?? -1
        const bIndex = resolvedPreferredCodes?.indexOf(b.code as DisplayNameCode) ?? -1

        // If both are in preferred codes, sort by their index in the preferred array
        if (aIndex !== -1 && bIndex !== -1) {
          return aIndex - bIndex
        }

        // If only a is preferred, it comes first
        if (aIndex !== -1) {
          return -1
        }

        // If only b is preferred, it comes first
        if (bIndex !== -1) {
          return 1
        }

        // Neither is preferred, keep original order
        return 0
      })

    if (resolvedRemoveDuplicates) {
      return result.filter((item, index, self) => self.findIndex(t => t[resolvedRemoveDuplicates].toLowerCase() === item[resolvedRemoveDuplicates].toLowerCase()) === index)
    }

    return result
  })
}

export function useDisplayNames(mainLocale?: MaybeRefOrGetter<string | DisplayNameCode>) {
  return {
    getDisplayName: (code: Parameters<typeof getDisplayName>[0], options?: GetDisplayNameOptions) => {
      return getDisplayName(code, {
        ...toValue(options),
        locale: toValue(options)?.locale || mainLocale,
      })
    },

    getAllDisplayNames: <T extends CodesType>(options?: GetAllDisplayNamesOptions<T>) => {
      return getAllDisplayNames<T>({
        ...toValue(options),
        locale: toValue(options)?.locale || mainLocale,
      })
    },
  }
}
