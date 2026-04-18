export default defineNuxtConfig({
  ssr: true,
  compatibilityDate: '2024-04-03',
  css: [
    '~/assets/css/main.css',
    '~/assets/css/typography.css',
    '~/assets/css/animations.css',
  ],
  typescript: {
    strict: true,
  },
})
