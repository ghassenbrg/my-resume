import { afterEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
import fixture from '../fixtures/cv-data.json'
import { useCvData } from '~/composables/useCvData'

afterEach(() => vi.unstubAllGlobals())

describe('CV language loading', () => {
  it('accepts the Japanese route alias when supplied explicitly by the route watcher', async () => {
    const states = new Map()
    vi.stubGlobal('useState', (key: string, initialize: () => unknown) => {
      if (!states.has(key)) states.set(key, ref(initialize()))
      return states.get(key)
    })
    vi.stubGlobal('useRuntimeConfig', () => ({ public: { cvDataLanguages: ['en', 'jp'] } }))
    vi.stubGlobal('useNuxtApp', () => ({ isHydrating: true }))
    vi.stubGlobal('useRoute', () => ({ path: '/ja' }))
    vi.stubGlobal('useAnalytics', () => ({ trackEvent: vi.fn(() => false) }))
    vi.stubGlobal('$fetch', vi.fn(async (path: string) => path === '/cv-config.json'
      ? { cvLink: '/en.pdf', cvLinks: { en: '/en.pdf', jp: '/jp.pdf' } }
      : fixture))

    const cv = useCvData()
    await expect(cv.loadCvData({ language: 'ja' })).resolves.toBeTruthy()
    expect(cv.activeLanguage.value).toBe('jp')
    expect(cv.cvLink.value).toBe('/jp.pdf')
  })
})
