<template>
  <div ref="rowRef" class="lang-row">
    <div class="lang-top">
      <span class="lang-code">{{ lng.code }}</span>
      <div class="lang-name-wrap">
        <span class="lang-name">{{ lng.language }}</span>
        <span class="lang-level">{{ lng.level }}</span>
      </div>
      <span v-if="showPercentage" class="lang-pct">{{ lng.percentage }}%</span>
    </div>
    <div class="lang-track">
      <div
        class="lang-fill"
        role="progressbar"
        :aria-valuenow="lng.percentage"
        aria-valuemin="0"
        aria-valuemax="100"
        :aria-label="lng.language"
        :style="{ width: `${width}%` }"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Language } from '~/types/cv'

const props = withDefaults(
  defineProps<{ lng: Language; index: number; showPercentage?: boolean }>(),
  { showPercentage: true },
)

const rowRef = ref<HTMLElement | null>(null)
const width = ref(0)

onMounted(() => {
  const el = rowRef.value
  if (!el) {
    return
  }

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReduced || !('IntersectionObserver' in window)) {
    width.value = props.lng.percentage
    return
  }

  let timer = 0

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          timer = window.setTimeout(() => {
            width.value = props.lng.percentage
          }, 120 + props.index * 90)
          observer.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.4 },
  )

  observer.observe(el)
  onBeforeUnmount(() => {
    observer.disconnect()
    window.clearTimeout(timer)
  })
})

// Keep the bar in sync if the dataset (percentage) changes on a language switch.
watch(
  () => props.lng.percentage,
  (value) => {
    if (width.value !== 0) {
      width.value = value
    }
  },
)
</script>
