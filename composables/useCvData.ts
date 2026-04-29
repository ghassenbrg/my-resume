import { getResumeUiCopy, languageNativeLabels, type ResumeUiCopy } from '~/data/resume-ui'
import type {
  AvailableLanguage,
  CVData,
  CVStats,
  Experience,
  LanguageSelectionMeta,
  LanguageSelectionSource,
  NormalizationIssue,
  RuntimeCVData,
  RuntimeSkill,
} from '~/types/cv'

const DEFAULT_LANGUAGE_CODE = 'en'
const JAPANESE_LANGUAGE_ALIAS = 'jp'
const languageFileRequests = new Map<string, Promise<RuntimeCVData>>()
let availableLanguageRequest: Promise<AvailableLanguage[]> | null = null

export const extractYearsExperience = (paragraphs: string[]) => {
  const yearsMatch = paragraphs.join(' ').match(/(\d+)\+?\s+years/i)

  return yearsMatch ? Number(yearsMatch[1]) : 0
}

const parseIsoDate = (value?: string) => {
  if (!value) {
    return null
  }

  const date = new Date(`${value}T00:00:00Z`)

  return Number.isNaN(date.getTime()) ? null : date
}

export const calculateYearsExperienceFromDates = (
  experiences: Experience[],
  referenceDate = new Date(),
) => {
  const parsedStartDates = experiences
    .map((experience) => parseIsoDate(experience.startDate))
    .filter((date): date is Date => date !== null)

  if (parsedStartDates.length === 0) {
    return 0
  }

  const earliestStartDate = parsedStartDates.reduce((earliest, current) => {
    return current.getTime() < earliest.getTime() ? current : earliest
  })

  const latestKnownEndDate = experiences
    .map((experience) => parseIsoDate(experience.endDate))
    .filter((date): date is Date => date !== null)
    .reduce<Date | null>((latest, current) => {
      if (!latest) {
        return current
      }

      return current.getTime() > latest.getTime() ? current : latest
    }, null)

  const hasCurrentExperience = experiences.some((experience) => !experience.endDate)
  const comparisonDate = hasCurrentExperience ? referenceDate : (latestKnownEndDate ?? referenceDate)

  let years = comparisonDate.getUTCFullYear() - earliestStartDate.getUTCFullYear()
  const comparisonMonth = comparisonDate.getUTCMonth()
  const comparisonDay = comparisonDate.getUTCDate()
  const startMonth = earliestStartDate.getUTCMonth()
  const startDay = earliestStartDate.getUTCDate()

  if (
    comparisonMonth < startMonth ||
    (comparisonMonth === startMonth && comparisonDay < startDay)
  ) {
    years -= 1
  }

  return Math.max(years, 0)
}

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

const isNonEmptyString = (value: unknown) => typeof value === 'string' && value.trim().length > 0

const isUrlLike = (value: string) => {
  return value.startsWith('/') || /^https?:\/\//i.test(value) || value.startsWith('mailto:')
}

const assertRequiredString = (
  data: Record<string, unknown>,
  path: string,
  field: string,
  issues: NormalizationIssue[],
) => {
  if (!isNonEmptyString(data[field])) {
    issues.push({
      path: `${path}.${field}`,
      message: 'Required string is missing.',
    })
  }
}

const assertValidIsoDate = (
  data: Record<string, unknown>,
  path: string,
  field: string,
  issues: NormalizationIssue[],
  options: {
    required?: boolean
  } = {},
) => {
  const value = data[field]

  if (value === undefined || value === null || value === '') {
    if (options.required) {
      issues.push({
        path: `${path}.${field}`,
        message: 'Required ISO date is missing.',
      })
    }

    return
  }

  if (typeof value !== 'string' || !parseIsoDate(value)) {
    issues.push({
      path: `${path}.${field}`,
      message: 'Expected an ISO date in YYYY-MM-DD format.',
    })
  }
}

