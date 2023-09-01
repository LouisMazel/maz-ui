<template>
  <div
    class="maz-base-component maz-pagination maz-flex maz-flex-center"
    :class="{ 'maz-is-dark': dark }"
  >
    <div class="maz-pagination__container maz-align-center maz-flex">
      <PaginationArrowBtn :dark="dark" @click="previous" />
      <template v-for="({ number, isActive, disabled, divider }, i) in pages">
        <PaginationDotsDivider
          v-if="divider"
          :key="`pagination-btn-${number}-${i}`"
        />
        <PaginationNumberBtn
          v-else
          :key="`pagination-btn-${number}-${i}`"
          :disabled="disabled"
          :active="isActive"
          @click="emitPageValue(number)"
        >
          {{ number }}
        </PaginationNumberBtn>
      </template>

      <PaginationArrowBtn :dark="dark" right @click="next" />
    </div>
  </div>
</template>

<script>
  import PaginationArrowBtn from './_subs/PaginationArrowBtn'
  import PaginationNumberBtn from './_subs/PaginationNumberBtn'
  import PaginationDotsDivider from './_subs/PaginationDotsDivider'

  const divider = [{ divider: true }]

  export default {
    name: 'MazPagination',
    components: {
      PaginationArrowBtn,
      PaginationNumberBtn,
      PaginationDotsDivider,
    },
    props: {
      value: { type: Number, required: true },
      pageCount: { type: Number, required: true },
      pageRange: { type: Number, default: 3 },
      dark: { type: Boolean, default: false },
    },
    computed: {
      currentPage: {
        get() {
          return this.value
        },
        set(n) {
          this.$emit('input', n)
        },
      },
      allPages() {
        const { pageCount, currentPage } = this
        return Array.from({ length: pageCount }, (x, i) => {
          const itemNumber = i + 1
          return {
            number: itemNumber,
            isActive: itemNumber === currentPage,
          }
        })
      },
      halfPageRange() {
        return Math.floor(this.pageRange / 2)
      },
      firstOne() {
        const { allPages, halfPageRange, currentPage } = this
        return currentPage - halfPageRange > 1 ? allPages.slice(0, 1) : []
      },
      lastOne() {
        const { allPages, halfPageRange, currentPage, pageCount } = this
        return currentPage < pageCount - halfPageRange ? allPages.slice(-1) : []
      },
      rangeStartAt() {
        const { currentPage, halfPageRange, pageRange, pageCount } = this
        return currentPage - halfPageRange - 1 < 0
          ? 0
          : currentPage - halfPageRange - 1 > pageCount - pageRange
          ? pageCount - pageRange
          : currentPage - halfPageRange - 1
      },
      rangeEndAt() {
        const { currentPage, halfPageRange, pageCount, pageRange } = this
        return currentPage + halfPageRange > pageCount
          ? pageCount
          : currentPage + halfPageRange < pageRange
          ? pageRange
          : currentPage + halfPageRange
      },
      range() {
        const { allPages, rangeStartAt, rangeEndAt } = this
        return allPages.slice(rangeStartAt, rangeEndAt)
      },
      firstDivider() {
        const { currentPage, halfPageRange } = this
        return currentPage - halfPageRange > 2 ? divider : []
      },
      lastDivider() {
        const { currentPage, halfPageRange, pageCount } = this
        return currentPage < pageCount - halfPageRange - 1 ? divider : []
      },
      pages() {
        const { firstOne, lastOne, range, firstDivider, lastDivider } = this
        return [
          ...firstOne,
          ...firstDivider,
          ...range,
          ...lastDivider,
          ...lastOne,
        ]
      },
    },
    methods: {
      emitPageValue(v) {
        this.$emit('input', v)
        this.$emit('page', v)
      },
      previous() {
        if (this.currentPage > 1) {
          this.emitPageValue(this.currentPage - 1)
        }
      },
      next() {
        if (this.currentPage < this.pageCount) {
          this.emitPageValue(this.currentPage + 1)
        }
      },
    },
  }
</script>
