import { describe, expect, it } from 'vitest'
import fixture from '../fixtures/cv-data.json'
import { normalizeCvData } from '~/composables/useCvData'
import type { CVData } from '~/types/cv'

describe('hero section data contract', () => {
  it('exposes first-impression identity and primary follow-up actions', () => {
    const cvData = normalizeCvData(fixture as CVData)

    expect(cvData.hero.name).toBeTruthy()
    expect(cvData.hero.title).toBeTruthy()
    expect(cvData.hero.location).toBeTruthy()
    expect(cvData.hero.email).toContain('@')
    expect(cvData.hero.cvLink).toMatch(/^\/.+\.pdf$/)
  })
})
