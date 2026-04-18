import type { Ref } from 'vue'

interface MagneticEffectOptions {
  strength?: number
  maxDistance?: number
}

export const useMagneticEffect = (
  target: Ref<HTMLElement | null>,
  options: MagneticEffectOptions = {},
) => {
  const { strength = 0.25, maxDistance = 120 } = options
  const isEnabled = ref(false)

  let mediaQuery: MediaQueryList | null = null

  const reset = () => {
    target.value?.style.removeProperty('transform')
  }

  const handlePointerMove = (event: PointerEvent) => {
    const element = target.value

    if (!element || !isEnabled.value) {
      return
    }

    const rect = element.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const deltaX = event.clientX - centerX
    const deltaY = event.clientY - centerY
    const distance = Math.hypot(deltaX, deltaY)

    if (distance > maxDistance) {
      reset()
      return
    }

    element.style.transform = `translate3d(${deltaX * strength}px, ${deltaY * strength}px, 0)`
  }

  const handlePointerLeave = () => {
    reset()
  }

  onMounted(() => {
    mediaQuery = window.matchMedia('(hover: hover) and (pointer: fine)')
    isEnabled.value = mediaQuery.matches

    window.addEventListener('pointermove', handlePointerMove)
    target.value?.addEventListener('pointerleave', handlePointerLeave)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('pointermove', handlePointerMove)
    target.value?.removeEventListener('pointerleave', handlePointerLeave)
    reset()
  })

  return {
    isEnabled: readonly(isEnabled),
    reset,
  }
}