export const validateCvData = (data: unknown): NormalizationIssue[] => {
  const issues: NormalizationIssue[] = []

  if (!isRecord(data)) {
    return [{ path: '$', message: 'CV data must be an object.' }]
  }

  const requiredCollections = ['experience', 'projects', 'education', 'certifications', 'languages'] as const

  for (const collection of requiredCollections) {
    if (!Array.isArray(data[collection])) {
      issues.push({ path: collection, message: 'Expected an array.' })
    }
  }

  if (!isRecord(data.hero)) {
    issues.push({ path: 'hero', message: 'Hero profile is required.' })
  } else {
    for (const field of ['name', 'title', 'location', 'email', 'github', 'linkedin', 'cvLink']) {
      assertRequiredString(data.hero, 'hero', field, issues)
    }

    for (const field of ['github', 'linkedin', 'cvLink']) {
      const value = data.hero[field]

      if (typeof value === 'string' && !isUrlLike(value)) {
        issues.push({ path: `hero.${field}`, message: 'Expected a URL or public asset path.' })
      }
    }
  }

  if (!isRecord(data.about) || !Array.isArray(data.about.paragraphs) || data.about.paragraphs.length === 0) {
    issues.push({ path: 'about.paragraphs', message: 'At least one about paragraph is required.' })
  }

  if (!isRecord(data.skills) || Object.keys(data.skills).length === 0) {
    issues.push({ path: 'skills', message: 'At least one skill category is required.' })
  }

  if (Array.isArray(data.experience)) {
    data.experience.forEach((entry, index) => {
      if (!isRecord(entry)) {
        issues.push({ path: `experience.${index}`, message: 'Experience entry must be an object.' })
        return
      }

      for (const field of ['company', 'position', 'location', 'description']) {
        assertRequiredString(entry, `experience.${index}`, field, issues)
      }

      assertValidIsoDate(entry, `experience.${index}`, 'startDate', issues, { required: true })
      assertValidIsoDate(entry, `experience.${index}`, 'endDate', issues)

      const startDate = parseIsoDate(typeof entry.startDate === 'string' ? entry.startDate : undefined)
      const endDate = parseIsoDate(typeof entry.endDate === 'string' ? entry.endDate : undefined)

      if (startDate && endDate && endDate.getTime() < startDate.getTime()) {
        issues.push({
          path: `experience.${index}.endDate`,
          message: 'End date must be the same as or later than start date.',
        })
      }

      if (!Array.isArray(entry.achievements) || entry.achievements.length === 0) {
        issues.push({ path: `experience.${index}.achievements`, message: 'At least one achievement is required.' })
      }
    })
  }

  return issues
}

export const assertValidCvData = (data: unknown): asserts data is CVData => {
  const issues = validateCvData(data)

  if (issues.length > 0) {
    const details = issues.map((issue) => `${issue.path}: ${issue.message}`).join('; ')

    throw new Error(`Invalid CV data. ${details}`)
  }
}

export const normalizeSkills = (skills: CVData['skills']) => {
  return Object.fromEntries(
    Object.entries(skills).map(([category, categorySkills]) => [
      category,
      categorySkills.map(
        (skill): RuntimeSkill => ({
          ...skill,
          highlight: Boolean(skill.highlight),
        }),
      ),
    ]),
  )
}

export const normalizeStats = (data: CVData): CVStats => {
  const derivedYearsExperience = calculateYearsExperienceFromDates(data.experience)

  return {
    yearsExperience: derivedYearsExperience || extractYearsExperience(data.about.paragraphs),
    companiesWorked: data.experience.length,
    certificationsCount: data.certifications.length,
  }
}

export const normalizeCvData = (data: CVData): RuntimeCVData => {
  assertValidCvData(data)

  return {
    ...data,
    about: {
      ...data.about,
      stats: normalizeStats(data),
    },
    skills: normalizeSkills(data.skills),
  }
}

export const normalizeLanguageCode = (languageCode: string) => {
  const normalized = languageCode.trim().toLowerCase().replace(/_/g, '-')

  if (normalized === 'ja' || normalized.startsWith('ja-')) {
    return JAPANESE_LANGUAGE_ALIAS
  }

  return normalized
}

export const resolveBrowserLanguagePreferences = (clientLanguages?: {
  language?: string
  languages?: readonly string[]
}) => {
  const orderedLanguages = [
    ...(clientLanguages?.languages ?? []),
    ...(clientLanguages?.language ? [clientLanguages.language] : []),
  ]

  return Array.from(
    new Set(
      orderedLanguages
        .map((language) => normalizeLanguageCode(language))
        .filter(Boolean),
    ),
  )
}

