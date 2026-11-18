import type { Config } from 'svgo'
import { relative } from 'node:path'
import process from 'node:process'
import { optimize } from 'svgo'

export type SvgoConfigOption = Config | ((defaults: Config) => Config)

export interface OptimizeSvgOptions {
  /** Path of the file: prefixes its ids (relative to `root`), passed to svgo */
  path?: string
  /** @default process.cwd() */
  root?: string
  /** Replaces the default config, or receives it to extend it */
  config?: SvgoConfigOption
}

const SVG_TAG_RE = /<svg\b[^>]*>/i
const VIEW_BOX_RE = /\sviewBox\s*=\s*["']([^"']+)["']/i
const DIMENSION_RE = /\s(width|height)\s*=\s*["']\s*([\d.]+)(?:px)?\s*["']/gi

function getSvgSize(svg: string): number | undefined {
  const tag = SVG_TAG_RE.exec(svg)?.[0]
  if (!tag) {
    return undefined
  }

  const viewBox = VIEW_BOX_RE.exec(tag)?.[1].trim().split(/[\s,]+/).map(Number)
  const sizes = viewBox?.length === 4
    ? viewBox.slice(2)
    : [
        ...tag.matchAll(DIMENSION_RE),
      ].map(([, , value]) => Number(value))
  const size = Math.max(...sizes)

  return Number.isFinite(size) && size > 0
    ? size
    : undefined
}

/**
 * Decimals kept by svgo, from the size of the SVG: 3 below 480 (icons stay untouched), 2 below 4800, 1 beyond.
 */
export function getFloatPrecision(svg: string): number {
  const size = getSvgSize(svg)
  if (!size) {
    return 3
  }

  return Math.min(3, Math.max(1, 3 - Math.floor(Math.log10(size / 48))))
}

function hash(value: string): string {
  let result = 5381
  for (let index = 0; index < value.length; index++) {
    result = Math.imul(result, 33) ^ value.charCodeAt(index)
  }
  return (result >>> 0).toString(36)
}

/**
 * Prefix of the ids of an SVG: two inline SVGs with the same `id` point to each other's `url(#id)`.
 */
export function getIdPrefix(svg: string, { path, root = process.cwd() }: Pick<OptimizeSvgOptions, 'path' | 'root'> = {}): string {
  const prefix = path
    ? relative(root, path).replace(/\.svg$/i, '').replaceAll(/[^\w-]+/g, '-').replace(/^-+/, '')
    : hash(svg)

  return /^[a-z]/i.test(prefix)
    ? prefix
    : `svg-${prefix}`
}

export function getDefaultSvgoConfig(svg: string, options: Pick<OptimizeSvgOptions, 'path' | 'root'> = {}): Config {
  return {
    multipass: true,
    floatPrecision: getFloatPrecision(svg),
    plugins: [
      {
        name: 'preset-default',
        params: {
          overrides: {
            convertTransform: { floatPrecision: 3 },
            inlineStyles: { onlyMatchedOnce: false },
            // Merging overlapping paths changes how they are filled
            mergePaths: false,
          },
        },
      },
      'cleanupListOfValues',
      'convertStyleToAttrs',
      'convertOneStopGradients',
      'removeScripts',
      'removeXlink',
      'removeDeprecatedAttrs',
      {
        name: 'prefixIds',
        params: {
          prefix: getIdPrefix(svg, options),
        },
      },
    ],
  }
}

export function optimizeSvg(svg: string, { config, ...options }: OptimizeSvgOptions = {}): string {
  const defaults = getDefaultSvgoConfig(svg, options)
  const resolved = typeof config === 'function'
    ? config(defaults)
    : config ?? defaults

  return optimize(svg, { ...resolved, path: options.path }).data
}
