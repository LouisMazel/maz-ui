<script lang="ts" setup>
import type { CanvasScene } from './useCanvasScene'
import { ref } from 'vue'
import { useCanvasScene } from './useCanvasScene'

interface Dot {
  baseX: number
  baseY: number
  x: number
  y: number
  glow: number
}

const canvas = ref<HTMLCanvasElement>()
const SPACING = 26
const RADIUS = 190
const PUSH = 26

let dots: Dot[] = []

function setup({ width, height }: CanvasScene) {
  dots = []
  for (let y = SPACING / 2; y < height; y += SPACING) {
    for (let x = SPACING / 2; x < width; x += SPACING)
      dots.push({ baseX: x, baseY: y, x, y, glow: 0 })
  }
}

function frame({ ctx, width, height, pointer, colors }: CanvasScene, delta: number) {
  ctx.clearRect(0, 0, width, height)
  const ease = Math.min(0.14 * delta, 1)

  for (const dot of dots) {
    let targetX = dot.baseX
    let targetY = dot.baseY
    let targetGlow = 0
    if (pointer.active) {
      const dx = dot.baseX - pointer.x
      const dy = dot.baseY - pointer.y
      const distance = Math.hypot(dx, dy)
      if (distance < RADIUS && distance > 0) {
        const influence = (1 - distance / RADIUS) ** 2
        targetX += (dx / distance) * influence * PUSH
        targetY += (dy / distance) * influence * PUSH
        targetGlow = influence
      }
    }
    dot.x += (targetX - dot.x) * ease
    dot.y += (targetY - dot.y) * ease
    dot.glow += (targetGlow - dot.glow) * ease

    ctx.globalAlpha = 0.22 + dot.glow * 0.78
    ctx.fillStyle = dot.glow > 0.05
      ? (dot.glow > 0.45
          ? colors.primary
          : colors.secondary)
      : colors.muted
    ctx.beginPath()
    ctx.arc(dot.x, dot.y, 1.1 + dot.glow * 2.6, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.globalAlpha = 1
}

useCanvasScene(canvas, { setup, frame })
</script>

<template>
  <canvas ref="canvas" class="maz:pointer-events-none maz:absolute maz:inset-0 maz:size-full" aria-hidden="true" />
</template>
