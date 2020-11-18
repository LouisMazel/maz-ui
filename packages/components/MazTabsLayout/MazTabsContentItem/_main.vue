<template>
  <transition
    :name="transitionName"
    tag="div"
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
      transitionName: null,
      currentTab: null
    }
  },
  computed: {
    itemStepNumber () {
      if (Number.isInteger(this.step)) return this.step - 1
      const currentUid = this._uid
      const index = this.$parent.$children.findIndex((c) => c._uid === currentUid)
      return index
    },
    isCurrentTab () {
      return this.currentTab === this.itemStepNumber
    }
  },
  watch: {
    '$parent.currentTab': {
      async handler (value, oldValue) {
        const newTabIsBigger = oldValue < value
        this.transitionName = newTabIsBigger ? 'maz-tab-transition' : 'maz-tab-reverse-transition'
        await this.$nextTick()
        this.currentTab = value
      },
      immediate: true
    }
  },
  created () {
    this.currentTab = this.$parent.currentTab
  }
}
</script>
