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
  </div>
</template>

<script setup lang="ts">
import AppCursor from '~/components/layout/AppCursor.vue'
import AppLoader from '~/components/layout/AppLoader.vue'
import AppNavigation from '~/components/layout/AppNavigation.vue'
import AppScrollProgress from '~/components/layout/AppScrollProgress.vue'
</script>
