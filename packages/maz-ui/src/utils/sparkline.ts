export interface SparklinePoint {
  x: number
  y: number
  value: number
}

export const SPARKLINE_PADDING = 3

/**
 * Space kept around the line so the stroke and the last point are never clipped
 */
export function getSparklinePadding(strokeWidth: number) {
  return Math.ceil(strokeWidth * 1.6) + 1
}

/**
 * Coordinates of the points of a sparkline in a `width` x `height` box, the lowest value at the bottom
 */
export function getSparklinePoints(data: number[], width: number, height: number, padding = SPARKLINE_PADDING): SparklinePoint[] {
  const values = data.filter(Number.isFinite)

  if (values.length === 0)
    return []

  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min
  const innerWidth = Math.max(width - padding * 2, 0)
  const innerHeight = Math.max(height - padding * 2, 0)

  return values.map((value, index) => ({
    x: values.length === 1 ? width / 2 : padding + (index * innerWidth) / (values.length - 1),
    y: range === 0 ? height / 2 : padding + innerHeight - ((value - min) / range) * innerHeight,
    value,
  }))
}

function round(value: number) {
  return Math.round(value * 100) / 100
}

function getMonotoneSlopes(points: SparklinePoint[]) {
  const count = points.length
  const deltas: number[] = []
  const widths: number[] = []

  for (let index = 0; index < count - 1; index++) {
    const width = points[index + 1]!.x - points[index]!.x
    widths.push(width)
    deltas.push(width === 0 ? 0 : (points[index + 1]!.y - points[index]!.y) / width)
  }

  const slopes = [deltas[0]!]

  for (let index = 1; index < count - 1; index++) {
    const previous = deltas[index - 1]!
    const next = deltas[index]!
    slopes.push(previous * next <= 0 ? 0 : (previous + next) / 2)
  }

  slopes.push(deltas[count - 2]!)

  for (let index = 0; index < count - 1; index++) {
    const delta = deltas[index]!

    if (delta === 0) {
      slopes[index] = 0
      slopes[index + 1] = 0
      continue
    }

    const a = slopes[index]! / delta
    const b = slopes[index + 1]! / delta
    const magnitude = a * a + b * b

    if (magnitude > 9) {
      const scale = 3 / Math.sqrt(magnitude)
      slopes[index] = scale * a * delta
      slopes[index + 1] = scale * b * delta
    }
  }

  return { slopes, widths }
}

/**
 * SVG path of the line, straight segments or a smooth curve that never overshoots the data (monotone cubic)
 */
export function getSparklinePath(points: SparklinePoint[], smooth = true): string {
  if (points.length === 0)
    return ''

  const first = points[0]!

  if (points.length === 1)
    return `M${round(first.x)} ${round(first.y)}`

  if (!smooth || points.length === 2)
    return points.map((point, index) => `${index === 0 ? 'M' : 'L'}${round(point.x)} ${round(point.y)}`).join('')

  const { slopes, widths } = getMonotoneSlopes(points)
  let path = `M${round(first.x)} ${round(first.y)}`

  for (let index = 0; index < points.length - 1; index++) {
    const from = points[index]!
    const to = points[index + 1]!
    const third = widths[index]! / 3

    path += `C${round(from.x + third)} ${round(from.y + slopes[index]! * third)} ${round(to.x - third)} ${round(to.y - slopes[index + 1]! * third)} ${round(to.x)} ${round(to.y)}`
  }

  return path
}

/**
 * SVG path of the area under the line, closed on the bottom edge
 */
export function getSparklineAreaPath(linePath: string, points: SparklinePoint[], height: number): string {
  if (points.length < 2)
    return ''

  return `${linePath}L${round(points.at(-1)!.x)} ${height}L${round(points[0]!.x)} ${height}Z`
}

export function getSparklineTrend(values: number[]): 'up' | 'down' | 'flat' {
  const clean = values.filter(Number.isFinite)

  if (clean.length < 2)
    return 'flat'

  const delta = clean.at(-1)! - clean[0]!

  if (delta === 0)
    return 'flat'

  return delta > 0 ? 'up' : 'down'
}
