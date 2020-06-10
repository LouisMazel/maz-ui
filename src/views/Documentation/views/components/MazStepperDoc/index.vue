<template>
  <div class="maz-stepper-doc">
    <div class="maz-flex maz-flex-wrap">
      <div class="maz-flex-1 maz-mr-4">
        <ComponentContainer
          code="<template>
  <MazStepper
    v-model=&quot;activeStep&quot;
    :steps=&quot;5&quot;
  />
</template>

<script>
  export default {
    data () {
      return {
        activeStep: 3
      }
    }
  }
</script>"
        >
          <h4>
            Basic
          </h4>
          <hr class="maz-border-top maz-border-solid maz-border-color maz-mt-3 maz-mb-5">
          <MazStepper
            v-model="activeStep"
            :steps="5"
          />
        </ComponentContainer>
        <ComponentContainer
          code="<template>
  <MazStepper
    v-model=&quot;activeStep&quot;
    :steps=&quot;5&quot;
    :size=&quot;20&quot;
    show-step-number
    shadow
  />
</template>

<script>
  export default {
    data () {
      return {
        activeStep: 3
      }
    }
  }
</script>"
        >
          <h4>
            Multiple options
          </h4>
          <h5 class="maz-text-muted">
            size="20" - show-step-number - shadow - variant="square"
          </h5>
          <hr class="maz-border-top maz-border-solid maz-border-color maz-mt-3 maz-mb-5">
          <MazStepper
            v-model="activeStep"
            :steps="5"
            :size="20"
            variant="square"
            show-step-number
            shadow
          />
        </ComponentContainer>
        <ComponentContainer
          code="<template>
  <MazStepper
    v-model=&quot;activeStep&quot;
    :steps=&quot;5&quot;
    disabled
    space=&quot;between&quot;
  />
</template>

<script>
  export default {
    data () {
      return {
        activeStep: 3
      }
    }
  }
</script>"
        >
          <h4>
            Disabled click on steps buttons - space="between"
          </h4>
          <hr class="maz-border-top maz-border-solid maz-border-color maz-mt-3 maz-mb-5">
          <MazStepper
            v-model="activeStep"
            :steps="5"
            disabled
            space="between"
          />
        </ComponentContainer>
      </div>
      <div class="maz-flex-1">
        <ComponentContainer>
          <h4>
            Colors
          </h4>
          <hr class="maz-border-top maz-border-solid maz-border-color maz-mt-3 maz-mb-5">
          <div
            v-for="color in colors"
            :key="`stepper-${color}`"
          >
            <p class="maz-mb-3">
              color="{{ color }}"
            </p>
            <MazStepper
              v-model="activeStep"
              :steps="5"
              :color="color"
              class="maz-mb-3"
            />
          </div>
        </ComponentContainer>
      </div>
    </div>

    <hr
      id="howToUseIt"
      class="maz-border-top maz-border-solid maz-border-color maz-my-5"
    >

    <h3>
      How to use it ?
    </h3>

    <CodeContainer
      language="html"
      code="<template>
  <MazStepper
    v-model=&quot;activeStep&quot;
    :steps=&quot;4&quot;
  />
</template>

<script>
  import { MazStepper } from 'maz-ui'
  export default {
    components: { MazStepper },
    data () {
      return {
        activeStep: 2
      }
    }
  }
</script>"
    />
  </div>
</template>

<script>
import { COLORS } from '@/constantes'

export default {
  name: 'MazStepperDoc',
  data () {
    return {
      colors: COLORS,
      activeStep: 3
    }
  }
}
</script>
