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
  nitro: {
    compressPublicAssets: true,
  },
  runtimeConfig: {
    public: {
      emailjsServiceId: process.env.NUXT_PUBLIC_EMAILJS_SERVICE_ID || '',
      emailjsTemplateId: process.env.NUXT_PUBLIC_EMAILJS_TEMPLATE_ID || '',
      emailjsPublicKey: process.env.NUXT_PUBLIC_EMAILJS_PUBLIC_KEY || '',
    },
  },
})
