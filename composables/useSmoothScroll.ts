import type Lenis from 'lenis'

type ScrollTarget = Parameters<Lenis['scrollTo']>[0]
type ScrollToOptions = Parameters<Lenis['scrollTo']>[1]

export const useSmoothScroll = () => {
  const { $lenis } = useNuxtApp()

  const scrollTo = (target: ScrollTarget, options?: ScrollToOptions) => {
    const lenis = unref($lenis)

    if (lenis) {
      lenis.scrollTo(target, options)
      return
    }

    if (!import.meta.client) {
      return
    }

    if (typeof target === 'number') {
      window.scrollTo({
        top: target,
        behavior: 'smooth',
      })
      return
    }

    if (typeof target === 'string') {
      document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' })
      return
    }

    target.scrollIntoView({ behavior: 'smooth' })
  }

  const stop = () => {
    unref($lenis)?.stop()
  }

  const start = () => {
    unref($lenis)?.start()
  }

  return {
    lenis: $lenis,
    scrollTo,
    stop,
    start,
  }
}
