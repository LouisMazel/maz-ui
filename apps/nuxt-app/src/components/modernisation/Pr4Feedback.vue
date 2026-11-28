<script lang="ts" setup>
const saveState = ref<'idle' | 'loading' | 'success'>('idle')

function save() {
  saveState.value = 'loading'
  setTimeout(() => {
    saveState.value = 'success'
  }, 1200)
  setTimeout(() => {
    saveState.value = 'idle'
  }, 3200)
}

const holdCount = ref(0)

const alertOpen = ref(true)

const badgeCount = ref(9)
const tags = ref(['Vue', 'Nuxt', 'Vite', 'Tailwind', 'Pinia'])

function resetTags() {
  tags.value = ['Vue', 'Nuxt', 'Vite', 'Tailwind', 'Pinia']
}

const progress = ref(35)
const percent = ref(50)

const spinnerDone = ref(false)

const barLoading = ref(false)

const skeletonLoaded = ref(false)

const showLoader = ref(false)

const LOADER_DURATION = 3

const loaderSeconds = ref(LOADER_DURATION)
let loaderTimer: ReturnType<typeof setInterval> | undefined

function closeLoader() {
  clearInterval(loaderTimer)
  showLoader.value = false
}

function openLoader() {
  loaderSeconds.value = LOADER_DURATION
  showLoader.value = true
  clearInterval(loaderTimer)
  loaderTimer = setInterval(() => {
    loaderSeconds.value--
    if (loaderSeconds.value <= 0)
      closeLoader()
  }, 1000)
}

onBeforeUnmount(() => clearInterval(loaderTimer))

const imageKey = ref(0)

function reloadImages() {
  imageKey.value++
}

const scrollTarget = ref<HTMLElement>()
</script>

