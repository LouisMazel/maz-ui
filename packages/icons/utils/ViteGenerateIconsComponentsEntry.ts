import type { Plugin } from 'vite'
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { logger } from '@maz-ui/node'
import { getComponentList } from './getComponentList.js'

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

    logger.success(`[ViteGenerateIconsComponentsEntry](replaceValuesInSvg) ✅ all svg files cleaned`)
  }
  catch (error) {
    logger.error('[ViteGenerateIconsComponentsEntry](replaceValuesInSvg) 🔴 error while replacing values in svg', error)

    throw error
  }
}

function getReservedNames() {
  const componentNameList = getComponentList().map(({ name }) => name)
  return [...componentNameList, 'Map', 'Object', 'String', 'Number', 'Boolean', 'Array', 'Date', 'RegExp', 'Error', 'Function', 'Promise', 'Set', 'WeakMap', 'WeakSet', 'Symbol', 'Proxy', 'Reflect', 'Math', 'JSON', 'Intl', 'Console', 'Window', 'Document', 'Element', 'HTMLElement', 'Node', 'Event', 'EventTarget', 'Location', 'History', 'Navigator', 'Screen', 'Storage', 'URL', 'URLSearchParams', 'FormData', 'File', 'Blob', 'FileReader', 'XMLHttpRequest', 'WebSocket', 'Worker', 'SharedWorker', 'ServiceWorker', 'Cache', 'Request', 'Response', 'Headers', 'Body', 'ReadableStream', 'WritableStream', 'TransformStream', 'ByteLengthQueuingStrategy', 'CountQueuingStrategy', 'TextEncoder', 'TextDecoder', 'Image', 'ImageData', 'Canvas', 'CanvasRenderingContext2D', 'WebGLRenderingContext', 'WebGL2RenderingContext', 'Audio', 'AudioContext', 'AudioBuffer', 'AudioBufferSourceNode', 'GainNode', 'OscillatorNode', 'AnalyserNode', 'BiquadFilterNode', 'ChannelMergerNode', 'ChannelSplitterNode', 'ConvolverNode', 'DelayNode', 'DynamicsCompressorNode', 'IIRFilterNode', 'MediaElementAudioSourceNode', 'MediaStreamAudioDestinationNode', 'MediaStreamAudioSourceNode', 'PannerNode', 'StereoPannerNode', 'WaveShaperNode', 'MediaStream', 'MediaStreamTrack', 'MediaRecorder', 'MediaDevices', 'MediaQueryList', 'MutationObserver', 'IntersectionObserver', 'ResizeObserver', 'Performance', 'PerformanceEntry', 'PerformanceMark', 'PerformanceMeasure', 'PerformanceNavigation', 'PerformanceResourceTiming', 'PerformanceTiming', 'PerformanceObserver', 'PerformanceObserverEntryList', 'PerformancePaintTiming', 'PerformanceServerTiming', 'PerformanceNavigationTiming', 'PerformanceLongTaskTiming', 'PerformanceEventTiming', 'PerformanceLayoutShift', 'PerformanceFirstInput', 'PerformanceLargestContentfulPaint', 'PerformanceElementTiming', 'PerformanceResourceTiming', 'PerformanceServerTiming', 'PerformanceNavigationTiming', 'PerformancePaintTiming', 'PerformanceLongTaskTiming', 'PerformanceEventTiming', 'PerformanceLayoutShift', 'PerformanceFirstInput', 'PerformanceLargestContentfulPaint', 'PerformanceElementTiming']
}

function generateStaticIconFiles(files: { file: string, name: string, path: string }[]) {
  try {
    if (!existsSync(staticDir)) {
      mkdirSync(staticDir, { recursive: true })
    }

    const reservedNames = getReservedNames()

    for (const { file, name, path } of files) {
      const iconName = toPascalCase(name)
      const finalName = reservedNames.includes(iconName) || reservedNames.includes(`Maz${iconName}`) || reservedNames.includes(`Maz${iconName}Icon`) ? `${iconName}Icon` : iconName
      const componentName = `Maz${finalName}`

      // path already contains '../', so we only need one '../' to go from static/ to src/ then use path
      const relativePath = path.startsWith('../') ? `../${path}` : `../../${path}`

      const content = `/// <reference types="vite-svg-loader" />

/**
 * This file is generated automatically, do not manually modify it
 */

import _component from '${relativePath}/${file}?component'

export const ${componentName} = _component
`

      const outputPath = resolve(staticDir, `${componentName}.ts`)
      writeFileSync(outputPath, content)
    }

    logger.success(`[ViteGenerateIconsComponentsEntry](generateStaticIconFiles) ✅ ${files.length} static icon files generated`)
  }
  catch (error) {
    logger.error('[ViteGenerateIconsComponentsEntry](generateStaticIconFiles) 🔴 error while generating static icon files', error)

    throw error
  }
}

