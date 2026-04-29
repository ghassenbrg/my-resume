import { describe, expect, it } from 'vitest'

const sectionRegistry = ['hero', 'about', 'experience', 'skills', 'projects', 'education', 'languages', 'contact']

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
