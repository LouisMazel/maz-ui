<script lang="ts" setup>
import MazAnimatedText from 'maz-ui/components/MazAnimatedText'
import MazIcon from 'maz-ui/components/MazIcon'
import { vDraw } from 'maz-ui/directives/vDraw'
import { vMagnetic } from 'maz-ui/directives/vMagnetic'
import { vPress } from 'maz-ui/directives/vPress'
import { vRipple } from 'maz-ui/directives/vRipple'
import { vTilt } from 'maz-ui/directives/vTilt'
import { ref } from 'vue'

const drawKey = ref(0)
const textKey = ref(0)
const scrambleText = ref('Les composants prennent vie')

const scrambleChoices = ['Les composants prennent vie', 'Un peu de mouvement, sobrement', 'Accessible, rapide, léger']

function nextScramble() {
  const next = scrambleChoices[(scrambleChoices.indexOf(scrambleText.value) + 1) % scrambleChoices.length]!
  scrambleText.value = next
}

const icons = [
  { name: 'bell', label: 'Cloche' },
  { name: 'trash', label: 'Corbeille' },
  { name: 'cog-6-tooth', label: 'Engrenage' },
  { name: 'paper-airplane', label: 'Avion' },
  { name: 'arrow-right', label: 'Flèche' },
  { name: 'heart', label: 'Coeur' },
]
</script>

