import { describe, expect, it } from 'vitest'
import {
  NAV_SECTION_IDS,
  SECTION_IDS,
  getResumeUiCopy,
  languageNativeLabels,
  languageVisuals,
  normalizeUiLanguageCode,
  type ResumeUiCopy,
} from '~/data/resume-ui'

const collectKeyPaths = (value: unknown, prefix = ''): string[] => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return [prefix]
  }

  return Object.entries(value as Record<string, unknown>)
    .flatMap(([key, child]) => collectKeyPaths(child, prefix ? `${prefix}.${key}` : key))
    .sort()
}

describe('resume UI registry', () => {
  it('keeps the public sections in the design contract order', () => {
    expect([...SECTION_IDS]).toEqual([
      'hero',
      'about',
      'skills',
      'experience',
      'projects',
      'education',
      'contact',
    ])
  })

  it('navigates every section except the hero', () => {
    expect([...NAV_SECTION_IDS]).toEqual([
      'about',
      'skills',
      'experience',
      'projects',
      'education',
      'contact',
    ])
    expect(new Set(SECTION_IDS).size).toBe(SECTION_IDS.length)
  })

  it('exposes identical copy shapes across every supported language', () => {
    const reference = collectKeyPaths(getResumeUiCopy('en') as unknown as ResumeUiCopy)

    for (const language of ['fr', 'jp']) {
      expect(collectKeyPaths(getResumeUiCopy(language))).toEqual(reference)
    }
  })

  it('provides the design-specified action and section labels in English', () => {
    const copy = getResumeUiCopy('en')

    expect(copy.actions.downloadCV).toBe('Download CV')
    expect(copy.actions.available).toBe('Open to opportunities')
    expect(copy.sections.skillsAll).toBe('All')
    expect(copy.meta.highlighted).toBe('Core strengths')
    expect(copy.sections.contactTitleAccent).toBe('reliable')
  })

  it('maps language visuals and the Japanese alias', () => {
    expect(languageVisuals.jp.shortLabel).toBe('JA')
    expect(languageNativeLabels.jp).toBe('日本語')
    expect(normalizeUiLanguageCode('ja')).toBe('jp')
    expect(getResumeUiCopy('ja')).toBe(getResumeUiCopy('jp'))
  })
})
