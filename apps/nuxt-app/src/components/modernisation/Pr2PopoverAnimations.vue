<script lang="ts" setup>
const tooltips = ['Modifier', 'Copier', 'Partager']
</script>

<template>
  <ModernisationSection
    id="pr2-popover-animations"
    title="PR 2. Les deux animations des popovers"
    description="scale-pop (par défaut) jaillit de son déclencheur avec un ressort et y est aspiré à la fermeture. scale-fade est plus sobre : un fondu et une légère croissance."
  >
    <ModernisationDemo title="scale-pop, par défaut" hint="Tooltips et menus. Clique pour ouvrir, clique ailleurs pour voir l'aspiration.">
      <div class="flex flex-wrap gap-3">
        <MazPopover position="bottom">
          <template #trigger>
            <MazBtn color="neutral">
              Ouvrir en bas
            </MazBtn>
          </template>
          <p class="p-3">
            Je jaillis de mon bouton.
          </p>
        </MazPopover>
        <MazPopover position="right">
          <template #trigger>
            <MazBtn color="neutral">
              Ouvrir à droite
            </MazBtn>
          </template>
          <p class="p-3">
            Et je retourne dedans.
          </p>
        </MazPopover>
        <MazBtn v-for="label in tooltips" :key="label" v-tooltip="label" color="neutral" variant="outline">
          {{ label }}
        </MazBtn>
      </div>
    </ModernisationDemo>

    <ModernisationDemo title="scale-fade, sobre" hint="Selects, autocomplete et date picker. transition=&quot;scale-fade&quot; sur MazPopover.">
      <div class="flex flex-wrap gap-3">
        <MazPopover position="bottom" transition="scale-fade">
          <template #trigger>
            <MazBtn color="neutral">
              Ouvrir en bas
            </MazBtn>
          </template>
          <p class="p-3">
            Un fondu discret.
          </p>
        </MazPopover>
        <MazPopover position="right" transition="scale-fade">
          <template #trigger>
            <MazBtn color="neutral">
              Ouvrir à droite
            </MazBtn>
          </template>
          <p class="p-3">
            Quelques pixels depuis le bouton.
          </p>
        </MazPopover>
      </div>
    </ModernisationDemo>

    <ModernisationDemo title="Sous la barre collante" hint="collisionPadding: { top: 88 } dans les défauts de l'app : ouvre un popover puis fais défiler, il se cache quand son bouton passe sous la barre au lieu de la recouvrir.">
      <MazPopover position="top">
        <template #trigger>
          <MazBtn color="neutral">
            Ouvrir puis faire défiler
          </MazBtn>
        </template>
        <p class="p-3">
          Je ne passe pas sur la barre.
        </p>
      </MazPopover>
    </ModernisationDemo>
  </ModernisationSection>
</template>
