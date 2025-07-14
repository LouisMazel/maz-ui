import type { Plugin } from 'vite'
import { readdir, readFile, writeFile } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { logger } from '@maz-ui/utils'
import { getComponentList } from './getComponentList.js'

function toPascalCase(str: string) {
  return str
    .split(/[-_]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('')
}

const _dirname = fileURLToPath(new URL('.', import.meta.url))

const svgDir = resolve(_dirname, '../svg')
const outputIndex = resolve(_dirname, '../src/index.ts')

async function replaceValuesInSvg(files: string[]) {
  try {
    const svgFiles = files.filter(file => file.endsWith('.svg'))

    for (const file of svgFiles) {
      const filePath = join(svgDir, file)
      let content = await readFile(filePath, 'utf-8')

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

      await writeFile(filePath, content)
    }

    logger.success(`[ViteGenerateIconsComponentsEntry](replaceValuesInSvg) ✅ all svg files cleaned`)
  }
  catch (error) {
    logger.error('[ViteGenerateIconsComponentsEntry](replaceValuesInSvg) 🔴 error while replacing values in svg', error)

    throw error
  }
}

async function getReservedNames() {
  const componentNameList = (await getComponentList()).map(({ name }) => name)
  return [...componentNameList, 'Map', 'Object', 'String', 'Number', 'Boolean', 'Array', 'Date', 'RegExp', 'Error', 'Function', 'Promise', 'Set', 'WeakMap', 'WeakSet', 'Symbol', 'Proxy', 'Reflect', 'Math', 'JSON', 'Intl', 'Console', 'Window', 'Document', 'Element', 'HTMLElement', 'Node', 'Event', 'EventTarget', 'Location', 'History', 'Navigator', 'Screen', 'Storage', 'URL', 'URLSearchParams', 'FormData', 'File', 'Blob', 'FileReader', 'XMLHttpRequest', 'WebSocket', 'Worker', 'SharedWorker', 'ServiceWorker', 'Cache', 'Request', 'Response', 'Headers', 'Body', 'ReadableStream', 'WritableStream', 'TransformStream', 'ByteLengthQueuingStrategy', 'CountQueuingStrategy', 'TextEncoder', 'TextDecoder', 'Image', 'ImageData', 'Canvas', 'CanvasRenderingContext2D', 'WebGLRenderingContext', 'WebGL2RenderingContext', 'Audio', 'AudioContext', 'AudioBuffer', 'AudioBufferSourceNode', 'GainNode', 'OscillatorNode', 'AnalyserNode', 'BiquadFilterNode', 'ChannelMergerNode', 'ChannelSplitterNode', 'ConvolverNode', 'DelayNode', 'DynamicsCompressorNode', 'IIRFilterNode', 'MediaElementAudioSourceNode', 'MediaStreamAudioDestinationNode', 'MediaStreamAudioSourceNode', 'PannerNode', 'StereoPannerNode', 'WaveShaperNode', 'MediaStream', 'MediaStreamTrack', 'MediaRecorder', 'MediaDevices', 'MediaQueryList', 'MutationObserver', 'IntersectionObserver', 'ResizeObserver', 'Performance', 'PerformanceEntry', 'PerformanceMark', 'PerformanceMeasure', 'PerformanceNavigation', 'PerformanceResourceTiming', 'PerformanceTiming', 'PerformanceObserver', 'PerformanceObserverEntryList', 'PerformancePaintTiming', 'PerformanceServerTiming', 'PerformanceNavigationTiming', 'PerformanceLongTaskTiming', 'PerformanceEventTiming', 'PerformanceLayoutShift', 'PerformanceFirstInput', 'PerformanceLargestContentfulPaint', 'PerformanceElementTiming', 'PerformanceResourceTiming', 'PerformanceServerTiming', 'PerformanceNavigationTiming', 'PerformancePaintTiming', 'PerformanceLongTaskTiming', 'PerformanceEventTiming', 'PerformanceLayoutShift', 'PerformanceFirstInput', 'PerformanceLargestContentfulPaint', 'PerformanceElementTiming']
}

async function generateIconsComponentsEntry(files: string[]) {
  const reservedNames = await getReservedNames()
  const imports = files.map((file) => {
    const name = toPascalCase(file.replace('.svg', ''))
    const finalName = reservedNames.includes(name) || reservedNames.includes(`Maz${name}`) || reservedNames.includes(`Maz${name}Icon`) ? `${name}Icon` : name
    return `export const Maz${finalName} = defineAsyncComponent(() => import('./../svg/${file}?component'));`
  }).join('\n')

  try {
    const content = `/// <reference types="vite-svg-loader" />

import type { Component, ComponentPublicInstance, FunctionalComponent } from 'vue';
import { defineAsyncComponent } from 'vue';

export type IconComponent = FunctionalComponent | ComponentPublicInstance | Component

${imports}
`

    await writeFile(outputIndex, content)

    logger.success('[ViteGenerateIconsComponentsEntry](generateIconsComponentsEntry) ✅ icons components entry generated')
  }
  catch (error) {
    logger.error('[ViteGenerateIconsComponentsEntry](generateIconsComponentsEntry) 🔴 error while generating icons components entry', error)

    throw error
  }
}

async function generateIconsList(files: string[]) {
  const outputPath = resolve(_dirname, '../src/icon-list.ts')
  const reservedNames = await getReservedNames()
  const iconNames = files
    .filter(file => file.endsWith('.svg'))
    .map((file) => {
      const name = toPascalCase(file.replace('.svg', ''))
      const finalName = reservedNames.includes(name) || reservedNames.includes(`Maz${name}`) || reservedNames.includes(`Maz${name}Icon`) ? `${name}Icon` : name
      return `'Maz${finalName}'`
    })
    .join(',\n  ')

  try {
    const content = `// Ce fichier est généré automatiquement, ne pas modifier manuellement
export const iconsList = [
  ${iconNames}
] as const

export type IconName = typeof iconsList[number]
`

    await writeFile(outputPath, content)
    logger.success('[ViteGenerateIconsComponentsEntry](generateIconsList) ✅ icons list generated')
  }
  catch (error) {
    logger.error('[ViteGenerateIconsComponentsEntry](generateIconsList) 🔴 error while generating icons list', error)
    throw error
  }
}

export function ViteGenerateIconsComponentsEntry(): Plugin {
  return {
    name: 'vite-generate-icons-components-entry',
    async configResolved() {
      logger.log('[ViteGenerateIconsComponentsEntry] ✅ starting to generate icons components entry')
      const files = (await readdir(svgDir)).filter(file => file.endsWith('.svg') && !file.endsWith('.DS_Store'))

      try {
        await replaceValuesInSvg(files)
        await generateIconsComponentsEntry(files)
        await generateIconsList(files)

        logger.success('[ViteGenerateIconsComponentsEntry] ✅ icons components entry generated')
      }
      catch (error) {
        logger.error('[ViteGenerateIconsComponentsEntry] 🔴 error while generating icons components entry', error instanceof Error ? error.message : String(error))

        throw error
      }
    },
  }
}
