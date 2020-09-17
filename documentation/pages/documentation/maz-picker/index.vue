<template>
  <div class="maz-picker-doc">
    <h4>
      Informations
    </h4>

    <p>
      This component uses <router-link :to="{name: 'documentation-maz-input'}">
        MazInput
      </router-link> and therefore inherits all these options
    </p>

    <hr class="maz-border-top maz-border-solid maz-border-color maz-my-3" />

    <p class="maz-fw-700 maz-mb-3">
      This component is based on
      <a
        target="_blank"
        href="https://momentjs.com/"
      >MomentJS</a>
    </p>

    <p class="maz-mb-3">
      You can use any locale available in moment package.
    </p>

    <div class="maz-flex maz-flex-1">
      <MazBtnGroup
        v-model="locale"
        :items="locales"
      />
    </div>

    <hr class="maz-border-top maz-border-solid maz-border-color maz-my-3" />

    <p class="maz-fw-700 maz-mb-3">
      Top or bottom position of pickers is calculate
    </p>

    <p class="maz-mb-3">
      But you can set the position with "position" props attribute :
    </p>

    <CodeContainer
      language="html"
      code="<MazPicker
  v-model=&quot;pickerValue&quot;
  position=&quot;top right&quot;
  @formatted=&quot;pickerFormatted = $event&quot;
