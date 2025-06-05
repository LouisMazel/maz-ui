import { readdir, readFile, writeFile } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { Plugin } from 'vite'
import { logger } from './logger'

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
    const colorRegex = /(stroke|fill|color|stop-color|flood-color|lighting-color)="#[\dA-Fa-f]{3}(?:[\dA-Fa-f]{3})?"/g
    const rgbRegex = /(stroke|fill|color|stop-color|flood-color|lighting-color)="rgb\([^)]+\)"/g
    const svgFiles = files.filter(file => file.endsWith('.svg'))

    for (const file of svgFiles) {
      const filePath = join(svgDir, file)
      let content = await readFile(filePath, 'utf-8')

      // width/height
      content = content.replace(/<svg[^>]*width="[^"]*"/g, '<svg width="1em"')
      content = content.replace(/<svg[^>]*height="[^"]*"/g, '<svg height="1em"')

      // couleurs HEX
      content = content.replace(colorRegex, '$1="currentColor"')
      // couleurs rgb()
      content = content.replace(rgbRegex, '$1="currentColor"')

      await writeFile(filePath, content)
    }

    logger.success(`[ViteGenerateIconsComponentsEntry](replaceValuesInSvg) ✅ all svg files cleaned`)
  }
  catch (error) {
    logger.error('[ViteGenerateIconsComponentsEntry](replaceValuesInSvg) 🔴 error while replacing values in svg', error)

    throw error
  }
}

async function generateIconsComponentsEntry(files: string[]) {
  const reservedNames = ['Map', 'Object', 'String', 'Number', 'Boolean', 'Array', 'Date', 'RegExp', 'Error', 'Function', 'Promise', 'Set', 'WeakMap', 'WeakSet', 'Symbol', 'Proxy', 'Reflect', 'Math', 'JSON', 'Intl', 'Console', 'Window', 'Document', 'Element', 'HTMLElement', 'Node', 'Event', 'EventTarget', 'Location', 'History', 'Navigator', 'Screen', 'Storage', 'URL', 'URLSearchParams', 'FormData', 'File', 'Blob', 'FileReader', 'XMLHttpRequest', 'WebSocket', 'Worker', 'SharedWorker', 'ServiceWorker', 'Cache', 'Request', 'Response', 'Headers', 'Body', 'ReadableStream', 'WritableStream', 'TransformStream', 'ByteLengthQueuingStrategy', 'CountQueuingStrategy', 'TextEncoder', 'TextDecoder', 'Image', 'ImageData', 'Canvas', 'CanvasRenderingContext2D', 'WebGLRenderingContext', 'WebGL2RenderingContext', 'Audio', 'AudioContext', 'AudioBuffer', 'AudioBufferSourceNode', 'GainNode', 'OscillatorNode', 'AnalyserNode', 'BiquadFilterNode', 'ChannelMergerNode', 'ChannelSplitterNode', 'ConvolverNode', 'DelayNode', 'DynamicsCompressorNode', 'IIRFilterNode', 'MediaElementAudioSourceNode', 'MediaStreamAudioDestinationNode', 'MediaStreamAudioSourceNode', 'PannerNode', 'StereoPannerNode', 'WaveShaperNode', 'MediaStream', 'MediaStreamTrack', 'MediaRecorder', 'MediaDevices', 'MediaQueryList', 'MutationObserver', 'IntersectionObserver', 'ResizeObserver', 'Performance', 'PerformanceEntry', 'PerformanceMark', 'PerformanceMeasure', 'PerformanceNavigation', 'PerformanceResourceTiming', 'PerformanceTiming', 'PerformanceObserver', 'PerformanceObserverEntryList', 'PerformancePaintTiming', 'PerformanceServerTiming', 'PerformanceNavigationTiming', 'PerformanceLongTaskTiming', 'PerformanceEventTiming', 'PerformanceLayoutShift', 'PerformanceFirstInput', 'PerformanceLargestContentfulPaint', 'PerformanceElementTiming', 'PerformanceResourceTiming', 'PerformanceServerTiming', 'PerformanceNavigationTiming', 'PerformancePaintTiming', 'PerformanceLongTaskTiming', 'PerformanceEventTiming', 'PerformanceLayoutShift', 'PerformanceFirstInput', 'PerformanceLargestContentfulPaint', 'PerformanceElementTiming']

  const imports = files.map((file) => {
    const name = toPascalCase(file.replace('.svg', ''))
    const finalName = reservedNames.includes(name) ? `${name}Icon` : name
    return `  ${finalName}: defineAsyncComponent(() => import('./../svg/${file}?component')),`
  }).join('\n')

  const namedExports = files.map((file) => {
    const name = toPascalCase(file.replace('.svg', ''))
    const finalName = reservedNames.includes(name) ? `${name}Icon` : name
    return `export const ${finalName} = icons.${finalName}`
  }).join('\n')

  try {
    const content = `import type { Component, ComponentPublicInstance, FunctionalComponent, SVGAttributes } from 'vue'
import { defineAsyncComponent } from 'vue'

export type IconComponent = FunctionalComponent | ComponentPublicInstance | Component
export type IconName = keyof typeof icons

const icons = {
${imports}
} satisfies Record<string, IconComponent>

${namedExports}

export default icons
`

    await writeFile(outputIndex, content)

    logger.success('[ViteGenerateIconsComponentsEntry](generateIconsComponentsEntry) ✅ icons components entry generated')
  }
  catch (error) {
    logger.error('[ViteGenerateIconsComponentsEntry](generateIconsComponentsEntry) 🔴 error while generating icons components entry', error)

    throw error
  }
}

export function ViteGenerateIconsComponentsEntry(): Plugin {
  return {
    name: 'vite-generate-icons-components-entry',
    async buildStart() {
      logger.log('[ViteGenerateIconsComponentsEntry] ✅ starting to generate icons components entry')
      const files = await readdir(svgDir)

      try {
        await replaceValuesInSvg(files)
        await generateIconsComponentsEntry(files)

        logger.success('[ViteGenerateIconsComponentsEntry] ✅ icons components entry generated')
      }
      catch (error) {
        logger.error('[ViteGenerateIconsComponentsEntry] 🔴 error while generating icons components entry', error instanceof Error ? error.message : String(error))

        throw error
      }
    },
  }
}
