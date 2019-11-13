<template>
  <div class="maz-input-doc">
    <h2>
      {{ this.$route.name.substring(3).slice(0, -3) }}
    </h2>
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
