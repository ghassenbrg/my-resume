import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import fixture from '../fixtures/cv-data.json'
import { buildRevealScrollTriggerOptions } from '~/composables/useScrollAnimation'
import type { CVData } from '~/types/cv'

describe('projects section motion safeguards', () => {
  it('keeps featured project entries renderable from structured data', () => {
    const data = fixture as CVData

    expect(data.projects.length).toBeGreaterThan(0)
    expect(data.projects.every((entry) => entry.title && entry.role)).toBe(true)
  })

  it('builds reveal triggers that can be scoped to the projects section', () => {
    const target = '#projects-stack'
    const options = buildRevealScrollTriggerOptions(target, {
      trigger: '#projects',
      start: 'top 72%',
      invalidateOnRefresh: true,
    })

    expect(options).toEqual({
      trigger: '#projects',
      start: 'top 72%',
      end: undefined,
      once: false,
      invalidateOnRefresh: true,
    })
  })

  it('locks the projects section source to section-scoped reveal and fade guards', () => {
    const source = readFileSync(
      resolve(process.cwd(), 'components/sections/ProjectsSection.vue'),
      'utf8',
    )

    expect(source).toContain("trigger: sectionRef.value ?? undefined")
    expect(source).toContain("start: 'top bottom'")
    expect(source).toContain('const projectCardReadableDwellOffset = 96')
    expect(source).toContain("const projectCardTransitionDistance = '+=42%'")
    expect(source).toContain('start: `top+=${projectCardReadableDwellOffset} top`')
    expect(source).toContain('scrub: 0.45')
    expect(source).toContain('duration: 0.42')
    expect(source).toContain("ease: 'power2.out'")
    expect(source).toContain('onLeaveBack: () => {')
    expect(source).toContain('clearStackAnimations()')
    expect(source).toContain('resetProjectCardState(cards)')
  })
})
