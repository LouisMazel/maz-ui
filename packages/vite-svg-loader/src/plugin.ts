import type { Plugin } from 'vite'
import type { SvgoConfigOption } from './optimize.ts'
import { readFile } from 'node:fs/promises'
import process from 'node:process'
import { compileSvgComponent } from './compile.ts'
import { optimizeSvg } from './optimize.ts'

export type SvgImportType = 'url' | 'raw' | 'component'

export interface SvgLoaderOptions {
  /**
   * Optimize the SVG with svgo (`?skipsvgo` skips it for one import)
   * @default true
   */
  svgo?: boolean
  /** Replaces the default svgo config, or receives it (for each file) to extend it */
  svgoConfig?: SvgoConfigOption
  /**
   * What an import without query returns
   * @default 'url'
   */
  defaultImport?: SvgImportType
}

const SVG_ID_RE = /\.svg(?:\?.*)?$/

const URI_QUERY_RE = /([?&])uri(?=&|$)/

function getImportType(params: URLSearchParams, defaultImport: SvgImportType): 'raw' | 'svg' | 'component' | undefined {
  if (params.has('svg')) {
    return 'svg'
  }
  if (params.has('raw')) {
    return 'raw'
  }
  if (params.has('component') || params.has('skipsvgo')) {
    return 'component'
  }
  // `?url`, `?inline` and the other queries of Vite stay to Vite
  if (params.size > 0 || defaultImport === 'url') {
    return undefined
  }
  return defaultImport
}

export function svgLoader({ svgo = true, svgoConfig, defaultImport = 'url' }: SvgLoaderOptions = {}): Plugin {
  let root = process.cwd()

  return {
    name: 'maz-ui:vite-svg-loader',
    enforce: 'pre',
    configResolved(config) {
      root = config.root
    },
    // `?uri` is `?url` with a typed string: the same URL, the same file
    resolveId: {
      filter: { id: URI_QUERY_RE },
      handler(source, importer, options) {
        if (!SVG_ID_RE.test(source) || !URI_QUERY_RE.test(source)) {
          return
        }

        return this.resolve(source.replace(URI_QUERY_RE, '$1url'), importer, { ...options, skipSelf: true })
      },
    },
    load: {
      filter: { id: SVG_ID_RE },
      async handler(id) {
        const [path, query] = id.split('?', 2)
        if (!path.endsWith('.svg')) {
          return
        }

        const params = new URLSearchParams(query)
        const type = getImportType(params, defaultImport)
        if (!type) {
          return
        }

        let svg: string
        try {
          svg = await readFile(path, 'utf8')
        }
        catch {
          // Not a file (virtual module...): left to the other plugins
          return
        }

        if (svgo && !params.has('skipsvgo')) {
          svg = optimizeSvg(svg, { path, root, config: svgoConfig })
        }

        // `?svg` is typed `<svg...`: without what svgo can keep before it (`<?xml`, a comment)
        if (type === 'svg') {
          svg = svg.slice(Math.max(0, svg.indexOf('<svg')))
        }

        return type === 'component'
          ? compileSvgComponent(svg, { id, path })
          : `export default ${JSON.stringify(svg)}`
      },
    },
  }
}
