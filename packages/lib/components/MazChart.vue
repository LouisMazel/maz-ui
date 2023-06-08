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
    const {
      BarController,
      LineController,
      ScatterController,
      BubbleController,
      PieController,
      DoughnutController,
      PolarAreaController,
      RadarController,
    } = await import('chart.js')

    switch (props.type) {
      case 'bar': {
        return createTypedChart('bar', BarController)
      }
      case 'line': {
        return createTypedChart('line', LineController)
      }
      case 'scatter': {
        return createTypedChart('scatter', ScatterController)
      }
      case 'bubble': {
        return createTypedChart('bubble', BubbleController)
      }
      case 'pie': {
        return createTypedChart('pie', PieController)
      }
      case 'doughnut': {
        return createTypedChart('doughnut', DoughnutController)
      }
      case 'polarArea': {
        return createTypedChart('polarArea', PolarAreaController)
      }
      case 'radar': {
        return createTypedChart('radar', RadarController)
      }
    }
  })
</script>
