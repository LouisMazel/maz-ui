<template>
  <div
    class="header-picker p-2"
  >
    <p class="header-picker__year">
      {{ year }}
    </p>
    <p class="header-picker__date">
      {{ dateFormatted | capitalize }}
    </p>
  </div>
</template>

<script>
  export default {
    name: 'HeaderPicker',
    props: {
      dateMoment: { type: Object, required: true }
    },
    computed: {
      year () {
        return this.dateMoment.year()
      },
      dateFormatted () {
        return this.dateMoment.format('ddd D MMM')
      }
    }
  }
</script>

<style lang="scss" scoped>
  .header-picker {
    background-color: $primary-color;
    color: white;

    &__year {
      opacity: .7;
    }

    &__date {
      font-size: 1.285em;
    }
  }
</style>
