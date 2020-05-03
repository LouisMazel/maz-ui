<template>
  <div class="footer-picker p-2 flex justify-end border-top border-top-solid border-color">
    <MazBtn
      v-if="hasNow"
      size="md"
      tabindex="-1"
      class="footer-picker__now bg-transparent no-shadow px-3 hover-bg-color no-focus-bg border border-color text-primary"
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
