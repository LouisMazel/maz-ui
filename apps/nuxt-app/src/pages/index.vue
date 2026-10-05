<script lang="ts" setup>
// Start Developping Area - You should not commit anything here to keep this place clean for all others

const toast = useToast()

function showToast() {
  toast.message(`Hello, <strong>world</strong>!`, {
    position: 'top-right',
    html: true,
    maxToasts: 2,
    queue: true,
  })
  toast.info('Hello, world!', {
    position: 'bottom-right',
  })
  toast.warning('Hello, world!', {
    position: 'bottom-left',
  })
  toast.error('Hello, world!', {
    position: 'bottom',
  })
  toast.success('Hello, world!', {
    position: 'top-left',
  })
  toast.message('Hello, world!', {
    position: 'top',
    buttons: [
      {
        text: 'Click me',
        color: 'warning',
      },
    ],
  })
}

// End Developping Area
</script>

<template>
  <div class="home maz:p-8">
    <div class="maz:flex maz:flex-col maz:gap-10">
      <!-- Start Developping Area - You should not commit anything here to keep this place clean for all others -->

      <MazBtn @click="showToast">
        Show toast
      </MazBtn>

      <!-- End Developping Area -->
    </div>
  </div>
</template>
