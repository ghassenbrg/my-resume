import { describe, expect, it } from 'vitest'
import fixture from '../fixtures/cv-data.json'
import invalidFixture from '../fixtures/cv-data-invalid.json'
import {
  calculateYearsExperienceFromDates,
  createAvailableLanguages,
  extractYearsExperience,
  normalizeCvData,
  resolveBrowserLanguagePreferences,
  resolvePreferredLanguage,
  validateCvData,
} from '~/composables/useCvData'
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

  it('derives years of experience from the earliest start date through the current role', () => {
    expect(
      calculateYearsExperienceFromDates(
        [
          {
            company: 'A',
            position: 'Engineer',
            location: 'X',
            startDate: '2020-01-15',
            description: 'A',
            achievements: ['A'],
          },
          {
            company: 'B',
            position: 'Engineer',
            location: 'Y',
            startDate: '2024-01-01',
            description: 'B',
            achievements: ['B'],
          },
        ],
        new Date('2026-04-29T00:00:00Z'),
      ),
    ).toBe(6)
  })

  it('uses the latest end date when no current experience exists', () => {
    expect(
      calculateYearsExperienceFromDates(
        [
          {
            company: 'A',
            position: 'Engineer',
            location: 'X',
            startDate: '2019-01-10',
            endDate: '2021-01-10',
            description: 'A',
            achievements: ['A'],
          },
          {
            company: 'B',
            position: 'Engineer',
            location: 'Y',
            startDate: '2021-02-01',
            endDate: '2025-03-01',
            description: 'B',
            achievements: ['B'],
          },
        ],
        new Date('2030-01-01T00:00:00Z'),
      ),
    ).toBe(6)
  })

  it('normalizes browser language preferences and preserves order', () => {
    expect(
      resolveBrowserLanguagePreferences({
        language: 'en-US',
        languages: ['fr-CA', 'ja-JP', 'en-US'],
      }),
    ).toEqual(['fr-ca', 'jp', 'en-us'])
  })

  it('resolves a supported preferred language using base-language fallback', () => {
    expect(resolvePreferredLanguage(['fr-ca', 'en-us'], ['en', 'fr', 'jp'])).toEqual({
      code: 'fr',
      source: 'auto',
      requestedLanguage: 'fr-ca',
      fallbackReason: null,
    })
  })

  it('maps Japanese browser locale aliases to the published jp dataset code', () => {
    expect(resolvePreferredLanguage(['ja-jp'], ['en', 'fr', 'jp'])).toEqual({
      code: 'jp',
      source: 'auto',
      requestedLanguage: 'ja-jp',
      fallbackReason: null,
    })
  })

  it('falls back to English when no usable preferred language is available', () => {
    expect(resolvePreferredLanguage(['es-es'], ['en', 'fr'], 'en')).toEqual({
      code: 'en',
      source: 'fallback',
      requestedLanguage: 'es-es',
      fallbackReason: 'unsupported_language',
    })
  })

  it('creates visitor-facing language options only from valid published codes', () => {
    expect(createAvailableLanguages(['en', 'fr', 'jp'])).toEqual([
      { code: 'en', label: 'English', path: '/cv-data-en.json', isDefault: true },
      { code: 'fr', label: 'Français', path: '/cv-data-fr.json', isDefault: false },
      { code: 'jp', label: '日本語', path: '/cv-data-jp.json', isDefault: false },
    ])
  })

  it('flags malformed translation datasets before they can be published', () => {
    expect(validateCvData(invalidFixture)).not.toEqual([])
    expect(validateCvData(invalidFixture)).toContainEqual({
      path: 'hero.title',
      message: 'Required string is missing.',
    })
  })
})
