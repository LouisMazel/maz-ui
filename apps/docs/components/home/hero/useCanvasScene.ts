import type { Ref } from 'vue'
import { useTheme } from '@maz-ui/themes/composables/useTheme'
import { onBeforeUnmount, onMounted, watch } from 'vue'

export interface CanvasScene {
  ctx: CanvasRenderingContext2D
  width: number
  height: number
  pointer: { x: number, y: number, active: boolean }
  colors: Record<'primary' | 'secondary' | 'accent' | 'muted' | 'foreground', string>
}

interface Options {
  setup: (scene: CanvasScene) => void
  frame: (scene: CanvasScene, delta: number) => void
}

const ROLES = [
  'primary',
  'secondary',
  'accent',
  'muted',
  'foreground',
] as const

export function useCanvasScene(canvas: Ref<HTMLCanvasElement | undefined>, { setup, frame }: Options) {
  const { isDark } = useTheme()
  let scene: CanvasScene | undefined
  let raf = 0
  let last = 0
  let visible = false
  let resizeObserver: ResizeObserver | undefined
  let intersectionObserver: IntersectionObserver | undefined
  const reducedMotion = typeof window !== 'undefined' && globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches

  function readColors(element: HTMLElement): CanvasScene['colors'] {
    const probe = document.createElement('span')
    element.parentElement?.append(probe)
    const colors = Object.fromEntries(ROLES.map((role) => {
      probe.style.color = `var(--maz-${role})`
      return [role, getComputedStyle(probe).color]
    })) as CanvasScene['colors']
    probe.remove()

    return colors
  }

  function resize() {
    const element = canvas.value
    if (!element || !scene)
      return
    const ratio = Math.min(window.devicePixelRatio || 1, 2)
    const { width, height } = element.getBoundingClientRect()
    element.width = Math.round(width * ratio)
    element.height = Math.round(height * ratio)
    scene.ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
    scene.width = width
    scene.height = height
    setup(scene)
    if (reducedMotion)
      frame(scene, 0)
  }

  function loop(time: number) {
    if (!scene || !visible)
      return
    const delta = Math.min((time - (last || time)) / 16.67, 3)
    last = time
    frame(scene, delta)
    raf = requestAnimationFrame(loop)
  }

  function start() {
    if (reducedMotion || raf)
      return
    last = 0
    raf = requestAnimationFrame(loop)
  }

  function stop() {
    cancelAnimationFrame(raf)
    raf = 0
  }

  function onPointerMove(event: PointerEvent) {
    const element = canvas.value
    if (!element || !scene)
      return
    const rect = element.getBoundingClientRect()
    scene.pointer.x = event.clientX - rect.left
    scene.pointer.y = event.clientY - rect.top
    scene.pointer.active = scene.pointer.y >= 0 && scene.pointer.y <= rect.height
  }

  function onPointerLeave() {
    if (scene)
      scene.pointer.active = false
  }

  onMounted(() => {
    const element = canvas.value
    const ctx = element?.getContext('2d')
    if (!element || !ctx)
      return

    scene = {
      ctx,
      width: 0,
      height: 0,
      pointer: { x: 0, y: 0, active: false },
      colors: readColors(element),
    }
    resize()

    resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(element)

    intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = !!entry?.isIntersecting
      if (visible)
        start()
      else
        stop()
    })
    intersectionObserver.observe(element)

    globalThis.addEventListener('pointermove', onPointerMove, { passive: true })
    document.documentElement.addEventListener('pointerleave', onPointerLeave)
  })

  watch(isDark, () => {
    requestAnimationFrame(() => {
      if (!scene || !canvas.value)
        return
      scene.colors = readColors(canvas.value)
      if (reducedMotion)
        frame(scene, 0)
    })
  })

  onBeforeUnmount(() => {
    stop()
    resizeObserver?.disconnect()
    intersectionObserver?.disconnect()
    globalThis.removeEventListener('pointermove', onPointerMove)
    document.documentElement.removeEventListener('pointerleave', onPointerLeave)
  })
}
