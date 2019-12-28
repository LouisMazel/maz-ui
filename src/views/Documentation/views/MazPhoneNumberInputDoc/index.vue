<template>
  <div class="maz-input-doc">
    <ComponentContainer
      :code="codeExample"
    >
      <MazPhoneNumberInput
        v-model="phoneNumberExample"
      />
    </ComponentContainer>
    <div class="flex flex--wrap">
      <div class="flex-1 mr-4">
        <p class="mb-2">
          Basic
        </p>
        <ComponentContainer>
          <MazPhoneNumberInput
            v-model="phoneNumber"
          />
        </ComponentContainer>
      </div>
      <div class="flex-1">
        <p class="mb-2">
          Error
        </p>
        <ComponentContainer>
          <MazPhoneNumberInput
            v-model="phoneNumber"
            error
          />
        </ComponentContainer>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'MazInputDoc',
    data () {
      return {
        phoneNumber: '',
        phoneNumberExample: '',
        codeExample: `<template>
  <MazPhoneNumberInput
    v-model="phoneNumberExample"
  />
</template>

export default {
  data () {
    return {
      phoneNumberExample: ''
    }
  }
}`
      }
    }
  }
</script>
