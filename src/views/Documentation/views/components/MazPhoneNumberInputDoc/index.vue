<template>
  <div class="maz-phone-number-doc">
    <h3>
      Informations
    </h3>

    <p>
      This component uses <router-link :to="{name: 'MazInputDoc'}">
        MazInput
      </router-link> and therefore inherits all these options
    </p>

    <hr class="maz-border-top maz-border-solid maz-border-color maz-my-5">

    <h3>
      Features list
    </h3>

    <ul>
      <li>
        You can set <strong>preferred-countries</strong>, <strong>ignored-countries</strong> or have <strong>only-countries</strong>
      </li>
      <li>
        Validation UI state: input becomes green ($success-color) when the phone number is valid (can be disabled by <strong>no-validation</strong> attr)
      </li>
      <li>
        Multi options to getting country code : By default the component get the country code via the browser (disable it with no-use-browser-locale)
        or you can use fetch-country to get the country code via https://ip2c.org/s (network needed) - you can use default-country-code option instead to set one
      </li>
      <li>
        Phone number formatting while typing
      </li>
      <li>
        You can search your country in list (open countries list & type your country name)
      </li>
      <li>
        Keyboard accessibility (Arrow down, Arrow up: Countries list navigation - Escape: Close countries list)
      </li>
      <li>
        Phone number example for each country in placeholder/label
      </li>
      <li>
        Auto focus phone number input after selecting country
      </li>
      <li>
        You can disable the flags - no-flags props
      </li>
      <li>
        Set your translations
      </li>
    </ul>

    <hr class="maz-border-top maz-border-solid maz-border-color maz-my-5">

    <h3>
      Translations
    </h3>

    <p>
      You can translate the component with the <strong>translations</strong> attribute option like this:
    </p>

    <CodeContainer
      language="javascript"
      code=":translations=&quot;{
  countrySelectorLabel: 'Code pays',
  countrySelectorError: 'Choisir un pays',
  phoneNumberLabel: 'Numéro de téléphone',
  example: 'Exemple :'
}&quot;"
    />

    <hr class="maz-border-top maz-border-solid maz-border-color maz-my-5">

    <h3>
      Keyboard accessibility
    </h3>
    <table class="maz-md">
      <tr>
        <th>
          Entries
        </th>
        <th>
          Actions
        </th>
      </tr>
      <tr>
        <td>
          ArrowDown
        </td>
        <td>
          Navigation down in countries list
        </td>
      </tr>
      <tr>
        <td>
          ArrowUp
        </td>
        <td>
          Navigation up in countries list
        </td>
      </tr>
      <tr>
        <td>
          Escape
        </td>
        <td>
          Close countries list
        </td>
      </tr>
      <tr>
        <td>
          All letters characters
        </td>
        <td>
          Searching country name in countries list (should be open)
        </td>
      </tr>
    </table>

    <hr class="maz-border-top maz-border-solid maz-border-color maz-my-5">

    <h3>
      Examples
    </h3>

    <div class="examples">
      <ComponentContainer :code="codeExample">
        <h3>
          Basic
        </h3>

        <hr class="maz-border-top maz-border-solid maz-border-color maz-my-3">

        <MazPhoneNumberInput
          v-model="phoneNumber"
          @update="results = getJson($event)"
        />

        <hr class="maz-border-top maz-border-solid maz-border-color maz-my-3">

        <p>
          <strong>Value:</strong> {{ phoneNumber || 'null' }}
        </p>

        <br>

        <strong>Results sent on @update event:</strong>
        <CodeContainer
          :code="results || 'null'"
          language="json"
        />
      </ComponentContainer>
      <ComponentContainer
        :code="example2"
      >
        <h3 class="maz-mb-2">
          Advanced settings
        </h3>
        <h4>
          With default value & preferred countries & default country code & no flags & show code on list
        </h4>

        <hr class="maz-border-top maz-border-solid maz-border-color maz-my-3">

        <MazPhoneNumberInput
          v-model="phoneNumberExample"
          no-flags
          show-code-on-list
          :preferred-countries="['FR', 'BE', 'DE']"
          @update="resultsExample = getJson($event)"
        />
        <!-- no-use-browser-locale -->

        <hr class="maz-border-top maz-border-solid maz-border-color maz-my-3">

        <p>
          <strong>Value:</strong> {{ phoneNumberExample || 'null' }}
        </p>

        <br>

        <strong>Results sent on @update event:</strong>
        <CodeContainer
          :code="resultsExample || 'null'"
          language="json"
        />
      </ComponentContainer>
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
  <MazPhoneNumberInput
    v-model=&quot;phoneNumber&quot;
  />
</template>

<script>
  import { MazPhoneNumberInput } from 'maz-ui'
  export default {
    components: { MazPhoneNumberInput }
    data () {
      return {
        phoneNumber: null
      }
    }
  }
</script>"
    />
  </div>
</template>

<script>
export default {
  name: 'MazPhoneNumberInputDoc',
  data () {
    return {
      phoneNumber: null,
      results: null,
      phoneNumberExample: '+33365656565',
      resultsExample: null,
      codeExample: `<template>
  <p>
    <strong>Value:</strong> {{ phoneNumber || 'null' }}
  </p>
  <p>
    <strong>Results:</strong> {{ results || 'null' }}
  </p>
  <MazPhoneNumberInput
    v-model="phoneNumber"
    @update="results = JSON.stringify($event)"
  />
</template>

export default {
  data () {
    return {
      phoneNumber: '',
      results: null
    }
  }
}`,
      example2: `<template>
  <p>
    <strong>Value:</strong> {{ phoneNumberExample || 'null' }}
  </p>
  <p>
    <strong>Results:</strong> {{ resultsExample || 'null' }}
  </p>
  <MazPhoneNumberInput
    v-model="phoneNumberExample"
    no-flags
    default-country-code="FR"
    show-code-on-list
    :preferred-countries="['FR', 'BE', 'DE']"
    @update="resultsExample = getJson($event)"
  />
</template>

export default {
  data () {
    return {
      phoneNumberExample: '0665656565',
      resultsExample: null
    }
  }
}`
    }
  },
  methods: {
    getJson (e) {
      return JSON.stringify(e).replace(/,/g, ',\n').replace(/{/g, '{\n').replace(/}/g, '\n}')
    }
  }
}
</script>

<style lang="scss" scoped>
  .maz-phone-number-doc {
    .examples {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      grid-gap: 20px;
      align-items: start;

      @media screen and (max-width: $breakpoint-laptop-s) {
        grid-template-columns: repeat(1, 1fr);
      }
    }
  }
</style>