import type { Connect } from 'vite'

interface Redirect {
  from: string
  to: string
  /** Also redirects the sub-paths: `/helpers/debounce` -> `/ecosystem/utils/debounce` */
  prefix?: boolean
}

/** Legacy URLs, served by the dev server and written to the `.htaccess` of the build */
export const redirects: Redirect[] = [
  { from: '/helpers', to: '/ecosystem/utils', prefix: true },
  { from: '/utils', to: '/ecosystem/utils', prefix: true },
  { from: '/guide/icon-set', to: '/ecosystem/icons/icon-set' },
  { from: '/guide/icons', to: '/ecosystem/icons/' },
  { from: '/guide/themes', to: '/ecosystem/themes' },
  { from: '/guide/nuxt', to: '/ecosystem/nuxt' },
  { from: '/guide/translations', to: '/ecosystem/translations' },
  { from: '/guide/mcp', to: '/ecosystem/mcp' },
  { from: '/components/maz-phone-number-input', to: '/components/maz-input-phone-number' },
  { from: '/components/maz-picker', to: '/components/maz-date-picker' },
  { from: '/components/maz-dialog-promise', to: '/components/maz-dialog-confirm' },
  { from: '/composables/use-language-display-names', to: '/composables/use-display-names' },
  { from: '/plugins/toaster', to: '/plugins/toast' },
]

function resolveRedirect(path: string): string | undefined {
  for (const { from, to, prefix } of redirects) {
    if (path === from || path === `${from}/` || path === `${from}.html`)
      return to
    if (prefix && path.startsWith(`${from}/`))
      return `${to}${path.slice(from.length)}`
  }
}

export const redirectMiddleware: Connect.NextHandleFunction = (req, res, next) => {
  const location = resolveRedirect(req.url?.split(/[?#]/)[0] ?? '')
  if (!location)
    return next()
  res.writeHead(301, { Location: location })
  res.end()
}

/** Apache rules of the production server (maz-ui.com) */
export function getHtaccess(): string {
  const rules = redirects.flatMap(({ from, to, prefix }) => {
    const pattern = from.slice(1)
    return prefix
      ? [`RewriteRule ^${pattern}/?$ ${to}/ [R=301,L]`, `RewriteRule ^${pattern}/(.*)$ ${to}/$1 [R=301,L]`]
      : [`RewriteRule ^${pattern}(\\.html)?/?$ ${to} [R=301,L]`]
  })

  return [
    'AddType text/markdown .md',
    '',
    '# Agent discovery (RFC 8288): every page links to the docs for the agents',
    '<FilesMatch "\\.html$">',
    '  Header append Link "</llms.txt>; rel=\\"describedby\\""',
    '  Header append Link "</guide/ai-agents>; rel=\\"service-doc\\""',
    '  Header append Link "</.well-known/agent-skills/index.json>; rel=\\"describedby\\"; type=\\"application/json\\""',
    '</FilesMatch>',
    '',
    '# The same URL serves HTML or markdown depending on the `Accept` header',
    'Header append Vary Accept',
    '',
    'RewriteEngine on',
    '',
    '# Legacy URLs (generated from .vitepress/configs/redirects.mts)',
    ...rules,
    '',
    '# Markdown for agents: `Accept: text/markdown` serves the markdown version of the page',
    'RewriteCond %{HTTP:Accept} text/markdown [NC]',
    'RewriteCond %{DOCUMENT_ROOT}/$1index.md -f',
    'RewriteRule ^(.*/)?$ /$1index.md [L]',
    'RewriteCond %{HTTP:Accept} text/markdown [NC]',
    'RewriteCond %{DOCUMENT_ROOT}/$1.md -f',
    'RewriteRule ^(.*?)(?:\\.html)?$ /$1.md [L]',
    '',
    '# Clean URLs: /guide/vue -> /guide/vue.html',
    'RewriteCond %{REQUEST_FILENAME} !-d',
    'RewriteCond %{REQUEST_FILENAME}\\.html -f',
    'RewriteRule ^(.*)$ $1.html',
    '',
  ].join('\n')
}
