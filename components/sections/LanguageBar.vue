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
        :aria-valuetext="lng.level"
        aria-valuemin="0"
        aria-valuemax="100"
        :aria-label="lng.language"
        :style="{ width: `${width}%` }"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Language } from '~/types/cv'

const props = withDefaults(
  defineProps<{ lng: Language; index: number; showPercentage?: boolean }>(),
  { showPercentage: true },
)

const rowRef = ref<HTMLElement | null>(null)
const width = ref(0)
const revealed = ref(false)

onMounted(() => {
  const el = rowRef.value
  if (!el) {
    return
  }

  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)')
  const reveal = () => {
    revealed.value = true
    width.value = props.lng.percentage
  }
  let timer = 0

  const observer = !motionPreference.matches && 'IntersectionObserver' in window ? new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          timer = window.setTimeout(reveal, 120 + props.index * 90)
          observer?.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.4 },
  ) : null

  if (observer) observer.observe(el)
  else reveal()

  const onMotionChange = () => {
    if (motionPreference.matches) {
      window.clearTimeout(timer)
      observer?.disconnect()
      reveal()
    }
  }
  motionPreference.addEventListener('change', onMotionChange)
  onBeforeUnmount(() => {
    observer?.disconnect()
    window.clearTimeout(timer)
    motionPreference.removeEventListener('change', onMotionChange)
  })
})

// Keep the bar in sync if the dataset (percentage) changes on a language switch.
watch(
  () => props.lng.percentage,
  (value) => {
    if (revealed.value) {
      width.value = value
    }
  },
)
</script>
