import { svgLoader } from './plugin.ts'

export { compileSvgComponent } from './compile.ts'
export { getDefaultSvgoConfig, getFloatPrecision, getIdPrefix, optimizeSvg } from './optimize.ts'
export type { OptimizeSvgOptions, SvgoConfigOption } from './optimize.ts'
export { svgLoader } from './plugin.ts'
export type { SvgImportType, SvgLoaderOptions } from './plugin.ts'

export default svgLoader
