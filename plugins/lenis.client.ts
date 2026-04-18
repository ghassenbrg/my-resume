import Lenis from 'lenis'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import 'lenis/dist/lenis.css'

export default defineNuxtPlugin((nuxtApp) => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  let lenis: Lenis | null = null

  if (!prefersReducedMotion) {
    lenis = new Lenis({
      duration: 1.1,
      easing: (time: number) => Math.min(1, 1.001 - 2 ** (-10 * time)),
      smoothWheel: true,
      syncTouch: false,
    })

    lenis.on('scroll', ScrollTrigger.update)

    let frameId = 0

    const raf = (time: number) => {
      lenis?.raf(time)
      frameId = requestAnimationFrame(raf)
    }

    frameId = requestAnimationFrame(raf)

    nuxtApp.hook('page:finish', () => {
      lenis?.resize()
      ScrollTrigger.refresh()
    })

    window.addEventListener(
      'pagehide',
      () => {
        cancelAnimationFrame(frameId)
        lenis?.destroy()
      },
      { once: true },
    )
  }

  return {
    provide: {
      lenis,
    },
  }
})
