import { describe, expect, it } from 'vitest'
import fixture from '../fixtures/cv-data.json'
import { normalizeCvData } from '~/composables/useCvData'
import type { CVData } from '~/types/cv'

describe('about section structured content', () => {
  it('derives profile stats from the normalized resume dataset', () => {
    const cvData = normalizeCvData(fixture as CVData)

    expect(cvData.about.stats.yearsExperience).toBeGreaterThan(0)
    expect(cvData.about.stats.companiesWorked).toBe(cvData.experience.length)
    expect(cvData.about.stats.certificationsCount).toBe(cvData.certifications.length)
  })
})
