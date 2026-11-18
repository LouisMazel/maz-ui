import { compileTemplate } from 'vue/compiler-sfc'

/**
 * Compiles an SVG into the code of a Vue component (`export default { render }`).
 */
export function compileSvgComponent(svg: string, { id, path }: { id: string, path: string }): string {
  // compileTemplate drops the <style> tags
  const source = svg
    .replaceAll('<style', '<component is="style"')
    .replaceAll('</style', '</component')

  const { code, errors } = compileTemplate({
    id,
    source,
    filename: path,
    transformAssetUrls: false,
  })

  if (errors.length > 0) {
    throw new Error(`[@maz-ui/vite-svg-loader] ${path}: ${errors.map(String).join(', ')}`)
  }

  return `${code}\nexport default { render }`
}
