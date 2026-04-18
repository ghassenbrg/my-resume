import type { Ref } from 'vue'

type ScrollTarget = Element | string
type AnimatedTarget = Element | Element[] | string

interface RevealOptions {
  trigger?: ScrollTarget
  start?: string
  y?: number
  duration?: number
  stagger?: number
}

export const useScrollAnimation = () => {
  const { $gsap, $ScrollTrigger, $prefersReducedMotion } = useNuxtApp()
  const cleanups: Array<() => void> = []

  const reveal = (target: AnimatedTarget | Ref<Element | null>, options: RevealOptions = {}) => {
    if (!import.meta.client || $prefersReducedMotion) {
      return
    }

    const element = isRef(target) ? target.value : target

    if (!element) {
      return
    }

    const animation = $gsap.from(element, {
      y: options.y ?? 40,
      opacity: 0,
      duration: options.duration ?? 0.8,
      stagger: options.stagger,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: options.trigger ?? element,
        start: options.start ?? 'top 80%',
      },
    })

    cleanups.push(() => {
      animation.scrollTrigger?.kill()
      animation.kill()
    })
  }

  const refresh = () => {
    if (import.meta.client) {
      $ScrollTrigger.refresh()
    }
  }

  onBeforeUnmount(() => {
    for (const cleanup of cleanups) {
      cleanup()
    }
    cleanups.length = 0
  })

  return {
    gsap: $gsap,
    ScrollTrigger: $ScrollTrigger,
    reveal,
    refresh,
  }
}
