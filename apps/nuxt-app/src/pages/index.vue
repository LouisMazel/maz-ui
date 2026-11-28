<script lang="ts" setup>
// Start Developping Area - You should not commit anything here to keep this place clean for all others

const toast = useToast()

function showToast() {
  toast.message(`Bonjour <strong>le monde</strong> !`, {
    position: 'top-right',
    html: true,
    maxToasts: 2,
    queue: true,
  })
  toast.info('Bonjour le monde !', {
    position: 'bottom-right',
  })
  toast.warning('Bonjour le monde !', {
    position: 'bottom-left',
  })
  toast.error('Bonjour le monde !', {
    position: 'bottom',
  })
  toast.success('Bonjour le monde !', {
    position: 'top-left',
  })
  toast.message('Bonjour le monde !', {
    position: 'top',
    buttons: [
      {
        text: 'Clique ici',
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
        Afficher les toasts
      </MazBtn>

      <!-- End Developping Area -->
    </div>
  </div>
</template>
