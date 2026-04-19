<template>
  <div ref="rootRef" class="particle-canvas" aria-hidden="true">
    <ClientOnly>
      <TresCanvas
        v-if="isCanvasEnabled"
        class="particle-canvas__scene"
        :alpha="true"
        :antialias="true"
        :clear-alpha="0"
        :dpr="[1, 1.5]"
        render-mode="always"
        @ready="handleReady"
        @loop="handleLoop"
      />
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { TresCanvas, type TresContext, type TresContextWithClock } from '@tresjs/core'
import * as THREE from 'three'

const rootRef = ref<HTMLElement | null>(null)
const isCanvasEnabled = ref(false)

const pointer = {
  x: 0,
  y: 0,
}

let group: THREE.Group | null = null
let camera: THREE.PerspectiveCamera | null = null
let pointsGeometry: THREE.BufferGeometry | null = null
let linesGeometry: THREE.BufferGeometry | null = null
let context: TresContext | null = null
let mediaQuery: MediaQueryList | null = null
let motionQuery: MediaQueryList | null = null
let supportsWebGL = false

const particleCount = 72
const fieldRadius = 6

const updateEnabledState = () => {
  const canHover = mediaQuery?.matches ?? false
  const allowsMotion = !(motionQuery?.matches ?? false)

  isCanvasEnabled.value = supportsWebGL && canHover && allowsMotion
}

const detectWebGLSupport = () => {
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('webgl2') ?? canvas.getContext('webgl')

  return Boolean(context)
}

const createParticleSystem = () => {
  const positions = new Float32Array(particleCount * 3)
  const indices: number[] = []

  for (let index = 0; index < particleCount; index += 1) {
    const offset = index * 3
    positions[offset] = (Math.random() - 0.5) * fieldRadius * 2
    positions[offset + 1] = (Math.random() - 0.5) * fieldRadius
    positions[offset + 2] = (Math.random() - 0.5) * fieldRadius
  }

  for (let index = 0; index < particleCount - 1; index += 1) {
    indices.push(index, index + 1)

    if (index % 3 === 0 && index + 6 < particleCount) {
      indices.push(index, index + 6)
    }
  }

  pointsGeometry = new THREE.BufferGeometry()
  pointsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

  linesGeometry = new THREE.BufferGeometry()
  linesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  linesGeometry.setIndex(indices)

  const points = new THREE.Points(
    pointsGeometry,
    new THREE.PointsMaterial({
      color: '#f5f0e8',
      size: 0.055,
      transparent: true,
      opacity: 0.82,
      sizeAttenuation: true,
    }),
  )

  const lines = new THREE.LineSegments(
    linesGeometry,
    new THREE.LineBasicMaterial({
      color: '#e8a838',
      transparent: true,
      opacity: 0.16,
    }),
  )

  group = new THREE.Group()
  group.add(points, lines)

  return group
}

const handleReady = (readyContext: TresContext) => {
  context = readyContext
  camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100)
  camera.position.set(0, 0, 9)

  readyContext.camera.registerCamera(camera, true)
  readyContext.scene.value.add(camera)
  readyContext.scene.value.add(createParticleSystem())
}

const handleLoop = ({ elapsed }: TresContextWithClock) => {
  if (!group || !camera || !context) {
    return
  }

  const width = context.sizes.width.value
  const height = context.sizes.height.value

  if (height > 0) {
    camera.aspect = width / height
    camera.updateProjectionMatrix()
  }

  group.rotation.y = elapsed * 0.035 + pointer.x * 0.12
  group.rotation.x = pointer.y * 0.08
}

const handlePointerMove = (event: PointerEvent) => {
  pointer.x = (event.clientX / window.innerWidth - 0.5) * 2
  pointer.y = (event.clientY / window.innerHeight - 0.5) * 2
}

onMounted(() => {
  mediaQuery = window.matchMedia('(min-width: 768px) and (hover: hover) and (pointer: fine)')
  motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  supportsWebGL = detectWebGLSupport()

  updateEnabledState()
  mediaQuery.addEventListener('change', updateEnabledState)
  motionQuery.addEventListener('change', updateEnabledState)
  window.addEventListener('pointermove', handlePointerMove, { passive: true })
})

onBeforeUnmount(() => {
  mediaQuery?.removeEventListener('change', updateEnabledState)
  motionQuery?.removeEventListener('change', updateEnabledState)
  window.removeEventListener('pointermove', handlePointerMove)

  if (group && context) {
    context.scene.value.remove(group)
  }

  pointsGeometry?.dispose()
  linesGeometry?.dispose()
})
</script>

<style scoped>
.particle-canvas {
  position: absolute;
  inset: 0;
  z-index: var(--z-base);
  overflow: hidden;
  opacity: 0;
  animation: particle-fade-in 1s ease forwards;
}

.particle-canvas::before {
  content: "";
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 50% 45%, rgba(232, 168, 56, 0.12), transparent 32%),
    linear-gradient(180deg, rgba(9, 9, 15, 0), var(--bg-1));
}

.particle-canvas__scene {
  width: 100%;
  height: 100%;
}

@keyframes particle-fade-in {
  to {
    opacity: 1;
  }
}

@media (max-width: 767px), (hover: none), (pointer: coarse), (prefers-reduced-motion: reduce) {
  .particle-canvas {
    display: none;
  }
}
</style>
