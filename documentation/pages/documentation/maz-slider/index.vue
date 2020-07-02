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
      <h4 class="maz-mb-3">
        Basic
      </h4>
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
      <h4 class="maz-mb-3">
        Multiple values
      </h4>
      <h5>
        With labels
      </h5>
      <hr class="maz-border-top maz-border-solid maz-border-color maz-my-5">
      <MazSlider
        v-model="multipleSilders"
        :labels="multipleSildersLabels"
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
      <h4 class="maz-mb-3">
        Size & colors
      </h4>
      <h5>
        Default: color="primary" size="8"
      </h5>
      <hr class="maz-border-top maz-border-solid maz-border-color maz-my-5">
      <h5>
        Default
      </h5>
      <MazSlider
        v-model="multipleSilders"
        :labels="multipleSildersLabels"
      />
      <hr class="maz-border-top maz-border-solid maz-border-color maz-my-5">
      <h5>
        color="secondary"
        :size="2"
      </h5>
      <MazSlider
        v-model="multipleSilders"
        :labels="multipleSildersLabels"
        color="secondary"
        :size="2"
      />
      <hr class="maz-border-top maz-border-solid maz-border-color maz-my-5">
      <h5>
        color="third"
        :size="4"
      </h5>
      <MazSlider
        v-model="multipleSilders"
        :labels="multipleSildersLabels"
        color="third"
        :size="4"
      />
      <hr class="maz-border-top maz-border-solid maz-border-color maz-my-5">
      <h5>
        color="warning"
        :size="6"
      </h5>
      <MazSlider
        v-model="multipleSilders"
        :labels="multipleSildersLabels"
        color="warning"
        :size="6"
      />
      <hr class="maz-border-top maz-border-solid maz-border-color maz-my-5">
      <h5>
        color="danger"
        :size="10"
      </h5>
      <MazSlider
        v-model="multipleSilders"
        :labels="multipleSildersLabels"
        color="danger"
        :size="10"
      />
      <hr class="maz-border-top maz-border-solid maz-border-color maz-my-5">
      <h5>
        color="success"
        :size="12"
      </h5>
      <MazSlider
        v-model="multipleSilders"
        :labels="multipleSildersLabels"
        color="success"
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
      <h4 class="maz-mb-3">
        Logarithmic/exponential slider
      </h4>
      <h5>
        With min & max values (50, 50000)
      </h5>
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
      <h4 class="maz-mb-3">
        No-divider: No differents colors between cursors
      </h4>
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

    <h4>
      How to use it ?
    </h4>

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
