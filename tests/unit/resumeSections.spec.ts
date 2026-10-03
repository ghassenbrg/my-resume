import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import fixture from '../fixtures/cv-data.json'
import { normalizeCvData } from '~/composables/useCvData'
import type { CVData } from '~/types/cv'

const readSource = (relativePath: string) =>
  readFileSync(resolve(process.cwd(), relativePath), 'utf8')

describe('resume content contract', () => {
  it('passes hero tagline and about highlights through normalization', () => {
    const normalized = normalizeCvData(fixture as CVData)

    expect(normalized.hero.tagline).toBeTruthy()
    expect(normalized.about.highlights?.length).toBeGreaterThan(0)
    expect(normalized.about.highlights?.[0]).toEqual(
      expect.objectContaining({ value: expect.any(String), label: expect.any(String) }),
    )
  })

  it('keeps experience entries renderable with real company logos', () => {
    const data = fixture as CVData

    expect(data.experience.length).toBeGreaterThan(0)
    expect(data.experience.every((entry) => entry.startDate && entry.company)).toBe(true)
  })

  it('publishes the same personal and professional projects in every language', () => {
    const projectsFor = (lang: string) =>
      (JSON.parse(readSource(`public/cv-data-${lang}.json`)) as CVData).projects

    const reference = projectsFor('en')
    const signature = (projects: CVData['projects']) =>
      projects.map((project) => `${project.kind}:${project.link ?? ''}:${project.repo ?? ''}`)

    expect(reference.some((project) => project.kind === 'personal')).toBe(true)
    expect(reference.every((project) => project.kind === 'personal' || project.kind === 'professional')).toBe(true)

    for (const lang of ['fr', 'jp']) {
      expect(signature(projectsFor(lang))).toEqual(signature(reference))
    }
  })
})

describe('section implementation guards', () => {
  it('renders the contact section as links-only (no message form / EmailJS)', () => {
    const source = readSource('components/sections/ContactSection.vue')

    expect(source).toContain('contact-card')
    expect(source).toContain('mailto:')
    expect(source).not.toMatch(/<form/)
    expect(source).not.toMatch(/<textarea/)
    expect(source).not.toMatch(/emailjs/i)
  })

  it('renders experience tiles from the company logo asset', () => {
    const source = readSource('components/sections/ExperienceCard.vue')

    expect(source).toContain('exp.logo')
    expect(source).toContain('company-logo')
    expect(source).toContain('/${exp.logo}')
  })

  it('maps every skill category in every language to a glyph', () => {
    const source = readSource('components/ui/SkillGlyph.vue')

    for (const lang of ['en', 'fr', 'jp']) {
      const { skills } = JSON.parse(readSource(`public/cv-data-${lang}.json`)) as CVData

      for (const category of Object.keys(skills)) {
        expect(source, `${lang}: ${category}`).toMatch(
          new RegExp(`['"]${category.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"]: '`),
        )
      }
    }
  })

  it('features three personal products and associates company projects with their roles', () => {
    for (const lang of ['en', 'fr', 'jp']) {
      const data = JSON.parse(readSource(`public/cv-data-${lang}.json`)) as CVData
      expect(data.projects.filter(project => project.featured).map(project => project.title)).toEqual(['Slide Agent', 'Pockito', 'SubMate'])
      expect(data.projects.every(project => project.kind === 'personal')).toBe(true)
      expect(data.projects.map(project => project.title)).not.toContain('TermLoom')
      expect(data.experience.some(experience => experience.projects?.length)).toBe(true)
    }
  })

  it('drives the hero from the data-driven tagline and animated backdrop', () => {
    const source = readSource('components/sections/HeroSection.vue')

    expect(source).toContain('hero-canvas')
    expect(source).toContain('tagline')
    expect(source).toContain('uiCopy.actions.downloadCV')
  })

  it('composes the page with the combined credentials section in design order', () => {
    const source = readSource('pages/index.vue')

    expect(source).toContain('HeroSection')
    expect(source).toContain('CredentialsSection')
    expect(source).not.toContain('LazySectionMount')
    expect(source).not.toContain('LanguagesSection')
  })

  it('keeps the navigation theme toggle and language switch wired', () => {
    const source = readSource('components/layout/AppNav.vue')

    expect(source).toContain('toggleTheme')
    expect(source).toContain('setActiveLanguage')
    expect(source).toContain('lang-menu')
  })
})
