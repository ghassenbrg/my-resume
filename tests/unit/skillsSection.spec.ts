import { describe, expect, it } from 'vitest'
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
})
