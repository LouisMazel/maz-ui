<script lang="ts" setup>
const levels = [0, 1, 2, 3] as const

const accordionSteps = [1, 2, 3]

const tableHeaders = [
  { label: 'Id', key: 'id', width: '4rem' },
  { label: 'Prénom', key: 'name' },
  { label: 'Score', key: 'score', align: 'center' as const },
]
const tableRows = ref([
  { id: 1, name: 'Camille', score: 12 },
  { id: 2, name: 'Louis', score: 24 },
  { id: 3, name: 'Inès', score: 8 },
  { id: 4, name: 'Hugo', score: 31 },
  { id: 5, name: 'Jade', score: 17 },
  { id: 6, name: 'Nina', score: 5 },
  { id: 7, name: 'Lucas', score: 28 },
  { id: 8, name: 'Zoé', score: 19 },
])

function rotateRows() {
  const [first, ...rest] = tableRows.value

  tableRows.value = [...rest, first!]
}

const carouselItems = Array.from({ length: 10 }, (_, index) => index + 1)

const timelineStep = ref(2)
const timelineSteps = [
  { title: 'Commande', subtitle: 'Reçue ce matin' },
  { title: 'Préparation', subtitle: 'Emballée avec soin' },
  { title: 'Expédition', subtitle: 'Confiée au transporteur' },
  { title: 'Livraison', subtitle: 'Chez toi sous 48 heures' },
  { title: 'Avis', subtitle: 'Dis-nous ce que tu en penses' },
]
const longTimelineSteps = Array.from({ length: 6 }, (_, index) => ({
  title: `Étape ${index + 1}`,
  subtitle: 'Fais défiler la page pour voir le rail se remplir',
}))

const longText = 'La modernisation donne vie à la bibliothèque : un seul langage de mouvement, appliqué partout, sur les mêmes jetons du thème. Les durées sont courtes, les sorties plus rapides que les entrées, et chaque composant respecte le mouvement réduit. Rien ne bouge sur la mise en page sans que tu le demandes, et tout reste accessible au clavier comme au lecteur d\'écran. Ouvre ce texte pour voir la hauteur s\'animer en douceur.'

const progressFiles = ref<any[]>([])
let uploadTimer: ReturnType<typeof setInterval> | undefined

function simulateUpload() {
  clearInterval(uploadTimer)

  for (const file of progressFiles.value) {
    file.uploading = true
    file.success = false
    file.progress = 0
  }

  uploadTimer = setInterval(() => {
    for (const file of progressFiles.value) {
      file.progress = Math.min(100, (file.progress ?? 0) + 7)

      if (file.progress === 100) {
        file.uploading = false
        file.success = true
      }
    }

    if (progressFiles.value.every(file => file.progress === 100))
      clearInterval(uploadTimer)
  }, 250)
}

onBeforeUnmount(() => clearInterval(uploadTimer))

const tickerWords = ['Mouvement', 'Cohérence', 'Accessibilité', 'Thème', 'Jetons', 'Sans régression']

const color = ref('#3b82f6')
const swatches = ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#ef4444']

const expanded = ref(false)
</script>

