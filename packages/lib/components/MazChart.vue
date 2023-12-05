<template>
  <!-- @vue-expect-error -->
  <Component :is="component" v-bind="props" />
</template>

<script lang="ts" setup>
  import { type PropType, defineAsyncComponent } from 'vue'
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
    type ChartType,
    type ChartData,
    type UpdateMode,
  } from 'chart.js'

  export type { ChartType, ChartData, UpdateMode }

  const props = defineProps({
    /**
     * Chart.js chart type
     */
    type: {
      type: String as PropType<ChartType>,
      required: true,
    },
    /**
     * The data object that is passed into the Chart.js chart
     * @see https://www.chartjs.org/docs/latest/getting-started/
     */
    data: {
      type: Object as PropType<ChartData<ChartType>>,
      required: true,
    },
    /**
     * The options object that is passed into the Chart.js chart
     * @see https://www.chartjs.org/docs/latest/general/options.html
     */
    options: {
      type: Object,
      default: () => ({}),
    },
    /**
     * The plugins array that is passed into the Chart.js chart
     * @see https://www.chartjs.org/docs/latest/developers/plugins.html
     */
    plugins: {
      type: Array,
      default: () => [],
    },
    /**
     * Key name to identificate dataset
     */
    datasetIdKey: {
      type: String,
      default: 'label',
    },
    /**
     * A mode string to indicate transition configuration should be used.
     * @see https://www.chartjs.org/docs/latest/developers/api.html#update-mode
     */
    updateMode: {
      type: String as PropType<UpdateMode>,
      default: undefined,
    },
  })

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
