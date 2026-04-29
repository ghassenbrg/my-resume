import { describe, expect, it } from 'vitest'
import { SECTION_IDS } from '~/data/resume-ui'

const sectionRegistry = [...SECTION_IDS]

describe('app navigation section registry', () => {
  it('keeps the public resume sections in contract order', () => {
    expect(sectionRegistry).toEqual([
      'hero',
      'about',
      'experience',
      'skills',
      'projects',
      'education',
      'languages',
      'contact',
    ])
  })

  it('uses stable unique anchors for active-section tracking', () => {
    expect(new Set(sectionRegistry).size).toBe(sectionRegistry.length)
  })
})
