<template>
  <div class="maz-picker-doc">
    <p class="fw-700 mb-3">
      This component is based on <a
        target="_blank"
        href="https://momentjs.com/"
      >MomentJS</a>
    </p>

    <br>
    <p class="mb-3">
      You can use any locale available in moment package
    </p>

    <p class="fw-700 mb-3">
      This component is based on
      <a
        target="_blank"
        href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat"
      >
        native Intl.DateTimeFormat
      </a>
    </p>

    <p>
      The locale of the picker is automatically set with the browser locale
    </p>

    <p>
      You can use any locale supported by Intl.DateTimeFormat.
      Check
      <a
        target="_blank"
        href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/supportedLocalesOf"
      >
        here
      </a>
    </p>

    <br>
    <div class="flex flex-1 ">
      <MazBtnGroup
        v-model="locale"
        :items="locales"
      />
    </div>

    <hr class="border-top-2 border-solid border-color my-3">

    <p class="fw-700 mb-3">
      Top or bottom position of pickers is calculate
    </p>

    <p class="mb-3">
      You can set the position with "position" props attribute :
    </p>

    <CodeContainer
      language="html"
      :code="positionCodeExample"
    />

    <hr class="border-top-2 border-solid border-color my-3">

    <div class="examples my-3">
      <ComponentContainer
        :code="codeExample"
      >
        <h4 class="mb-3">
          Basic
        </h4>

        <p>
          Value : {{ pickerValue || 'null' }}
        </p>
        <p class="mb-2">
          Formatted value : {{ pickerFormatted || 'null' }}
        </p>

        <MazPicker
          v-model="pickerValue"
          :locale="locale"
          @formatted="pickerFormatted = $event"
        />
      </ComponentContainer>

      <ComponentContainer
        :code="clearableExample"
      >
        <h4 class="mb-3">
          Clearable - size="sm" - formatted="ll"
        </h4>

        <p>
          Value : {{ pickerValue2 || 'null' }}
        </p>
        <p class="mb-2">
          Formatted value : {{ pickerFormatted2 || 'null' }}
        </p>

        <MazPicker
          v-model="pickerValue2"
          clearable
          size="sm"
          formatted="ll"
          :locale="locale"
          @formatted="pickerFormatted2 = $event"
        />
      </ComponentContainer>

      <ComponentContainer
        :code="doubleExample"
      >
        <h4 class="mb-3">
          double - size="lg" - format="DD-MM-YYYY" - label="Select date in big calander"
        </h4>

        <p>
          Value : {{ pickerValue3 || 'null' }}
        </p>
        <p class="mb-2">
          Formatted value : {{ pickerFormatted3 || 'null' }}
        </p>

        <MazPicker
          v-model="pickerValue3"
          label="Select date in big calendar"
          format="DD-MM-YYYY"
          clearable
          size="lg"
          double
          :locale="locale"
          @formatted="pickerFormatted3 = $event"
        />
      </ComponentContainer>

      <ComponentContainer
        :code="rangeExample"
      >
        <h4 class="mb-3">
          Range
        </h4>

        <p>
          Value : {{ pickerRangeValues || 'null' }}
        </p>
        <p class="mb-2">
          Formatted value : {{ pickerRangeValuesFormatted || 'null' }}
        </p>

        <MazPicker
          v-model="pickerRangeValues"
          label="Select period"
          range
          open
          :locale="locale"
          @formatted="pickerRangeValuesFormatted = $event"
        />
      </ComponentContainer>

      <ComponentContainer
        :code="inlineExample"
      >
        <h4 class="mb-3">
          Inline - Double
        </h4>

        <p>
          Value : {{ pickerValue4 || 'null' }}
        </p>
        <p class="mb-2">
          Formatted value : {{ pickerFormatted4 || 'null' }}
        </p>

        <MazPicker
          v-model="pickerValue4"
          inline
          double
          :locale="locale"
          @formatted="pickerFormatted4 = $event"
        />
      </ComponentContainer>
    </div>
  </div>
</template>

<script>
  const getDefaultLocale = () => {
    if (typeof window === 'undefined') return null

    const { userLanguage, language } = window.navigator
    const locale = (userLanguage || language || 'en').substr(0, 2)
    return locale
  }

  export default {
    name: 'MazPickerDoc',
    data () {
      return {
        locale: getDefaultLocale(),
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
    label="Select date in big calendar"
    format="DD-MM-YYYY"
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
        pickerValue4: null,
        pickerFormatted4: null,
        inlineExample: `<template>
  <MazPicker
    v-model="pickerValue3"
    inline
    double
    @formatted="pickerFormatted3 = $event"
  />
</template>

export default {
  data () {
    return {
      pickerFormatted3: null,
      pickerValue4: null
    }
  }
}`,
        pickerRangeValues: null,
        pickerRangeValuesFormatted: null,
        rangeExample: `<template>
  <MazPicker
    v-model="pickerValue3"
    range
    @formatted="pickerFormatted3 = $event"
  />
</template>

export default {
  data () {
    return {
      pickerFormatted3: null,
      pickerValue4: null
    }
  }
}`,
        positionCodeExample: `<MazPicker
  v-model="pickerValue"
  position="top right"
  @formatted="pickerFormatted = $event"
/>`
      }
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
