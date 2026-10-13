<script lang="ts">
import type {
  ChartComponentLike,
  ChartData,
  Chart as ChartInstance,
  ChartOptions,
  ChartType,
  DefaultDataPoint,
  Plugin,
  UpdateMode,
} from 'chart.js'

export type { ChartData as MazChartData, DefaultDataPoint as MazChartDefaultDataPoint, Plugin as MazChartPlugin, ChartType as MazChartType, UpdateMode as MazChartUpdateMode } from 'chart.js'

export interface MazChartProps<T extends ChartType = ChartType, TData = DefaultDataPoint<T>, TLabel = unknown> {
  /**
   * Type of the chart
   * @type ChartType
   * @values 'bar', 'line', 'scatter', 'bubble', 'pie', 'doughnut', 'polarArea', 'radar'
   * @required
   */
  type: T
  /**
   * Data of the chart
   * @type ChartData<T, TData, TLabel>
   * @required
   */
  data: ChartData<T, TData, TLabel>
  /**
   * Options of the chart
   * @type ChartOptions<T>
   * @default {}
   */
  options?: ChartOptions<T>
  /**
   * Plugins of the chart
   * @type Plugin[]
   */
  plugins?: Plugin[]
  /**
   * Dataset ID key
   * @type string
   */
  datasetIdKey?: string
  /**
   * Update mode used when `data` or `options` change after the initial
   * render. Defaults to `'none'` to skip animations on updates (the
   * initial render still animates per the chart's `options`).
   * @type UpdateMode
   * @values 'resize', 'reset', 'none', 'hide', 'show', 'default', 'active'
   * @default 'none'
   */
  updateMode?: UpdateMode
}
</script>

<script lang="ts" setup generic="T extends ChartType, TData = DefaultDataPoint<T>, TLabel = unknown">
import { markRaw, onBeforeUnmount, onMounted, shallowRef, useTemplateRef, watch } from 'vue'

const {
  type,
  data,
  options,
  plugins,
  datasetIdKey,
  updateMode = 'none',
} = defineProps<MazChartProps<T, TData, TLabel>>()

const canvasRef = useTemplateRef<HTMLCanvasElement>('canvasRef')
const chartInstance = shallowRef<ChartInstance | null>(null) as { value: ChartInstance | null }

async function loadChartCtor() {
  const cjs = await import('chart.js')
  const {
    Chart,
    Title,
    Tooltip,
    Legend,
    Filler,
    BarController,
    BarElement,
    LineController,
    LineElement,
    PointElement,
    PieController,
    DoughnutController,
    ArcElement,
    RadarController,
    PolarAreaController,
    ScatterController,
    BubbleController,
    CategoryScale,
    LinearScale,
    RadialLinearScale,
  } = cjs

  const TYPE_MODULES: Record<ChartType, ReadonlyArray<ChartComponentLike>> = {
    bar: [BarController, BarElement, CategoryScale, LinearScale],
    line: [LineController, LineElement, PointElement, CategoryScale, LinearScale],
    scatter: [ScatterController, LineElement, PointElement, LinearScale],
    bubble: [BubbleController, PointElement, LinearScale],
    pie: [PieController, ArcElement],
    doughnut: [DoughnutController, ArcElement],
    radar: [RadarController, LineElement, PointElement, RadialLinearScale],
    polarArea: [PolarAreaController, ArcElement, RadialLinearScale],
  }

  Chart.register(Title, Tooltip, Legend, Filler, ...TYPE_MODULES[type])
  return Chart
}

onMounted(async () => {
  if (!canvasRef.value)
    return

  const Chart = await loadChartCtor()

  if (!canvasRef.value)
    return

  chartInstance.value = markRaw(new Chart(canvasRef.value, {
    type,
    data,
    options,
    plugins,
    ...(datasetIdKey ? { datasetIdKey } : {}),
  } as ConstructorParameters<typeof Chart>[1])) as ChartInstance
})

watch(
  () => data,
  (next) => {
    const chart = chartInstance.value
    if (!chart)
      return
    chart.data = next as ChartInstance['data']
    chart.update(updateMode)
  },
  { deep: true },
)

watch(
  () => options,
  (next) => {
    const chart = chartInstance.value
    if (!chart)
      return
    chart.options = (next ?? {}) as ChartInstance['options']
    chart.update(updateMode)
  },
  { deep: true },
)

onBeforeUnmount(() => {
  chartInstance.value?.destroy()
  chartInstance.value = null
})
</script>

<template>
  <canvas ref="canvasRef" class="m-chart m-reset-css" />
</template>
