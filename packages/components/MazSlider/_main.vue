<template>
  <div
    :style="[wrapperStyle]"
    class="maz-base-component maz-slider"
    :class="[`maz-slider--${color}`]"
    @mousemove="handleMousemove"
    @mouseup="handleMouseup"
    @mouseleave="handleMouseup"
  >
    <div
      ref="MazSlider"
      class="maz-slider__bar maz-flex maz-flex-center"
      :style="[barStyle]"
      role="slider"
    >
      <div
        v-for="(div, i) in dividers"
        :key="`divider-${i}`"
        :style="[dividers[i]]"
        class="maz-slider__divider"
      />
      <button
        v-for="(btn, i) in computedValue"
        :key="`cursor-${i}`"
        ref="Cursor"
        type="button"
        :data-label="getLabel(i)"
        class="maz-slider__btn maz-flex maz-flex-center maz-bg-color-light"
        :class="{
          'active-cursor': i === activeCursor && !noCursorAnim
        }"
        :style="[buttonStyles[i]]"
        @mousedown="handleMousedown($event, i)"
        @focus="handleMousedown($event, i)"
        @blur="blurCursor(i)"
        @click="focusCursor(i)"
        @keydown="cursorKeyDown($event, i)"
      >
        <ArrowIcon
          v-if="i === activeCursor && !noCursorAnim"
          orientation="left"
          :size="sizeValue * 2"
        />
        <span class="maz-text-color">
          {{ tmpValues[i] }}
        </span>
        <ArrowIcon
          v-if="i === activeCursor && !noCursorAnim"
          orientation="right"
          :size="sizeValue * 2"
        />
      </button>
    </div>
  </div>
</template>

<script>
import ArrowIcon from '../_subs/ArrowIcon'

const getOpacityCoeff = (index, middle, length) => {
  const currentIndex = index + 1
  const isBiggerThanMiddle = middle < currentIndex
  const deviation = isBiggerThanMiddle ? currentIndex - middle : middle - currentIndex
  return ((100 / length * deviation) / 100)
}

const isBetween = (value, prev, next, direction) => {
  return direction === 'minus'
    ? prev ? value >= prev : true
    : next ? value <= next : true
}

