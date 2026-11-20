import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { logger } from '@maz-ui/node'
import { getComponentList } from './getComponentList.ts'

export interface IconFile {
  /** `academic-cap.svg`, `FR.svg` */
  file: string
  /** The component name, in kebab case: `flag-square-f-r` is `MazFlagSquareFR` */
  name: string
  /** The name of `<MazIcon icon="..." />`: `flag-square-fr` */
  iconName: string
  /** The folder of the file, from the root of the package: `svg`, `flags/1x1` */
  dir: string
}

export interface GenerateIconsOptions {
  /** The root of the package: its `svg`, `flags` and `logos` are read, its `src` and `icon-names.json` written */
  root: string
  /** The names a component of an icon cannot take, it ends with `Icon` instead: `MazLinkIcon` */
  reservedNames?: string[]
}

const GENERATED_HEADER = `/**
 * This file is generated automatically, do not manually modify it
 */`
const SVG_LOADER_TYPES = '/// <reference types="@maz-ui/vite-svg-loader/client" />'

/** The globals of JavaScript and of the browser: an icon component with their name would shadow them */
const GLOBAL_NAMES = [
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
]

/** The color attributes of an SVG: their colors become `currentColor` */
// eslint-disable-next-line sonarjs/regex-complexity, regexp/no-useless-assertions
const COLOR_ATTRIBUTE = /\b(stroke|fill|color|stop-color|flood-color|lighting-color)\b="(?:#[\dA-Fa-f]{3,8}|rgb\([^)]+\)|rgba\([^)]+\)|hsl\([^)]+\)|hsla\([^)]+\)|[a-zA-Z]+)"/g

