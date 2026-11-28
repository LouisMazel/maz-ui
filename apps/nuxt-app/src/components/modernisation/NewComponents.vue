<script lang="ts" setup>
import { debounce } from '@maz-ui/utils/helpers/debounce'

const count = ref(42)

const yearly = ref(false)
const currency = ref<'USD' | 'EUR' | 'JPY'>('USD')
const price = computed(() => (yearly.value ? 190 : 19))

const copied = ref(false)
const resetCopied = debounce(() => {
  copied.value = false
}, 1500)

function copy() {
  copied.value = true
  resetCopied()
}

const direction = ref<'up' | 'down' | 'auto'>('auto')

const drawnNames = ['check', 'x-mark', 'minus', 'check-circle', 'x-circle', 'exclamation-circle', 'information-circle'] as const
const drawn = ref(true)

function replay() {
  drawn.value = false
  setTimeout(() => {
    drawn.value = true
  }, 80)
}

const morphNames = ['menu-close', 'plus-close', 'plus-minus', 'play-pause', 'eye-eye-slash', 'copy-check', 'sun-moon', 'chevron-down-up', 'sound-mute'] as const
const morphState = reactive<Record<string, boolean>>({})
</script>

<template>
  <ModernisationSection
    id="new-components"
    title="4. Nouveaux composants"
    description="MazRollingText, MazDrawnIcon et MazMorphIcon. Avec les animations réduites, le mouvement devient un changement instantané."
  >
    <ModernisationDemo title="MazRollingText : compteur" hint="Seuls les chiffres qui changent défilent. La direction suit la valeur.">
      <div class="flex flex-wrap items-center gap-4">
        <MazBtn size="sm" color="neutral" aria-label="Diminuer" @click="count--">
          -
        </MazBtn>
        <MazRollingText :value="count" class="text-title-1" :direction="direction" />
        <MazBtn size="sm" color="neutral" aria-label="Augmenter" @click="count++">
          +
        </MazBtn>
        <MazBtn size="sm" color="secondary" @click="count += 100">
          +100
        </MazBtn>
        <MazSegmented
          v-model="direction"
          :options="[{ label: 'auto', value: 'auto' }, { label: 'haut', value: 'up' }, { label: 'bas', value: 'down' }]"
          size="sm"
          aria-label="Direction du défilement"
        />
      </div>
    </ModernisationDemo>

    <ModernisationDemo title="MazRollingText : prix" hint="Intl.NumberFormat avec une devise, mensuel ou annuel.">
      <div class="flex flex-wrap items-center gap-4">
        <MazSwitch v-model="yearly" label="Annuel" />
        <MazSegmented
          v-model="currency"
          :options="[{ label: 'USD', value: 'USD' }, { label: 'EUR', value: 'EUR' }, { label: 'JPY', value: 'JPY' }]"
          size="sm"
          aria-label="Devise"
        />
        <MazRollingText
          :value="price"
          locale="fr-FR"
          :format="{ style: 'currency', currency, maximumFractionDigits: 0 }"
          class="text-title-1"
        />
      </div>
    </ModernisationDemo>

    <ModernisationDemo title="MazRollingText : texte" hint="Fonctionne aussi avec du texte : Copier devient Copié.">
      <MazBtn size="sm" @click="copy">
        <MazRollingText :value="copied ? 'Copié' : 'Copier'" />
      </MazBtn>
    </ModernisationDemo>

    <ModernisationDemo title="MazDrawnIcon" hint="Icônes tracées trait par trait. Rejouer les trace à nouveau.">
      <div class="mb-4">
        <MazBtn size="sm" @click="replay">
          Rejouer
        </MazBtn>
      </div>
      <div class="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-7">
        <div v-for="name in drawnNames" :key="name" class="flex flex-col items-center gap-2 rounded-lg border border-divider p-4">
          <MazDrawnIcon :name="name" :drawn="drawn" size="xl" class="text-primary" />
          <span class="text-caption">{{ name }}</span>
        </div>
      </div>
    </ModernisationDemo>

    <ModernisationDemo title="MazMorphIcon" hint="Chaque bouton bascule la paire (aria-pressed).">
      <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <!-- maz-ui-review-ignore prefer-maz-component -- toggle card around the icon -->
        <button
          v-for="name in morphNames"
          :key="name"
          type="button"
          class="press focus-ring flex flex-col items-center gap-2 rounded-lg border border-divider p-4"
          :aria-pressed="!!morphState[name]"
          :aria-label="name"
          @click="morphState[name] = !morphState[name]"
        >
          <MazMorphIcon :name="name" :active="!!morphState[name]" size="xl" />
          <span class="text-caption">{{ name }}</span>
        </button>
      </div>
    </ModernisationDemo>
  </ModernisationSection>
</template>
