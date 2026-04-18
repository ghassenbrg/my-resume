<template>
  <div class="app-shell">
    <a class="skip-link" href="#main-content">Skip to main content</a>
    <AppLoader />
    <AppScrollProgress />
    <AppNavigation />
    <AppCursor />
    <main id="main-content" tabindex="-1">
      <slot />
    </main>
    <footer class="site-footer">
      <div class="site-footer__inner">
        <p>&copy; 2026 Ghassen Bargougui</p>
        <p>Made with Vue 3 + Nuxt 3</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import AppCursor from '~/components/layout/AppCursor.vue'
import AppLoader from '~/components/layout/AppLoader.vue'
import AppNavigation from '~/components/layout/AppNavigation.vue'
import AppScrollProgress from '~/components/layout/AppScrollProgress.vue'
</script>

<style scoped>
.site-footer {
  border-top: 1px solid var(--border-subtle);
  background: var(--bg-0);
}

.site-footer__inner {
  display: flex;
  width: min(100% - var(--space-8), 72rem);
  margin-inline: auto;
  justify-content: space-between;
  gap: var(--space-4);
  padding-block: var(--space-8);
  color: var(--text-2);
  font-family: var(--font-mono);
  font-size: var(--text-sm);
}

.site-footer p {
  margin: 0;
}

@media (max-width: 767px) {
  .site-footer__inner {
    width: min(100% - var(--space-6), 72rem);
    flex-direction: column;
    padding-block: var(--space-6) var(--space-8);
  }
}
</style>
