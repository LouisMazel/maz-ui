<template>
  <div class="maz-input-doc">
    <ComponentContainer>
      <MazPhoneNumberInput
        v-model="phoneNumber"
      />
    </ComponentContainer>
  </div>
</template>

<script>
  export default {
    name: 'MazInputDoc',
    data () {
      return {
        phoneNumber: ''
      }
    }
  }
</script>
