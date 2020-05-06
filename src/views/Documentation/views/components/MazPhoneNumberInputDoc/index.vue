<template>
  <div class="maz-input-doc">
    <ComponentContainer :code="codeExample">
      <MazPhoneNumberInput v-model="phoneNumberExample" />
    </ComponentContainer>
    <div class="maz-flex maz-flex-wrap">
      <div class="maz-flex-1 maz-mr-4">
        <p class="maz-mb-2">
          Basic
        </p>
        <ComponentContainer>
          <MazPhoneNumberInput v-model="phoneNumber" />
        </ComponentContainer>
      </div>
      <div class="maz-flex-1">
        <p class="maz-mb-2">
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
