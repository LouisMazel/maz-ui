<template>
  <Component :is="component" v-bind="propsRef" />
</template>

<script lang="ts" setup>
  import { defineAsyncComponent } from 'vue'
  import { type ChartProps } from 'vue-chartjs'
  import {
    ArcElement,
    BarElement,
    LineElement,
    PointElement,
    CategoryScale,
    Chart,
    Legend,
    LinearScale,
    Title,
    Tooltip,
  } from 'chart.js'
  import { ref, type PropType } from 'vue'

  const props = defineProps({
    /**
     * Chart.js chart type
     */
    type: { type: String as PropType<ChartProps['type']>, required: true },
    /**
     * The data object that is passed into the Chart.js chart
     * @see https://www.chartjs.org/docs/latest/getting-started/
     */
    data: { type: Object as PropType<ChartProps['data']>, required: true },
    /**
     * The options object that is passed into the Chart.js chart
     * @see https://www.chartjs.org/docs/latest/general/options.html
     */
    options: { type: Object as PropType<ChartProps['options']>, default: Object },
    /**
     * The plugins array that is passed into the Chart.js chart
     * @see https://www.chartjs.org/docs/latest/developers/plugins.html
     */
    plugins: { type: Array as PropType<ChartProps['plugins']>, default: Array },
    /**
     * Key name to identificate dataset
     */
    datasetIdKey: { type: String as PropType<ChartProps['datasetIdKey']>, default: 'label' },
    /**
     * A mode string to indicate transition configuration should be used.
     * @see https://www.chartjs.org/docs/latest/developers/api.html#update-mode
     */
    updateMode: { type: String as PropType<ChartProps['updateMode']>, default: undefined },
  })

  const propsRef = ref<unknown>(props)

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

    switch (props.type) {
      case 'bar': {
        return Bar
      }
      case 'line': {
        return Line
      }
      case 'scatter': {
        return Scatter
      }
      case 'bubble': {
        return Bubble
      }
      case 'pie': {
        return Pie
      }
      case 'doughnut': {
        return Doughnut
      }
      case 'polarArea': {
        return PolarArea
      }
      case 'radar': {
        return Radar
      }
    }
  })
</script>