function generateStaticIndex(files: { file: string, name: string, path: string }[]) {
  try {
    const reservedNames = getReservedNames()
    const exports = files.map(({ name }) => {
      const iconName = toPascalCase(name)
      const finalName = reservedNames.includes(iconName) || reservedNames.includes(`Maz${iconName}`) || reservedNames.includes(`Maz${iconName}Icon`) ? `${iconName}Icon` : iconName
      const componentName = `Maz${finalName}`
      return `export { ${componentName} } from './${componentName}'`
    }).sort((a, b) => a.localeCompare(b, undefined, { numeric: true })).join('\n')

    const content = `/// <reference types="vite-svg-loader" />

/**
 * This file is generated automatically, do not manually modify it
 */

${exports}
`

    const staticIndexPath = resolve(staticDir, 'index.ts')
    writeFileSync(staticIndexPath, content)

    logger.success('[ViteGenerateIconsComponentsEntry](generateStaticIndex) ✅ static index generated')
  }
  catch (error) {
    logger.error('[ViteGenerateIconsComponentsEntry](generateStaticIndex) 🔴 error while generating static index', error)

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
      const finalName = reservedNames.includes(iconName) || reservedNames.includes(`Maz${iconName}`) || reservedNames.includes(`Maz${iconName}Icon`) ? `${iconName}Icon` : iconName
      const componentName = `Maz${finalName}`

      // path already contains '../', so we only need one '../' to go from lazy/ to src/ then use path
      const relativePath = path.startsWith('../') ? `../${path}` : `../../${path}`

      const content = `/// <reference types="vite-svg-loader" />

/**
 * This file is generated automatically, do not manually modify it
 */

import { defineAsyncComponent, markRaw } from 'vue'

export const ${componentName} = markRaw(defineAsyncComponent(() => import('${relativePath}/${file}?component')))
`

      const outputPath = resolve(lazyDir, `${componentName}.ts`)
      writeFileSync(outputPath, content)
    }

    logger.success(`[ViteGenerateIconsComponentsEntry](generateLazyIconFiles) ✅ ${files.length} lazy icon files generated`)
  }
  catch (error) {
    logger.error('[ViteGenerateIconsComponentsEntry](generateLazyIconFiles) 🔴 error while generating lazy icon files', error)

    throw error
  }
}

function generateLazyIndex(files: { file: string, name: string, path: string }[]) {
  try {
    const reservedNames = getReservedNames()
    const exports = files.map(({ name }) => {
      const iconName = toPascalCase(name)
      const finalName = reservedNames.includes(iconName) || reservedNames.includes(`Maz${iconName}`) || reservedNames.includes(`Maz${iconName}Icon`) ? `${iconName}Icon` : iconName
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

    logger.success('[ViteGenerateIconsComponentsEntry](generateLazyIndex) ✅ lazy index generated')
  }
  catch (error) {
    logger.error('[ViteGenerateIconsComponentsEntry](generateLazyIndex) 🔴 error while generating lazy index', error)

    throw error
  }
}

function generateIconsComponentsEntry(files: { file: string, name: string, path: string }[]) {
  try {
    const reservedNames = getReservedNames()
    const lazyExports = files.map(({ name }) => {
      const iconName = toPascalCase(name)
      const finalName = reservedNames.includes(iconName) || reservedNames.includes(`Maz${iconName}`) || reservedNames.includes(`Maz${iconName}Icon`) ? `${iconName}Icon` : iconName
      const componentName = `Maz${finalName}`
      return `export { ${componentName} as Lazy${componentName} } from './lazy/${componentName}'`
    }).sort((a, b) => a.localeCompare(b, undefined, { numeric: true })).join('\n')

    const content = `/// <reference types="vite-svg-loader" />

/**
 * This file is generated automatically, do not manually modify it
 */

import type { Component, ComponentPublicInstance, FunctionalComponent } from 'vue'

export type IconComponent = FunctionalComponent | ComponentPublicInstance | Component

export * from './static'

${lazyExports}
`

    writeFileSync(outputIndex, content)

    logger.success('[ViteGenerateIconsComponentsEntry](generateIconsComponentsEntry) ✅ icons components entry generated')
  }
  catch (error) {
    logger.error('[ViteGenerateIconsComponentsEntry](generateIconsComponentsEntry) 🔴 error while generating icons components entry', error)

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
        const finalName = reservedNames.includes(iconName) || reservedNames.includes(`Maz${iconName}`) || reservedNames.includes(`Maz${iconName}Icon`) ? `${iconName}Icon` : iconName
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
    logger.success('[ViteGenerateIconsComponentsEntry](generateIconList) ✅ icons list generated')
  }
  catch (error) {
    logger.error('[ViteGenerateIconsComponentsEntry](generateIconList) 🔴 error while generating icons list', error)
    throw error
  }
}

export function ViteGenerateIconsComponentsEntry(): Plugin {
  return {
    name: 'vite-generate-icons-components-entry',
    configResolved() {
      try {
        logger.log('[ViteGenerateIconsComponentsEntry] ✅ starting to generate icons components entry')
        const [svgFiles, flags1x1Files, flags3x2Files, logos] = [
          readdirSync(svgDir).map(file => ({
            file,
            name: file.replace('.svg', ''),
            path: '../svg',
            dir: 'svg',
          })),
          readdirSync(logosDir).map(file => ({
            file,
            name: `logo-${file.replace('.svg', '')}`,
            path: '../logos',
            dir: 'logos',
          })),
          readdirSync(flags1x1Dir).map(file => ({
            file,
            name: `flag-square-${file.replace('.svg', '').split('').join('-')}`,
            path: '../flags/1x1',
            dir: 'flags/1x1',
          })),
          readdirSync(flags3x2Dir).map(file => ({
            file,
            name: `flag-${file.replace('.svg', '').split('').join('-')}`,
            path: '../flags/3x2',
            dir: 'flags/3x2',
          })),
        ]

        const files = [...svgFiles, ...flags1x1Files, ...flags3x2Files, ...logos].filter(({ file }) => file.endsWith('.svg') && !file.endsWith('.DS_Store'))

        replaceValuesInSvg(svgFiles)
        generateStaticIconFiles(files)
        generateStaticIndex(files)
        generateLazyIconFiles(files)
        generateLazyIndex(files)
        generateIconsComponentsEntry(files)
        generateIconList(files)

        logger.success('[ViteGenerateIconsComponentsEntry] ✅ icons components entry generated')
      }
      catch (error) {
        logger.error('[ViteGenerateIconsComponentsEntry] 🔴 error while generating icons components entry', error instanceof Error ? error.message : String(error))

        throw error
      }
    },
  }
}
