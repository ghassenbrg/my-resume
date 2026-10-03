<template>
  <footer class="site-footer">
    <div class="container footer-inner">
      <div class="footer-brand">
        <BrandMonogram :size="44" :radius="12" :glow="false" />
        <div>
          <div class="footer-name">{{ name }}</div>
          <div class="footer-role">{{ role }}</div>
        </div>
      </div>
      <p class="footer-note">{{ uiCopy.footer.builtWith }}</p>
      <!-- Ordinary links to each translated resume, in addition to the
           interactive switcher: reachable without JavaScript and by crawlers. -->
      <nav v-if="languageLinks.length > 1" class="footer-langs" :aria-label="uiCopy.footer.languages">
        <span>{{ uiCopy.footer.languages }}</span>
        <a
          v-for="language in languageLinks"
          :key="language.code"
          :href="language.href"
          :hreflang="language.tag"
          :lang="language.tag"
          :aria-current="language.code === activeLanguage ? 'page' : undefined"
        >{{ language.label }}</a>
      </nav>
      <div class="footer-bottom">© {{ year }} {{ name }}. {{ uiCopy.footer.rights }}</div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import BrandMonogram from '~/components/ui/BrandMonogram.vue'

const { cvData, uiCopy, referenceDate, availableLanguages, activeLanguage } = useCvData()

const name = computed(() => cvData.value?.hero.name ?? 'Ghassen Bargougui')
const role = computed(() => cvData.value?.hero.title ?? '')
const year = computed(() => referenceDate.value.getUTCFullYear())
const languageLinks = computed(() =>
  availableLanguages.value.map(({ code, label }) => {
    const tag = code === 'jp' ? 'ja' : code
    return { code, label, tag, href: code === 'en' ? '/' : `/${tag}` }
  }),
)
</script>
