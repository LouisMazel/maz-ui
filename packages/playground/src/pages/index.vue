<template>
  <MazTabs class="home">
    <h1>Home</h1>

    <!-- Start Developping Area - You should not commit anything here to keep this place clean for all others -->

    <!-- End Developping Area -->
  </MazTabs>
</template>

<script lang="ts" setup>
  const toast = useToast()

  toast.info('Votre mot de passe a été mis à jour', {
    position: 'top-left',
  })
  toast.success('Votre mot de passe a été mis à jour', {
    position: 'top-right',
  })
  toast.error('Votre mot de passe a été mis à jour', {
    position: 'bottom-right',
  })
  toast.warning('Votre mot de passe a été mis à jour', {
    position: 'bottom-left',
  })
  toast.info('Votre mot de passe a été mis à jour', {
    position: 'top',
  })
  toast.error('Votre mot de passe a été mis à jour', {
    position: 'bottom',
  })
</script>
