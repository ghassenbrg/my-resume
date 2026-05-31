/* Global reveal-on-scroll: any element with `.reveal` fades up when in view.
 * Re-scans when `dep` changes (e.g. language / theme switch re-renders content).
 * Ported from the design's lib.jsx with a scroll-position fallback so content
 * can never get stuck invisible. */

/* Shared trigger so feature components (e.g. the Skills tab filter) can ask the
 * single observer in the layout to re-scan after they swap `.reveal` content. */
export const useRevealController = () => {
  const version = useState('reveal-version', () => 0)
  const bumpReveal = () => {
    version.value += 1
  }

  return { revealVersion: version, bumpReveal }
}

export const useRevealObserver = (dep?: MaybeRefOrGetter<unknown>) => {
  if (!import.meta.client) {
    return
  }

  let observer: IntersectionObserver | null = null
  let onScroll: (() => void) | null = null

  const teardown = () => {
    observer?.disconnect()
    observer = null

    if (onScroll) {
      window.removeEventListener('scroll', onScroll)
      onScroll = null
    }
  }

  const scan = () => {
    teardown()

    const reveal = (element: Element) => element.classList.add('in')
    const inView = (element: Element) => {
      const rect = element.getBoundingClientRect()

      return rect.top < window.innerHeight * 0.92 && rect.bottom > 0
    }

    const elements = Array.from(document.querySelectorAll('.reveal:not(.in)'))

    if (!elements.length) {
      return
    }

    // Immediate pass: anything already on-screen reveals right away.
    elements.forEach((element) => {
      if (inView(element)) {
        reveal(element)
      }
    })

    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              reveal(entry.target)
              observer?.unobserve(entry.target)
            }
          })
        },
        { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
      )

      elements.forEach((element) => {
        if (!element.classList.contains('in')) {
          observer?.observe(element)
        }
      })
    }

    // Scroll fallback: guarantees nothing stays hidden even if IO misses.
    onScroll = () => {
      let remaining = false

      document.querySelectorAll('.reveal:not(.in)').forEach((element) => {
        if (inView(element)) {
          reveal(element)
        } else {
          remaining = true
        }
      })

      if (!remaining && onScroll) {
        window.removeEventListener('scroll', onScroll)
        onScroll = null
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
  }

  const rescan = () => nextTick(scan)

  onMounted(rescan)

  if (dep !== undefined) {
    watch(() => toValue(dep), rescan)
  }

  onBeforeUnmount(teardown)

  return { rescan }
}
