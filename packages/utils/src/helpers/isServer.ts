export function isServer() {
  return typeof document === 'undefined' || typeof globalThis.window === 'undefined'
}
