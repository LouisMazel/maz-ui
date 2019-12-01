<template>
  <div class="maz-input-doc flex flex-wrap">
    <div class="flex-1 mr-4">
      <h3>Light</h3>
      <ComponentContainer>
        <MazPhoneNumberInput
          v-model="phoneNumber"
        />
      </ComponentContainer>
      <ComponentContainer>
        <p class="mb-2">
          Error
        </p>
        <MazPhoneNumberInput
          v-model="phoneNumber"
          error
        />
      </ComponentContainer>
    </div>
    <div class="flex-1">
      <h4>Dark</h4>
      <ComponentContainer dark>
        <MazPhoneNumberInput
          v-model="phoneNumber"
          dark
        />
      </ComponentContainer>
      <ComponentContainer dark>
        <p class="mb-2">
          Error
        </p>
        <MazPhoneNumberInput
          v-model="phoneNumber"
          error
          dark
        />
      </ComponentContainer>
    </div>
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
