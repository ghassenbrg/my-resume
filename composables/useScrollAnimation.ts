import type { Ref } from 'vue'

type ScrollTarget = Element | string
type AnimatedTarget = Element | Element[] | string

interface RevealOptions {
  trigger?: ScrollTarget
  start?: string
  end?: string
  y?: number
  duration?: number
  stagger?: number
  once?: boolean
  invalidateOnRefresh?: boolean
}

export const buildRevealScrollTriggerOptions = (target: ScrollTarget, options: RevealOptions = {}) => ({
  trigger: options.trigger ?? target,
  start: options.start ?? 'top 80%',
  end: options.end,
  once: options.once ?? false,
  invalidateOnRefresh: options.invalidateOnRefresh ?? false,
})

export const useScrollAnimation = () => {
  const { $loadGsap, $prefersReducedMotion } = useNuxtApp()
  const cleanups: Array<() => void> = []

  const reveal = async (target: AnimatedTarget | Ref<Element | null>, options: RevealOptions = {}) => {
    if (!import.meta.client || $prefersReducedMotion) {
      return
    }

    const element = isRef(target) ? target.value : target

    if (!element) {
      return
    }

    const { gsap } = await $loadGsap()
    const animation = gsap.from(element, {
      y: options.y ?? 40,
      opacity: 0,
      duration: options.duration ?? 0.8,
      stagger: options.stagger,
      ease: 'power3.out',
      scrollTrigger: buildRevealScrollTriggerOptions(element, options),
    })

    cleanups.push(() => {
      animation.scrollTrigger?.kill()
      animation.kill()
    })
  }

  const refresh = async () => {
    if (import.meta.client) {
      const { ScrollTrigger } = await $loadGsap()
      ScrollTrigger.refresh()
    }
  }

  onBeforeUnmount(() => {
    for (const cleanup of cleanups) {
      cleanup()
    }
    cleanups.length = 0
  })

  return {
    load: $loadGsap,
    reveal,
    refresh,
  }
}
