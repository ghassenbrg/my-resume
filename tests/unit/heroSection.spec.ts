import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import fixture from '../fixtures/cv-data.json'
import { normalizeCvData } from '~/composables/useCvData'
import { getResumeUiCopy } from '~/data/resume-ui'
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

  it('defines icon-led pills and localized primary action labels in the hero source', () => {
    const source = readFileSync(
      resolve(process.cwd(), 'components/sections/HeroSection.vue'),
      'utf8',
    )
    const englishCopy = getResumeUiCopy('en')

    expect(source).toContain('githubIcon')
    expect(source).toContain('linkedinIcon')
    expect(source).toContain("pill.icon === 'location'")
    expect(englishCopy.hero.actions.github).toBe('GitHub')
    expect(englishCopy.hero.actions.linkedin).toBe('LinkedIn')
    expect(englishCopy.hero.actions.email).toBe('Email')
    expect(englishCopy.hero.actions.cv).toBe('CV')
    expect(source).toContain('uiCopy.hero.actions.github')
    expect(source).toContain('uiCopy.hero.actions.linkedin')
    expect(source).toContain('uiCopy.hero.actions.email')
    expect(source).toContain('uiCopy.hero.actions.cv')
  })
})
