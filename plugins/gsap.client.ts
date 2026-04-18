import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

export default defineNuxtPlugin(() => {
  gsap.registerPlugin(ScrollTrigger, SplitText)

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (prefersReducedMotion) {
    gsap.defaults({
      duration: 0,
      ease: 'none',
    })
  }

  return {
    provide: {
      gsap,
      ScrollTrigger,
      SplitText,
      prefersReducedMotion,
    },
  }
})