<template>
  <ModernisationSection
    id="pr5-effects"
    title="PR 5. Effets : directives, icônes animées, textes animés"
    description="Cinq directives (appui, ondulation, aimant, inclinaison 3D, tracé SVG), des icônes qui miment leur sens au survol et cinq effets pour MazAnimatedText. Tout se coupe ou se réduit quand tu coupes les animations, rien ne bouge sur écran tactile quand ça n'a pas de sens."
  >
    <ModernisationDemo title="v-press : retour d'appui" hint="Appuie (souris, doigt, Entrée ou Espace) : l'élément s'enfonce légèrement puis revient avec un petit rebond. Marche sur n'importe quel élément cliquable.">
      <div class="flex flex-wrap items-center gap-4">
        <!-- maz-ui-review-ignore prefer-maz-component -- shows the directive on a native element -->
        <button v-press type="button" class="rounded-lg bg-primary px-4 py-2 text-primary-foreground">
          Bouton natif
        </button>
        <MazBtn v-press color="secondary">
          MazBtn
        </MazBtn>
        <div v-press tabindex="0" role="button" class="cursor-pointer rounded-xl border border-divider bg-container px-5 py-3">
          Carte cliquable
        </div>
        <MazBtn v-press="{ scale: 0.9 }" color="accent">
          Appui marqué
        </MazBtn>
      </div>
    </ModernisationDemo>

    <ModernisationDemo title="v-ripple : le remplissage suit le pointeur" hint="Survole par un coin puis sors par un autre : le remplissage part du point d'entrée et se vide vers le point de sortie. En mode click, une onde part du clic (ou du centre au clavier).">
      <div class="flex flex-wrap items-center gap-4">
        <!-- maz-ui-review-ignore prefer-maz-component -- shows the directive on a native element -->
        <button v-ripple type="button" class="rounded-xl border border-divider bg-surface px-8 py-5">
          Survol
        </button>
        <!-- maz-ui-review-ignore prefer-maz-component -- shows the directive on a native element -->
        <button v-ripple="{ color: 'var(--maz-primary)', opacity: 0.2 }" type="button" class="rounded-xl border border-divider bg-surface px-8 py-5">
          Couleur du thème
        </button>
        <!-- maz-ui-review-ignore prefer-maz-component -- shows the directive on a native element -->
        <button v-ripple="'click'" type="button" class="rounded-xl bg-primary px-8 py-5 text-primary-foreground">
          Onde au clic
        </button>
        <MazBtn v-ripple="{ mode: 'click', opacity: 0.3 }" color="secondary">
          MazBtn
        </MazBtn>
      </div>
    </ModernisationDemo>

    <ModernisationDemo title="v-magnetic : le bouton se penche vers le pointeur" hint="Approche le pointeur sans toucher : le bouton te suit un peu, puis revient en douceur. Désactivé au toucher et sans animations.">
      <div class="flex flex-wrap items-center gap-12 py-6">
        <MazBtn v-magnetic size="lg">
          Commencer
        </MazBtn>
        <MazBtn v-magnetic="{ strength: 0.5, radius: 140 }" size="lg" color="secondary">
          Très attiré
        </MazBtn>
      </div>
    </ModernisationDemo>

    <ModernisationDemo title="v-tilt : inclinaison 3D" hint="Passe sur les cartes : elles s'inclinent vers le pointeur. La troisième ajoute un reflet. La scène de droite suit le pointeur sur toute la page et flotte en profondeur.">
      <div class="grid gap-6 lg:grid-cols-[1fr_1fr_1fr_1.4fr]">
        <div v-tilt class="rounded-2xl border border-divider bg-container p-6 shadow-elevation">
          <p class="text-title-4">
            Inclinaison
          </p>
          <p class="mt-1 text-body-sm text-muted">
            8 degrés au maximum.
          </p>
        </div>
        <div v-tilt="{ max: 16, perspective: 600 }" class="rounded-2xl border border-divider bg-container p-6 shadow-elevation">
          <p class="text-title-4">
            Plus marquée
          </p>
          <p class="mt-1 text-body-sm text-muted">
            16 degrés, perspective serrée.
          </p>
        </div>
        <div v-tilt="{ glare: true }" class="rounded-2xl border border-divider bg-container p-6 shadow-elevation">
          <p class="text-title-4">
            Avec reflet
          </p>
          <p class="mt-1 text-body-sm text-muted">
            Une lumière suit le pointeur.
          </p>
        </div>
        <div class="flex min-h-48 items-center justify-center">
          <div v-tilt="{ global: true, float: true, max: 14 }" class="relative h-44 w-full max-w-72">
            <div class="absolute inset-0 rounded-2xl border border-divider bg-container shadow-elevation" style="transform: translateZ(0)" />
            <div class="absolute top-4 inset-s-4 rounded-xl bg-primary px-4 py-3 text-primary-foreground shadow-elevation" style="transform: translateZ(2.5rem)">
              Scène 3D
            </div>
            <div class="absolute inset-e-4 bottom-4 rounded-xl bg-secondary px-4 py-3 text-secondary-foreground shadow-elevation" style="transform: translateZ(4.5rem)">
              Suit la page
            </div>
          </div>
        </div>
      </div>
    </ModernisationDemo>

    <ModernisationDemo title="v-draw : un SVG qui se dessine" hint="Les traits se dessinent un par un quand le SVG entre dans l'écran. À droite, le tracé est lié au scroll (sur les navigateurs qui le gèrent, sinon il se dessine à l'entrée).">
      <div class="flex flex-col items-start gap-4">
        <MazBtn size="sm" @click="drawKey++">
          Rejouer
        </MazBtn>
        <div :key="drawKey" class="flex flex-wrap items-center gap-10">
          <svg v-draw="{ duration: 700, stagger: 250 }" viewBox="0 0 120 100" class="h-28 w-36 text-primary" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-label="Maison dessinée" role="img">
            <path d="M10 50 L60 10 L110 50" />
            <path d="M22 44 V92 H98 V44" />
            <path d="M50 92 V62 H70 V92" />
            <circle cx="60" cy="38" r="6" />
          </svg>
          <svg v-draw="{ duration: 1200 }" viewBox="0 0 160 60" class="h-20 w-48 text-secondary" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" aria-label="Courbe dessinée" role="img">
            <path d="M5 50 C 30 5, 50 5, 70 30 S 110 55, 155 10" />
          </svg>
          <svg v-draw="{ stagger: 120 }" viewBox="0 0 48 48" class="size-20 text-success" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-label="Validé" role="img">
            <circle cx="24" cy="24" r="20" />
            <path d="M14 25 L21 32 L34 17" />
          </svg>
          <svg v-draw="'scroll'" viewBox="0 0 160 60" class="h-20 w-48 text-accent" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" aria-label="Tracé lié au scroll" role="img">
            <path d="M5 30 H40 L55 8 L80 52 L100 30 H155" />
          </svg>
        </div>
      </div>
    </ModernisationDemo>

    <ModernisationDemo title="MazIcon animated : des icônes qui miment leur sens" hint="Survole l'icône ou son bouton (ou passe dessus au clavier) : la cloche sonne, la corbeille se soulève, l'engrenage tourne, l'avion décolle, la flèche pousse, le coeur bat.">
      <div class="flex flex-wrap items-center gap-6">
        <!-- maz-ui-review-ignore prefer-maz-component -- the hover of a plain parent animates the icon -->
        <button v-for="item in icons" :key="item.name" type="button" class="flex items-center gap-2 rounded-lg border border-divider bg-surface px-4 py-2 focus-ring" :aria-label="item.label">
          <MazIcon :icon="item.name" animated size="lg" />
          <span class="text-body-sm text-muted">{{ item.label }}</span>
        </button>
        <MazBtn color="secondary">
          <MazIcon icon="bell" animated />
          Notifications
        </MazBtn>
        <MazBtn color="destructive">
          <MazIcon icon="trash" animated />
          Supprimer
        </MazBtn>
      </div>
    </ModernisationDemo>

    <ModernisationDemo title="MazAnimatedText : scramble" hint="Le texte se décode lettre par lettre quand il entre dans l'écran ou quand il change. Les lecteurs d'écran lisent le vrai texte.">
      <div class="flex flex-col items-start gap-4">
        <MazBtn size="sm" @click="nextScramble">
          Changer le texte
        </MazBtn>
        <MazAnimatedText effect="scramble" tag="p" :text="scrambleText" class="text-title-2" />
      </div>
    </ModernisationDemo>

    <ModernisationDemo title="MazAnimatedText : rotate" hint="Un mot de la phrase change en boucle. Ça s'arrête hors écran, au survol et au focus.">
      <MazAnimatedText effect="rotate" tag="h3" text="Créez des sites" :words="['rapides', 'beaux', 'accessibles', 'sobres']" class="text-title-1" />
    </ModernisationDemo>

    <ModernisationDemo title="MazAnimatedText : typewriter" hint="Le texte est tapé avec un rythme humain (pauses après les virgules et les points) et un curseur.">
      <div class="flex flex-col items-start gap-4">
        <MazBtn size="sm" @click="textKey++">
          Rejouer
        </MazBtn>
        <MazAnimatedText :key="textKey" effect="typewriter" tag="p" text="Bonjour. Je tape ce texte, lettre après lettre, comme une vraie personne." class="text-title-3" />
      </div>
    </ModernisationDemo>

    <ModernisationDemo title="MazAnimatedText : shimmer" hint="Une bande de lumière traverse le texte, pratique pour un état de chargement (réflexion d'une IA par exemple).">
      <MazAnimatedText effect="shimmer" tag="p" text="Réflexion en cours..." class="text-title-2" />
    </ModernisationDemo>

    <ModernisationDemo title="MazAnimatedText : highlight" hint="Un surlignage, un soulignement ou un cercle dessiné à la main autour de mots clés. Le slot accepte aussi des éléments mark.">
      <div class="flex flex-col gap-5 text-title-3">
        <MazAnimatedText effect="highlight" tag="p" text="Une bibliothèque rapide, accessible et sobre." :highlight="['rapide', 'sobre']" />
        <MazAnimatedText effect="highlight" tag="p" text="Une bibliothèque rapide, accessible et sobre." highlight="accessible" highlight-type="underline" color="secondary" />
        <MazAnimatedText effect="highlight" tag="p" text="Une bibliothèque rapide, accessible et sobre." highlight="sobre" highlight-type="circle" color="accent" />
        <MazAnimatedText effect="highlight" tag="p">
          Avec le slot : <mark>un mot</mark> et <mark>un autre</mark>.
        </MazAnimatedText>
      </div>
    </ModernisationDemo>
  </ModernisationSection>
</template>
