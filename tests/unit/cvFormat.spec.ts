import { describe, expect, it } from 'vitest'
import {
  formatDateRange,
  formatDuration,
  hueOf,
  initials,
  tileGradient,
} from '~/utils/cvFormat'

describe('cvFormat helpers', () => {
  it('derives monogram initials, ignoring parenthetical qualifiers', () => {
    expect(initials('Sogeti (on mission at BGL BNP Paribas)')).toBe('SO')
    expect(initials('CBTW')).toBe('CB')
    expect(initials('VERMEG for Banking and Insurance')).toBe('VF')
    expect(initials('Rakuten Card')).toBe('RC')
  })

  it('produces a deterministic hue in the 0–359 range', () => {
    const hue = hueOf('Rakuten Card')

    expect(hue).toBe(hueOf('Rakuten Card'))
    expect(hue).toBeGreaterThanOrEqual(0)
    expect(hue).toBeLessThan(360)
  })

  it('builds an oklch tile gradient from a label', () => {
    expect(tileGradient('Orbit Ways')).toContain('oklch(')
    expect(tileGradient('Orbit Ways')).toMatch(/linear-gradient/)
  })

  it('formats an open-ended date range with the present label', () => {
    expect(formatDateRange('2025-12-01', undefined, 'Present')).toBe('Dec 2025 — Present')
    expect(formatDateRange('2024-09-01', '2025-01-31', 'Present')).toBe('Sep 2024 — Jan 2025')
  })

  it('computes a human-readable duration', () => {
    expect(formatDuration('2024-01-01', '2025-03-01')).toBe('1 yr 2 mos')
    expect(formatDuration('2024-01-01', '2024-02-01')).toBe('1 mo')
    expect(formatDuration('2022-01-01', '2024-01-01')).toBe('2 yrs')
  })

  it('rounds a partial month up, LinkedIn-style', () => {
    // Feb 1 → Nov 30 is 9 months and 29 days, which should read as 10 mos.
    expect(formatDuration('2025-02-01', '2025-11-30')).toBe('10 mos')
    // Sep 1 → Jan 31 is 4 months and 30 days, which should read as 5 mos.
    expect(formatDuration('2024-09-01', '2025-01-31')).toBe('5 mos')
    // Oct 1 2019 → Aug 31 2024 rounds 4 yrs 10 mos 30 days up to 4 yrs 11 mos.
    expect(formatDuration('2019-10-01', '2024-08-31')).toBe('4 yrs 11 mos')
  })
})