export default {
  name: 'MazSlider',
  components: { ArrowIcon },
  props: {
    // Array of cursors values
    value: {
      required: true,
      validator: prop => ['number'].includes(typeof prop) || Array.isArray(prop) || prop === null
    },
    // array of cursors label
    labels: { type: Array, default: null },
    // min value of sliders
    min: { type: Number, default: 0 },
    // max value of sliders
    max: { type: Number, default: 100 },
    // height size of slider bar
    size: { type: Number, default: 8 },
    // remove div in different colors
    noDivider: { type: Boolean, default: false },
    // become a logarithmic slider (exponential)
    log: { type: Boolean, default: false },
    // main slider color
    color: { type: String, default: 'primary' },
    // disables cursor animation when active
    noCursorAnim: { type: Boolean, default: false }
  },
  data () {
    return {
      activeCursor: null,
      buttonPositions: [],
      buttonStyles: [],
      tmpValues: null,
      dividers: []
    }
  },
  computed: {
    computedValue () {
      const { value } = this
      return typeof value === 'number' ? [value] : this.value
    },
    minLog () {
      return Math.log(this.min || 1)
    },
    maxLog () {
      return Math.log(this.max)
    },
    scale () {
      const { minLog, maxLog, min, max } = this
      return (maxLog - minLog) / (max - min)
    },
    range () {
      const { min, max } = this
      return max - min
    },
    sizeValue () {
      const { size } = this
      return size < 8 ? 8 : size
    },
    buttonSize () {
      const size = this.sizeValue
      return {
        height: size * 2
      }
    },
    barStyle () {
      const { size, sizeValue } = this
      return {
        height: `${size}px`,
        fontSize: `${sizeValue}px`
      }
    },
    wrapperStyle () {
      const { labels, sizeValue, noCursorAnim } = this
      return {
        padding: `${sizeValue * 1.5}px ${sizeValue * (noCursorAnim ? 2 : 5.5) }px`,
        paddingTop: labels ? `${sizeValue * 4}px` : `${sizeValue * 1.5}px`
      }
    },
    hasMultipleValues () {
      return Array.isArray(this.value)
    }
  },
  watch: {
    value: {
      handler () {
        this.tmpValues = this.computedValue
      },
      immediate: true
    }
  },
  mounted () {
    this.buildComponent()

    window.addEventListener('resize', this.buildComponent)

    // watch multiples values
    this.$watch(vm => [vm.computedValue, vm.min, vm.max, vm.sizeValue, vm.log].join(), () => {
      this.buildComponent()
    })
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.buildComponent)
  },
  methods: {
    cursorKeyDown (e, i) {
      // ArrowLeft
      if (e.keyCode === 37) {
        e.preventDefault()
        if (isBetween(this.tmpValues[i] - 1, this.tmpValues[i - 1], this.tmpValues[i + 1], 'minus')) {
          this.tmpValues[i]--
          this.emitValue(this.tmpValues)
        }
      }
      // ArrowRight
      if (e.keyCode === 39) {
        e.preventDefault()
        if (isBetween(this.tmpValues[i] + 1, this.tmpValues[i - 1], this.tmpValues[i + 1], 'plus')) {
          this.tmpValues[i]++
          this.emitValue(this.tmpValues)
        }
      }
    },
    focusCursor (i) {
      this.activeCursor = i
      const { Cursor } = this.$refs
      // get width of text in cursor + padding/space
      console.log('Cursor', Cursor)
      Cursor[i].focus()
    },
    blurCursor (i) {
      this.activeCursor = null
      this.setBtnStyle(i)
    },
    async buildComponent () {
      await this.checkValues()
      await this.calcPos()
      await this.$nextTick()
      this.computedValue.forEach((b, i) => this.setBtnDividers(i))
    },
    async checkValues () {
      // check if values are not below the min or above the max
      const { min, max, computedValue } = this
      const valuesChecked = computedValue.map(v => v < min ? min : v > max ? max : v)
      this.emitValue(valuesChecked)
      this.tmpValues = valuesChecked
    },
    emitValue (values) {
      const { hasMultipleValues } = this
      let valueToEmit = hasMultipleValues ? values.slice() : values[0]
      this.$emit('input', valueToEmit)
    },
    getLabel (i) {
      const { labels } = this
      return labels ? labels[i] : null
    },
    setBtnDividers (i) {
      this.setBtnStyle(i)
      if (!this.noDivider) this.setDividers()
    },
    async setBtnStyle (i) {
      await this.$nextTick()
      const { height } = this.buttonSize
      const { buttonPositions, noCursorAnim } = this
      const { Cursor } = this.$refs
      // get width of text in cursor + padding/space
      const width = Cursor[i].querySelector('span').clientWidth + 16
      const isActive = i === this.activeCursor
      const btnStyle = {
        // 16 = space for arrows
        width: `${isActive && !noCursorAnim ? width + 16 : width}px`,
        height: `${height}px`,
        left: `${buttonPositions[i] - width / 2}px`
      }
      this.$set(this.buttonStyles, i, btnStyle)
    },
    setDividers () {
      const { buttonPositions } = this
      // remove getters/setters of vue
      const base = buttonPositions.slice()
      // add an item to generate one more divider
      base.push(0)
      const baseLength = base.length
      const middle = Math.round(baseLength / 2)
      // generate dividers items with style
      this.dividers = base.map((pos, i) => ({
        left: `${i === 0 ? 0 : buttonPositions[i - 1]}px`,
        right: `${
          i + 1 === baseLength
            ? 0
            : 'calc( 100% - ' + pos + 'px )'
        }`,
        backgroundColor: middle === i + 1
          ? null
          : i < middle
            // ligthen
            ? `rgba(255, 255, 255, ${getOpacityCoeff(i, middle, baseLength)})`
            // darken
            : `rgba(0, 0, 0, ${getOpacityCoeff(i, middle, baseLength)})`
      }))
    },
    async calcPos () {
      await this.$nextTick()
      const { MazSlider } = this.$refs
      const { tmpValues, min, scale, range, minLog, max, log } = this
      const barWidth = MazSlider.clientWidth
      this.buttonPositions = tmpValues.map(v => log
        ? ((barWidth / max) * (min + (Math.log(v) - minLog) / scale))
        : ((barWidth / range) * (v - min))
      )
    },
    async getCursorsValues () {
      await this.$nextTick()
      const { range, scale, buttonPositions, max, min, minLog, log } = this
      const barWidth = this.$refs.MazSlider.clientWidth
      return log ? buttonPositions.map(pos => {
        const position = pos / (barWidth / max)
        const value = Math.exp((position - min) * scale + minLog)
        return Math.round(value)
      }) : buttonPositions.map(pos => Math.round(pos / (barWidth / range)) + min)
    },
    handleMousedown (e, i) {
      e.preventDefault()
      if (this.activeCursor !== null) return

      this.activeCursor = i
      this.setBtnDividers(i)
    },
    async handleMouseup () {
      const { activeCursor, getCursorsValues } = this
      if (activeCursor === null) return

      const values = await getCursorsValues()

      // emit values of cursors
      // @arg array of numbers
      this.emitValue(values)

      this.activeCursor = null
      this.setBtnDividers(activeCursor)
    },
    async handleMousemove (e) {
      await this.$nextTick()
      const { activeCursor, buttonPositions, getCursorsValues } = this
      if (activeCursor === null) return

      this.tmpValues = await getCursorsValues()

      const barWidth = this.$refs.MazSlider.clientWidth
      const position = buttonPositions[activeCursor]
      const prevValue = buttonPositions[activeCursor - 1] || 0
      const nextValue = buttonPositions[activeCursor + 1] || barWidth

      buttonPositions[activeCursor] = (() => {
        const pos = position + e.movementX
        if (pos < prevValue) {
          return prevValue
        } else if (pos > nextValue) {
          return nextValue
        }
        return pos
      })()

      this.setBtnDividers(activeCursor)

      this.buttonPositions = buttonPositions
    }
  },
}
</script>