export function toPascalCase(value: string): string {
  return value
    .split(/[-_]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('')
}

/** `academic-cap` is `MazAcademicCap`, `link` is `MazLinkIcon` when `MazLink` is reserved (a component of maz-ui) */
export function getComponentName(name: string, reservedNames: ReadonlySet<string>): string {
  const iconName = toPascalCase(name)
  const isReserved = reservedNames.has(iconName) || reservedNames.has(`Maz${iconName}`) || reservedNames.has(`Maz${iconName}Icon`)

  return isReserved
    ? `Maz${iconName}Icon`
    : `Maz${iconName}`
}

/** An icon of the interface: `1em` wide and high, in the color of the text (`none` and `transparent` are kept) */
export function cleanSvg(content: string): string {
  const width = /\swidth\s*=/.test(content)
    ? content.replaceAll(/\swidth\s*=\s*"[^"]*"/g, ' width="1em"')
    : content.replace(/<svg\b/, '<svg width="1em"')
  const size = /\sheight\s*=/.test(width)
    ? width.replaceAll(/\sheight\s*=\s*"[^"]*"/g, ' height="1em"')
    : width.replace(/<svg\b/, '<svg height="1em"')

  return size.replaceAll(COLOR_ATTRIBUTE, (match, attribute: string) => {
    const color = match.split('=')[1].replaceAll('"', '')

    return color === 'none' || color === 'transparent'
      ? match
      : `${attribute}="currentColor"`
  })
}

function readIcons(root: string, dir: string, toName: (name: string) => { name: string, iconName: string }): IconFile[] {
  return readdirSync(resolve(root, dir))
    .filter(file => file.endsWith('.svg'))
    .map(file => ({
      file,
      dir,
      ...toName(file.replace('.svg', '')),
    }))
}

/** The SVG of the interface icons (`svg`), the logos and the flags (`FR.svg` is `flag-fr`, its component `MazFlagFR`) */
export function listIconFiles(root: string): IconFile[] {
  return [
    ...readIcons(root, 'svg', name => ({ name, iconName: name })),
    ...readIcons(root, 'logos', name => ({ name: `logo-${name}`, iconName: `logo-${name}` })),
    ...readIcons(root, 'flags/1x1', code => ({ name: `flag-square-${code.split('').join('-')}`, iconName: `flag-square-${code.toLowerCase()}` })),
    ...readIcons(root, 'flags/3x2', code => ({ name: `flag-${code.split('').join('-')}`, iconName: `flag-${code.toLowerCase()}` })),
  ]
}

/** The components of `@maz-ui/icons/vue`: an icon can not have their name */
const PACKAGE_COMPONENTS = ['MazIconPrimitive']

function getReservedNames(): string[] {
  return [
    ...getComponentList().map(({ name }) => name),
    ...PACKAGE_COMPONENTS,
    ...GLOBAL_NAMES,
  ]
}

function compareCodePoints(a: string, b: string): number {
  if (a === b)
    return 0

  return a < b
    ? -1
    : 1
}

function sortExports(lines: string[]): string {
  return lines.toSorted((a, b) => a.localeCompare(b, undefined, { numeric: true })).join('\n')
}

function writeModules(dir: string, modules: { name: string, content: string }[], index: string): void {
  if (!existsSync(dir))
    mkdirSync(dir, { recursive: true })

  for (const { name, content } of modules)
    writeFileSync(resolve(dir, `${name}.ts`), content)

  writeFileSync(resolve(dir, 'index.ts'), index)
}

/**
 * `icon-names.json`: the component and the file of each name, read by `MazUi()` of `@maz-ui/vite-plugin` (a name
 * imports the `raw` module of its component)
 */
function getIconNames(icons: (IconFile & { component: string })[]): string {
  const entries = icons
    .map(({ component, file, iconName, dir }) => [
      iconName,
      { component, file: `${dir}/${file}` },
    ] as const)
    .sort(([a], [b]) => compareCodePoints(a, b))

  const duplicates = entries.filter(([name], index) => index > 0 && entries[index - 1][0] === name)
  if (duplicates.length > 0)
    throw new Error(`duplicated icon names: ${duplicates.map(([name]) => name).join(', ')}`)

  return `${JSON.stringify(Object.fromEntries(entries), null, 2)}\n`
}

/**
 * Writes the variants of each icon (`src/static`, `src/lazy`, `src/raw`), their entries, `src/icon-list.ts` and
 * `icon-names.json`. The SVG of `svg` are cleaned in place (`1em`, `currentColor`): the logos and the flags keep
 * their colors.
 */
export function generateIcons({ root, reservedNames = getReservedNames() }: GenerateIconsOptions): void {
  try {
    logger.log('[generateIcons] ✅ starting to generate icons components entry')

    const icons = listIconFiles(root)
    const reserved = new Set(reservedNames)
    const components = icons.map(icon => ({
      ...icon,
      component: getComponentName(icon.name, reserved),
      source: `../../${icon.dir}/${icon.file}`,
    }))
    const iconNames = getIconNames(components)

    for (const { dir, file } of icons.filter(icon => icon.dir === 'svg')) {
      const path = resolve(root, dir, file)
      const content = readFileSync(path, 'utf8')
      const cleaned = cleanSvg(content)

      if (cleaned !== content)
        writeFileSync(path, cleaned)
    }

    const reexports = sortExports(components.map(({ component }) => `export { ${component} } from './${component}.ts'`))

    writeModules(resolve(root, 'src/static'), components.map(({ component, source }) => ({
      name: component,
      content: `${SVG_LOADER_TYPES}\n\n${GENERATED_HEADER}\n\nimport _component from '${source}?component'\n\nexport const ${component} = _component\n`,
    })), `${SVG_LOADER_TYPES}\n\n${GENERATED_HEADER}\n\n${reexports}\n`)

    writeModules(resolve(root, 'src/lazy'), components.map(({ component }) => ({
      name: component,
      content: `${SVG_LOADER_TYPES}\n\n${GENERATED_HEADER}\n\nimport { defineAsyncComponent, markRaw } from 'vue'\n\nexport const ${component} = markRaw(defineAsyncComponent(() => import('../static/${component}.ts').then(module => module.${component})))\n`,
    })), `${GENERATED_HEADER}\n\n${reexports}\n`)

    writeModules(resolve(root, 'src/raw'), components.map(({ component, source }) => ({
      name: component,
      content: `${SVG_LOADER_TYPES}\n\n${GENERATED_HEADER}\n\nimport _raw from '${source}?svg'\n\nexport const ${component} = _raw\n`,
    })), `${GENERATED_HEADER}\n\n${reexports}\n`)

    const lazyExports = sortExports(components.map(({ component }) => `export { ${component} as Lazy${component} } from './lazy/${component}.ts'`))

    writeFileSync(resolve(root, 'src/index.ts'), `${SVG_LOADER_TYPES}\n/// <reference path="./svg-modules.d.ts" />\n\n${GENERATED_HEADER}\n\nimport type { Component, ComponentPublicInstance, FunctionalComponent } from 'vue'\n\nexport type IconComponent = FunctionalComponent | ComponentPublicInstance | Component\n\nexport type * from './types.ts'\n\nexport * from './static/index.ts'\n\n${lazyExports}\n`)

    const iconList = [
      ...components.map(({ component }) => `'${component}'`),
      ...components.map(({ component }) => `'Lazy${component}'`),
    ].join(',\n  ')

    writeFileSync(resolve(root, 'src/icon-list.ts'), `${GENERATED_HEADER}\nexport const iconList = [\n  ${iconList}\n] as const\n\n/** The name of a component of the icons ('MazStar', 'LazyMazStar'), not a name of icon="star" (IconName of @maz-ui/icons) */\nexport type IconName = typeof iconList[number]\n`)
    writeFileSync(resolve(root, 'icon-names.json'), iconNames)

    logger.success(`[generateIcons] ✅ ${icons.length} icons generated`)
  }
  catch (error) {
    logger.error('[generateIcons] 🔴 error while generating the icons', String(error))

    throw error
  }
}
