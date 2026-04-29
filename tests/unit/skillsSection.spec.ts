import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import fixture from '../fixtures/cv-data.json'
import { normalizeCvData } from '~/composables/useCvData'
import type { CVData } from '~/types/cv'

describe('skills section structured content', () => {
  it('normalizes highlighted and non-highlighted skills for orbit and accordion views', () => {
    const cvData = normalizeCvData(fixture as CVData)
    const skills = Object.values(cvData.skills).flat()

    expect(skills.some((skill) => skill.highlight)).toBe(true)
    expect(skills.every((skill) => typeof skill.highlight === 'boolean')).toBe(true)
    expect(skills.every((skill) => skill.name && skill.icon)).toBe(true)
  })

  it('keeps the active orbit panel as the scroll container for long skill lists', () => {
    const source = readFileSync(
      resolve(process.cwd(), 'components/ui/SkillOrbit.vue'),
      'utf8',
    )

    expect(source).toContain('data-lenis-prevent')
    expect(source).toContain('class="skill-orbit__panel-scroll"')
    expect(source).toContain('grid-template-rows: auto auto minmax(0, 1fr);')
    expect(source).toContain('.skill-orbit__panel-scroll')
    expect(source).toContain('overscroll-behavior: contain;')
  })

  it('shows explicit overflow cues when additional skills are hidden', () => {
    const source = readFileSync(
      resolve(process.cwd(), 'components/ui/SkillOrbit.vue'),
      'utf8',
    )

    expect(source).toContain('skill-orbit__panel--can-scroll-down')
    expect(source).toContain('skill-orbit__scroll-cue')
    expect(source).toContain('skill-orbit__scroll-cue-line')
    expect(source).toContain('skill-orbit__scroll-cue-arrow')
    expect(source).toContain('skill-orbit__scroll-cue-text')
  })
})
