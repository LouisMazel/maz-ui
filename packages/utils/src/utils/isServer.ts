export function isServer() {
  return typeof document === 'undefined' || typeof window === 'undefined'
}
