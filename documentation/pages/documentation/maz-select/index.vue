<template>
  <div class="maz-input-doc">
    <h4>
      Informations
    </h4>

    <p>
      This component uses <router-link :to="{name: 'documentation-maz-input'}">
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
      <p class="maz-mb-3">
        <strong>v-model:</strong> {{ selectValueExample }}
      </p>
      <MazSelect
        v-model="selectValueExample"
        placeholder="Custom label & placeholder text"
        :options="options"
        clearable
      />
    </ComponentContainer>

    <ComponentContainer
      code="<template>
  <MazSelect
    v-model=&quot;selectValue&quot;
    :options=&quot;options&quot;
    search
    search-placeholder=&quot;Search in options&quot;
  >
    <template
      v-slot=&quot;{ option }&quot;
    >
      <div
        v-if=&quot;option.value&quot;
        class=&quot;maz-flex maz-flex-start maz-text-color&quot;
        :class=&quot;{
          'maz-text-white': option.isSelected
        }&quot;
      >
        <div class=&quot;maz-label maz-label-secondary&quot;>
          {\{ option.label }\}
        </div>
        <span class=&quot;maz-ml-2&quot;>
          is selected: {\{ option.isSelected }\}
        </span>
      </div>
    </template>
  </MazSelect>
</template>"
    >
      <h5>
        Search - custom options list - position="top right"
      </h5>
      <p class="maz-mb-3 maz-text-muted">
        Select input with search textfield
      </p>
      <MazSelect
        v-model="selectValue"
        :options="options"
        search
        position="top right"
        search-placeholder="Search in options"
      >
        <template
          v-slot="{ option }"
        >
          <div
            v-if="option.value"
            class="maz-flex maz-flex-start maz-text-color"
            :class="{
              'maz-text-white': option.isSelected
            }"
          >
            <div class="maz-label maz-label-secondary">
              {{ option.label }}
            </div>
            <span class="maz-ml-2">
              is selected: {{ option.isSelected }}
            </span>
          </div>
        </template>
      </MazSelect>
    </ComponentContainer>
    <ComponentContainer
      code="<template>
  <MazSelect
    v-model=&quot;multipleValues&quot;
    :options=&quot;optionsMultiple&quot;
    multiple
    clearable
    search
    search-placeholder=&quot;Search in options&quot;
    size=&quot;lg&quot;
    color=&quot;info&quot;
  >
    <i
      slot=&quot;icon-left&quot;
      class=&quot;material-icons&quot;
    >
      add_circle_outline
    </i>
  </MazSelect>
</template>"
    >
      <h5>
        Multiple - custom left icon
      </h5>
      <p class="maz-mb-3 maz-text-muted">
        You can choose multiple values
      </p>
      <p class="maz-mb-3">
        <strong>v-model:</strong> {{ multipleValues }}
      </p>
      <MazSelect
        v-model="multipleValues"
        :options="optionsMultiple"
        multiple
        clearable
        search
        search-placeholder="Search in options"
        size="lg"
        color="info"
      >
        <i
          slot="icon-left"
          class="material-icons"
        >
          add_circle_outline
        </i>
      </MazSelect>
    </ComponentContainer>

    <ComponentContainer
      code="<template>
  <MazSelect
    v-model=&quot;selectValue&quot;
    :options=&quot;options&quot;
    size=&quot;sm&quot;
  />
  <MazSelect
    v-model=&quot;selectValue&quot;
    :options=&quot;options&quot;
  />
  <MazSelect
    v-model=&quot;selectValue&quot;
    :options=&quot;options&quot;
    size=&quot;lg&quot;
  />
</template>"
    >
      <h5 class="maz-mb-3">
        Basic
      </h5>
      <MazSelect
        v-model="selectValue"
        :options="options"
        size="sm"
        class="maz-mb-3"
      />
      <MazSelect
        v-model="selectValue"
        :options="options"
        class="maz-mb-3"
      />
      <MazSelect
        v-model="selectValue"
        :options="options"
        size="lg"
      />
    </ComponentContainer>

    <ComponentContainer>
      <h5 class="maz-mb-3">
        Colors
      </h5>

      <div class="maz-flex maz-flex-wrap">
        <MazSelect
          v-for="color in inputColors"
          :key="color"
          v-model="selectValue"
          :options="options"
          :placeholder="color"
          :color="color"
          class="maz-mb-2 maz-mr-2"
        />
      </div>


      <p>
        <strong>Colors list:</strong>
        {{ inputColors }}
      </p>
    </ComponentContainer>
    <ComponentContainer>
      <h5 class="maz-mb-3">
        Error
      </h5>
      <MazSelect
        v-model="selectValue"
        :options="options"
        error
      />
    </ComponentContainer>
    <ComponentContainer>
      <h5 class="maz-mb-3">
        Success
      </h5>
      <MazSelect
        v-model="selectValue"
        :options="options"
        success
      />
    </ComponentContainer>
    <ComponentContainer>
      <h5 class="maz-mb-3">
        Warning
      </h5>
      <MazSelect
        v-model="selectValue"
        :options="options"
        warning
      />
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
import { COLORS } from '@/constantes'

export default {
  name: 'MazInputDoc',
  data () {
    return {
      selectValue: null,
      selectValueExample: null,
      options: [
        { label: 'None', value: null },
        { label: 'First option', value: 'first' },
        { label: 'Second option', value: 'second' },
        { label: 'Third option', value: 'third' }
      ],
      multipleValues: ['first', 'fourth'],
      optionsMultiple: [
        { label: 'None', value: null },
        { label: 'First', value: 'first' },
        { label: 'Second', value: 'second' },
        { label: 'Third', value: 'third' },
        { label: 'Fourth', value: 'fourth' },
        { label: 'Fifth', value: 'fifth' }
      ],
      inputColors: COLORS
    }
  }
}
</script>