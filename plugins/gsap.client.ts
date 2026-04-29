type GsapRuntime = {
  gsap: typeof import('gsap')['gsap']
  ScrollTrigger: typeof import('gsap/ScrollTrigger')['ScrollTrigger']
  SplitText: typeof import('gsap/SplitText')['SplitText']
  prefersReducedMotion: boolean
}

export default defineNuxtPlugin(() => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  let runtimePromise: Promise<GsapRuntime> | null = null

  const loadGsap = () => {
    runtimePromise ??= Promise.all([
      import('gsap'),
      import('gsap/ScrollTrigger'),
      import('gsap/SplitText'),
    ]).then(([{ gsap }, { ScrollTrigger }, { SplitText }]) => {
      gsap.registerPlugin(ScrollTrigger, SplitText)

      if (prefersReducedMotion) {
        gsap.defaults({
          duration: 0,
          ease: 'none',
        })
      }

      return {
        gsap,
        ScrollTrigger,
        SplitText,
        prefersReducedMotion,
      }
    })

    return runtimePromise
  }

  return {
    provide: {
      loadGsap,
      prefersReducedMotion,
    },
  }
})
