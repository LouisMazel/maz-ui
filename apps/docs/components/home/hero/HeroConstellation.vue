<script lang="ts" setup>
import type { CanvasScene } from './useCanvasScene'
import { ref } from 'vue'
import { useCanvasScene } from './useCanvasScene'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  role: 'primary' | 'secondary' | 'accent'
}

const canvas = ref<HTMLCanvasElement>()
const ROLES = ['primary', 'secondary', 'accent'] as const
const LINK_DISTANCE = 120
const POINTER_RADIUS = 160

let particles: Particle[] = []

function setup({ width, height }: CanvasScene) {
  const count = Math.min(170, Math.round((width * height) / 8000))
  particles = Array.from({ length: count }, (_, index) => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.35,
    vy: (Math.random() - 0.5) * 0.35,
    radius: 1 + Math.random() * 1.8,
    role: ROLES[index % ROLES.length]!,
  }))
}

function frame({ ctx, width, height, pointer, colors }: CanvasScene, delta: number) {
  ctx.clearRect(0, 0, width, height)

  for (const particle of particles) {
    if (pointer.active) {
      const dx = particle.x - pointer.x
      const dy = particle.y - pointer.y
      const distance = Math.hypot(dx, dy)
      if (distance < POINTER_RADIUS && distance > 0) {
        const force = (1 - distance / POINTER_RADIUS) * 0.6
        particle.vx += (dx / distance) * force * delta
        particle.vy += (dy / distance) * force * delta
      }
    }
    particle.vx *= 0.96
    particle.vy *= 0.96
    particle.vx += (Math.random() - 0.5) * 0.02
    particle.vy += (Math.random() - 0.5) * 0.02
    particle.x = (particle.x + particle.vx * delta + width) % width
    particle.y = (particle.y + particle.vy * delta + height) % height
  }

  ctx.lineWidth = 1
  for (let i = 0; i < particles.length; i++) {
    const a = particles[i]!
    for (let j = i + 1; j < particles.length; j++) {
      const b = particles[j]!
      const distance = Math.hypot(a.x - b.x, a.y - b.y)
      if (distance < LINK_DISTANCE) {
        ctx.globalAlpha = (1 - distance / LINK_DISTANCE) * 0.35
        ctx.strokeStyle = colors[a.role]
        ctx.beginPath()
        ctx.moveTo(a.x, a.y)
        ctx.lineTo(b.x, b.y)
        ctx.stroke()
      }
    }
    if (pointer.active) {
      const distance = Math.hypot(a.x - pointer.x, a.y - pointer.y)
      if (distance < POINTER_RADIUS * 1.4) {
        ctx.globalAlpha = (1 - distance / (POINTER_RADIUS * 1.4)) * 0.6
        ctx.strokeStyle = colors.primary
        ctx.beginPath()
        ctx.moveTo(a.x, a.y)
        ctx.lineTo(pointer.x, pointer.y)
        ctx.stroke()
      }
    }
  }

  for (const particle of particles) {
    ctx.globalAlpha = 0.9
    ctx.fillStyle = colors[particle.role]
    ctx.beginPath()
    ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.globalAlpha = 1
}

useCanvasScene(canvas, { setup, frame })
</script>

<template>
  <canvas ref="canvas" class="maz:pointer-events-none maz:absolute maz:inset-0 maz:size-full" aria-hidden="true" />
</template>
