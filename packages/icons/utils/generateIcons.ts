import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { logger } from '@maz-ui/node'
import { getComponentList } from './getComponentList.ts'

function toPascalCase(str: string) {
  return str
    .split(/[-_]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('')
}

const _dirname = fileURLToPath(new URL('.', import.meta.url))

const svgDir = resolve(_dirname, '../svg')
const flags1x1Dir = resolve(_dirname, '../flags/1x1')
const flags3x2Dir = resolve(_dirname, '../flags/3x2')
const logosDir = resolve(_dirname, '../logos')
const outputIndex = resolve(_dirname, '../src/index.ts')
const staticDir = resolve(_dirname, '../src/static')
const lazyDir = resolve(_dirname, '../src/lazy')
const rawDir = resolve(_dirname, '../src/raw')
const iconNamesJsonPath = resolve(_dirname, '../icon-names.json')

function compareCodePoints(a: string, b: string) {
  if (a === b) {
    return 0
  }
  return a < b
    ? -1
    : 1
}

function replaceValuesInSvg(files: { file: string, name: string, path: string, dir: string }[]) {
  try {
    const svgFiles = files.filter(({ file }) => file.endsWith('.svg'))

    for (const file of svgFiles) {
      const filePath = resolve(file.dir, file.file)
      let content = readFileSync(filePath, 'utf-8')

      if (!/\swidth\s*=/.test(content)) {
        content = content.replace(/<svg\b/, '<svg width="1em"')
      }
      else {
        content = content.replace(/\swidth\s*=\s*"[^"]*"/g, ' width="1em"')
      }

      if (!/\sheight\s*=/.test(content)) {
        content = content.replace(/<svg\b/, '<svg height="1em"')
      }
      else {
        content = content.replace(/\sheight\s*=\s*"[^"]*"/g, ' height="1em"')
      }

      // eslint-disable-next-line sonarjs/regex-complexity, regexp/no-useless-assertions
      const colorRegex = /\b(stroke|fill|color|stop-color|flood-color|lighting-color)\b="(?:#[\dA-Fa-f]{3,8}|rgb\([^)]+\)|rgba\([^)]+\)|hsl\([^)]+\)|hsla\([^)]+\)|[a-zA-Z]+)"/g
      content = content.replace(colorRegex, (match, attribute) => {
        const colorValue = match.split('=')[1].replace(/"/g, '')
        if (colorValue === 'none' || colorValue === 'transparent') {
          return match
        }
        return `${attribute}="currentColor"`
      })

      writeFileSync(filePath, content)
    }

    logger.success(`[generateIcons](replaceValuesInSvg) ✅ all svg files cleaned`)
  }
  catch (error) {
    logger.error('[generateIcons](replaceValuesInSvg) 🔴 error while replacing values in svg', error)

    throw error
  }
}

function getReservedNames() {
  const componentNameList = getComponentList().map(({ name }) => name)
  return [
    ...componentNameList,
    'Map',
    'Object',
    'String',
    'Number',
    'Boolean',
    'Array',
    'Date',
    'RegExp',
    'Error',
    'Function',
    'Promise',
    'Set',
    'WeakMap',
    'WeakSet',
    'Symbol',
    'Proxy',
    'Reflect',
    'Math',
    'JSON',
    'Intl',
    'Console',
    'Window',
    'Document',
    'Element',
    'HTMLElement',
    'Node',
    'Event',
    'EventTarget',
    'Location',
    'History',
    'Navigator',
    'Screen',
    'Storage',
    'URL',
    'URLSearchParams',
    'FormData',
    'File',
    'Blob',
    'FileReader',
    'XMLHttpRequest',
    'WebSocket',
    'Worker',
    'SharedWorker',
    'ServiceWorker',
    'Cache',
    'Request',
    'Response',
    'Headers',
    'Body',
    'ReadableStream',
    'WritableStream',
    'TransformStream',
    'ByteLengthQueuingStrategy',
    'CountQueuingStrategy',
    'TextEncoder',
    'TextDecoder',
    'Image',
    'ImageData',
    'Canvas',
    'CanvasRenderingContext2D',
    'WebGLRenderingContext',
    'WebGL2RenderingContext',
    'Audio',
    'AudioContext',
    'AudioBuffer',
    'AudioBufferSourceNode',
    'GainNode',
    'OscillatorNode',
    'AnalyserNode',
    'BiquadFilterNode',
    'ChannelMergerNode',
    'ChannelSplitterNode',
    'ConvolverNode',
    'DelayNode',
    'DynamicsCompressorNode',
    'IIRFilterNode',
    'MediaElementAudioSourceNode',
    'MediaStreamAudioDestinationNode',
    'MediaStreamAudioSourceNode',
    'PannerNode',
    'StereoPannerNode',
    'WaveShaperNode',
    'MediaStream',
    'MediaStreamTrack',
    'MediaRecorder',
    'MediaDevices',
    'MediaQueryList',
    'MutationObserver',
    'IntersectionObserver',
    'ResizeObserver',
    'Performance',
    'PerformanceEntry',
    'PerformanceMark',
    'PerformanceMeasure',
    'PerformanceNavigation',
    'PerformanceResourceTiming',
    'PerformanceTiming',
    'PerformanceObserver',
    'PerformanceObserverEntryList',
    'PerformancePaintTiming',
    'PerformanceServerTiming',
    'PerformanceNavigationTiming',
    'PerformanceLongTaskTiming',
    'PerformanceEventTiming',
    'PerformanceLayoutShift',
    'PerformanceFirstInput',
    'PerformanceLargestContentfulPaint',
    'PerformanceElementTiming',
    'PerformanceResourceTiming',
    'PerformanceServerTiming',
    'PerformanceNavigationTiming',
    'PerformancePaintTiming',
    'PerformanceLongTaskTiming',
    'PerformanceEventTiming',
    'PerformanceLayoutShift',
    'PerformanceFirstInput',
    'PerformanceLargestContentfulPaint',
    'PerformanceElementTiming',
  ]
}

function generateStaticIconFiles(files: { file: string, name: string, path: string }[]) {
  try {
    if (!existsSync(staticDir)) {
      mkdirSync(staticDir, { recursive: true })
    }

    const reservedNames = getReservedNames()

    for (const { file, name, path } of files) {
      const iconName = toPascalCase(name)
      const finalName = reservedNames.includes(iconName) || reservedNames.includes(`Maz${iconName}`) || reservedNames.includes(`Maz${iconName}Icon`)
        ? `${iconName}Icon`
        : iconName
      const componentName = `Maz${finalName}`

      // path already contains '../', so we only need one '../' to go from static/ to src/ then use path
      const relativePath = path.startsWith('../')
        ? `../${path}`
        : `../../${path}`

      const content = `/// <reference types="@maz-ui/vite-svg-loader/client" />

/**
 * This file is generated automatically, do not manually modify it
 */

import _component from '${relativePath}/${file}?component'

export const ${componentName} = _component
`

      const outputPath = resolve(staticDir, `${componentName}.ts`)
      writeFileSync(outputPath, content)
    }

    logger.success(`[generateIcons](generateStaticIconFiles) ✅ ${files.length} static icon files generated`)
  }
  catch (error) {
    logger.error('[generateIcons](generateStaticIconFiles) 🔴 error while generating static icon files', error)

    throw error
  }
}

function generateStaticIndex(files: { file: string, name: string, path: string }[]) {
  try {
    const reservedNames = getReservedNames()
    const exports = files.map(({ name }) => {
      const iconName = toPascalCase(name)
      const finalName = reservedNames.includes(iconName) || reservedNames.includes(`Maz${iconName}`) || reservedNames.includes(`Maz${iconName}Icon`)
        ? `${iconName}Icon`
        : iconName
      const componentName = `Maz${finalName}`
      return `export { ${componentName} } from './${componentName}'`
    }).sort((a, b) => a.localeCompare(b, undefined, { numeric: true })).join('\n')

    const content = `/// <reference types="@maz-ui/vite-svg-loader/client" />

/**
 * This file is generated automatically, do not manually modify it
 */

${exports}
`

    const staticIndexPath = resolve(staticDir, 'index.ts')
    writeFileSync(staticIndexPath, content)

    logger.success('[generateIcons](generateStaticIndex) ✅ static index generated')
  }
  catch (error) {
    logger.error('[generateIcons](generateStaticIndex) 🔴 error while generating static index', error)

    throw error
  }
}

function generateLazyIconFiles(files: { file: string, name: string, path: string }[]) {
  try {
    if (!existsSync(lazyDir)) {
      mkdirSync(lazyDir, { recursive: true })
    }

    const reservedNames = getReservedNames()

    for (const { file, name, path } of files) {
      const iconName = toPascalCase(name)
      const finalName = reservedNames.includes(iconName) || reservedNames.includes(`Maz${iconName}`) || reservedNames.includes(`Maz${iconName}Icon`)
        ? `${iconName}Icon`
        : iconName
      const componentName = `Maz${finalName}`

      // path already contains '../', so we only need one '../' to go from lazy/ to src/ then use path
      const relativePath = path.startsWith('../')
        ? `../${path}`
        : `../../${path}`

      const content = `/// <reference types="@maz-ui/vite-svg-loader/client" />

/**
 * This file is generated automatically, do not manually modify it
 */

import { defineAsyncComponent, markRaw } from 'vue'

export const ${componentName} = markRaw(defineAsyncComponent(() => import('${relativePath}/${file}?component')))
`

      const outputPath = resolve(lazyDir, `${componentName}.ts`)
      writeFileSync(outputPath, content)
    }

    logger.success(`[generateIcons](generateLazyIconFiles) ✅ ${files.length} lazy icon files generated`)
  }
  catch (error) {
    logger.error('[generateIcons](generateLazyIconFiles) 🔴 error while generating lazy icon files', error)

    throw error
  }
}

function generateLazyIndex(files: { file: string, name: string, path: string }[]) {
  try {
    const reservedNames = getReservedNames()
    const exports = files.map(({ name }) => {
      const iconName = toPascalCase(name)
      const finalName = reservedNames.includes(iconName) || reservedNames.includes(`Maz${iconName}`) || reservedNames.includes(`Maz${iconName}Icon`)
        ? `${iconName}Icon`
        : iconName
      const componentName = `Maz${finalName}`
      return `export { ${componentName} } from './${componentName}'`
    }).sort((a, b) => a.localeCompare(b, undefined, { numeric: true })).join('\n')

    const content = `/**
 * This file is generated automatically, do not manually modify it
 */

${exports}
`

    const lazyIndexPath = resolve(lazyDir, 'index.ts')
    writeFileSync(lazyIndexPath, content)

    logger.success('[generateIcons](generateLazyIndex) ✅ lazy index generated')
  }
  catch (error) {
    logger.error('[generateIcons](generateLazyIndex) 🔴 error while generating lazy index', error)

    throw error
  }
}

function generateRawIconFiles(files: { file: string, name: string, path: string }[]) {
  try {
    if (!existsSync(rawDir)) {
      mkdirSync(rawDir, { recursive: true })
    }

    const reservedNames = getReservedNames()

    for (const { file, name, path } of files) {
      const iconName = toPascalCase(name)
      const finalName = reservedNames.includes(iconName) || reservedNames.includes(`Maz${iconName}`) || reservedNames.includes(`Maz${iconName}Icon`)
        ? `${iconName}Icon`
        : iconName
      const componentName = `Maz${finalName}`

      const relativePath = path.startsWith('../')
        ? `../${path}`
        : `../../${path}`

      const content = `/// <reference types="@maz-ui/vite-svg-loader/client" />

/**
 * This file is generated automatically, do not manually modify it
 */

import _raw from '${relativePath}/${file}?raw'

export const ${componentName}: string = _raw
`

      const outputPath = resolve(rawDir, `${componentName}.ts`)
      writeFileSync(outputPath, content)
    }

    logger.success(`[generateIcons](generateRawIconFiles) ✅ ${files.length} raw icon files generated`)
  }
  catch (error) {
    logger.error('[generateIcons](generateRawIconFiles) 🔴 error while generating raw icon files', error)

    throw error
  }
}

function generateRawIndex(files: { file: string, name: string, path: string }[]) {
  try {
    const reservedNames = getReservedNames()
    const exports = files.map(({ name }) => {
      const iconName = toPascalCase(name)
      const finalName = reservedNames.includes(iconName) || reservedNames.includes(`Maz${iconName}`) || reservedNames.includes(`Maz${iconName}Icon`)
        ? `${iconName}Icon`
        : iconName
      const componentName = `Maz${finalName}`
      return `export { ${componentName} } from './${componentName}'`
    }).sort((a, b) => a.localeCompare(b, undefined, { numeric: true })).join('\n')

    const content = `/**
 * This file is generated automatically, do not manually modify it
 */

${exports}
`

    const rawIndexPath = resolve(rawDir, 'index.ts')
    writeFileSync(rawIndexPath, content)

    logger.success('[generateIcons](generateRawIndex) ✅ raw index generated')
  }
  catch (error) {
    logger.error('[generateIcons](generateRawIndex) 🔴 error while generating raw index', error)

    throw error
  }
}

function generateIconsComponentsEntry(files: { file: string, name: string, path: string }[]) {
  try {
    const reservedNames = getReservedNames()
    const lazyExports = files.map(({ name }) => {
      const iconName = toPascalCase(name)
      const finalName = reservedNames.includes(iconName) || reservedNames.includes(`Maz${iconName}`) || reservedNames.includes(`Maz${iconName}Icon`)
        ? `${iconName}Icon`
        : iconName
      const componentName = `Maz${finalName}`
      return `export { ${componentName} as Lazy${componentName} } from './lazy/${componentName}'`
    }).sort((a, b) => a.localeCompare(b, undefined, { numeric: true })).join('\n')

    const content = `/// <reference types="@maz-ui/vite-svg-loader/client" />

/**
 * This file is generated automatically, do not manually modify it
 */

import type { Component, ComponentPublicInstance, FunctionalComponent } from 'vue'

export type IconComponent = FunctionalComponent | ComponentPublicInstance | Component

export * from './static'

${lazyExports}
`

    writeFileSync(outputIndex, content)

    logger.success('[generateIcons](generateIconsComponentsEntry) ✅ icons components entry generated')
  }
  catch (error) {
    logger.error('[generateIcons](generateIconsComponentsEntry) 🔴 error while generating icons components entry', error)

    throw error
  }
}

function generateIconList(files: { file: string, name: string }[]) {
  try {
    const outputPath = resolve(_dirname, '../src/icon-list.ts')
    const reservedNames = getReservedNames()
    const staticNames = files
      .filter(({ file }) => file.endsWith('.svg'))
      .map(({ name }) => {
        const iconName = toPascalCase(name)
        const finalName = reservedNames.includes(iconName) || reservedNames.includes(`Maz${iconName}`) || reservedNames.includes(`Maz${iconName}Icon`)
          ? `${iconName}Icon`
          : iconName
        return `Maz${finalName}`
      })

    const allNames = [
      ...staticNames.map(n => `'${n}'`),
      ...staticNames.map(n => `'Lazy${n}'`),
    ].join(',\n  ')

    const content = `/**
 * This file is generated automatically, do not manually modify it
 */
export const iconList = [
  ${allNames}
] as const

export type IconName = typeof iconList[number]
`

    writeFileSync(outputPath, content)
    logger.success('[generateIcons](generateIconList) ✅ icons list generated')
  }
  catch (error) {
    logger.error('[generateIcons](generateIconList) 🔴 error while generating icons list', error)
    throw error
  }
}

/**
 * The names of `<MazIcon icon="x-mark" />` and the file of each one (`icon-names.json`), read by `MazUi()` of
 * `@maz-ui/vite-plugin` to register the icons and generate their types.
 */
function generateIconNames(files: { file: string, iconName: string, dir: string }[]) {
  try {
    const entries = files
      .map(({ file, iconName, dir }) => [iconName, `${dir}/${file}`] as const)
      .sort(([a], [b]) => compareCodePoints(a, b))

    const duplicates = entries.filter(([name], index) => index > 0 && entries[index - 1][0] === name)
    if (duplicates.length > 0) {
      throw new Error(`duplicated icon names: ${duplicates.map(([name]) => name).join(', ')}`)
    }

    writeFileSync(iconNamesJsonPath, `${JSON.stringify(Object.fromEntries(entries), null, 2)}\n`)

    logger.success(`[generateIcons](generateIconNames) ✅ ${entries.length} icon names generated`)
  }
  catch (error) {
    logger.error('[generateIcons](generateIconNames) 🔴 error while generating icon names', error)
    throw error
  }
}

/** Writes the variants of each icon (`src/static`, `src/lazy`, `src/raw`), their entries and `icon-names.json` */
export function generateIcons() {
  try {
    logger.log('[generateIcons] ✅ starting to generate icons components entry')
    const [svgFiles, flags1x1Files, flags3x2Files, logos] = [
      readdirSync(svgDir).map(file => ({
        file,
        name: file.replace('.svg', ''),
        iconName: file.replace('.svg', ''),
        path: '../svg',
        dir: 'svg',
      })),
      readdirSync(logosDir).map(file => ({
        file,
        name: `logo-${file.replace('.svg', '')}`,
        iconName: `logo-${file.replace('.svg', '')}`,
        path: '../logos',
        dir: 'logos',
      })),
      readdirSync(flags1x1Dir).map(file => ({
        file,
        name: `flag-square-${file.replace('.svg', '').split('').join('-')}`,
        iconName: `flag-square-${file.replace('.svg', '').toLowerCase()}`,
        path: '../flags/1x1',
        dir: 'flags/1x1',
      })),
      readdirSync(flags3x2Dir).map(file => ({
        file,
        name: `flag-${file.replace('.svg', '').split('').join('-')}`,
        iconName: `flag-${file.replace('.svg', '').toLowerCase()}`,
        path: '../flags/3x2',
        dir: 'flags/3x2',
      })),
    ]

    const files = [
      ...svgFiles,
      ...flags1x1Files,
      ...flags3x2Files,
      ...logos,
    ].filter(({ file }) => file.endsWith('.svg') && !file.endsWith('.DS_Store'))

    replaceValuesInSvg(svgFiles)
    generateStaticIconFiles(files)
    generateStaticIndex(files)
    generateLazyIconFiles(files)
    generateLazyIndex(files)
    generateRawIconFiles(files)
    generateRawIndex(files)
    generateIconsComponentsEntry(files)
    generateIconList(files)
    generateIconNames(files)

    logger.success('[generateIcons] ✅ icons components entry generated')
  }
  catch (error) {
    logger.error('[generateIcons] 🔴 error while generating icons components entry', error instanceof Error
      ? error.message
      : String(error))

    throw error
  }
}
