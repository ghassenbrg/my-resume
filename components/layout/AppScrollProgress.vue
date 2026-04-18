<template>
  <div class="scroll-progress" aria-hidden="true">
    <span class="scroll-progress__bar" :style="{ transform: `scaleX(${progressRatio})` }"></span>
  </div>
</template>

<script setup lang="ts">
const progress = ref(0)

const progressRatio = computed(() => progress.value / 100)

const updateProgress = () => {
  const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight

  if (scrollableHeight <= 0) {
    progress.value = 0
    return
  }

  progress.value = Math.min(100, Math.max(0, (window.scrollY / scrollableHeight) * 100))
}

onMounted(() => {
  updateProgress()
  window.addEventListener('scroll', updateProgress, { passive: true })
  window.addEventListener('resize', updateProgress)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', updateProgress)
  window.removeEventListener('resize', updateProgress)
})
</script>

<style scoped>
.scroll-progress {
  position: fixed;
  top: 0;
  left: 0;
  z-index: var(--z-sticky);
  width: 100%;
  height: 2px;
  overflow: hidden;
  background: rgba(42, 42, 68, 0.7);
}

.scroll-progress__bar {
  display: block;
  width: 100%;
  height: 100%;
  transform-origin: left center;
  background: var(--accent-amber);
  box-shadow: var(--shadow-glow);
  transition: transform 120ms ease-out;
}

@media (prefers-reduced-motion: reduce) {
  .scroll-progress__bar {
    transition: none;
  }
}
</style>