export const resolvePreferredLanguage = (
  preferredLanguages: string[],
  availableCodes: string[],
  fallbackLanguage = DEFAULT_LANGUAGE_CODE,
) => {
  for (const preferredLanguage of preferredLanguages) {
    const normalized = preferredLanguage.trim().toLowerCase().replace(/_/g, '-')
    const normalizedAlias = normalizeLanguageCode(preferredLanguage)

    if (availableCodes.includes(normalized)) {
      return {
        code: normalized,
        source: 'auto' as LanguageSelectionSource,
        requestedLanguage: preferredLanguage,
        fallbackReason: null,
      }
    }

    if (availableCodes.includes(normalizedAlias)) {
      return {
        code: normalizedAlias,
        source: 'auto' as LanguageSelectionSource,
        requestedLanguage: preferredLanguage,
        fallbackReason: null,
      }
    }

    const baseLanguage = normalized.split('-')[0]
    const normalizedBaseLanguage = normalizeLanguageCode(baseLanguage)

    if (availableCodes.includes(baseLanguage)) {
      return {
        code: baseLanguage,
        source: 'auto' as LanguageSelectionSource,
        requestedLanguage: preferredLanguage,
        fallbackReason: null,
      }
    }

    if (availableCodes.includes(normalizedBaseLanguage)) {
      return {
        code: normalizedBaseLanguage,
        source: 'auto' as LanguageSelectionSource,
        requestedLanguage: preferredLanguage,
        fallbackReason: null,
      }
    }
  }

  return {
    code: fallbackLanguage,
    source: 'fallback' as LanguageSelectionSource,
    requestedLanguage: preferredLanguages[0] ?? null,
    fallbackReason: preferredLanguages.length > 0 ? 'unsupported_language' : 'unknown_language',
  }
}

export const createAvailableLanguages = (languageCodes: string[]) => {
  return languageCodes.map(
    (languageCode): AvailableLanguage => ({
      code: languageCode,
      label: languageNativeLabels[languageCode] ?? languageCode.toUpperCase(),
      path: `/cv-data-${languageCode}.json`,
      isDefault: languageCode === DEFAULT_LANGUAGE_CODE,
    }),
  )
}

const getCvDataPath = (languageCode: string) => `/cv-data-${languageCode}.json`

const getPublishedLanguageCodes = (configuredCodes: unknown) => {
  const normalizedConfiguredCodes = Array.isArray(configuredCodes)
    ? configuredCodes
      .filter((value): value is string => typeof value === 'string' && value.trim().length > 0)
      .map((value) => normalizeLanguageCode(value))
    : []

  return Array.from(new Set([DEFAULT_LANGUAGE_CODE, ...normalizedConfiguredCodes]))
}

const loadLanguageDataset = async (languageCode: string) => {
  const normalizedLanguageCode = normalizeLanguageCode(languageCode)

  if (!languageFileRequests.has(normalizedLanguageCode)) {
    languageFileRequests.set(
      normalizedLanguageCode,
      $fetch<CVData>(getCvDataPath(normalizedLanguageCode), {
        query: import.meta.client ? { v: Date.now() } : undefined,
      }).then(normalizeCvData),
    )
  }

  try {
    return await languageFileRequests.get(normalizedLanguageCode)!
  } catch (error) {
    languageFileRequests.delete(normalizedLanguageCode)
    throw error
  }
}

