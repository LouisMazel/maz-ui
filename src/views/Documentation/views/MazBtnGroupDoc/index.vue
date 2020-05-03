<template>
  <div class="maz-btn-doc">
    <ComponentContainer
      :code="codeExample"
      language="html"
      class="btn-container flex flex-start"
    >
      <h3 class="mb-3">
        Examples
      </h3>

      <h4 class="mb-3">
        LG primary
      </h4>
      <MazBtnGroup
        v-model="btnGroupValue"
        :items="items"
        size="lg"
      />
      <h4 class="mb-3">
        Secondary
      </h4>
      <MazBtnGroup
        v-model="btnGroupValueBoolean"
        :items="itemsBoolean"
        color="secondary"
      />
      <h4 class="mb-3">
        SM third outline
      </h4>
      <MazBtnGroup
        v-model="btnGroupValueBoolean"
        :items="itemsBoolean"
        outline
        size="md"
        color="third"
      />
      <h4 class="mb-3">
        SM third rounded
      </h4>
      <MazBtnGroup
        v-model="btnGroupValueString"
        :items="itemsString"
        rounded
        size="sm"
        color="third"
      />
      <h4 class="mb-3">
        MINI success rounded outline
      </h4>
      <MazBtnGroup
        v-model="btnGroupValueMini"
        :items="itemsMini"
        rounded
        outline
        size="mini"
        color="success"
      />

      <h4 class="mb-3">
        Disabled
      </h4>
      <MazBtnGroup
        v-model="btnGroupValue"
        :items="items"
        disabled
      />

      <p>Number value : {{ btnGroupValue }}</p>
      <p>Boolean value : {{ btnGroupValueBoolean }}</p>
      <p>String value : {{ btnGroupValueString || 'null' }}</p>
    </ComponentContainer>
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
  <h4 class="mb-3">
    LG primary
  </h4>
  <MazBtnGroup
    v-model="btnGroupValue"
    :items="items"
    size="lg"
  />
  <h4 class="mb-3">
    Secondary
  </h4>
  <MazBtnGroup
    v-model="btnGroupValueBoolean"
    :items="itemsBoolean"
    color="secondary"
  />
  <h4 class="mb-3">
    SM third outline
  </h4>
  <MazBtnGroup
    v-model="btnGroupValueBoolean"
    :items="itemsBoolean"
    outline
    size="md"
    color="third"
  />
  <h4 class="mb-3">
    SM third rounded
  </h4>
  <MazBtnGroup
    v-model="btnGroupValueString"
    :items="itemsString"
    rounded
    size="sm"
    color="third"
  />
  <h4 class="mb-3">
    MINI success rounded outline
  </h4>
  <MazBtnGroup
    v-model="btnGroupValueMini"
    :items="itemsMini"
    rounded
    outline
    size="mini"
    color="success"
  />

  <h4 class="mb-3">
    Disabled
  </h4>
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
