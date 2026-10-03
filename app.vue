<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
const { cvData, cvConfig, activeLanguage, availableLanguages, loadCvData, refreshMountedCvData } = useCvData()
const route = useRoute()
if (!route.matched.length) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found' })
}

// Await the data before Nuxt renders the layout and page. On the client these
// useState refs arrive in the payload, so hydration reuses the same content.
await loadCvData()
onNuxtReady(() => { void refreshMountedCvData() })
watch(() => route.path, () => {
  if (!route.matched.length) {
    showError({ statusCode: 404, statusMessage: 'Page not found' })
    return
  }
  void loadCvData({ language: route.path === '/' ? 'en' : route.path.replace(/^\/+|\/+$/g, '') })
    .catch(() => showError({ statusCode: 404, statusMessage: 'Resume translation not found' }))
})

const seoTitle = computed(() =>
  cvData.value ? `${cvData.value.hero.name} — ${cvData.value.hero.title}` : 'Ghassen Bargougui — Application Engineer',
)
const seoDescription = computed(() => {
  const firstParagraph = cvData.value?.about.paragraphs[0]

  return firstParagraph ?? 'Application Engineer portfolio and resume.'
})

// Document language for SEO / accessibility (jp dataset maps to the ja tag).
const htmlLang = computed(() => (activeLanguage.value === 'jp' ? 'ja' : activeLanguage.value))

// Site metadata lives in the shared cv-config.json (with SSR-safe fallbacks).
const siteUrl = computed(() => {
  try {
    const url = new URL(cvConfig.value?.meta.siteUrl || 'https://ghassen.io')
    return /^https?:$/.test(url.protocol) ? url.origin : 'https://ghassen.io'
  } catch {
    return 'https://ghassen.io'
  }
})
const languagePath = (code: string) => code === 'en' ? '/' : `/${code === 'jp' ? 'ja' : code}`
const canonicalUrl = computed(() => new URL(languagePath(activeLanguage.value), siteUrl.value).href)
const ogImage = computed(() => {
  try {
    return new URL(cvConfig.value?.meta.ogImage || '/og-image.png', siteUrl.value).href
  } catch {
    return new URL('/og-image.png', siteUrl.value).href
  }
})

useSeoMeta({
  title: () => seoTitle.value,
  description: () => seoDescription.value,
  ogTitle: () => seoTitle.value,
  ogDescription: () => seoDescription.value,
  ogType: 'website',
  ogLocale: () => ({ en: 'en_US', fr: 'fr_FR', jp: 'ja_JP' })[activeLanguage.value] ?? htmlLang.value,
  ogImage: () => ogImage.value,
  ogUrl: () => canonicalUrl.value,
  twitterCard: 'summary_large_image',
  twitterTitle: () => seoTitle.value,
  twitterDescription: () => seoDescription.value,
  twitterImage: () => ogImage.value,
})

useHead(() => ({
  htmlAttrs: {
    lang: htmlLang.value,
  },
  link: [
    { rel: 'canonical', href: canonicalUrl.value },
    ...availableLanguages.value.map(({ code }) => ({
      rel: 'alternate',
      hreflang: code === 'jp' ? 'ja' : code,
      href: new URL(languagePath(code), siteUrl.value).href,
    })),
    { rel: 'alternate', hreflang: 'x-default', href: `${siteUrl.value}/` },
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
  ],
  // Resume copy must remain visible when scripts are disabled (the normal
  // reveal animation uses JavaScript to add its visible class).
  noscript: [{ innerHTML: '<style>.reveal{opacity:1!important;transform:none!important}</style>' }],
}))
</script>
