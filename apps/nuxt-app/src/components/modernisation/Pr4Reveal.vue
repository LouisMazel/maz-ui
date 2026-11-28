<script lang="ts" setup>
import MazReveal from 'maz-ui/components/MazReveal'
import { useReveal } from 'maz-ui/composables/useReveal'
import { vReveal } from 'maz-ui/directives/vReveal'
import { ref } from 'vue'

type Effect = 'fade' | 'slide-up' | 'slide-down' | 'slide-start' | 'slide-end' | 'blur' | 'scale' | 'curtain-up' | 'curtain-down' | 'curtain-start' | 'curtain-end' | 'iris' | 'settle'

const effects: Effect[] = ['fade', 'slide-up', 'slide-down', 'slide-start', 'slide-end', 'blur', 'scale', 'curtain-up', 'curtain-down', 'curtain-start', 'curtain-end', 'iris', 'settle']

const effectsKey = ref(0)
const cascadeKey = ref(0)
const textKey = ref(0)
const componentsKey = ref(0)
const repeatKey = ref(0)
const rtl = ref(false)
const staticRoot = ref<HTMLElement>()

const cards = ['Rapide', 'Léger', 'Accessible', 'Logique', 'Sobre', 'Lisible']

useReveal({ root: staticRoot, selector: '[data-maz-reveal]' })
</script>

