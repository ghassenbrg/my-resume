<template>
  <component :is="component" v-if="isLoaded" />
  <div
    v-else
    :id="sectionId"
    ref="placeholderRef"
    class="lazy-section-placeholder"
    :style="placeholderStyle"
    :aria-label="`${label} section loading point`"
  ></div>
</template>

<script setup lang="ts">
import type { Component } from 'vue'

const props = withDefaults(
  defineProps<{
    sectionId: string
    label: string
    component: Component
    minHeight?: string
  }>(),
  {
    minHeight: '85svh',
  },
)

const placeholderRef = ref<HTMLElement | null>(null)
const isLoaded = ref(false)

let observer: IntersectionObserver | null = null

const placeholderStyle = computed(() => ({
  minHeight: props.minHeight,
}))

const loadSection = () => {
  isLoaded.value = true
  observer?.disconnect()
  observer = null
}

const handleHashChange = () => {
  if (window.location.hash === `#${props.sectionId}`) {
    loadSection()
  }
}

onMounted(() => {
  if (window.location.hash === `#${props.sectionId}`) {
    loadSection()
    return
  }

  const placeholder = placeholderRef.value

  if (!placeholder || !('IntersectionObserver' in window)) {
    loadSection()
    return
  }

  observer = new IntersectionObserver(
    (entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        loadSection()
      }
    },
    {
      rootMargin: '128px 0px',
    },
  )

  observer.observe(placeholder)
  window.addEventListener('hashchange', handleHashChange)
})

onBeforeUnmount(() => {
  observer?.disconnect()
  window.removeEventListener('hashchange', handleHashChange)
})
</script>

<style scoped>
.lazy-section-placeholder {
  position: relative;
  scroll-margin-top: var(--space-20);
}
</style>
