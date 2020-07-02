<template>
  <div class="maz-btn-doc">
    <h4>
      Examples
    </h4>
    <ComponentContainer
      :code="codeExample"
      language="html"
      class="btn-container"
    >
      <div class="flex flex-start direction-column">
        <h5 class="maz-mb-3">
          LG primary
        </h5>
        <MazBtnGroup
          v-model="btnGroupValue"
          :items="items"
          size="lg"
        />
        <h5 class="maz-mb-3">
          Secondary
        </h5>
        <MazBtnGroup
          v-model="btnGroupValueBoolean"
          :items="itemsBoolean"
          color="secondary"
        />
        <h5 class="maz-mb-3">
          SM third outline
        </h5>
        <MazBtnGroup
          v-model="btnGroupValueBoolean"
          :items="itemsBoolean"
          outline
          size="md"
          color="third"
        />
        <h5 class="maz-mb-3">
          SM third rounded
        </h5>
        <MazBtnGroup
          v-model="btnGroupValueString"
          :items="itemsString"
          rounded
          size="sm"
          color="third"
        />
        <h5 class="maz-mb-3">
          MINI success rounded outline
        </h5>
        <MazBtnGroup
          v-model="btnGroupValueMini"
          :items="itemsMini"
          rounded
          outline
          size="mini"
          color="success"
        />

        <h5 class="maz-mb-3">
          Disabled
        </h5>
        <MazBtnGroup
          v-model="btnGroupValue"
          :items="items"
          disabled
        />

        <p>Number value : {{ btnGroupValue }}</p>
        <p>Boolean value : {{ btnGroupValueBoolean }}</p>
        <p>String value : {{ btnGroupValueString || 'null' }}</p>
      </div>
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
      class="maz-mb-0"
      code="<template>
  <MazBtnGroup
    v-model=&quot;btnGroupValue&quot;
    :items=&quot;items&quot;
  />
</template>

<script>
  import { MazBtnGroup } from 'maz-ui'
  export default {
    components: { MazBtnGroup },
    data () {
      return {
        btnGroupValue: null,
        items: [
          { label: 'Number 1', value: 1 },
          { label: 'Number 2', value: 2 },
          { label: 'Number 3', value: 3 }
        ]
      }
    }
  }
</script>"
    />
  </div>
</template>

<script>
export default {
  name: 'MazBtnGroupDoc',
  data () {
    return {
      btnGroupValue: 1,
      btnGroupValueBoolean: false,
      btnGroupValueString: null,
      btnGroupValueMini: null,
      items: [
        { label: 'Number 1', value: 1 },
        { label: 'Number 2', value: 2 },
        { label: 'Number 3', value: 3 }
      ],
      itemsBoolean: [
        { label: 'Boolean true', value: true },
        { label: 'Boolean false', value: false }
      ],
      itemsString: [
        { label: 'String foo', value: 'foo' },
        { label: 'String bar', value: 'bar' },
        { label: 'String toto', value: 'toto' },
        { label: 'String tata', value: 'tata' }
      ],
      itemsMini: [
        { label: 'Mini foo', value: 'foo' },
        { label: 'Mini bar', value: 'bar' },
        { label: 'Mini toto', value: 'toto' },
        { label: 'Mini tata', value: 'tata' }
      ],
      codeExample: `<template>
  <h5 class="maz-mb-3">
    LG primary
  </h5>
  <MazBtnGroup
    v-model="btnGroupValue"
    :items="items"
    size="lg"
  />
  <h5 class="maz-mb-3">
    Secondary
  </h5>
  <MazBtnGroup
    v-model="btnGroupValueBoolean"
    :items="itemsBoolean"
    color="secondary"
  />
  <h5 class="maz-mb-3">
    SM third outline
  </h5>
  <MazBtnGroup
    v-model="btnGroupValueBoolean"
    :items="itemsBoolean"
    outline
    size="md"
    color="third"
  />
  <h5 class="maz-mb-3">
    SM third rounded
  </h5>
  <MazBtnGroup
    v-model="btnGroupValueString"
    :items="itemsString"
    rounded
    size="sm"
    color="third"
  />
  <h5 class="maz-mb-3">
    MINI success rounded outline
  </h5>
  <MazBtnGroup
    v-model="btnGroupValueMini"
    :items="itemsMini"
    rounded
    outline
    size="mini"
    color="success"
  />

  <h5 class="maz-mb-3">
    Disabled
  </h5>
  <MazBtnGroup
    v-model="btnGroupValue"
    :items="items"
    disabled
  />
</template>

export default {
  data () {
    return {
      btnGroupValue: 1,
      btnGroupValueBoolean: false,
      btnGroupValueString: null,
      btnGroupValueMini: null,
      items: [
        { label: 'Number 1', value: 1 },
        { label: 'Number 2', value: 2 },
        { label: 'Number 3', value: 3 }
      ],
      itemsBoolean: [
        { label: 'Boolean true', value: true },
        { label: 'Boolean false', value: false }
      ],
      itemsString: [
        { label: 'String foo', value: 'foo' },
        { label: 'String bar', value: 'bar' },
        { label: 'String toto', value: 'toto' },
        { label: 'String tata', value: 'tata' }
      ],
      itemsMini: [
        { label: 'Mini foo', value: 'foo' },
        { label: 'Mini bar', value: 'bar' },
        { label: 'Mini toto', value: 'toto' },
        { label: 'Mini tata', value: 'tata' }
      ]
    }
  }
}`
    }
  }
}
</script>

<style lang="scss" scoped>
  .btn-container {
    .maz-btn-group {
      margin-bottom: 20px;
    }
  }
</style>
