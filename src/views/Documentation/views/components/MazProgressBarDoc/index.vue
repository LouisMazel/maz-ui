<template>
  <div class="maz-stepper-doc">
    <ComponentContainer
      code="<template>
  <MazProgressBar :percent=&quot;percent&quot; />
</template>"
    >
      <h3 class="maz-mb-3">
        Basic
      </h3>
      <MazProgressBar :percent="percent" />

      <p class="maz-mt-3">
        <strong>percent:</strong> {{ percent }}
      </p>

      <MazBtn
        class="maz-mt-3"
        @click="percent = Math.floor(Math.random() * 100)"
      >
        Update percent with random value
      </MazBtn>
    </ComponentContainer>

    <ComponentContainer
      code="<template>
  <MazProgressBar
    animated
    color=&quot;<BASIC_COLOR>&quot;
    :percent=&quot;percent&quot;
  />
  <MazProgressBar
    animated
    bg-color=&quot;<BASIC_COLOR>&quot;
    :percent=&quot;percent&quot;
  />
</template>"
    >
      <h3 class="maz-mb-3">
        Color (:height="10")
      </h3>
      <MazProgressBar
        v-for="color in colors"
        :key="`color-${color}`"
        :percent="percent"
        :color="color"
        :height="10"
        class="maz-mb-3"
      />
      <h3 class="maz-my-5">
        Bg-Color
      </h3>
      <MazProgressBar
        v-for="color in colors"
        :key="`bg-color-${color}`"
        :percent="percent"
        color="light"
        :bg-color="color"
        :height="10"
        class="maz-mb-3"
      />
    </ComponentContainer>

    <ComponentContainer
      code="<template>
  <MazProgressBar
    animated
    :height=&quot;10&quot;
    :percent=&quot;percent&quot;
  />
</template>"
    >
      <h3 class="maz-mb-3">
        Animated
      </h3>
      <MazProgressBar
        animated
        :height="10"
        :percent="percent"
        class="maz-mb-3"
      />
    </ComponentContainer>

    <ComponentContainer
      code="<template>
  <MazProgressBar
    no-radius
    :height=&quot;10&quot;
    :percent=&quot;percent&quot;
  />
</template>"
    >
      <h3 class="maz-mb-3">
        No-radius
      </h3>
      <MazProgressBar
        no-radius
        :height="10"
        :percent="percent"
        class="maz-mb-3"
      />
    </ComponentContainer>

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
  <MazProgressBar
    :percent=&quot;percent&quot;
  />
</template>

<script>
  import { MazProgressBar } from 'maz-ui'
  export default {
    components: { MazProgressBar },
    data () {
      return {
        percent: 33
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
      percent: 33
    }
  }
}
</script>