export const useCvData = () => {
  const cvData = useState<RuntimeCVData | null>('cv-data', () => null)
  const cvDataError = useState<string | null>('cv-data-error', () => null)
  const isCvDataLoading = useState('cv-data-loading', () => false)
  const availableLanguages = useState<AvailableLanguage[]>('cv-available-languages', () => [])
  const activeLanguage = useState<string>('cv-active-language', () => DEFAULT_LANGUAGE_CODE)
  const languageSelection = useState<LanguageSelectionMeta>('cv-language-selection', () => ({
    code: DEFAULT_LANGUAGE_CODE,
    source: 'fallback',
    requestedLanguage: null,
    fallbackReason: null,
  }))
  const hasTrackedInitialLanguage = useState<boolean>('cv-language-tracked', () => false)
  const uiCopy = computed<ResumeUiCopy>(() => getResumeUiCopy(activeLanguage.value))
  const runtimeConfig = useRuntimeConfig()
  const { trackEvent } = useAnalytics()

  const loadAvailableLanguages = async () => {
    if (availableLanguages.value.length > 0) {
      return availableLanguages.value
    }

    if (!availableLanguageRequest) {
      const publishedLanguageCodes = getPublishedLanguageCodes(runtimeConfig.public.cvDataLanguages)

      availableLanguageRequest = Promise.allSettled(
        publishedLanguageCodes.map(async (languageCode) => {
          await loadLanguageDataset(languageCode)
          return languageCode
        }),
      ).then((results) => {
        const validCodes = results.flatMap((result) => (result.status === 'fulfilled' ? [result.value] : []))

        if (!validCodes.includes(DEFAULT_LANGUAGE_CODE)) {
          throw new Error('English CV data is required and must remain valid.')
        }

        availableLanguages.value = createAvailableLanguages(validCodes)
        return availableLanguages.value
      }).catch((error) => {
        availableLanguageRequest = null
        throw error
      })
    }

    return availableLanguageRequest
  }

  const applyLanguageSelection = async (
    targetLanguageCode: string,
    selectionSource: LanguageSelectionSource,
    requestedLanguage: string | null,
    fallbackReason: string | null = null,
  ) => {
    const available = await loadAvailableLanguages()
    const normalizedTarget = normalizeLanguageCode(targetLanguageCode)
    const targetLanguage = available.find((language) => language.code === normalizedTarget)
    const resolvedLanguage = targetLanguage?.code ?? DEFAULT_LANGUAGE_CODE

    try {
      cvData.value = await loadLanguageDataset(resolvedLanguage)
      activeLanguage.value = resolvedLanguage
      languageSelection.value = {
        code: resolvedLanguage,
        source: selectionSource,
        requestedLanguage,
        fallbackReason,
      }

      return cvData.value
    } catch (error) {
      if (resolvedLanguage !== DEFAULT_LANGUAGE_CODE) {
        cvData.value = await loadLanguageDataset(DEFAULT_LANGUAGE_CODE)
        activeLanguage.value = DEFAULT_LANGUAGE_CODE
        languageSelection.value = {
          code: DEFAULT_LANGUAGE_CODE,
          source: 'fallback',
          requestedLanguage,
          fallbackReason: fallbackReason ?? 'invalid_translation',
        }
        return cvData.value
      }

      throw error
    }
  }

  const loadCvData = async () => {
    await loadAvailableLanguages()

    if (cvData.value && availableLanguages.value.some((language) => language.code === activeLanguage.value)) {
      return cvData.value
    }

    try {
      isCvDataLoading.value = true
      cvDataError.value = null

      const preferredLanguages = import.meta.client
        ? resolveBrowserLanguagePreferences(window.navigator)
        : [DEFAULT_LANGUAGE_CODE]
      const availableCodes = availableLanguages.value.map((language) => language.code)
      const resolvedSelection = resolvePreferredLanguage(preferredLanguages, availableCodes, DEFAULT_LANGUAGE_CODE)
      const data = await applyLanguageSelection(
        languageSelection.value.source === 'manual' ? activeLanguage.value : resolvedSelection.code,
        languageSelection.value.source === 'manual' ? 'manual' : resolvedSelection.source,
        languageSelection.value.source === 'manual' ? activeLanguage.value : resolvedSelection.requestedLanguage,
        languageSelection.value.source === 'manual' ? null : resolvedSelection.fallbackReason,
      )

      if (import.meta.client && !hasTrackedInitialLanguage.value && languageSelection.value.source !== 'manual') {
        trackEvent('language_auto_resolved', {
          resolved_language: languageSelection.value.code,
          requested_language: languageSelection.value.requestedLanguage,
          selection_source: languageSelection.value.source,
          fallback_reason: languageSelection.value.fallbackReason,
        })
        hasTrackedInitialLanguage.value = true
      }

      return data
    } catch (error) {
      cvDataError.value = error instanceof Error ? error.message : 'Unable to load CV data.'
      throw error
    } finally {
      isCvDataLoading.value = false
    }
  }

  const setActiveLanguage = async (languageCode: string) => {
    await loadAvailableLanguages()

    try {
      isCvDataLoading.value = true
      cvDataError.value = null

      const data = await applyLanguageSelection(languageCode, 'manual', languageCode)

      if (import.meta.client) {
        trackEvent('language_switched', {
          resolved_language: languageSelection.value.code,
          requested_language: languageCode,
          selection_source: languageSelection.value.source,
          fallback_reason: languageSelection.value.fallbackReason,
        })
      }

      return data
    } catch (error) {
      cvDataError.value = error instanceof Error ? error.message : 'Unable to load CV data.'
      throw error
    } finally {
      isCvDataLoading.value = false
    }
  }

  return {
    cvData: readonly(cvData),
    cvDataError: readonly(cvDataError),
    isCvDataLoading: readonly(isCvDataLoading),
    availableLanguages: readonly(availableLanguages),
    activeLanguage: readonly(activeLanguage),
    languageSelection: readonly(languageSelection),
    uiCopy: readonly(uiCopy),
    loadAvailableLanguages,
    loadCvData,
    setActiveLanguage,
  }
}
