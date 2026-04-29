import type Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import { shallowRef } from 'vue'

export default defineNuxtPlugin((nuxtApp) => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const lenis = shallowRef<Lenis | null>(null)

  const initializeLenis = async () => {
    if (prefersReducedMotion || lenis.value) {
      return
    }

    const loadGsap = nuxtApp.$loadGsap as () => Promise<{
      ScrollTrigger: typeof import('gsap/ScrollTrigger')['ScrollTrigger']
    }>
    const [{ default: Lenis }, { ScrollTrigger }] = await Promise.all([
      import('lenis'),
      loadGsap(),
    ])

    const instance = new Lenis({
      duration: 1.1,
      easing: (time: number) => Math.min(1, 1.001 - 2 ** (-10 * time)),
      smoothWheel: true,
      syncTouch: false,
    })
    lenis.value = instance

    instance.on('scroll', ScrollTrigger.update)

    let frameId = 0

    const raf = (time: number) => {
      lenis.value?.raf(time)
      frameId = requestAnimationFrame(raf)
    }

    frameId = requestAnimationFrame(raf)

    nuxtApp.hook('page:finish', () => {
      lenis.value?.resize()
      ScrollTrigger.refresh()
    })

    window.addEventListener(
      'pagehide',
      () => {
        cancelAnimationFrame(frameId)
        lenis.value?.destroy()
        lenis.value = null
      },
      { once: true },
    )
  }

  window.setTimeout(() => {
    void initializeLenis()
  }, 1600)

  return {
    provide: {
      lenis,
    },
  }
})
