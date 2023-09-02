<template>
  <div
    class="maz-base-component maz-stepper maz-w-100 maz-flex"
    :class="[
      {
        'maz-is-dark': dark,
      },
      `maz-stepper--${color}`,
      `maz-space-${space}`,
    ]"
  >
    <MazBtn
      v-for="(step, i) in stepsNumber"
      :key="i"
      class="maz-stepper__step maz-flex maz-flex-center"
      :class="[
        {
          'is-active': step === value,
        },
        `maz-stepper__step--${variant}`,
      ]"
      :style="[stepStyle]"
      :no-shadow="!shadow"
      :color="color"
      :disabled="isDisabled(step, value) && step !== value"
      @click="disabled ? null : emitStep(step)"
    >
      <span v-if="showStepNumber" class="maz-stepper__step__number">{{
        step
      }}</span>
    </MazBtn>
  </div>
</template>

<script>
  import MazBtn from '../MazBtn'

  export default {
    name: 'MazStepper',
    components: { MazBtn },
    props: {
      // value of active step
      value: { type: Number, required: true },
      // steps number
      steps: { type: Number, default: 1 },
      // choose a color from list
      color: { type: String, default: 'primary' },
      // If is `true`, item number is shown
      showStepNumber: { type: Boolean, default: false },
      // flexbox space (`around`, `between`)
      space: { type: String, default: 'around' },
      // step size
      size: { type: Number, default: 10 },
      // step style (`dot`, `square`)
      variant: { type: String, default: 'dot' },
      // add shadow elevation to step buttons
      shadow: { type: Boolean, default: false },
      // disallow step click
      disabled: { type: Boolean, default: false },
      // disallow multiple steps click
      disabledSteps: { type: Array, default: Array },
      // disallow next steps from current step
      disabledNextSteps: { type: Boolean, default: false },
      // disallow previous steps from current step
      disabledPreviousSteps: { type: Boolean, default: false },
      // set dark mode
      dark: { type: Boolean, default: false },
    },
    computed: {
      stepsNumber() {
        const { steps } = this
        return Array.from({ length: steps }, (x, i) => i + 1)
      },
      stepStyle() {
        const { size } = this
        return {
          height: `${size}px`,
          width: `${size}px`,
          fontSize: `${size / 1.5}px`,
        }
      },
    },
    methods: {
      emitStep(step) {
        // return the step number clicked
        // @arg `Number`
        this.$emit('input', step)
      },
      isDisabled(step) {
        const {
          disabled,
          disabledSteps,
          disabledNextSteps,
          disabledPreviousSteps,
          value,
        } = this
        return (
          disabled ||
          disabledSteps.includes(step) ||
          (disabledNextSteps && value < step) ||
          (disabledPreviousSteps && value > step)
        )
      },
    },
  }
</script>
