import { Buffer } from 'node:buffer'
import { readdirSync, readFileSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'
import sharp from 'sharp'
import { optimizeSvg } from '../optimize.ts'

const ICONS_DIR = resolve(import.meta.dirname, '../../../icons')
const CORPUS = [
  'svg',
  'flags/1x1',
  'flags/3x2',
  'logos',
]
const MAX_DIFF_RATIO = 0.01

function getFiles(dir: string) {
  return readdirSync(dir).filter(file => file.endsWith('.svg')).map(file => join(dir, file))
}

function resize(svg: string, size: number) {
  const viewBox = /viewBox="([^"]+)"/.exec(svg)?.[1].split(/[\s,]+/).map(Number) ?? [0, 0, 24, 24]
  const scale = size / Math.max(viewBox[2], viewBox[3])

  return svg
    .replace(/<svg\b([^>]*?)(\/?)>/, (_, attributes: string, close: string) => `<svg${attributes.replaceAll(/\s(?:width|height)="[^"]*"/g, '')} width="${Math.round(viewBox[2] * scale)}" height="${Math.round(viewBox[3] * scale)}"${close}>`)
    .replaceAll('currentColor', '#000')
}

function rasterize(svg: string, size: number) {
  return sharp(Buffer.from(resize(svg, size))).flatten({ background: '#fff' }).raw().toBuffer()
}

async function getDiffRatio(source: string, optimized: string, size: number) {
  const [expected, actual] = await Promise.all([
    rasterize(source, size),
    rasterize(optimized, size),
  ])
  if (expected.length !== actual.length) {
    return 1
  }

  let diff = 0
  for (let index = 0; index < expected.length; index++) {
    if (Math.abs(expected[index] - actual[index]) > 32) {
      diff++
    }
  }
  return diff / expected.length
}

describe.each(CORPUS)('given the SVG files of @maz-ui/icons/%s', (dir) => {
  describe('when they are optimized with the default config', () => {
    it('then they render like their source, at 24px and 128px', async () => {
      const altered: string[] = []

      for (const path of getFiles(join(ICONS_DIR, dir))) {
        const source = readFileSync(path, 'utf8')
        const optimized = optimizeSvg(source, { path, root: ICONS_DIR })

        for (const size of [24, 128]) {
          const ratio = await getDiffRatio(source, optimized, size)
          if (ratio > MAX_DIFF_RATIO) {
            altered.push(`${relative(ICONS_DIR, path)} at ${size}px: ${(ratio * 100).toFixed(2)}%`)
          }
        }
      }

      expect(altered).toEqual([])
    }, 120_000)
  })
})
