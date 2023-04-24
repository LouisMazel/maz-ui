<template>
  <Component :is="component" v-bind="props" />
</template>

<script lang="ts">
  export { getDatasetAtEvent, getElementAtEvent, getElementsAtEvent } from 'vue-chartjs'
</script>

<script lang="ts" setup>
  import { defineAsyncComponent } from 'vue'
  import { createTypedChart } from 'vue-chartjs'
  import {
    ArcElement,
    BarElement,
    CategoryScale,
    Chart,
    Legend,
    LineElement,
    LinearScale,
    PointElement,
    Title,
    Tooltip,
    type ChartType,
    type ChartData,
    type ChartOptions,
    type DefaultDataPoint,
    type Plugin,
    type UpdateMode,
  } from 'chart.js'

  export interface ChartProps<
    TType extends ChartType = ChartType,
    TData = DefaultDataPoint<TType>,
    TLabel = unknown,
  > {
    type: ChartType
    data: ChartData<TType, TData, TLabel>
    options?: ChartOptions<TType>
    plugins?: Plugin<TType>[]
    datasetIdKey?: string
    updateMode?: UpdateMode
  }

  const props = defineProps<ChartProps>()

  Chart.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement,
  )

  const component = defineAsyncComponent(async () => {
    /* eslint-disable unicorn/no-await-expression-member */
    switch (props.type) {
      case 'bar': {
        return createTypedChart('bar', (await import('chart.js')).BarController)
      }
      case 'line': {
        return createTypedChart('bar', (await import('chart.js')).LineController)
      }
      case 'scatter': {
        return createTypedChart('bar', (await import('chart.js')).ScatterController)
      }
      case 'bubble': {
        return createTypedChart('bar', (await import('chart.js')).BubbleController)
      }
      case 'pie': {
        return createTypedChart('bar', (await import('chart.js')).PieController)
      }
      case 'doughnut': {
        return createTypedChart('bar', (await import('chart.js')).DoughnutController)
      }
      case 'polarArea': {
        return createTypedChart('bar', (await import('chart.js')).PolarAreaController)
      }
      case 'radar': {
        return createTypedChart('bar', (await import('chart.js')).RadarController)
      }
    }
    /* eslint-enable unicorn/no-await-expression-member */
  })
</script>