/>"
    />

    <hr class="maz-border-top maz-border-solid maz-border-color maz-my-3" />

    <div class="examples maz-my-3">
      <ComponentContainer :code="codeExample">
        <h5>Date Time Picker</h5>
        <h6 class="maz-mb-3">
          Basic
        </h6>

        <p class="maz-mb-3">
          <strong>Options:</strong>
          none
        </p>

        <p>
          <strong>Value</strong>
          : {{ pickerValue || 'null' }}
        </p>
        <p class="maz-mb-2">
          <strong>Formatted value</strong>
          : {{ pickerFormatted || 'null' }}
        </p>

        <MazPicker
          v-model="pickerValue"
          :locale="locale"
          color="third"
          open
          @formatted="pickerFormatted = $event"
        />
      </ComponentContainer>

      <ComponentContainer :code="clearableExample">
        <h5>Date Picker</h5>
        <h6 class="maz-mb-3">
          Small input size clearable with input value formatted
        </h6>

        <p class="maz-mb-3">
          <strong>Options:</strong>
          no-time - clearable - size="sm" - formatted="ll" - placeholder="Select
          date" - color="secondary"
        </p>

        <p>
          <strong>Value</strong>
          : {{ pickerValue2 || 'null' }}
        </p>
        <p class="maz-mb-2">
          <strong>Formatted value</strong>
          : {{ pickerFormatted2 || 'null' }}
        </p>

        <MazPicker
          v-model="pickerValue2"
          clearable
          placeholder="Select date"
          size="sm"
          no-time
          color="secondary"
          formatted="ll"
          :locale="locale"
          @formatted="pickerFormatted2 = $event"
        />
      </ComponentContainer>

      <ComponentContainer :code="doubleExample">
        <h5>Double Date Picker</h5>
        <h6 class="maz-mb-3">
          Large input size - french format - custom placeholder
        </h6>

        <p class="maz-mb-3">
          <strong>Options:</strong>
          double - size="lg" - format="DD-MM-YYYY" - placeholder="Select date in
          big calander" - no-time
        </p>

        <p>
          <strong>Value</strong>
          : {{ pickerValue3 || 'null' }}
        </p>
        <p class="maz-mb-2">
          <strong>Formatted value</strong>
          : {{ pickerFormatted3 || 'null' }}
        </p>

        <MazPicker
          v-model="pickerValue3"
          placeholder="Select date in big calendar"
          format="DD-MM-YYYY"
          formatted="LL"
          no-time
          size="lg"
          double
          :locale="locale"
          @formatted="pickerFormatted3 = $event"
        />
      </ComponentContainer>

      <ComponentContainer :code="rangeExample">
        <h5>Range Double Date Picker</h5>
        <h6 class="maz-mb-3">
          Position forced
        </h6>

        <p class="maz-mb-3">
          <strong>Options:</strong>
          range - double - position="top right" - placeholder="Select period" - color="third"
        </p>

        <p>
          <strong>Value</strong>
          : {{ pickerRangeValues || 'null' }}
        </p>
        <p class="maz-mb-2">
          <strong>Formatted value</strong>
          :
          {{ pickerRangeValuesFormatted || 'null' }}
        </p>

        <MazPicker
          v-model="pickerRangeValues"
          placeholder="Select period"
          color="third"
          range
          double
          formatted="ll"
          position="top right"
          :locale="locale"
          @formatted="pickerRangeValuesFormatted = $event"
        >
          <i
            slot="icon-left"
            class="material-icons"
          >
            date_range
          </i>
        </MazPicker>
      </ComponentContainer>

      <ComponentContainer :code="inlineExample">
        <h5>Inline Double Date Time Picker</h5>
        <h6 class="maz-mb-3">
          Min & max dates provided & without time picker
        </h6>

        <p class="maz-mb-3">
          <strong>Options:</strong>
          inline - min-date="2020-05-05" - max-date="2020-06-22" - no-time
        </p>

        <p>
          <strong>Value</strong>
          : {{ pickerValue4 || 'null' }}
        </p>
        <p class="maz-mb-2">
          <strong>Formatted value</strong>
          : {{ pickerFormatted4 || 'null' }}
        </p>

        <MazPicker
          v-model="pickerValue4"
          inline
          no-time
          double
          min-date="2020-05-05"
          max-date="2020-06-22"
          :locale="locale"
          @formatted="pickerFormatted4 = $event"
        />
      </ComponentContainer>

      <ComponentContainer :code="inlineExample">
        <h5>Time Picker</h5>
        <h6 class="maz-mb-3">
          Min & max dates provided & without time picker
        </h6>

        <p class="maz-mb-3">
          <strong>Options:</strong>
          no-date - placeholder="Select time"
        </p>

        <p>
          <strong>Value</strong>
          : {{ pickerValue5 || 'null' }}
        </p>
        <p class="maz-mb-2">
          <strong>Formatted value</strong>
          : {{ pickerFormatted5 || 'null' }}
        </p>

        <MazPicker
          v-model="pickerValue5"
          placeholder="Select time"
          no-date
          :locale="locale"
        />
      </ComponentContainer>

      <ComponentContainer :code="rangeShortcutsExample">
        <h5>Range Double Date Picker</h5>
        <h6 class="maz-mb-3">
          Custom shortcuts
        </h6>

        <p class="maz-mb-3">
          <strong>Options:</strong>
          range - double - placeholder="Select period" - custom-shortcuts
        </p>

        <p>
          <strong>Value</strong>
          : {{ pickerRangeValues || 'null' }}
        </p>
        <p class="maz-mb-2">
          <strong>Formatted value</strong>
          :
          {{ pickerRangeValuesFormatted || 'null' }}
        </p>

        <MazPicker
          v-model="pickerRangeValues"
          placeholder="Select period"
          range
          double
          formatted="ll"
          :locale="locale"
          :shortcuts="customShortcuts"
          @formatted="pickerRangeValuesFormatted = $event"
        />
      </ComponentContainer>

      <ComponentContainer :code="inlineExample">
        <h5 class="maz-mb-3">
          Disabled
        </h5>

        <p>Value : {{ pickerValue4 || 'null' }}</p>
        <p class="maz-mb-2">
          Formatted value : {{ pickerFormatted4 || 'null' }}
        </p>

        <MazPicker
          v-model="pickerValue4"
          disabled
          :locale="locale"
        />
      </ComponentContainer>
    </div>

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
  <MazPicker
    v-model=&quot;pickerValue&quot;
  />
</template>

<script>
  import { MazPicker } from 'maz-ui'
  export default {
    components: { MazPicker },
    data () {
      return {
        pickerValue: null
      }
    }
  }
</script>"
    />
  </div>
</template>

<script>
import moment from 'moment'

const getDefaultLocale = () => {
  if (typeof window === 'undefined') return null

  const { userLanguage, language } = window.navigator
  const locale = (userLanguage || language || 'en').substr(0, 2)
  return locale
}

const CUSTOM_SHORTCUTS = [
  { key: 'lastMonth', label: 'Last month', value: '-month' },
  { key: 'lastQuarter', label: 'Last quarter', value: 'quarter' },
  {
    key: 'lastSemester',
    label: 'Last semester',
    value: () => ({
      start: moment().subtract(6, 'months'),
      end: moment()
    })
  },
  { key: 'lastYear', label: 'Last year', value: '-year' },
  {
    key: 'origin',
    label: 'Since origin',
    value: () => ({
      start: moment().subtract(5, 'years'),
      end: moment()
    }),
    callback: ({ start, end, shortcut }) => {
      console.log('payload', start, end, shortcut)
    }
  }
]

