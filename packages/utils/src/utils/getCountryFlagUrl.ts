type Ratio = '16x12'
  | '20x15'
  | '24x18'
  | '28x21'
  | '32x24'
  | '36x27'
  | '40x30'
  | '48x36'
  | '56x42'
  | '60x45'
  | '64x48'
  | '72x54'
  | '80x60'
  | '84x63'
  | '96x72'
  | '108x81'
  | '112x84'
  | '120x90'
  | '128x96'
  | '144x108'
  | '160x120'
  | '192x144'
  | '224x168'
  | '256x192'

type Height = 'h20'
  | 'h24'
  | 'h40'
  | 'h60'
  | 'h80'
  | 'h120'
  | 'h240'

type Width = 'w20'
  | 'w40'
  | 'w80'
  | 'w160'
  | 'w320'
  | 'w640'
  | 'w1280'
  | 'w2560'

type Size = Ratio | Height | Width

const _supportedCodes = ['ad', 'ae', 'af', 'ag', 'ai', 'al', 'am', 'ao', 'aq', 'ar', 'as', 'at', 'au', 'aw', 'ax', 'az', 'ba', 'bb', 'bd', 'be', 'bf', 'bg', 'bh', 'bi', 'bj', 'bl', 'bm', 'bn', 'bo', 'bq', 'br', 'bs', 'bt', 'bv', 'bw', 'by', 'bz', 'ca', 'cc', 'cd', 'cf', 'cg', 'ch', 'ci', 'ck', 'cl', 'cm', 'cn', 'co', 'cr', 'cu', 'cv', 'cw', 'cx', 'cy', 'cz', 'de', 'dj', 'dk', 'dm', 'do', 'dz', 'ec', 'ee', 'eg', 'eh', 'er', 'es', 'et', 'eu', 'fi', 'fj', 'fk', 'fm', 'fo', 'fr', 'ga', 'gb', 'gb-eng', 'gb-nir', 'gb-sct', 'gb-wls', 'gd', 'ge', 'gf', 'gg', 'gh', 'gi', 'gl', 'gm', 'gn', 'gp', 'gq', 'gr', 'gs', 'gt', 'gu', 'gw', 'gy', 'hk', 'hm', 'hn', 'hr', 'ht', 'hu', 'id', 'ie', 'il', 'im', 'in', 'io', 'iq', 'ir', 'is', 'it', 'je', 'jm', 'jo', 'jp', 'ke', 'kg', 'kh', 'ki', 'km', 'kn', 'kp', 'kr', 'kw', 'ky', 'kz', 'la', 'lb', 'lc', 'li', 'lk', 'lr', 'ls', 'lt', 'lu', 'lv', 'ly', 'ma', 'mc', 'md', 'me', 'mf', 'mg', 'mh', 'mk', 'ml', 'mm', 'mn', 'mo', 'mp', 'mq', 'mr', 'ms', 'mt', 'mu', 'mv', 'mw', 'mx', 'my', 'mz', 'na', 'nc', 'ne', 'nf', 'ng', 'ni', 'nl', 'no', 'np', 'nr', 'nu', 'nz', 'om', 'pa', 'pe', 'pf', 'pg', 'ph', 'pk', 'pl', 'pm', 'pn', 'pr', 'ps', 'pt', 'pw', 'py', 'qa', 're', 'ro', 'rs', 'ru', 'rw', 'sa', 'sb', 'sc', 'sd', 'se', 'sg', 'sh', 'si', 'sj', 'sk', 'sl', 'sm', 'sn', 'so', 'sr', 'ss', 'st', 'sv', 'sx', 'sy', 'sz', 'tc', 'td', 'tf', 'tg', 'th', 'tj', 'tk', 'tl', 'tm', 'tn', 'to', 'tr', 'tt', 'tv', 'tw', 'tz', 'ua', 'ug', 'um', 'un', 'us', 'us-ak', 'us-al', 'us-ar', 'us-az', 'us-ca', 'us-co', 'us-ct', 'us-de', 'us-fl', 'us-ga', 'us-hi', 'us-ia', 'us-id', 'us-il', 'us-in', 'us-ks', 'us-ky', 'us-la', 'us-ma', 'us-md', 'us-me', 'us-mi', 'us-mn', 'us-mo', 'us-ms', 'us-mt', 'us-nc', 'us-nd', 'us-ne', 'us-nh', 'us-nj', 'us-nm', 'us-nv', 'us-ny', 'us-oh', 'us-ok', 'us-or', 'us-pa', 'us-ri', 'us-sc', 'us-sd', 'us-tn', 'us-tx', 'us-ut', 'us-va', 'us-vt', 'us-wa', 'us-wi', 'us-wv', 'us-wy', 'uy', 'uz', 'va', 'vc', 've', 'vg', 'vi', 'vn', 'vu', 'wf', 'ws', 'xk', 'ye', 'yt', 'za', 'zm', 'zw'] as const

type SupportedCodes = typeof _supportedCodes[number]

export function getCountryFlagUrl(countryIsoCode: SupportedCodes | string, size?: Size) {
  const code = countryIsoCode.toLowerCase()

  if (!_supportedCodes.includes(code as SupportedCodes)) {
    // console.warn(`[maz-ui](getCountryFlagUrl) Country code ${countryIsoCode} is not supported`)

    return undefined
  }

  return size ? `https://flagcdn.com/${size}/${code}.png` : `https://flagcdn.com/${code}.svg`
}