<template>
  <ModernisationSection
    id="pr4-feedback"
    title="PR 4. Retours d'état"
    description="Boutons, alertes, badges, progressions, chargements et squelettes : un retour de pression, des coches qui se dessinent, des chiffres qui roulent et des états qui se replient au lieu de disparaître."
  >
    <ModernisationDemo title="MazBtn : pression, succès et maintien" hint="Appuie sur un bouton : il s'enfonce un peu. Enregistrer enchaîne chargement puis succès : la coche se dessine à la place du loader et le libellé roule sans changer la largeur. Le bouton Maintenir pour supprimer se remplit tant que tu le tiens (souris, Espace ou Entrée) et se vide si tu relâches trop tôt.">
      <div class="flex flex-wrap items-center gap-4">
        <MazBtn
          text="Enregistrer"
          success-text="Enregistré"
          loading-position="start"
          :loading="saveState === 'loading'"
          :success="saveState === 'success'"
          @click="save"
        />
        <MazBtn
          text="Chargement"
          loading
          loading-position="start"
          color="secondary"
        />
        <MazBtn
          hold
          color="destructive"
          text="Maintenir pour supprimer"
          @hold-confirm="holdCount++"
        />
        <span class="text-muted">Suppressions confirmées : {{ holdCount }}</span>
      </div>
    </ModernisationDemo>

    <ModernisationDemo title="MazBtnClipboard et MazBtnScroll" hint="Copier : l'icône se transforme en coche. Avec roll-label, le texte roule aussi vers « Copié » sans bouger le bouton. Dans la zone qui défile, fais défiler vers le bas : le bouton de retour en haut apparaît en bas à droite et reste en place. Au clic, sa flèche décolle et la zone remonte.">
      <div class="flex flex-wrap items-center gap-4">
        <MazBtnClipboard value="usr_8f3a21c9" />
        <MazBtnClipboard value="usr_8f3a21c9" roll-label copy-label="Copier" copied-label="Copié" />
        <MazBtnClipboard value="npm i maz-ui" prompt="$" variant="solid" color="primary" />
      </div>
      <div class="relative mt-4 rounded-lg border border-divider">
        <div ref="scrollTarget" class="h-40 overflow-y-auto p-3">
          <p v-for="line in 30" :key="line" class="m-0 py-1 text-muted">
            Ligne {{ line }}
          </p>
        </div>
        <MazBtnScroll :target="scrollTarget" :threshold="80" position="bottom-end" offset="1rem" size="sm" />
      </div>
    </ModernisationDemo>

    <ModernisationDemo title="MazAlert" hint="L'icône de la couleur se dessine à l'apparition. Avec dismissible, la croix de la première alerte la replie (hauteur et opacité) au lieu de la faire disparaître d'un coup. Le bouton « Afficher l'alerte » la déplie à nouveau.">
      <div class="flex flex-col gap-3">
        <MazAlert
          v-model:open="alertOpen"
          dismissible
          color="success"
          title="Modifications enregistrées"
          content="Ton profil est à jour."
        />
        <MazAlert color="warning" title="Attention" content="Cette action est irréversible." />
        <MazAlert color="destructive" title="Erreur" content="Le paiement a échoué." />
        <MazBtn v-if="!alertOpen" size="sm" class="self-start" @click="alertOpen = true">
          Afficher l'alerte
        </MazBtn>
      </div>
    </ModernisationDemo>

    <ModernisationDemo title="MazBadge" hint="Avec animated, le nombre roule quand il change : seuls les chiffres qui changent bougent. Dans une liste, un badge retiré se replie et les autres glissent à sa place (TransitionGroup maz-list).">
      <div class="flex flex-wrap items-center gap-4">
        <MazBtn size="sm" @click="badgeCount--">
          -
        </MazBtn>
        <MazBadge animated size="lg">
          {{ badgeCount }}
        </MazBadge>
        <MazBtn size="sm" @click="badgeCount += 10">
          +10
        </MazBtn>
      </div>
      <div class="mt-4 flex items-start gap-4">
        <TransitionGroup name="maz-list" tag="div" class="relative flex flex-wrap gap-2">
          <MazBadge
            v-for="tag in tags"
            :key="tag"
            removable
            @remove="tags = tags.filter(item => item !== tag)"
          >
            {{ tag }}
          </MazBadge>
        </TransitionGroup>
        <MazBtn size="sm" variant="outline" @click="resetTags">
          Réinitialiser
        </MazBtn>
      </div>
    </ModernisationDemo>

    <ModernisationDemo title="MazProgressBar et MazCircularProgressBar" hint="Le pourcentage roule (show-value), une coche se dessine à 100 % (check). Le mode indéterminé fait glisser un segment, ou tourner un arc, quand la progression est inconnue.">
      <div class="flex flex-col gap-4">
        <MazProgressBar :value="progress" show-value check label="Envoi" />
        <MazProgressBar indeterminate label="Chargement" color="secondary" />
        <div class="flex gap-2">
          <MazBtn size="sm" @click="progress = Math.max(0, progress - 20)">
            -20
          </MazBtn>
          <MazBtn size="sm" @click="progress = Math.min(100, progress + 20)">
            +20
          </MazBtn>
        </div>
        <div class="flex flex-wrap items-center gap-6">
          <MazCircularProgressBar :percentage="percent" roll check suffix="%" size="6em" />
          <MazCircularProgressBar :percentage="0" indeterminate size="4em" color="secondary" />
          <div class="flex gap-2">
            <MazBtn size="sm" @click="percent = Math.max(0, percent - 25)">
              -25
            </MazBtn>
            <MazBtn size="sm" @click="percent = Math.min(100, percent + 25)">
              +25
            </MazBtn>
          </div>
        </div>
      </div>
    </ModernisationDemo>

    <ModernisationDemo title="MazSpinner" hint="Quatre variantes : anneau (par défaut), points, barres et disque qui respire. Avec done, une coche se dessine à la place du spinner.">
      <div class="flex flex-wrap items-center gap-6">
        <MazSpinner variant="ring" />
        <MazSpinner variant="dots" />
        <MazSpinner variant="bars" />
        <MazSpinner variant="pulse" />
        <MazSpinner color="success" size="3em" :done="spinnerDone" />
        <MazBtn size="sm" @click="spinnerDone = !spinnerDone">
          {{ spinnerDone ? 'Relancer' : 'Terminer' }}
        </MazBtn>
      </div>
    </ModernisationDemo>

    <ModernisationDemo title="MazLoadingBar" hint="Avec loading, la barre avance par paliers qui ralentissent sans jamais finir. Quand loading passe à faux, elle court jusqu'au bout puis sort par la fin. Sans loading, elle glisse en boucle comme avant.">
      <div class="flex flex-col gap-3">
        <MazLoadingBar :loading="barLoading" height="4px" />
        <MazLoadingBar height="4px" color="secondary" />
        <MazBtn size="sm" class="self-start" @click="barLoading = !barLoading">
          {{ barLoading ? 'Terminer' : 'Démarrer' }}
        </MazBtn>
      </div>
    </ModernisationDemo>

    <ModernisationDemo title="MazSkeleton" hint="Tous les os brillent en même temps, d'un seul reflet. Avec un contenu dans le slot et loaded, un bord doux balaie le squelette et révèle le contenu.">
      <div class="flex flex-col gap-4">
        <div class="flex items-center gap-3">
          <MazSkeleton shape="circle" size="3rem" />
          <div class="flex flex-1 flex-col gap-2">
            <MazSkeleton height="1rem" width="60%" />
            <MazSkeleton height="1rem" />
          </div>
        </div>
        <MazSkeleton :loaded="skeletonLoaded" height="3rem">
          <p class="m-0">
            Ton profil est à jour, merci d'avoir patienté.
          </p>
        </MazSkeleton>
        <MazBtn size="sm" class="self-start" @click="skeletonLoaded = !skeletonLoaded">
          {{ skeletonLoaded ? 'Réinitialiser' : 'Charger' }}
        </MazBtn>
      </div>
    </ModernisationDemo>

    <ModernisationDemo title="MazLazyImg et MazFullscreenLoader" hint="MazLazyImg : clique sur « Recharger les images ». Celle de gauche (placeholder=blur) montre un bloc teinté puis passe du flou au net en fondu. Celle de droite garde le spinner d'origine. MazFullscreenLoader : « Afficher le loader » recouvre la page d'un voile flouté avec un spinner. Il se ferme en fondu tout seul au bout de 3 secondes, ou avec le bouton Fermer.">
      <div class="flex flex-wrap items-start gap-4">
        <div class="flex flex-col gap-1">
          <MazLazyImg
            :key="`blur-${imageKey}`"
            :src="`https://placedog.net/400/260?id=21&t=${imageKey}`"
            placeholder="blur"
            alt="Un chien"
            class="w-64 overflow-hidden rounded-lg"
            block
          />
          <span class="text-sm text-muted">placeholder="blur"</span>
        </div>
        <div class="flex flex-col gap-1">
          <MazLazyImg
            :key="`default-${imageKey}`"
            :src="`https://placedog.net/400/260?id=22&t=${imageKey}`"
            alt="Un autre chien"
            class="w-64 overflow-hidden rounded-lg"
            block
          />
          <span class="text-sm text-muted">par défaut (spinner)</span>
        </div>
      </div>
      <div class="mt-4 flex flex-wrap items-center gap-4">
        <MazBtn size="sm" variant="outline" @click="reloadImages">
          Recharger les images
        </MazBtn>
        <MazBtn size="sm" @click="openLoader">
          Afficher le loader
        </MazBtn>
      </div>
      <MazFullscreenLoader v-if="showLoader">
        <div class="flex flex-col items-center gap-3">
          <p class="m-0 text-lg">
            Chargement, fermeture dans {{ loaderSeconds }} s
          </p>
          <MazBtn size="sm" @click="closeLoader">
            Fermer
          </MazBtn>
        </div>
      </MazFullscreenLoader>
    </ModernisationDemo>
  </ModernisationSection>
</template>
