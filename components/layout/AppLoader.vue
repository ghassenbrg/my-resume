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

  const { $gsap, $prefersReducedMotion } = useNuxtApp()

  if ($prefersReducedMotion) {
    isVisible.value = false
    return
  }

  const loader = loaderRef.value
  const reveal = revealRef.value
  const logo = logoRef.value

  if (!loader || !reveal || !logo) {
    isVisible.value = false
    return
  }

  $gsap
    .timeline({
      defaults: {
        ease: 'power3.out',
      },
      onComplete: () => {
        isVisible.value = false
      },
    })
    .set(loader, {
      autoAlpha: 1,
    })
    .set(reveal, {
      scale: 0,
    })
    .fromTo(
      logo,
      {
        autoAlpha: 0,
        scale: 0.8,
      },
      {
        autoAlpha: 1,
        scale: 1,
        duration: 0.4,
      },
      0.2,
    )
    .to(
      reveal,
      {
        scale: 1,
        duration: 0.4,
      },
      0.6,
    )
    .to(
      loader,
      {
        backgroundColor: 'rgba(9, 9, 15, 0)',
        duration: 0.2,
      },
      1,
    )
    .to(
      reveal,
      {
        autoAlpha: 0,
        duration: 0.2,
      },
      1,
    )
    .to(
      logo,
      {
        scale: 0.56,
        x: 'calc(-50vw + 3rem)',
        y: 'calc(-50vh + 3rem)',
        duration: 0.2,
      },
      1.2,
    )
    .to(
      loader,
      {
        autoAlpha: 0,
        duration: 0.2,
      },
      1.4,
    )
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
}

.app-loader__reveal {
  position: absolute;
  width: 220vmax;
  aspect-ratio: 1;
  border-radius: var(--radius-full);
  background: var(--bg-1);
  transform: scale(0);
  transform-origin: center;
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
}

@media (prefers-reduced-motion: reduce) {
  .app-loader {
    display: none;
  }
}
</style>