<template>
  <ModernisationSection
    id="pr4-reveal"
    title="PR 4. Révélation au scroll (vReveal)"
    description="Un seul système remplace l'AOS : une directive, un composant et un composable. Rien n'est caché sans JavaScript ni avant l'hydratation, un seul observer sert toute la page, et le mouvement se réduit à un fondu court quand tu coupes les animations."
  >
    <ModernisationDemo title="Tous les effets" hint="Clique sur Rejouer : chaque tuile se révèle avec son effet, décalée de la précédente. Les effets slide-start et slide-end suivent le sens de lecture (essaie le mode RTL de la barre du haut).">
      <div class="flex flex-col items-start gap-4">
        <MazBtn size="sm" @click="effectsKey++">
          Rejouer
        </MazBtn>
        <div :key="effectsKey" class="grid w-full grid-cols-2 gap-3 sm:grid-cols-4">
          <div
            v-for="(effect, index) in effects"
            :key="effect"
            v-reveal="{ effect, delay: index * 60 }"
            class="rounded-lg bg-primary p-6 text-center text-body-sm text-primary-foreground"
          >
            {{ effect }}
          </div>
        </div>
      </div>
    </ModernisationDemo>

    <ModernisationDemo title="Cascade automatique et stagger" hint="Les blocs qui entrent ensemble se suivent seuls, avec un retard plafonné. L'option stagger fait de même avec les enfants d'un élément, avec son effet.">
      <div class="flex flex-col items-start gap-4">
        <MazBtn size="sm" @click="cascadeKey++">
          Rejouer
        </MazBtn>
        <ul :key="cascadeKey" v-reveal="{ effect: 'slide-up', stagger: 90, blur: true }" class="grid w-full list-none grid-cols-2 gap-3 p-0 sm:grid-cols-3">
          <li v-for="card in cards" :key="card" class="rounded-lg border border-divider bg-surface p-4 text-center">
            {{ card }}
          </li>
        </ul>
      </div>
    </ModernisationDemo>

    <ModernisationDemo title="Lignes et mots" hint="Les lignes d'un titre montent chacune depuis un masque, les mots arrivent un par un. Le texte reste lu en entier par un lecteur d'écran et le DOM d'origine revient à la fin.">
      <div class="flex flex-col items-start gap-4">
        <MazBtn size="sm" @click="textKey++">
          Rejouer
        </MazBtn>
        <div :key="textKey" class="flex w-full flex-col gap-5">
          <h3 v-reveal="'lines'" class="max-w-lg text-title-2">
            Chaque ligne de ce titre monte depuis son propre masque, l'une après l'autre
          </h3>
          <p v-reveal="{ effect: 'words', blur: true }" class="max-w-lg text-muted">
            Les mots arrivent doucement, un par un, et suivent la largeur de la page quand tu la redimensionnes.
          </p>
          <p v-reveal="'lines'" class="max-w-lg">
            Avec des sauts de ligne<br>le texte se découpe<br>sur chaque saut.
          </p>
        </div>
      </div>
    </ModernisationDemo>

    <ModernisationDemo title="Rideaux, iris et image qui se pose" hint="Révélations par clip-path : le rideau s'ouvre dans la direction choisie, l'iris s'ouvre depuis le centre, settle ajoute un léger zoom arrière. Rien d'autre que transform, opacity, filter et clip-path ne bouge : pas de décalage de mise en page.">
      <div class="flex flex-col items-start gap-4">
        <MazBtn size="sm" @click="componentsKey++">
          Rejouer
        </MazBtn>
        <div :key="componentsKey" class="grid w-full gap-3 sm:grid-cols-3">
          <MazReveal effect="curtain-up" :duration="900" class="rounded-lg bg-primary p-10 text-center text-primary-foreground">
            MazReveal curtain-up
          </MazReveal>
          <MazReveal effect="iris" :duration="1000" :delay="150" class="rounded-lg bg-secondary p-10 text-center text-secondary-foreground">
            MazReveal iris
          </MazReveal>
          <MazReveal effect="settle" :duration="1100" :delay="300" class="rounded-lg bg-accent p-10 text-center text-accent-foreground">
            MazReveal settle
          </MazReveal>
        </div>
      </div>
    </ModernisationDemo>

    <ModernisationDemo title="Mode lié au scroll" hint="Avec mode scroll, la progression suit le défilement de la page (animation-timeline: view()). Les navigateurs qui ne le gèrent pas retombent sur une révélation simple. Fais défiler les cartes dans la fenêtre.">
      <div class="flex flex-col gap-3">
        <div
          v-for="effect in (['curtain-up', 'slide-up', 'scale'] as const)"
          :key="effect"
          v-reveal="{ effect, mode: 'scroll' }"
          class="rounded-lg bg-primary p-8 text-center text-primary-foreground"
        >
          mode scroll, {{ effect }}
        </div>
        <p id="pr4-scroll-short" v-reveal="{ effect: 'slide-up', mode: 'scroll' }" class="text-center">
          Une ligne courte
        </p>
        <div id="pr4-scroll-tall" v-reveal="{ effect: 'scale', mode: 'scroll' }" class="flex h-[70vh] items-center justify-center rounded-lg bg-primary p-8 text-primary-foreground">
          Un grand bloc
        </div>
      </div>
    </ModernisationDemo>

    <ModernisationDemo title="Se révéler à chaque passage (once: false)" hint="Par défaut, la révélation n'a lieu qu'une fois. Avec once: false, le bloc se cache de nouveau en sortant de l'écran : fais défiler vers le haut puis vers le bas.">
      <div class="flex flex-col items-start gap-4">
        <MazBtn size="sm" @click="repeatKey++">
          Réinitialiser
        </MazBtn>
        <div :key="repeatKey" v-reveal="{ effect: 'scale', once: false, blur: true }" class="w-full rounded-lg border border-divider bg-surface p-8 text-center">
          Je reviens à chaque fois que tu me croises
        </div>
      </div>
    </ModernisationDemo>

    <ModernisationDemo title="HTML statique (data-maz-reveal et useReveal)" hint="Pour du markdown ou du contenu d'un CMS : il suffit des attributs data-maz-reveal, useReveal les révèle au montage et après chaque navigation.">
      <div ref="staticRoot" class="flex flex-col gap-3">
        <p data-maz-reveal="slide-up" class="m-0 rounded-lg bg-container p-4">
          Un paragraphe en slide-up.
        </p>
        <p data-maz-reveal="slide-end" data-maz-reveal-delay="150" class="m-0 rounded-lg bg-container p-4">
          Un autre en slide-end avec un retard.
        </p>
        <ul data-maz-reveal="fade" data-maz-reveal-stagger="100" class="m-0 flex list-none flex-col gap-2 p-0">
          <li class="rounded-lg bg-container p-4">
            Une liste en cascade (stagger)
          </li>
          <li class="rounded-lg bg-container p-4">
            Deuxième élément
          </li>
          <li class="rounded-lg bg-container p-4">
            Troisième élément
          </li>
        </ul>
      </div>
    </ModernisationDemo>

    <ModernisationDemo title="Texte animé, bloc animé et compteur" hint="MazAnimatedText, MazAnimatedElement et MazAnimatedCounter reposent désormais sur vReveal, avec le même rendu qu'avant. Le compteur gagne l'option roll : les chiffres roulent comme un compteur kilométrique.">
      <div :key="effectsKey" class="flex flex-wrap items-center gap-10">
        <MazAnimatedText text="Un texte qui arrive" last-word="mot à mot" tag="h4" class="text-title-3" />
        <MazAnimatedElement direction="up" :duration="1200">
          <MazBadge color="success">
            Bloc animé
          </MazBadge>
        </MazAnimatedElement>
        <div class="flex gap-8 text-title-2">
          <MazAnimatedCounter :count="12800" suffix=" étoiles" />
          <MazAnimatedCounter :count="12800" roll suffix=" roll" />
        </div>
      </div>
    </ModernisationDemo>

    <ModernisationDemo title="Sens de lecture" hint="Active le RTL de la barre du haut, ou ce bouton local : slide-start, slide-end, curtain-start et curtain-end s'inversent d'eux-mêmes.">
      <div class="flex flex-col items-start gap-4">
        <MazSwitch v-model="rtl" label="RTL pour ce bloc" />
        <div :key="`${rtl}-${effectsKey}`" :dir="rtl ? 'rtl' : 'ltr'" class="grid w-full gap-3 sm:grid-cols-4">
          <div v-for="effect in (['slide-start', 'slide-end', 'curtain-start', 'curtain-end'] as const)" :key="effect" v-reveal="effect" class="rounded-lg bg-primary p-6 text-center text-body-sm text-primary-foreground">
            {{ effect }}
          </div>
        </div>
      </div>
    </ModernisationDemo>
  </ModernisationSection>
</template>
