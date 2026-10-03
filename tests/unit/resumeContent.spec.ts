import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { validateCvData } from '~/composables/useCvData'
import type { CVData } from '~/types/cv'
import { displayUrl, selectExperience, selectPdfContent } from '~/scripts/resume-content.mjs'

const LANGUAGES = ['en', 'fr', 'jp'] as const
const load = (lang: string) =>
  JSON.parse(readFileSync(resolve(process.cwd(), `public/cv-data-${lang}.json`), 'utf8')) as CVData
const datasets = Object.fromEntries(LANGUAGES.map((lang) => [lang, load(lang)])) as Record<string, CVData>

/* Language-independent facts that every translation must keep identical. */
const factsOf = (data: CVData) => ({
  experience: data.experience.map((entry) => ({
    company: entry.company,
    position: entry.position,
    roles: entry.roles,
    startDate: entry.startDate,
    endDate: entry.endDate,
    achievements: entry.achievements.length,
    projects: entry.projects?.map((project) => [project.title.split(' — ')[0], project.period, project.outcomes.length, project.technologies]),
    pdf: entry.pdf,
  })),
  projects: data.projects.map((project) => [project.title, project.period, project.link, project.repo, project.featured, project.outcomes.length, project.technologies, project.pdf]),
  skills: Object.values(data.skills).map((items) => items.map((skill) => [skill.icon, Boolean(skill.highlight)])),
  education: data.education.length,
  certifications: data.certifications.map((cert) => [cert.name, cert.link]),
  languages: data.languages.map((language) => [language.code, language.percentage]),
})

describe('published resume content', () => {
  it.each(LANGUAGES)('%s data passes validation, including PDF selections and role dates', (lang) => {
    expect(validateCvData(datasets[lang])).toEqual([])
  })

  it('keeps the same facts, dates, links and PDF selections in every language', () => {
    for (const lang of ['fr', 'jp']) {
      expect(factsOf(datasets[lang]), lang).toEqual(factsOf(datasets.en))
    }
  })

  it('keeps official employment titles untranslated and separate from the functional headline', () => {
    for (const lang of LANGUAGES) {
      const data = datasets[lang]
      expect(data.hero.title).toBe('Application Engineer')
      expect(data.hero.headline).toBeTruthy()
      expect(data.experience.map((entry) => entry.position)).toEqual([
        'Application Engineer', 'Software Engineer', 'Java Full-Stack Engineer', 'Analyst Developer',
      ])
    }
  })

  it('shows each VERMEG title with its own contiguous date range inside the tenure', () => {
    const vermeg = datasets.en.experience.find((entry) => entry.company.startsWith('VERMEG'))!
    expect(vermeg.roles).toEqual([
      { position: 'Analyst Developer', startDate: '2023-01-01', endDate: '2024-08-31' },
      { position: 'Software Developer', startDate: '2019-10-01', endDate: '2022-12-31' },
    ])
    expect(vermeg.roles!.at(-1)!.startDate).toBe(vermeg.startDate)
    expect(vermeg.roles![0].endDate).toBe(vermeg.endDate)
  })

  it('contains no unexplained percentage claims, JLPT claim or excluded project', () => {
    for (const lang of LANGUAGES) {
      const { languages: _languages, ...prose } = datasets[lang]
      const text = JSON.stringify(prose)
      expect(text, lang).not.toMatch(/\d\s?%/)
      expect(text, lang).not.toMatch(/JLPT|N[1-5]\b/)
      expect(text, lang).not.toContain('TermLoom')
    }
  })

  it('describes the internal Rakuten work generically, without naming an agent application', () => {
    for (const lang of LANGUAGES) {
      const rakuten = datasets[lang].experience[0]
      expect(rakuten.company).toBe('Rakuten')
      expect(JSON.stringify(rakuten), lang).not.toMatch(/agent|エージェント/i)
    }
  })

  it('reports invalid PDF selections and role dates', () => {
    const data = structuredClone(datasets.en)
    data.experience[0].pdf = { achievements: [0, 0, 99] }
    data.experience[3].roles = [{ position: 'Analyst Developer', startDate: '2023-02-30' }]
    data.projects[0].pdf = { outcomes: [] }

    expect(validateCvData(data)).toEqual(expect.arrayContaining([
      { path: 'experience.0.pdf.achievements', message: 'Expected distinct indexes of existing entries.' },
      { path: 'experience.3.roles.0.startDate', message: 'Expected an ISO date in YYYY-MM-DD format.' },
      { path: 'projects.0.pdf.outcomes', message: 'Expected distinct indexes of existing entries.' },
    ]))
  })
})

describe('PDF evidence selection', () => {
  it('prints the selected bullets in the selected order, not the first entries', () => {
    const entry = {
      ...datasets.en.experience[3],
      pdf: { achievements: [3, 0], projects: [{ index: 1, outcomes: [1] }] },
    }
    const selected = selectExperience(entry)

    expect(selected.achievements).toEqual([entry.achievements[3], entry.achievements[0]])
    expect(selected.projects).toEqual([{ title: 'PackManager', period: '2022 – 2023', outcomes: [entry.projects![1].outcomes[1]] }])
    expect(selected.otherProjects.map((project) => project.title)).not.toContain('PackManager')
    expect(selected.roles.map((role) => role.position)).toEqual(['Analyst Developer', 'Software Developer'])
  })

  it('keeps the audited performance, observability, security and delivery evidence in the English PDF', () => {
    const content = selectPdfContent(datasets.en)
    const text = JSON.stringify(content)

    for (const evidence of ['k6', 'JMeter', 'Cloud Logging', 'Kafka/Confluent', 'CDI bean scope', 'Keycloak', 'rollback', 'JProfiler', 'Camunda', 'GKE', 'Redis-backed session management', 'LLM API integration', '@slide-agent/core', 'MCP server', 'right-to-left', 'Kubernetes deployment and rollback']) {
      expect(text, evidence).toContain(evidence)
    }
    expect(content.featuredProjects.map((project) => project.title)).toEqual(['Slide Agent', 'Pockito', 'SubMate'])
    expect(content.featuredProjects.every((project) => project.period)).toBe(true)
    expect(content.otherProjects.map((project) => project.title)).toEqual(['Orbit Ways', 'Traffic Forward'])
  })

  it('prints link destinations rather than generic labels', () => {
    expect(displayUrl('https://www.linkedin.com/in/ghassenbrg')).toBe('linkedin.com/in/ghassenbrg')
    expect(displayUrl('https://github.com/ghassenbrg/SubMate')).toBe('github.com/ghassenbrg/SubMate')
  })

  it('no longer truncates evidence by array position in the exporter', () => {
    const source = readFileSync(resolve(process.cwd(), 'scripts/generate-resume.mjs'), 'utf8')
    expect(source).not.toMatch(/\.slice\(0,\s*[23]\)/)
    expect(source).toContain('selectPdfContent')
  })
})

describe('initial HTML exposure', () => {
  it('renders every achievement in the markup and keeps extras in a native disclosure', () => {
    const source = readFileSync(resolve(process.cwd(), 'components/sections/ExperienceCard.vue'), 'utf8')
    expect(source).toContain('<details v-if="moreAchievements.length" class="ach-more">')
    expect(source).toContain('leadAchievements')
    expect(source).not.toMatch(/visibleAchievements|@click="open = !open"/)
  })
})
