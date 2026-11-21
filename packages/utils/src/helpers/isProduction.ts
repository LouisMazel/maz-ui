/**
 * `process.env.NODE_ENV` is replaced by the bundler of the app. Without bundler (CDN), `process` does not exist: not production.
 */
export function isProduction(): boolean {
  try {
    return process.env.NODE_ENV === 'production'
  }
  catch {
    return false
  }
}
