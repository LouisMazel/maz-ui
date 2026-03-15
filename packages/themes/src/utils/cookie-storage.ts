import { isServer } from '@maz-ui/utils/helpers/isServer'

export function getCookie(key: string): string | null {
  if (isServer())
    return null

  const cookies = document.cookie.split(';')
  const cookie = cookies.find(c => c.trim().startsWith(`${key}=`))

  return cookie ? decodeURIComponent(cookie.split('=')[1]) : null
}

export function setCookie(key: string, value: string): void {
  if (isServer())
    return

  document.cookie = `${key}=${encodeURIComponent(value)}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`
}
