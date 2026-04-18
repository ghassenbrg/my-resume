<template>
  <div
    v-if="isVisible"
    ref="loaderRef"
    class="app-loader"
    aria-hidden="true"
  >
    <span ref="revealRef" class="app-loader__reveal"></span>
    <span ref="logoRef" class="app-loader__logo">GB</span>
  </div>
</template>

<script setup lang="ts">
const isVisible = ref(true)
const loaderRef = ref<HTMLElement | null>(null)
const revealRef = ref<HTMLElement | null>(null)
const logoRef = ref<HTMLElement | null>(null)

onMounted(async () => {
  await nextTick()

  const { $prefersReducedMotion } = useNuxtApp()

  if ($prefersReducedMotion) {
    isVisible.value = false
    return
  }

  if (!loaderRef.value || !revealRef.value || !logoRef.value) {
    isVisible.value = false
    return
  }

  window.setTimeout(() => {
    isVisible.value = false
  }, 1600)
})
</script>

<style scoped>
.app-loader {
  position: fixed;
  inset: 0;
  z-index: var(--z-loader);
  display: grid;
  place-items: center;
  overflow: hidden;
  background: var(--bg-0);
  animation: loader-fade 1.6s ease both;
}

.app-loader__reveal {
  position: absolute;
  width: 220vmax;
  aspect-ratio: 1;
  border-radius: var(--radius-full);
  background: var(--bg-1);
  transform: scale(0);
  transform-origin: center;
  animation: loader-reveal 1.6s cubic-bezier(0.22, 1, 0.36, 1) both;
}

.app-loader__logo {
  position: relative;
  z-index: 1;
  display: grid;
  width: 5rem;
  aspect-ratio: 1;
  place-items: center;
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-full);
  background: var(--bg-2);
  color: var(--text-0);
  font-family: var(--font-heading);
  font-size: var(--text-h3);
  font-weight: 700;
  box-shadow: var(--shadow-glow);
  animation: loader-logo 1.6s cubic-bezier(0.22, 1, 0.36, 1) both;
}

@keyframes loader-fade {
  0%,
  62.5% {
    opacity: 1;
    background: var(--bg-0);
  }

  75% {
    background: rgba(9, 9, 15, 0);
  }

  100% {
    opacity: 0;
    background: rgba(9, 9, 15, 0);
  }
}

@keyframes loader-reveal {
  0%,
  37.5% {
    opacity: 1;
    transform: scale(0);
  }

  62.5% {
    opacity: 1;
    transform: scale(1);
  }

  75%,
  100% {
    opacity: 0;
    transform: scale(1);
  }
}

@keyframes loader-logo {
  0% {
    opacity: 0;
    transform: scale(0.8);
  }

  12.5%,
  62.5% {
    opacity: 1;
    transform: scale(1);
  }

  75% {
    opacity: 1;
    transform: translate(calc(-50vw + 3rem), calc(-50vh + 3rem)) scale(0.56);
  }

  87.5%,
  100% {
    opacity: 0;
    transform: translate(calc(-50vw + 3rem), calc(-50vh + 3rem)) scale(0.56);
  }
}

@media (prefers-reduced-motion: reduce) {
  .app-loader {
    display: none;
  }
}
</style>
