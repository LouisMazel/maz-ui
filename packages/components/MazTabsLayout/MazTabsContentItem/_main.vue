<template>
  <transition
    tag="div"
    :name="transitionName"
  >
    <div
      v-show="isCurrentTab"
      ref="MazTabsContentItem"
      class="maz-base-component maz-tabs-content-item"
    >
      <slot />
    </div>
  </transition>
</template>

<script>
export default {
  name: 'MazTabsContentItem',
  props: {
    step: { type: Number, default: null }
  },
  data () {
    return {
      itemStepNumber: this.step ? this.step - 1 : null,
      tmpCurrentTab: null,
      currentTab: null,
      newTabIsBigger: false
    }
  },
  computed: {
    parentCurrentTab () {
      return this.$parent.currentTab
    },
    isCurrentTab () {
      return this.currentTab === this.itemStepNumber
    },
    transitionName () {
      const { newTabIsBigger } = this
      const condition = newTabIsBigger
      return condition ? 'maz-tab-transition' : 'maz-tab-reverse-transition'
    }
  },
  watch: {
    parentCurrentTab: {
      handler (value) {
        this.newTabIsBigger = this.currentTab < value
        this.currentTab = value
      },
      immediate: true
    }
  },
  created () {
    this.currentTab = this.$parent.currentTab

    if (Number.isInteger(this.step)) return
    const currentUid = this._uid
    const index = this.$parent.$children.findIndex((c) => c._uid === currentUid)
    this.itemStepNumber = index
  }
}
</script>
