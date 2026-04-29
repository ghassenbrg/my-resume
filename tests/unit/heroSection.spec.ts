import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
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

  it('defines icon-led pills and primary action labels in the hero source', () => {
    const source = readFileSync(
      resolve(process.cwd(), 'components/sections/HeroSection.vue'),
      'utf8',
    )

    expect(source).toContain('githubIcon')
    expect(source).toContain('linkedinIcon')
    expect(source).toContain("pill.icon === 'location'")
    expect(source).toContain('<span>GitHub</span>')
    expect(source).toContain('<span>LinkedIn</span>')
    expect(source).toContain('<span>Email</span>')
    expect(source).toContain('<span>CV</span>')
  })
})
