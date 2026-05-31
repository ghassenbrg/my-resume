/* Pure formatting helpers for CV rendering (timeline, monograms).
 * Ported from the design's lib.jsx so components stay declarative & testable. */

/* Initials for monogram placeholders (company / project tiles). */
export const initials = (name: string): string => {
  const clean = name.replace(/\(.*?\)/g, '').trim()
  const words = clean.split(/[\s&]+/).filter(Boolean)

  if (words.length === 0) {
    return '?'
  }

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase()
  }

  return (words[0][0] + words[1][0]).toUpperCase()
}

/* Deterministic hue per string -> tints monogram tiles for variety. */
export const hueOf = (value: string): number => {
  let hash = 0

  for (let index = 0; index < value.length; index += 1) {
    hash = value.charCodeAt(index) + ((hash << 5) - hash)
  }

  return Math.abs(hash) % 360
}

/* Tile gradient background derived from a string (oklch keeps tints tasteful). */
export const tileGradient = (
  value: string,
  light = 0.32,
  dark = 0.2,
  lightChroma = 0.07,
  darkChroma = 0.05,
): string => {
  const hue = hueOf(value)

  return `linear-gradient(140deg, oklch(${light} ${lightChroma} ${hue}), oklch(${dark} ${darkChroma} ${hue}))`
}

const formatMonthYear = (iso: string): string => {
  const date = new Date(`${iso}T00:00:00`)

  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

/* Date range formatting from ISO startDate / endDate. */
export const formatDateRange = (
  start: string,
  end: string | undefined,
  presentLabel: string,
): string => {
  const formattedStart = formatMonthYear(start)
  const formattedEnd = end ? formatMonthYear(end) : presentLabel

  return `${formattedStart} — ${formattedEnd}`
}

export interface DurationUnits {
  year: string
  years: string
  month: string
  months: string
}

const DEFAULT_DURATION_UNITS: DurationUnits = {
  year: 'yr',
  years: 'yrs',
  month: 'mo',
  months: 'mos',
}

/* Human duration between two ISO dates (open-ended = until reference date).
 * Unit labels are localizable so fr/ja cards don't show English "yrs/mos". */
export const formatDuration = (
  start: string,
  end: string | undefined,
  units: DurationUnits = DEFAULT_DURATION_UNITS,
  referenceDate = new Date(),
): string => {
  const startDate = new Date(`${start}T00:00:00`)
  const endDate = end ? new Date(`${end}T00:00:00`) : referenceDate

  let months =
    (endDate.getFullYear() - startDate.getFullYear()) * 12 +
    (endDate.getMonth() - startDate.getMonth())
  // LinkedIn-style: round a partial month up, so "9 months and a few days" reads as 10 months.
  if (endDate.getDate() > startDate.getDate()) {
    months += 1
  }
  months = Math.max(1, months)

  const years = Math.floor(months / 12)
  const remainingMonths = months % 12
  const parts: string[] = []

  if (years) {
    parts.push(`${years} ${years > 1 ? units.years : units.year}`)
  }

  if (remainingMonths) {
    parts.push(`${remainingMonths} ${remainingMonths > 1 ? units.months : units.month}`)
  }

  return parts.join(' ')
}
