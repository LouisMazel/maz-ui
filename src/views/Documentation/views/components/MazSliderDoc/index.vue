<template>
  <div class="maz-slider-doc">
    <ComponentContainer
      code="<template>
  <MazSlider
    v-model=&quot;slider&quot;
  />
  </div>
</template>

<script>
  export default {
    data () {
      return {
        slider: 50
      }
    }
  }
</script>"
    >
      <h3 class="maz-mb-3">
        Basic
      </h3>
      <hr class="maz-border-top maz-border-solid maz-border-color maz-my-5">
      <MazSlider
        v-model="slider"
      />
      <hr class="maz-border-top maz-border-solid maz-border-color maz-my-5">
      <strong>
        v-model:
      </strong>
      {{ slider }}
    </ComponentContainer>
    <ComponentContainer
      code="<template>
  <MazSlider
    v-model=&quot;multipleSilders&quot;
    :labels=&quot;multipleSildersLabels&quot;
  />
  </div>
</template>

<script>
  export default {
    data () {
      return {
        multipleSilders: [25, 50, 75],
        multipleSildersLabels: ['Small', 'Middle', 'Big']
      }
    }
  }
</script>"
    >
      <h3 class="maz-mb-3">
        Multiple values
      </h3>
      <h4>
        With labels & custom size (default: 8)
      </h4>
      <hr class="maz-border-top maz-border-solid maz-border-color maz-my-5">
      <h5>
        :size="4"
      </h5>
      <MazSlider
        v-model="multipleSilders"
        :labels="multipleSildersLabels"
        :size="4"
      />
      <hr class="maz-border-top maz-border-solid maz-border-color maz-my-5">
      <h5>
        :size="12"
      </h5>
      <MazSlider
        v-model="multipleSilders"
        :labels="multipleSildersLabels"
        :size="12"
      />
      <hr class="maz-border-top maz-border-solid maz-border-color maz-my-5">
      <strong>
        v-model:
      </strong>
      {{ multipleSilders }}
    </ComponentContainer>

    <ComponentContainer
      code="<template>
  <MazSlider
    v-model=&quot;logSilders&quot;
    logs
    :labels=&quot;logSildersLabels&quot;
    :min=&quot;50&quot;
    :max=&quot;50000&quot;
  />
  </div>
</template>

<script>
  export default {
    data () {
      return {
        logSilders: [50, 10000, 30000, 45000],
        logSildersLabels: ['Micro', 'Small', 'Middle', 'Big']
      }
    }
  }
</script>"
    >
      <h3 class="maz-mb-3">
        Logarithmic/exponential slider
      </h3>
      <h4>
        With min & max values (50, 50000)
      </h4>
      <hr class="maz-border-top maz-border-solid maz-border-color maz-my-5">
      <MazSlider
        v-model="logSilders"
        log
        :labels="logSildersLabels"
        :min="50"
        :max="50000"
      />
      <hr class="maz-border-top maz-border-solid maz-border-color maz-my-5">
      <strong>
        v-model:
      </strong>
      {{ logSilders }}
    </ComponentContainer>

    <ComponentContainer
      code="<template>
  <MazSlider
    v-model=&quot;multipleSilders&quot;
    no-divider
  />
  </div>
</template>

<script>
  export default {
    data () {
      return {
        multipleSilders: [25, 50, 75]
      }
    }
  }
</script>"
    >
      <h3 class="maz-mb-3">
        No divider: No differents colors between cursors
      </h3>
      <hr class="maz-border-top maz-border-solid maz-border-color maz-my-5">
      <MazSlider
        v-model="multipleSilders"
        no-divider
      />
      <hr class="maz-border-top maz-border-solid maz-border-color maz-my-5">
      <strong>
        v-model:
      </strong>
      {{ multipleSilders }}
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
  <MazSlider
    v-model=&quot;slider&quot;
  />
  </div>
</template>

<script>
  import { MazSlider } from 'maz-ui'
  export default {
    components: { MazSlider },
    data () {
      return {
        slider: 50
      }
    }
  }
</script>"
    />
  </div>
</template>

<script>
export default {
  name: 'MazSliderDoc',
  data () {
    return {
      slider: 50,
      multipleSilders: [25, 50, 75],
      multipleSildersLabels: ['Small', 'Middle', 'Big'],
      logSilders: [100, 1000, 10000, 40000],
      logSildersLabels: ['Micro', 'Small', 'Middle', 'Big']
    }
  }
}
</script>
