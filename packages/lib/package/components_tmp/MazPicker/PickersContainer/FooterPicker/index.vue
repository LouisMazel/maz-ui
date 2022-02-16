<template>
  <div
    class="footer-picker maz-border-top maz-border-top-solid maz-flex maz-justify-end maz-border-color maz-p-2"
  >
    <MazBtn
      v-if="hasNow"
      size="mini"
      tabindex="-1"
      :color="color"
      class="footer-picker__now maz-no-shadow maz-hover-bg-color maz-no-focus-bg maz-border maz-border-color maz-bg-transparent maz-px-3"
      @click="now"
    >
      {{ nowTranslation }}
    </MazBtn>
    <MazBtn
      v-if="hasValidate"
      outline
      size="mini"
      tabindex="-1"
      :disabled="!currentValue"
      color="success"
      class="footer-picker__validate"
      @click="validate"
    >
      <i class="material-icons"> check </i>
    </MazBtn>
  </div>
</template>

<script>
  import { EventBus } from './../../utils'
  import MazBtn from '../../../MazBtn'

  export default {
    name: 'FooterPicker',
    components: { MazBtn },
    props: {
      value: { type: Object, default: null },
      hasValidate: { type: Boolean, required: true },
      hasNow: { type: Boolean, required: true },
      nowTranslation: { type: String, required: true },
      color: { type: String, required: true },
    },
    computed: {
      isRangeMode() {
        return !!this.value && Object.keys(this.value).includes('start')
      },
      currentValue() {
        if (this.isRangeMode) {
          return this.value.end
        }
        return this.value
      },
    },
    methods: {
      validate(e) {
        EventBus.$emit('validate', e)
      },
      now(e) {
        EventBus.$emit('now', e)
      },
    },
  }
</script>
