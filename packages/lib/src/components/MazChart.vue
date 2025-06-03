<script lang="ts">
/* eslint-disable import/first */
import type {
  ChartData,
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
   * Update mode
   * @type UpdateMode
   * @values 'resize', 'reset', 'none', 'hide', 'show', 'default', 'active'
   * @default 'default'
   */
  updateMode?: UpdateMode
}
</script>

<script lang="ts" setup generic="T extends ChartType, TData = DefaultDataPoint<T>, TLabel = unknown">
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js'
import { defineAsyncComponent } from 'vue'

const {
  type,
  data,
  options = {},
  plugins,
  datasetIdKey,
  updateMode,
} = defineProps<MazChartProps<T, TData, TLabel>>()

Chart.register(
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
)

const component = defineAsyncComponent(async () => {
  const { Bar, Bubble, Doughnut, Line, Pie, PolarArea, Radar, Scatter } = await import(
    'vue-chartjs'
  )

  const components = {
    bar: Bar,
    line: Line,
    scatter: Scatter,
    bubble: Bubble,
    pie: Pie,
    doughnut: Doughnut,
    polarArea: PolarArea,
    radar: Radar,
  } as const

  return components[type]
})
</script>

<template>
  <!-- @vue-expect-error -->
  <Component :is="component" class="m-chart m-reset-css" :data :options :plugins :dataset-id-key :update-mode />
</template>