export default {
  name: 'MazPickerDoc',
  data () {
    return {
      locale: 'en',
      locales: [
        { label: 'English', value: 'en' },
        { label: 'French', value: 'fr' },
        { label: 'Italian', value: 'it' },
        { label: 'Spanish', value: 'es' },
        { label: 'Russian', value: 'ru' }
      ],
      pickerValue: null,
      pickerFormatted: null,
      codeExample: `<template>
  <MazPicker
    v-model="pickerValue"
    @formatted="pickerFormatted = $event"
  />
</template>

export default {
  data () {
    return {
      pickerValue: null,
      pickerFormatted: null
    }
  }
}`,
      pickerValue2: '2020-02-03',
      pickerFormatted2: null,
      clearableExample: `<template>
  <MazPicker
    v-model="pickerValue2"
    clearable
    size="sm"
    placeholder="Select date"
    formatted="ll"
    @formatted="pickerFormatted2 = $event"
  />
</template>

export default {
  data () {
    return {
      pickerValue2: '2020-02-03',
      pickerFormatted2: null
    }
  }
}`,
      pickerValue3: '03-02-2020',
      pickerFormatted3: null,
      doubleExample: `<template>
  <MazPicker
    v-model="pickerValue3"
    placeholder="Select date in big calendar"
    format="DD-MM-YYYY"
    formatted="LL"
    clearable
    size="lg"
    double
    @formatted="pickerFormatted3 = $event"
  />
</template>

export default {
  data () {
    return {
      pickerFormatted2: null,
      pickerValue3: '03-02-2020'
    }
  }
}`,
      pickerValue4: '2020-05-15',
      pickerFormatted4: null,
      inlineExample: `<template>
  <MazPicker
    v-model="pickerValue4"
    inline
    no-time
    double
    min-date="2020-05-05"
    max-date="2020-06-22"
    @formatted="pickerFormatted4 = $event"
  />
</template>

export default {
  data () {
    return {
      pickerValue4: null,
      pickerFormatted4: null
    }
  }
}`,
      pickerValue5: null,
      pickerFormatted5: null,
      timeExample: `<template>
  <MazPicker
    v-model="pickerValue4"
    no-time
    @formatted="pickerFormatted4 = $event"
  />
</template>

export default {
  data () {
    return {
      pickerValue4: null,
      pickerFormatted4: null
    }
  }
}`,
      pickerRangeValues: null,
      pickerRangeValuesFormatted: null,
      rangeExample: `<template>
  <MazPicker
    v-model="pickerRangeValues"
    placeholder="Select period"
    range
    double
    position="bottom right"
    :locale="locale"
    @formatted="pickerRangeValuesFormatted = $event"
  >
    <i
      slot="icon-left"
      class="material-icons"
    >
      date_range
    </i>
  </MazPicker>
</template>

export default {
  data () {
    return {
      pickerRangeValues: null,
      pickerRangeValuesFormatted: null
    }
  }
}`,
      customShortcuts: CUSTOM_SHORTCUTS,
      rangeShortcutsExample: `<template>
  <MazPicker
    v-model="pickerRangeValues"
    placeholder="Select period"
    range
    double
    shortcuts="customShortcuts"
    :locale="locale"
    @formatted="pickerRangeValuesFormatted = $event"
  />
</template>

export default {
  data () {
    return {
      pickerRangeValues: null,
      pickerRangeValuesFormatted: null,
      customShortcuts: [
        { key: 'lastMonth', label: 'Last month', value: '-month' },
        { key: 'lastQuarter', label: 'Last quarter', value: 'quarter' },
        {
          key: 'lastSemester',
          label: 'Last semester',
          value: () => ({
            start: moment().subtract(6, 'months'),
            end: moment()
          })
        },
        { key: 'lastYear', label: 'Last year', value: '-year' },
        {
          key: 'origin',
          label: 'Since origin',
          value: () => ({
            start: moment().subtract(5, 'years'),
            end: moment()
          }),
          callback: ({ start, end, shortcuts }) => {
            console.log('payload', start, end, shortcuts)
          }
        }
      ]
    }
  }
}`
    }
  },
  mounted () {
    this.locale = getDefaultLocale()
  }
}
</script>

<style lang="scss" scoped>
  .maz-picker-doc {
    .examples {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      grid-gap: 20px;
      align-items: start;

      @media screen and (max-width: $breakpoint-laptop-s) {
        grid-template-columns: repeat(1, 1fr);
      }

      > div {
        margin: 0;
      }
    }
  }
</style>
