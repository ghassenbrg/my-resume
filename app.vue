<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
const { cvData } = useCvData()

const seoTitle = computed(() =>
  cvData.value ? `${cvData.value.hero.name} — ${cvData.value.hero.title}` : 'Ghassen Bargougui — Software Engineer',
)
const seoDescription = computed(() => {
  const firstParagraph = cvData.value?.about.paragraphs[0]

  return firstParagraph ?? 'Software engineer portfolio and resume.'
})
const seoSummary = computed(() => cvData.value?.hero.title ?? 'Software Engineer')

useSeoMeta({
  title: () => seoTitle.value,
  description: () => seoDescription.value,
  ogTitle: () => seoTitle.value,
  ogDescription: () => seoSummary.value,
  ogImage: '/og-image.png',
  ogUrl: 'https://ghassen.io',
  twitterCard: 'summary_large_image',
})

useHead({
  link: [
    {
      rel: 'icon',
      type: 'image/svg+xml',
      href: '/favicon.svg',
    },
    {
      rel: 'shortcut icon',
      type: 'image/svg+xml',
      href: '/favicon.svg',
    },
  ],
  script: [
    {
      key: 'runtime-config',
      src: '/runtime-config.js',
      defer: true,
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
