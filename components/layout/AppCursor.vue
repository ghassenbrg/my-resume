<template>
  <div
    v-if="isEnabled"
    class="app-cursor"
    aria-hidden="true"
    :class="{ 'app-cursor--active': isHoveringInteractive }"
  >
    <span class="app-cursor__dot" :style="dotStyle"></span>
    <span class="app-cursor__ring" :style="ringStyle">
      <span v-if="cursorLabel" class="app-cursor__label">{{ cursorLabel }}</span>
    </span>
  </div>
</template>

<script setup lang="ts">
const isEnabled = ref(false)
const isHoveringInteractive = ref(false)
const cursorLabel = ref('')

const pointer = reactive({
  x: 0,
  y: 0,
})

const follower = reactive({
  x: 0,
  y: 0,
})

let frameId = 0
let pointerQuery: MediaQueryList | null = null
let reducedMotionQuery: MediaQueryList | null = null

const interactiveSelector = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'textarea:not([disabled])',
  'select:not([disabled])',
  '[role="button"]',
  '[data-cursor-label]',
].join(',')

const dotStyle = computed(() => ({
  transform: `translate3d(${pointer.x}px, ${pointer.y}px, 0)`,
}))

const ringStyle = computed(() => ({
  transform: `translate3d(${follower.x}px, ${follower.y}px, 0)`,
}))

const updateEnabledState = () => {
  const hasFinePointer = pointerQuery?.matches ?? false
  const allowsMotion = !(reducedMotionQuery?.matches ?? false)

  isEnabled.value = hasFinePointer && allowsMotion
  document.documentElement.classList.toggle('has-custom-cursor', isEnabled.value)
}

const getCursorLabel = (element: Element) => {
  const explicitLabel = element.closest<HTMLElement>('[data-cursor-label]')?.dataset.cursorLabel

  if (explicitLabel) {
    return explicitLabel
  }

  if (element.closest('a[href]')) {
    return 'View'
  }

  return 'Click'
}

const updateInteractiveState = (target: EventTarget | null) => {
  if (!(target instanceof Element)) {
    isHoveringInteractive.value = false
    cursorLabel.value = ''
    return
  }

  const interactiveElement = target.closest(interactiveSelector)

  isHoveringInteractive.value = Boolean(interactiveElement)
  cursorLabel.value = interactiveElement ? getCursorLabel(interactiveElement) : ''
}

const handlePointerMove = (event: PointerEvent) => {
  pointer.x = event.clientX
  pointer.y = event.clientY
  updateInteractiveState(event.target)
}

const handlePointerLeave = () => {
  isHoveringInteractive.value = false
  cursorLabel.value = ''
}

const animateFollower = () => {
  follower.x += (pointer.x - follower.x) * 0.18
  follower.y += (pointer.y - follower.y) * 0.18
  frameId = requestAnimationFrame(animateFollower)
}

onMounted(() => {
  pointerQuery = window.matchMedia('(hover: hover) and (pointer: fine)')
  reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

  updateEnabledState()

  pointerQuery.addEventListener('change', updateEnabledState)
  reducedMotionQuery.addEventListener('change', updateEnabledState)
  window.addEventListener('pointermove', handlePointerMove, { passive: true })
  window.addEventListener('pointerleave', handlePointerLeave)

  frameId = requestAnimationFrame(animateFollower)
})

onBeforeUnmount(() => {
  pointerQuery?.removeEventListener('change', updateEnabledState)
  reducedMotionQuery?.removeEventListener('change', updateEnabledState)
  window.removeEventListener('pointermove', handlePointerMove)
  window.removeEventListener('pointerleave', handlePointerLeave)
  cancelAnimationFrame(frameId)
  document.documentElement.classList.remove('has-custom-cursor')
})
</script>

<style scoped>
.app-cursor {
  position: fixed;
  inset: 0;
  z-index: var(--z-cursor);
  pointer-events: none;
}

.app-cursor__dot,
.app-cursor__ring {
  position: fixed;
  top: 0;
  left: 0;
  display: grid;
  place-items: center;
  border-radius: var(--radius-full);
  pointer-events: none;
  translate: -50% -50%;
}

.app-cursor__dot {
  width: 0.45rem;
  aspect-ratio: 1;
  background: var(--accent-amber);
  box-shadow: var(--shadow-glow);
}

.app-cursor__ring {
  width: 2.25rem;
  aspect-ratio: 1;
  border: 1px solid rgba(245, 240, 232, 0.48);
  color: var(--bg-0);
  transition:
    width 160ms ease,
    border-color 160ms ease,
    background 160ms ease,
    color 160ms ease;
}

.app-cursor--active .app-cursor__ring {
  width: 4.5rem;
  border-color: var(--accent-amber);
  background: var(--accent-amber);
  box-shadow: var(--shadow-glow);
}

.app-cursor__label {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  font-weight: 500;
  line-height: 1;
  opacity: 0;
  transition: opacity 120ms ease;
}

.app-cursor--active .app-cursor__label {
  opacity: 1;
}

:global(.has-custom-cursor),
:global(.has-custom-cursor *) {
  cursor: none;
}

@media (hover: none), (pointer: coarse), (prefers-reduced-motion: reduce) {
  .app-cursor {
    display: none;
  }

  :global(.has-custom-cursor),
  :global(.has-custom-cursor *) {
    cursor: auto;
  }
}
</style>
