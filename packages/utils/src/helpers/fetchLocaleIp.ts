export interface IpWhoResponse {
  ip: string
  success: true
  type?: string
  continent?: string
  continent_code?: string
  country?: string
  country_code?: string
  region?: string
  region_code?: string
  city?: string
  latitude?: number
  longitude?: number
  is_eu: true
  postal?: string
  calling_code?: string
  capital?: string
  borders?: string
  flag: {
    img?: string
    emoji?: string
    emoji_unicode?: string
  }
  connection: {
    asn?: number
    org?: string
    isp?: string
    domain?: string
  }
  timezone: {
    id?: string
    abbr?: string
    is_dst: false
    offset?: number
    utc?: string
    current_time?: string
  }
}

export async function fetchLocaleIp(): Promise<string | undefined> {
  try {
    const reponse = await fetch('https://ipwho.is')
    const { country_code } = (await reponse.json()) as IpWhoResponse

    return country_code
  }
  catch (error) {
    console.error(`[maz-ui](fetchLocaleIp) ${error}`)

    return undefined
  }
}
