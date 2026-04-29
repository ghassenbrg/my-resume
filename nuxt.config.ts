import { readdirSync } from 'node:fs'
import { resolve } from 'node:path'

const publicDir = resolve(process.cwd(), 'public')
const cvDataLanguages = readdirSync(publicDir)
  .map((fileName) => fileName.match(/^cv-data-([a-z0-9-]+)\.json$/i)?.[1]?.toLowerCase() ?? null)
  .filter((language): language is string => Boolean(language))
  .sort((left, right) => {
    if (left === 'en') {
      return -1
    }

    if (right === 'en') {
      return 1
    }

    return left.localeCompare(right)
  })

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
      cvDataLanguages,
      emailjsServiceId: process.env.NUXT_PUBLIC_EMAILJS_SERVICE_ID || '',
      emailjsTemplateId: process.env.NUXT_PUBLIC_EMAILJS_TEMPLATE_ID || '',
      emailjsPublicKey: process.env.NUXT_PUBLIC_EMAILJS_PUBLIC_KEY || '',
    },
  },
})
