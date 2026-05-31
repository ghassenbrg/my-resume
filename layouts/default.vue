<template>
  <div class="app-shell">
    <a class="skip-link" href="#main-content">{{ uiCopy.a11y.skipToContent }}</a>
    <AppNav />
    <main id="main-content" tabindex="-1">
      <slot />
    </main>
    <AppFooter />
    <AppBackToTop />
  </div>
</template>

<script setup lang="ts">
import AppNav from '~/components/layout/AppNav.vue'
import AppFooter from '~/components/layout/AppFooter.vue'
import AppBackToTop from '~/components/layout/AppBackToTop.vue'

const { uiCopy, activeLanguage, cvData, cvConfig, loadConfig } = useCvData()
const { theme, setTheme, hasStoredPreference } = useTheme()
const { revealVersion } = useRevealController()

// Re-scan reveal targets when the rendered content changes (data arrives,
// language or theme switches re-render sections, or a feature swaps content).
useRevealObserver(
  () =>
    `${activeLanguage.value}-${theme.value}-${cvData.value ? '1' : '0'}-${revealVersion.value}`,
)

// Load shared config and, for first-time visitors with no saved preference,
// honor the config's default theme.
//
// Note: the pre-paint script (app.vue) reads only localStorage, and the config
// is fetched client-side, so a *non-dark* config default would apply one frame
// after first paint (a brief dark→light flash on a visitor's very first load
// only). The shipped default is "dark", which matches the pre-paint default, so
// there is no flash in practice.
onMounted(async () => {
  await loadConfig()

  if (!hasStoredPreference.value && cvConfig.value) {
    setTheme(cvConfig.value.theme.default)
  }
})
</script>
