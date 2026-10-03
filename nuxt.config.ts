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
  app: {
    head: {
      script: [
        {
          // Umami analytics. Declared here rather than in app.vue so the tag is
          // baked into every generated page (index.html, the 200.html SPA
          // fallback and 404.html), ahead of the Nuxt entry module. Both are
          // deferred, so window.umami exists before the app hydrates and early
          // events (e.g. language_auto_resolved) are not dropped.
          // data-domains keeps local/dev/preview traffic out of the stats.
          key: 'umami-analytics',
          src: 'https://umami.ghassen.io/analytics.js',
          defer: true,
          'data-website-id': '50b3cd1c-0757-4aac-bc88-ccbf97d38a19',
          'data-domains': 'ghassen.io,www.ghassen.io',
          'data-auto-track': 'true',
        },
      ],
    },
  },
  css: [
    '~/assets/css/theme.css',
    '~/assets/css/components.css',
  ],
  typescript: {
    strict: true,
  },
  nitro: {
    compressPublicAssets: true,
    prerender: {
      routes: ['/', ...cvDataLanguages.filter((code) => code !== 'en').map((code) => `/${code === 'jp' ? 'ja' : code}`)],
      failOnError: true,
    },
  },
  hooks: {
    'pages:extend'(pages) {
      // Reuse the resume page without changing the UI agent's index.vue.
      for (const code of cvDataLanguages.filter((language) => language !== 'en')) {
        pages.push({
          name: `resume-${code}`,
          path: `/${code === 'jp' ? 'ja' : code}`,
          file: resolve(process.cwd(), 'pages/index.vue'),
        })
      }
    },
  },
  runtimeConfig: {
    public: {
      cvDataLanguages,
    },
  },
})
