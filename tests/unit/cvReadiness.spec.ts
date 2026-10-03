import { describe, expect, it } from 'vitest'
import fixture from '../fixtures/cv-data.json'
import { calculateYearsExperienceFromDates, normalizeCvConfig, validateCvData } from '~/composables/useCvData'

describe('CV readiness normalization', () => {
  it('retains localized CV links, normalizes locale aliases and rejects malformed entries', () => {
    expect(normalizeCvConfig({
      cvLink: '/fallback.pdf',
      cvLinks: { en: '/en.pdf', FR: '/fr.pdf', 'ja-JP': '/jp.pdf', invalid: 42, '../escape': '/bad.pdf' },
    })).toMatchObject({
      cvLink: '/fallback.pdf',
      cvLinks: { en: '/en.pdf', fr: '/fr.pdf', jp: '/jp.pdf' },
    })
    expect(normalizeCvConfig({ cvLinks: null }).cvLinks).toBeUndefined()
  })

  it('keeps phone optional and only accepts a string', () => {
    expect(normalizeCvConfig({ contact: { phone: '+81 123 456' } }).contact.phone).toBe('+81 123 456')
    expect(normalizeCvConfig({ contact: { phone: 123 } }).contact.phone).toBeUndefined()
    expect(normalizeCvConfig({}).contact.phone).toBeUndefined()
  })

  it.each(['2025-02-29', '2024-02-30', '2026-04-31', '2026-4-01', '2026-13-01'])('rejects invalid ISO calendar date %s', (startDate) => {
    expect(validateCvData({ ...fixture, experience: [{ ...fixture.experience[0], startDate }] }))
      .toContainEqual({ path: 'experience.0.startDate', message: 'Expected an ISO date in YYYY-MM-DD format.' })
  })

  it('accepts a leap day and uses UTC anniversaries for experience totals', () => {
    const experience = { ...fixture.experience[0], startDate: '2024-02-29', endDate: undefined }
    expect(validateCvData({ ...fixture, experience: [experience] })).toEqual([])
    expect(calculateYearsExperienceFromDates([experience], new Date('2025-02-28T23:59:59Z'))).toBe(0)
    expect(calculateYearsExperienceFromDates([experience], new Date('2025-03-01T00:00:00Z'))).toBe(1)
  })
})
