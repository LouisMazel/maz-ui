<template>
  <div
    :id="uniqueId"
    class="maz-plotly"
  />
</template>
<script>
import Plotly from 'plotly.js-dist'
import events from './events.js'
import methods from './methods.js'
import { camelize } from './helper.js'
import uniqueId from './../../mixins/uniqueId'

export default {
  name: 'MazPlotly',
  mixins: [uniqueId],
  inheritAttrs: false,
  props: {
    data: { type: Array, default: null },
    layout: { type: Object, default: null },
    id: { type: String, default: null }
  },
  data () {
    return {
      scheduled: null,
      innerLayout: { ...this.layout }
    }
  },
  computed: {
    options () {
      const optionsFromAttrs = Object.keys(this.$attrs).reduce((acc, key) => {
        acc[camelize(key)] = this.$attrs[key]
        return acc
      }, {})
      return {
        responsive: false,
        ...optionsFromAttrs
      }
    }
  },
  watch: {
    data: {
      handler () {
        this.schedule({ replot: true })
      },
      deep: true
    },
    options: {
      handler (value, old) {
        if (JSON.stringify(value) === JSON.stringify(old)) {
          return
        }
        this.schedule({ replot: true })
      },
      deep: true
    },
    layout (layout) {
      this.innerLayout = { ...layout }
      this.schedule({ replot: false })
    }
  },
  mounted () {
    Plotly.newPlot(this.$el, this.data, this.innerLayout, this.options)
    events.forEach(evt => {
      this.$el.on(evt.completeName, evt.handler(this))
    })
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', this.onResize)
    }
  },
  beforeDestroy () {
    events.forEach(event => this.$el.removeAllListeners(event.completeName))
    Plotly.purge(this.$el)
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', this.onResize)
    }
  },
  methods: {
    ...methods,
    onResize () {
      console.log('onResizeok')
      Plotly.Plots.resize(this.$el)
    },
    schedule (context) {
      const { scheduled } = this
      if (scheduled) {
        scheduled.replot = scheduled.replot || context.replot
        return
      }
      this.scheduled = context
      this.$nextTick(() => {
        const {
          scheduled: { replot }
        } = this
        this.scheduled = null
        if (replot) {
          this.react()
          return
        }
        this.relayout(this.innerLayout)
      })
    },
    toImage (options) {
      const allOptions = Object.assign(this.getPrintOptions(), options)
      return Plotly.toImage(this.$el, allOptions)
    },
    downloadImage (options) {
      const filename = `plot--${new Date().toISOString()}`
      const allOptions = Object.assign(this.getPrintOptions(), { filename }, options)
      return Plotly.downloadImage(this.$el, allOptions)
    },
    getPrintOptions () {
      const { $el } = this
      return {
        format: 'png',
        width: $el.clientWidth,
        height: $el.clientHeight
      }
    },
    react () {
      Plotly.react(this.$el, this.data, this.innerLayout, this.options)
    }
  }
}
</script>
