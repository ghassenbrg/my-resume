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
  cvData.value?.meta?.title
    ?? (cvData.value ? `${cvData.value.hero.name} — ${cvData.value.hero.title}` : 'Ghassen Bargougui — Application Engineer'),
)
const seoDescription = computed(() =>
  cvData.value?.meta?.description ?? cvData.value?.about.paragraphs[0] ?? 'Application Engineer portfolio and resume.',
)

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

// ProfilePage + Person markup restates only facts visible on the page: the
// official title, current employer, education, certification and the same
// verified profile links. No ratings, awards or inferred seniority.
const structuredData = computed(() => {
  const data = cvData.value
  if (!data) return null
  const current = data.experience.find((entry) => !entry.endDate)
  const sameAs = [cvConfig.value?.social.linkedin, cvConfig.value?.social.github].filter(Boolean)
  const knowsAbout = Object.values(data.skills).flat().filter((skill) => skill.highlight).map((skill) => skill.name)
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    '@id': `${canonicalUrl.value}#profile`,
    url: canonicalUrl.value,
    name: seoTitle.value,
    inLanguage: htmlLang.value,
    mainEntity: {
      '@type': 'Person',
      '@id': `${siteUrl.value}/#person`,
      name: data.hero.name,
      url: `${siteUrl.value}/`,
      jobTitle: data.hero.title,
      ...(current ? { worksFor: { '@type': 'Organization', name: current.company } } : {}),
      ...(sameAs.length ? { sameAs } : {}),
      ...(knowsAbout.length ? { knowsAbout } : {}),
      alumniOf: data.education.map((entry) => ({ '@type': 'EducationalOrganization', name: entry.institution })),
      hasCredential: data.certifications.map((cert) => ({
        '@type': 'EducationalOccupationalCredential',
        name: cert.name,
        recognizedBy: { '@type': 'Organization', name: cert.issuer },
      })),
    },
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
    ...(structuredData.value
      ? [{
          key: 'profile-jsonld',
          type: 'application/ld+json',
          // Escape "<" so resume text can never close the script element.
          innerHTML: JSON.stringify(structuredData.value).replace(/</g, '\\u003c'),
        }]
      : []),
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
