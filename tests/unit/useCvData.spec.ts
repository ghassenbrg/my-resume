import { describe, expect, it } from 'vitest'
import fixture from '../fixtures/cv-data.json'
import { extractYearsExperience, normalizeCvData, validateCvData } from '~/composables/useCvData'
import type { CVData } from '~/types/cv'

describe('useCvData normalization helpers', () => {
  it('derives stats and normalizes skill highlight flags', () => {
    const normalized = normalizeCvData(fixture as CVData)

    expect(normalized.about.stats).toEqual({
      yearsExperience: 6,
      companiesWorked: 1,
      certificationsCount: 1,
    })
    expect(normalized.skills['Backend & Full-Stack Development']).toEqual([
      expect.objectContaining({ name: 'Java', highlight: true }),
      expect.objectContaining({ name: 'TypeScript', highlight: false }),
    ])
  })

  it('reports missing required profile fields before runtime use', () => {
    const issues = validateCvData({
      ...fixture,
      hero: {
        ...fixture.hero,
        email: '',
      },
    })

    expect(issues).toContainEqual({
      path: 'hero.email',
      message: 'Required string is missing.',
    })
  })

  it('extracts years of experience from editorial copy', () => {
    expect(extractYearsExperience(['Engineer with 9+ years across enterprise systems.'])).toBe(9)
  })
})
