interface TypewriterOptions {
  delay?: number
  startDelay?: number
}

export const useTypewriter = (text: MaybeRefOrGetter<string>, options: TypewriterOptions = {}) => {
  const { delay = 30, startDelay = 0 } = options
  const output = ref('')
  const isComplete = ref(false)

  let timeoutId: ReturnType<typeof window.setTimeout> | null = null

  const clearTimer = () => {
    if (timeoutId) {
      window.clearTimeout(timeoutId)
      timeoutId = null
    }
  }

  const start = () => {
    if (!import.meta.client) {
      output.value = toValue(text)
      isComplete.value = true
      return
    }

    clearTimer()

    const value = toValue(text)
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    output.value = ''
    isComplete.value = false

    if (prefersReducedMotion) {
      output.value = value
      isComplete.value = true
      return
    }

    let index = 0

    const tick = () => {
      output.value = value.slice(0, index)

      if (index > value.length) {
        isComplete.value = true
        return
      }

      index += 1
      timeoutId = window.setTimeout(tick, delay)
    }

    timeoutId = window.setTimeout(tick, startDelay)
  }

  onBeforeUnmount(clearTimer)

  return {
    output: readonly(output),
    isComplete: readonly(isComplete),
    start,
    reset: () => {
      clearTimer()
      output.value = ''
      isComplete.value = false
    },
  }
}
