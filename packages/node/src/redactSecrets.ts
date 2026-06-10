const MASK = '***'

const VISIBLE_PREFIX = 4
const VISIBLE_SUFFIX = 4
const MIN_LENGTH_TO_REVEAL = 16

const SECRET_FLAG_NAMES
  = 'password|passwd|pwd|pass|token|api[-_]?key|secret|authorization|auth[-_]?token|access[-_]?token|refresh[-_]?token|client[-_]?secret|private[-_]?key|credentials?|auth'

type Replacer = (match: string, ...groups: string[]) => string

const keepEnds: Replacer = value =>
  value.length < MIN_LENGTH_TO_REVEAL
    ? MASK
    : `${value.slice(0, VISIBLE_PREFIX)}${MASK}${value.slice(-VISIBLE_SUFFIX)}`

const keepPrefix: Replacer = (_match, prefix, value) => `${prefix}${keepEnds(value)}`

const REDACTION_RULES: [RegExp, Replacer][] = [
  [/(:?_authToken=)([^\s&]+)/gi, keepPrefix],
  [new RegExp(`(--(?:${SECRET_FLAG_NAMES})=)(\\S+)`, 'gi'), keepPrefix],
  [new RegExp(`(--(?:${SECRET_FLAG_NAMES})\\s+)(?!-)(\\S+)`, 'gi'), keepPrefix],
  [/(\/\/[^/:@\s]+:)([^/@\s]+)@/g, (_match, prefix, value) => `${prefix}${keepEnds(value)}@`],
  [/npm_[A-Za-z0-9]{10,}/g, keepEnds],
  [/gh[posru]_[A-Za-z0-9]{20,}/g, keepEnds],
  [/github_pat_\w{20,}/g, keepEnds],
  [/glpat-[\w-]{15,}/g, keepEnds],
  [/xox[baprs]-[A-Za-z0-9-]{10,}/g, keepEnds],
  [/AKIA[0-9A-Z]{16}/g, keepEnds],
  [/sk-[\w-]{16,}/g, keepEnds],
  [/eyJ[\w-]+\.eyJ[\w-]+\.[\w-]+/g, keepEnds],
]

const REDACTABLE_ERROR_KEYS = ['message', 'cmd', 'stack'] as const

/**
 * Masks secrets that have a recognizable syntactic context inside a string.
 *
 * Only deterministic patterns are redacted (npm auth tokens, named secret flags
 * such as `--token`/`--password`, prefixed provider tokens like `npm_`/`ghp_`,
 * JWTs, and basic-auth credentials in URLs). Context-free random strings are left
 * untouched because they cannot be detected without false positives.
 *
 * Tokens long enough (>= 16 chars) keep their first and last 4 characters visible
 * (e.g. `npm_***J1iF`) so the right credential can still be recognized; shorter
 * secrets are fully masked.
 */
export function redactSecrets(input: string): string {
  return REDACTION_RULES.reduce((acc, [pattern, replacement]) => acc.replace(pattern, replacement), input)
}

/**
 * Returns the given error with its `message`, `cmd` and `stack` redacted via
 * {@link redactSecrets}, so a thrown command never carries secrets to callers.
 */
export function redactError<T>(error: T): T {
  if (!error || typeof error !== 'object') {
    return error
  }

  for (const key of REDACTABLE_ERROR_KEYS) {
    const value = (error as Record<string, unknown>)[key]
    if (typeof value === 'string') {
      (error as Record<string, unknown>)[key] = redactSecrets(value)
    }
  }

  return error
}
