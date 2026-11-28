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
    title="4. New components"
    description="MazRollingText, MazDrawnIcon and MazMorphIcon. Reduced motion turns the movement into an instant change."
  >
    <ModernisationDemo title="MazRollingText: counter" hint="Only the digits that change roll. The direction follows the value.">
      <div class="flex flex-wrap items-center gap-4">
        <MazBtn size="sm" color="neutral" aria-label="Decrease" @click="count--">
          -
        </MazBtn>
        <MazRollingText :value="count" class="text-title-1" :direction="direction" />
        <MazBtn size="sm" color="neutral" aria-label="Increase" @click="count++">
          +
        </MazBtn>
        <MazBtn size="sm" color="secondary" @click="count += 100">
          +100
        </MazBtn>
        <MazSegmented
          v-model="direction"
          :options="[{ label: 'auto', value: 'auto' }, { label: 'up', value: 'up' }, { label: 'down', value: 'down' }]"
          size="sm"
          aria-label="Direction of the roll"
        />
      </div>
    </ModernisationDemo>

    <ModernisationDemo title="MazRollingText: price" hint="Intl.NumberFormat with a currency, monthly or yearly.">
      <div class="flex flex-wrap items-center gap-4">
        <MazSwitch v-model="yearly" label="Yearly" />
        <MazSegmented
          v-model="currency"
          :options="[{ label: 'USD', value: 'USD' }, { label: 'EUR', value: 'EUR' }, { label: 'JPY', value: 'JPY' }]"
          size="sm"
          aria-label="Currency"
        />
        <MazRollingText
          :value="price"
          locale="en-US"
          :format="{ style: 'currency', currency, maximumFractionDigits: 0 }"
          class="text-title-1"
        />
      </div>
    </ModernisationDemo>

    <ModernisationDemo title="MazRollingText: text" hint="Works with text too: Copy becomes Copied.">
      <MazBtn size="sm" @click="copy">
        <MazRollingText :value="copied ? 'Copied' : 'Copy'" />
      </MazBtn>
    </ModernisationDemo>

    <ModernisationDemo title="MazDrawnIcon" hint="Icons drawn stroke by stroke. Replay draws them again.">
      <div class="mb-4">
        <MazBtn size="sm" @click="replay">
          Replay
        </MazBtn>
      </div>
      <div class="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-7">
        <div v-for="name in drawnNames" :key="name" class="flex flex-col items-center gap-2 rounded-lg border border-divider p-4">
          <MazDrawnIcon :name="name" :drawn="drawn" size="xl" class="text-primary" />
          <span class="text-caption">{{ name }}</span>
        </div>
      </div>
    </ModernisationDemo>

    <ModernisationDemo title="MazMorphIcon" hint="Each button toggles the pair (aria-pressed).">
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
