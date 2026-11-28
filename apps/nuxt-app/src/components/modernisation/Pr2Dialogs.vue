<script lang="ts" setup>
const dialog = useDialog()

const clickPointOpen = ref(false)
const clickPointOrigin = ref<MouseEvent>()
const scrollableOpen = ref(false)
const plainFadeOpen = ref(false)
const confirmationResult = ref<string>()
const confirmResult = ref<string>()

function openFromClick(event: MouseEvent) {
  clickPointOrigin.value = event
  clickPointOpen.value = true
}

async function askWithEvent(event: MouseEvent) {
  const confirmed = await dialog.confirm({
    title: 'Archiver le rapport',
    message: 'L\'origine de ce dialogue est l\'événement de clic.',
    origin: event,
    identifier: 'pr2-confirm-event',
  })
  confirmResult.value = confirmed ? 'accepté' : 'refusé'
}

async function askWithConfirmation(event: MouseEvent) {
  const confirmed = await dialog.confirm({
    title: 'Supprimer le projet',
    message: 'Cette action est irréversible.',
    confirmation: 'my-project',
    acceptText: 'Supprimer',
    rejectText: 'Garder',
    origin: event,
    identifier: 'pr2-confirmation',
  })
  confirmationResult.value = confirmed ? 'supprimé' : 'gardé'
}
</script>