<template>
  <ModernisationSection
    id="pr4-display"
    title="PR 4. Affichage"
    description="Cartes, accordéon, tableau, carrousel, frise, texte repliable, zone de dépôt, bandeau et sélecteur de couleur : survols, bordures qui se dessinent, ombres par niveau, hauteurs animées. Rien ne change par défaut, tout est en option ou dans l'apparence."
  >
    <ModernisationDemo title="MazCard : niveaux d'élévation" hint="Les ombres viennent du thème et sont plus profondes en sombre : bascule le mode sombre en haut de la page. Le niveau 0 n'a pas d'ombre, true garde l'ombre historique.">
      <div class="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <MazCard v-for="level in levels" :key="level" :elevation="level" :bordered="false" class="w-full">
          <p class="text-center">
            Niveau {{ level }}
          </p>
        </MazCard>
        <MazCard elevation :bordered="false" class="w-full">
          <p class="text-center">
            true
          </p>
        </MazCard>
      </div>
    </ModernisationDemo>

    <ModernisationDemo title="Bordure qui se dessine" hint="Entre dans la carte par un coin ou par un côté : le trait part du point d'entrée et fait le tour dans les deux sens. Il se dessine aussi au focus clavier. Disponible sur MazCard, MazContainer et MazCardSpotlight.">
      <div class="flex flex-wrap items-start gap-4">
        <MazCard border-draw>
          <p>MazCard</p>
        </MazCard>
        <MazContainer border-draw title="MazContainer">
          <p>Entre par un coin.</p>
        </MazContainer>
        <MazCardSpotlight border-draw :elevation="1">
          <p>MazCardSpotlight</p>
        </MazCardSpotlight>
      </div>
    </ModernisationDemo>

    <ModernisationDemo title="MazCard lié" hint="À la souris : la carte grossit un peu, l'image se rapproche et la flèche glisse vers la fin de la ligne (essaie en RTL). Rien ne bouge sur écran tactile.">
      <div class="flex flex-wrap items-start gap-4">
        <MazCard
          href="#pr4-display"
          :gallery="{ images: ['https://placedog.net/300/200'], height: 160, width: false }"
          class="w-72"
        >
          <template #content-title>
            Une carte cliquable
          </template>
          <template #content-body>
            <div class="flex items-center justify-between">
              <span class="text-muted">Lire la suite</span>
              <span class="m-card__arrow inline-block">→</span>
            </div>
          </template>
        </MazCard>
      </div>
    </ModernisationDemo>

    <ModernisationDemo title="MazCardSpotlight" hint="Le halo suit la souris, un doigt posé sur la carte, puis s'efface en douceur. L'écouteur est sur la carte elle-même. Avec le mouvement réduit, le halo disparaît.">
      <MazCardSpotlight class="max-w-md">
        <h3 class="mb-2 text-title-4">
          Passe la souris ici
        </h3>
        <p class="text-muted">
          Le halo apparaît sous le pointeur et s'efface quand tu sors.
        </p>
      </MazCardSpotlight>
    </ModernisationDemo>

    <ModernisationDemo title="MazAccordion" hint="Le plus devient un moins, la réponse monte en s'ouvrant et repart plus vite. L'en-tête a l'anneau de focus du thème (Tab). Avec spotlight à false, les éléments sont de simples cartes bordées.">
      <div class="grid gap-6 lg:grid-cols-2">
        <MazAccordion class="w-full">
          <template v-for="step in accordionSteps" :key="step" #[`title-${step}`]>
            Question {{ step }}
          </template>
          <template v-for="step in accordionSteps" :key="step" #[`content-${step}`]>
            La réponse numéro {{ step }}, qui monte pendant l'ouverture.
          </template>
        </MazAccordion>
        <MazAccordion class="w-full" :spotlight="false">
          <template v-for="step in accordionSteps" :key="step" #[`title-${step}`]>
            Sans spotlight {{ step }}
          </template>
          <template v-for="step in accordionSteps" :key="step" #[`content-${step}`]>
            Une carte bordée simple.
          </template>
        </MazAccordion>
      </div>
    </ModernisationDemo>

    <ModernisationDemo title="MazExpandAnimation" hint="L'ouverture suit les jetons du thème (motion-slow) et la fermeture est environ 30 % plus rapide.">
      <div class="flex flex-col items-start gap-3">
        <MazBtn size="sm" @click="expanded = !expanded">
          {{ expanded ? 'Replier' : 'Déplier' }}
        </MazBtn>
        <MazExpandAnimation v-model="expanded" class="max-w-md">
          <p class="pt-2 text-muted">
            Ce bloc s'ouvre et se ferme sans saut, même si tu cliques plusieurs fois de suite.
          </p>
        </MazExpandAnimation>
      </div>
    </ModernisationDemo>

    <ModernisationDemo title="MazTable" hint="Clique sur un en-tête : la colonne triée reçoit une bande douce, et avec animated-rows les lignes glissent. L'en-tête reste collé en haut pendant le défilement (scrollable et max-height). Le survol suit le thème en clair comme en sombre.">
      <div class="flex flex-col items-start gap-3">
        <MazBtn size="sm" @click="rotateRows">
          Faire tourner les lignes
        </MazBtn>
        <MazTable
          class="w-full max-w-xl"
          size="sm"
          sortable
          scrollable
          animated-rows
          row-key="id"
          max-height="12rem"
          :headers="tableHeaders"
          :rows="tableRows"
        />
      </div>
    </ModernisationDemo>

    <ModernisationDemo title="MazCarousel" hint="Compteur qui roule, barre de progression et glisser à la souris avec un peu d'inertie : lance les cartes et lâche. Un clic qui termine un glissement n'ouvre rien.">
      <MazCarousel title="Mes cartes" counter progress drag-scroll>
        <MazCard v-for="item in carouselItems" :key="item" class="min-w-56">
          <template #content-title>
            Carte {{ item }}
          </template>
          <template #content-body>
            <p class="text-muted">
              Glisse-moi à la souris.
            </p>
          </template>
        </MazCard>
      </MazCarousel>
    </ModernisationDemo>

    <ModernisationDemo title="MazTimeline" hint="Le rail se remplit pendant que l'étape entre dans l'écran (navigateurs récents). Les étapes sous la ligne de flottaison montent la première fois qu'on les voit, les autres ne sont jamais cachées.">
      <div class="flex flex-col gap-10">
        <MazTimeline v-model="timelineStep" :steps="timelineSteps" direction="horizontal" clickable />
        <MazTimeline :model-value="5" :steps="longTimelineSteps" direction="vertical" />
      </div>
    </ModernisationDemo>

    <ModernisationDemo title="MazReadMore" hint="La hauteur s'anime à l'ouverture et à la fermeture (clique plusieurs fois vite : pas de saut). Avec fade, le bas du texte replié s'estompe.">
      <div class="grid gap-6 lg:grid-cols-2">
        <MazReadMore :text="longText" :max-lines="3" />
        <MazReadMore :text="longText" :max-lines="3" fade />
      </div>
    </ModernisationDemo>

    <ModernisationDemo title="MazDropzone" hint="Glisse un fichier au-dessus de la zone : la bordure défile. Dépose un fichier puis lance l'envoi simulé : le pourcentage roule et une barre fine se remplit.">
      <div class="flex max-w-xl flex-col items-start gap-3">
        <MazDropzone v-model="progressFiles" multiple />
        <MazBtn size="sm" :disabled="progressFiles.length === 0" @click="simulateUpload">
          Simuler un envoi
        </MazBtn>
      </div>
    </ModernisationDemo>

    <ModernisationDemo title="MazTicker" hint="Au survol, le bandeau ralentit doucement jusqu'à l'arrêt, puis repart en douceur quand la souris le quitte. Même chose au focus clavier. Sur écran tactile, rien ne l'arrête.">
      <MazTicker pause-on-hover pause-on-focus :duration="14">
        <span v-for="word in tickerWords" :key="word" class="px-6 text-title-4">
          {{ word }}
        </span>
      </MazTicker>
    </ModernisationDemo>

    <ModernisationDemo title="MazColorPicker" hint="Choisis une pastille : la poignée de la zone de couleur et les curseurs glissent vers la nouvelle couleur. Avec le mouvement réduit, ils sautent.">
      <MazColorPicker v-model="color" :swatches="swatches" label="Couleur de marque" />
    </ModernisationDemo>
  </ModernisationSection>
</template>
