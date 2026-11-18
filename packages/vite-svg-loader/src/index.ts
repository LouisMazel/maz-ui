import { svgLoader } from './plugin'

export { compileSvgComponent } from './compile'
export { getDefaultSvgoConfig, getFloatPrecision, getIdPrefix, optimizeSvg } from './optimize'
export type { OptimizeSvgOptions, SvgoConfigOption } from './optimize'
export { svgLoader } from './plugin'
export type { SvgImportType, SvgLoaderOptions } from './plugin'

export default svgLoader
