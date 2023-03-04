<script lang="ts">
  import { h, ref, onMounted, defineComponent, type PropType } from 'vue'

  import {
    chartJsEventNames,
    generateEventObject,
    generateChartJsEventListener,
  } from './MazChart/includes'

  import Chart from 'chart.js/auto/auto.mjs'

  import type { ChartItem, ChartType, Plugin, ChartData, ChartOptions } from 'chart.js'

  export default defineComponent({
    name: 'MazChart',
    props: {
      type: { type: String, required: true },
      data: { type: Object, required: true },
      height: { type: String, default: undefined },
      width: { type: String, default: undefined },
      options: { type: Object, default: () => ({}) },
      plugins: { type: Array as PropType<Plugin[]>, default: () => [] },
      locale: { type: String, default: 'fr-FR' },
    },
    emits: chartJsEventNames,
    setup(props, { emit }) {
      const chartRef = ref<HTMLCanvasElement>()
      //generate chart.js plugin to emit lib events
      const chartJsEventsPlugin: Plugin = chartJsEventNames.reduce(
        (reduced, eventType) => {
          const event = generateEventObject(eventType, chartRef.value)
          return { ...reduced, ...generateChartJsEventListener(emit, event) }
        },
        { id: 'MazChartEventHookPlugin' },
      )

      type ChartJssState = {
        chart?: Chart
        options?: ChartOptions
        plugins: Plugin[]
        props: typeof props
      }

      const chartJSState: ChartJssState = {
        chart: undefined,
        plugins: [chartJsEventsPlugin, ...props.plugins],
        props,
      }

      const destroy = () => {
        if (chartJSState.chart) {
          chartJSState.chart.destroy()
          chartJSState.chart = undefined
        }
      }

      const update = () => {
        if (chartJSState.chart) {
          chartJSState.chart.data = {
            ...chartJSState.chart.data,
            ...chartJSState.props.data,
          }
          chartJSState.chart.options = {
            ...chartJSState.chart.options,
            ...chartJSState.props.options,
          }
          chartJSState.chart.update('resize')
        }
      }

      const resize = () => chartJSState.chart && chartJSState.chart.resize()

      const render = () => {
        if (chartJSState.chart) {
          return chartJSState.chart.update()
        }
        if (chartRef.value) {
          return (chartJSState.chart = new Chart(chartRef.value.getContext('2d') as ChartItem, {
            type: chartJSState.props.type as ChartType,
            data: chartJSState.props.data as ChartData,
            options: {
              locale: props.locale,
              ...chartJSState.props.options,
            },
            plugins: chartJSState.plugins,
          }))
        }
      }

      onMounted(() => render())

      return {
        chartJSState,
        chartRef,
        render,
        resize,
        update,
        destroy,
      }
    },
    render(props) {
      return h('canvas', {
        ref: 'chartRef',
        width: props.width,
        height: props.height,
      })
    },
  })
</script>
