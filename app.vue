<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
const { cvData, cvConfig, activeLanguage } = useCvData()

const seoTitle = computed(() =>
  cvData.value ? `${cvData.value.hero.name} — ${cvData.value.hero.title}` : 'Ghassen Bargougui — Application Engineer',
)
const seoDescription = computed(() => {
  const firstParagraph = cvData.value?.about.paragraphs[0]

  return firstParagraph ?? 'Application Engineer portfolio and resume.'
})
const seoSummary = computed(() => cvData.value?.hero.title ?? 'Application Engineer')

// Document language for SEO / accessibility (jp dataset maps to the ja tag).
const htmlLang = computed(() => (activeLanguage.value === 'jp' ? 'ja' : activeLanguage.value))

// Site metadata lives in the shared cv-config.json (with SSR-safe fallbacks).
const ogImage = computed(() => cvConfig.value?.meta.ogImage || '/og-image.png')
const ogUrl = computed(() => cvConfig.value?.meta.siteUrl || 'https://ghassen.io')

useSeoMeta({
  title: () => seoTitle.value,
  description: () => seoDescription.value,
  ogTitle: () => seoTitle.value,
  ogDescription: () => seoSummary.value,
  ogImage: () => ogImage.value,
  ogUrl: () => ogUrl.value,
  twitterCard: 'summary_large_image',
})

useHead({
  htmlAttrs: {
    lang: () => htmlLang.value,
  },
  link: [
    { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
    { rel: 'shortcut icon', type: 'image/svg+xml', href: '/favicon.svg' },
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600&family=Space+Mono:wght@400;700&display=swap',
    },
  ],
  script: [
    {
      // Apply the saved theme before paint to avoid a flash of the wrong theme.
      key: 'theme-init',
      innerHTML:
        "(function(){try{var t=localStorage.getItem('cv-theme');if(t==='light'||t==='dark'){document.documentElement.setAttribute('data-theme',t);}}catch(e){}})();",
      tagPosition: 'head',
    },
    {
      key: 'umami-analytics',
      src: 'https://umami.ghassen.io/analytics.js',
      defer: true,
      'data-website-id': '50b3cd1c-0757-4aac-bc88-ccbf97d38a19',
      'data-domains': 'ghassen.io,www.ghassen.io',
      'data-auto-track': 'true',
    },
  ],
})
</script>