<template>
  <ModernisationSection
    id="pr2-dialogs"
    title="PR 2. Dialogues"
    description="Un dialogue sort de l'élément qui l'a ouvert et y retourne. Sur téléphone, il est centré et n'est plus collé en bas."
  >
    <ModernisationDemo title="MazDialog avec le slot trigger" hint="Le dialogue sort du bouton et y retourne. Change la position du bouton en faisant défiler : l'origine est lue à l'ouverture.">
      <div class="flex flex-wrap items-center gap-6">
        <MazDialog title="Depuis un bouton">
          <template #trigger="{ open }">
            <MazBtn @click="open">
              Ouvrir depuis ce bouton
            </MazBtn>
          </template>
          <p>Ce dialogue connaît son origine grâce au slot trigger.</p>
          <template #footer="{ close }">
            <MazBtn @click="close">
              Fermer
            </MazBtn>
          </template>
        </MazDialog>

        <div class="ms-auto">
          <MazDialog title="Depuis un bouton du côté de fin">
            <template #trigger="{ open, isOpen }">
              <MazBtn color="secondary" :aria-expanded="isOpen" @click="open">
                Ouvrir depuis le côté de fin
              </MazBtn>
            </template>
            <p>Il grandit depuis l'autre côté de la ligne (inversé en RTL).</p>
          </MazDialog>
        </div>
      </div>
    </ModernisationDemo>

    <ModernisationDemo title="Depuis un point de clic" hint="origin est l'événement de clic : le dialogue grandit depuis le point exact où tu as cliqué, n'importe où dans la zone ci-dessous.">
      <div
        class="flex h-48 cursor-pointer items-center justify-center rounded-xl border border-dashed border-divider text-muted"
        role="button"
        tabindex="0"
        @click="openFromClick"
        @keydown.enter="openFromClick($event as unknown as MouseEvent)"
      >
        Clique n'importe où dans cette zone
      </div>
      <MazDialog v-model="clickPointOpen" :origin="clickPointOrigin" title="Depuis le point de clic">
        <p>Il retourne au même point quand il se ferme.</p>
      </MazDialog>
    </ModernisationDemo>

    <ModernisationDemo title="useDialog().confirm avec l'événement" hint="dialog.confirm({ origin: event }) donne le même mouvement depuis un script. Sans origin, le dernier élément pressé est utilisé.">
      <div class="flex flex-wrap items-center gap-3">
        <MazBtn @click="askWithEvent">
          Confirmer avec l'événement de clic
        </MazBtn>
        <MazBtn
          color="secondary"
          @click="dialog.confirm({ title: 'Pas d\'origine explicite', message: 'Grandit depuis le dernier élément pressé.', identifier: 'pr2-confirm-auto' })"
        >
          Confirmer sans origine
        </MazBtn>
        <span v-if="confirmResult" class="text-muted">Résultat : {{ confirmResult }}</span>
      </div>
    </ModernisationDemo>

    <ModernisationDemo title="Confirmation renforcée" hint="Le bouton d'acceptation reste désactivé tant que le texte n'est pas saisi. Entrée dans le champ valide.">
      <div class="flex flex-wrap items-center gap-3">
        <MazBtn color="destructive" @click="askWithConfirmation">
          Supprimer le projet
        </MazBtn>
        <span v-if="confirmationResult" class="text-muted">Résultat : {{ confirmationResult }}</span>
      </div>
    </ModernisationDemo>

    <ModernisationDemo title="Dialogues imbriqués" hint="Échap et le piège à focus n'agissent que sur le dialogue du dessus. Chacun retourne dans son propre déclencheur.">
      <MazDialog title="Premier dialogue">
        <template #trigger="{ open }">
          <MazBtn @click="open">
            Ouvrir le premier dialogue
          </MazBtn>
        </template>
        <p class="mb-4">
          Le second s'ouvre depuis le bouton ci-dessous.
        </p>
        <MazDialog title="Second dialogue">
          <template #trigger="{ open }">
            <MazBtn color="secondary" @click="open">
              Ouvrir le second dialogue
            </MazBtn>
          </template>
          <p>Appuie sur Échap : seul celui-ci se ferme.</p>
        </MazDialog>
      </MazDialog>
    </ModernisationDemo>

    <ModernisationDemo title="Dialogue avec défilement" hint="L'en-tête et le pied restent en place, le contenu défile (tactile compris, touch-action n'est plus bloqué).">
      <MazBtn @click="scrollableOpen = true">
        Ouvrir un dialogue avec défilement
      </MazBtn>
      <MazDialog v-model="scrollableOpen" title="Contenu long" scrollable>
        <p v-for="i in 30" :key="i" class="pb-6">
          Paragraphe {{ i }}
        </p>
        <template #footer="{ close }">
          <MazBtn @click="close">
            Terminé
          </MazBtn>
        </template>
      </MazDialog>
    </ModernisationDemo>

    <ModernisationDemo title="Sur téléphone : nouveau défaut et align=&quot;end&quot;" hint="Vraies fenêtres de 375px (deux iframes). Gauche : centré avec des marges (nouveau défaut). Droite : align=&quot;end&quot;, l'ancien rendu. Pour une vraie bottom sheet, utilise MazBottomSheet.">
      <div class="flex flex-wrap justify-center gap-8">
        <figure class="flex flex-col items-center gap-2">
          <iframe
            title="Dialogue sur mobile, par défaut"
            src="/modernisation-dialog-phone"
            loading="lazy"
            class="h-[640px] w-[375px] rounded-3xl border border-divider bg-surface"
          />
          <figcaption class="text-body-sm text-muted">
            défaut (centré)
          </figcaption>
        </figure>
        <figure class="flex flex-col items-center gap-2">
          <iframe
            title="Dialogue sur mobile, align end"
            src="/modernisation-dialog-phone?align=end"
            loading="lazy"
            class="h-[640px] w-[375px] rounded-3xl border border-divider bg-surface"
          />
          <figcaption class="text-body-sm text-muted">
            align="end"
          </figcaption>
        </figure>
      </div>
    </ModernisationDemo>

    <ModernisationDemo title="Animations réduites et animated" hint="Gauche : suit l'option d'animations réduites de la barre d'outils (grandit depuis le bouton, ou un court fondu). Droite : animated=false, toujours un simple fondu.">
      <div class="flex flex-wrap items-center gap-3">
        <MazDialog title="Suit les animations réduites">
          <template #trigger="{ open }">
            <MazBtn @click="open">
              Grandit (ou fondu si réduit)
            </MazBtn>
          </template>
          <p>Active les animations réduites dans la barre d'outils et rouvre-le.</p>
        </MazDialog>
        <MazBtn color="secondary" @click="plainFadeOpen = true">
          animated=false
        </MazBtn>
        <MazDialog v-model="plainFadeOpen" :animated="false" title="Simple fondu">
          <p>Aucun mouvement, seulement le fondu.</p>
        </MazDialog>
      </div>
    </ModernisationDemo>
  </ModernisationSection>
</template>
