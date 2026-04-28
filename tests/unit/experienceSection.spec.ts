import { describe, expect, it } from 'vitest'
import fixture from '../fixtures/cv-data.json'
import type { CVData } from '~/types/cv'

describe('experience section structured content', () => {
  it('contains evidence-oriented entries with achievements', () => {
    const data = fixture as CVData

    expect(data.experience.length).toBeGreaterThan(0)
    expect(data.experience.every((entry) => entry.company && entry.position && entry.period)).toBe(true)
    expect(data.experience.every((entry) => entry.achievements.length > 0)).toBe(true)
  })
})
