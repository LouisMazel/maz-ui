<script lang="ts" setup>
import { MazCheck } from '@maz-ui/icons/raw/MazCheck'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useThemeColors } from './useThemeColors'

const { themeKey } = defineProps<{ themeKey?: string }>()

const scene = ref<HTMLElement>()
const email = ref('ada@maz-ui.com')
const notifications = ref(true)
const progress = ref(72)

const colors = useThemeColors(scene, () => themeKey)

const DOWNLOADS = [
  62,
  71,
  68,
  84,
  91,
  88,
  104,
  112,
  109,
  128,
]

const downloadsData = computed(() => ({
  labels: DOWNLOADS.map((_, index) => `W${index + 1}`),
  datasets: [
    {
      data: DOWNLOADS,
      borderColor: colors.value?.primary(),
      backgroundColor: colors.value?.primary(0.16),
      fill: true,
      tension: 0.4,
      pointRadius: 0,
      borderWidth: 2,
    },
  ],
}))

const SPARKLINE_OPTIONS = {
  responsive: true,
  maintainAspectRatio: false,
  animation: { duration: 900 },
  plugins: {
    legend: { display: false },
    tooltip: { enabled: false },
  },
  scales: {
    x: { display: false },
    y: { display: false },
  },
}

let raf = 0
let target = { x: 0, y: 0 }
let current = { x: 0, y: 0 }

function onPointerMove(event: PointerEvent) {
  target = {
    x: (event.clientX / window.innerWidth) * 2 - 1,
    y: (event.clientY / window.innerHeight) * 2 - 1,
  }
}

function loop() {
  current = {
    x: current.x + (target.x - current.x) * 0.06,
    y: current.y + (target.y - current.y) * 0.06,
  }
  scene.value?.style.setProperty('--hero-rx', `${(-current.y * 9).toFixed(2)}deg`)
  scene.value?.style.setProperty('--hero-ry', `${(current.x * 14).toFixed(2)}deg`)
  raf = requestAnimationFrame(loop)
}

onMounted(() => {
  if (globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches)
    return
  globalThis.addEventListener('pointermove', onPointerMove, { passive: true })
  raf = requestAnimationFrame(loop)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(raf)
  globalThis.removeEventListener('pointermove', onPointerMove)
})

const LAYER = 'maz:absolute maz:[transform:translateZ(var(--hero-z,0rem))] maz:motion-safe:animate-[hero-float_6s_ease-in-out_infinite]'
</script>

<template>
  <div class="maz:relative maz:h-[30rem] maz:perspective-[85.714286rem] maz:lap-s:h-[34rem]">
    <div
      ref="scene"
      class="maz:absolute maz:inset-0 maz:transform-[rotateX(var(--hero-rx,0deg))_rotateY(var(--hero-ry,0deg))] maz:transform-3d"
    >
      <div :class="LAYER" class="maz:inset-s-[4%] maz:top-[6%] maz:w-72 maz:[--hero-z:2.857143rem]">
        <MazCard bordered radius elevation block>
          <div class="maz:flex maz:items-center maz:gap-3">
            <MazAvatar caption="Ada Lovelace" size="md" />
            <div class="maz:min-w-0">
              <p class="maz:m-0 maz:font-semibold">
                Ada Lovelace
              </p>
              <p class="maz:m-0 maz:text-sm maz:text-muted">
                Lead engineer
              </p>
            </div>
            <MazBadge color="success" size="sm" class="maz:ms-auto">
              Online
            </MazBadge>
          </div>
        </MazCard>
      </div>

      <div :class="LAYER" class="maz:inset-e-[4%] maz:top-[2%] maz:w-64 maz:[--hero-z:7.857143rem] maz:[animation-delay:-2s]">
        <MazCard bordered radius elevation block>
          <p class="maz:m-0 maz:text-sm maz:text-muted">
            Weekly downloads
          </p>
          <p class="maz:m-0 maz:flex maz:items-baseline maz:gap-2 maz:font-display maz:text-4xl maz:font-bold">
            <MazAnimatedCounter :count="128400" :duration="1600" />
            <MazBadge color="success" size="sm" rounded-size="full">
              +24%
            </MazBadge>
          </p>
          <div class="maz:mt-3 maz:h-14">
            <MazChart v-if="colors" type="line" :data="downloadsData" :options="SPARKLINE_OPTIONS" aria-label="Downloads over the last ten weeks, growing" />
          </div>
        </MazCard>
      </div>

      <div :class="LAYER" class="maz:inset-s-[12%] maz:top-[34%] maz:w-80 maz:[--hero-z:11.428571rem] maz:[animation-delay:-4s]">
        <MazCard bordered radius elevation block>
          <div class="maz:flex maz:flex-col maz:gap-3">
            <MazInput v-model="email" label="Work email" type="email" block />
            <MazSwitch v-model="notifications" label="Release notes" />
            <MazBtn block :end-icon="MazCheck">
              Create workspace
            </MazBtn>
          </div>
        </MazCard>
      </div>

      <div :class="LAYER" class="maz:inset-e-[2%] maz:top-[46%] maz:w-72 maz:[--hero-z:5rem] maz:[animation-delay:-1s]">
        <MazCard bordered radius elevation block>
          <div class="maz:flex maz:items-center maz:gap-4">
            <MazCircularProgressBar :percentage="progress" size="4.5rem" color="secondary" :once="false" suffix="%" />
            <div class="maz:min-w-0 maz:flex-1">
              <p class="maz:m-0 maz:mb-3 maz:text-sm maz:font-semibold">
                Sprint progress
              </p>
              <MazSlider v-model="progress" :divider="false" color="secondary" aria-label="Sprint progress" />
            </div>
          </div>
        </MazCard>
      </div>

      <div :class="LAYER" class="maz:inset-s-[30%] maz:bottom-[2%] maz:flex maz:gap-2 maz:[--hero-z:15.714286rem] maz:[animation-delay:-3s]">
        <MazBadge color="primary" rounded-size="full">
          Vue 3
        </MazBadge>
        <MazBadge color="secondary" rounded-size="full">
          Nuxt
        </MazBadge>
        <MazBadge color="accent" rounded-size="full">
          TypeScript
        </MazBadge>
      </div>
    </div>
  </div>
</template>
