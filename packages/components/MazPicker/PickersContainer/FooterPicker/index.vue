<template>
  <div class="footer-picker maz-p-2 maz-flex maz-justify-end maz-border-top maz-border-top-solid maz-border-color">
    <MazBtn
      v-if="hasNow"
      size="md"
      tabindex="-1"
      class="footer-picker__now maz-bg-transparent maz-no-shadow maz-px-3 maz-hover-bg-color maz-no-focus-bg maz-border maz-border-color maz-text-primary"
      @click="now"
    >
      {{ nowTranslation }}
    </MazBtn>
    <MazBtn
      v-if="hasValidate"
      outline
      size="md"
      tabindex="-1"
      color="success"
      class="footer-picker__validate"
      @click="validate"
    >
      <i class="material-icons">
        check
      </i>
    </MazBtn>
  </div>
</template>

<script>
import { EventBus } from './../../utils'

export default {
  name: 'FooterPicker',
  props: {
    hasValidate: { type: Boolean, required: true },
    hasNow: { type: Boolean, required: true },
    nowTranslation: { type: String, required: true }
  },
  methods: {
    validate (e) {
      EventBus.$emit('validate', e)
    },
    now (e) {
      EventBus.$emit('now', e)
    }
  }
}
</script>
