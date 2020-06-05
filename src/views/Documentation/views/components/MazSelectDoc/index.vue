<template>
  <div class="maz-input-doc">
    <h3>
      Informations
    </h3>

    <p>
      This component uses <router-link :to="{name: 'MazInputDoc'}">
        MazInput
      </router-link> and therefore inherits all these options
    </p>

    <ComponentContainer
      code="<template>
  <MazSelect
    v-model=&quot;selectValueExample&quot;
    placeholder=&quot;Custom label/placeholder text&quot;
    :options=&quot;options&quot;
  />
</template>

<script>
  export default {
    data () {
      return {
        selectValueExample: '',
        options: [
          { label: 'None', value: null },
          { label: 'First option', value: 'first' },
          { label: 'Second option', value: 'second' },
          { label: 'Third option', value: 'third' }
        ]
      }
    }
  }
</script>"
    >
      <MazSelect
        v-model="selectValueExample"
        placeholder="Custom label & placeholder text"
        :options="options"
      />
    </ComponentContainer>
    <ComponentContainer
      code="<template>
  <MazSelect
    v-model=&quot;selectValue&quot;
    :options=&quot;options&quot;
    search
    search-placeholder=&quot;Search in options&quot;
  />
</template>"
    >
      <h4>
        Search & custom items list
      </h4>
      <p class="maz-mb-3 maz-text-muted">
        Select input with search textfield
      </p>
      <MazSelect
        v-model="selectValue"
        :options="options"
        search
        search-placeholder="Search in options"
      >
        <template
          v-slot="{ item }"
        >
          <div
            v-if="item.value"
            class="maz-flex maz-flex-start"
          >
            <div class="maz-label maz-label-secondary">
              {{ item.label }}
            </div>
          </div>
        </template>
      </MazSelect>
    </ComponentContainer>
    <ComponentContainer>
      <h4 class="maz-mb-3">
        Basic
      </h4>
      <MazSelect
        v-model="selectValue"
        :options="options"
      />
    </ComponentContainer>
    <ComponentContainer>
      <h4 class="maz-mb-3">
        Error
      </h4>
      <MazSelect
        v-model="selectValue"
        :options="options"
        error
      />
    </ComponentContainer>
    <ComponentContainer>
      <h4 class="maz-mb-3">
        Valid
      </h4>
      <MazSelect
        v-model="selectValue"
        :options="options"
        valid
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
  <MazSelect
    v-model=&quot;value&quot;
    :options=&quot;options&quot;
  />
</template>

<script>
  import { MazSelect } from 'maz-ui'
  export default {
    components: { MazSelect }
    data () {
      return {
        value: null,
        options: [
          { label: 'None', value: null },
          { label: 'First option', value: 'first' },
          { label: 'Second option', value: 'second' },
          { label: 'Third option', value: 'third' }
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
  name: 'MazInputDoc',
  data () {
    return {
      selectValue: '',
      selectValueExample: '',
      options: [
        { label: 'None', value: null },
        { label: 'First option', value: 'first' },
        { label: 'Second option', value: 'second' },
        { label: 'Third option', value: 'third' }
      ]
    }
  }
}
</script>
