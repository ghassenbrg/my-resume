import { computed, readonly } from 'vue'
import { getResumeUiCopy, languageNativeLabels, type ResumeUiCopy } from '~/data/resume-ui'
import type {
  AvailableLanguage,
  CVConfig,
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
const CONFIG_PATH = '/cv-config.json'
const languageFileRequests = new Map<string, Promise<RuntimeCVData>>()
let availableLanguageRequest: Promise<AvailableLanguage[]> | null = null
let configRequest: Promise<CVConfig> | null = null

/* Safe defaults so a missing/broken cv-config.json never blanks the whole site. */
export const DEFAULT_CV_CONFIG: CVConfig = {
  openToOpportunities: false,
  contact: { email: '' },
  social: { github: '', linkedin: '' },
  cvLink: '',
  meta: { siteUrl: '', ogImage: '/og-image.png' },
  theme: { default: 'dark' },
  display: { languagePercentage: true },
}

/* Merge a (possibly partial) config over the defaults so individual missing keys
 * fall back gracefully — the file can be edited/mounted without listing everything. */
export const normalizeCvConfig = (data: unknown): CVConfig => {
  const source = isRecord(data) ? data : {}
  const contact = isRecord(source.contact) ? source.contact : {}
  const social = isRecord(source.social) ? source.social : {}
  const meta = isRecord(source.meta) ? source.meta : {}
  const theme = isRecord(source.theme) ? source.theme : {}
  const display = isRecord(source.display) ? source.display : {}
  const cvLinks = isRecord(source.cvLinks)
    ? Object.fromEntries(Object.entries(source.cvLinks)
      .filter((entry): entry is [string, string] => /^[a-z0-9-]+$/i.test(entry[0]) && typeof entry[1] === 'string')
      .map(([code, link]) => [normalizeLanguageCode(code), link]))
    : undefined

  return {
    openToOpportunities: source.openToOpportunities === true,
    contact: {
      email: typeof contact.email === 'string' ? contact.email : DEFAULT_CV_CONFIG.contact.email,
      ...(typeof contact.phone === 'string' ? { phone: contact.phone } : {}),
    },
    social: {
      github: typeof social.github === 'string' ? social.github : DEFAULT_CV_CONFIG.social.github,
      linkedin:
        typeof social.linkedin === 'string' ? social.linkedin : DEFAULT_CV_CONFIG.social.linkedin,
    },
    cvLink: typeof source.cvLink === 'string' ? source.cvLink : DEFAULT_CV_CONFIG.cvLink,
    ...(cvLinks ? { cvLinks } : {}),
    meta: {
      siteUrl: typeof meta.siteUrl === 'string' ? meta.siteUrl : DEFAULT_CV_CONFIG.meta.siteUrl,
      ogImage: typeof meta.ogImage === 'string' ? meta.ogImage : DEFAULT_CV_CONFIG.meta.ogImage,
    },
    theme: {
      default: theme.default === 'light' ? 'light' : 'dark',
    },
    display: {
      // Shown by default; only an explicit `false` hides the value.
      languagePercentage: display.languagePercentage !== false,
    },
  }
}

export const extractYearsExperience = (paragraphs: string[]) => {
  const yearsMatch = paragraphs.join(' ').match(/(\d+)\+?\s+years/i)

  return yearsMatch ? Number(yearsMatch[1]) : 0
}

const parseIsoDate = (value?: string) => {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return null
  }

  const date = new Date(`${value}T00:00:00Z`)

  return Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value ? null : date
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
    // Contact/social links and cvLink moved to the shared cv-config.json, so the
    // per-language hero now only carries translatable identity fields.
    for (const field of ['name', 'title', 'location']) {
      assertRequiredString(data.hero, 'hero', field, issues)
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

export function assertValidCvData(data: unknown): asserts data is CVData {
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
      (async () => {
        if (import.meta.server) {
          // Nitro's internal fetch does not serve public assets while rendering.
          // Bundle build-time JSON for SSR; the client still fetches runtime mounts.
          const datasets = import.meta.glob<CVData>('../public/cv-data-*.json', { import: 'default' })
          const load = datasets[`../public/cv-data-${normalizedLanguageCode}.json`]
          if (!load) {
            throw new Error(`Missing CV dataset: ${normalizedLanguageCode}`)
          }
          return normalizeCvData(await load())
        }
        return normalizeCvData(await $fetch<CVData>(getCvDataPath(normalizedLanguageCode), {
          query: { v: Date.now() },
        }))
      })(),
    )
  }

  try {
    return await languageFileRequests.get(normalizedLanguageCode)!
  } catch (error) {
    languageFileRequests.delete(normalizedLanguageCode)
    throw error
  }
}

/* Loads the shared, language-independent config once (cached). */
const loadCvConfig = async () => {
  if (!configRequest) {
    configRequest = (async () => {
      if (import.meta.server) {
        const configs = import.meta.glob('../public/cv-config.json', { import: 'default' })
        return configs['../public/cv-config.json']?.()
      }
      return $fetch(CONFIG_PATH, { query: { v: Date.now() } })
    })()
      .then(normalizeCvConfig)
      .catch((error) => {
        configRequest = null
        throw error
      })
  }

  return configRequest
}

export const useCvData = () => {
  const cvData = useState<RuntimeCVData | null>('cv-data', () => null)
  const cvConfig = useState<CVConfig | null>('cv-config', () => null)
  const cvDataError = useState<string | null>('cv-data-error', () => null)
  const isCvDataLoading = useState('cv-data-loading', () => false)
  const availableLanguages = useState<AvailableLanguage[]>('cv-available-languages', () => [])
  const activeLanguage = useState<string>('cv-active-language', () => DEFAULT_LANGUAGE_CODE)
  // Components that display a current duration/year can share this serialized
  // clock, instead of comparing the static build with the browser's current day.
  const referenceDateIso = useState('cv-reference-date', () => new Date().toISOString())
  const referenceDate = computed(() => new Date(referenceDateIso.value))
  const languageSelection = useState<LanguageSelectionMeta>('cv-language-selection', () => ({
    code: DEFAULT_LANGUAGE_CODE,
    source: 'fallback',
    requestedLanguage: null,
    fallbackReason: null,
  }))
  const hasTrackedInitialLanguage = useState<boolean>('cv-language-tracked', () => false)
  const uiCopy = computed<ResumeUiCopy>(() => getResumeUiCopy(activeLanguage.value))
  const cvLink = computed(() =>
    cvConfig.value?.cvLinks?.[activeLanguage.value] ?? cvConfig.value?.cvLink ?? '',
  )
  const runtimeConfig = useRuntimeConfig()
  const nuxtApp = useNuxtApp()
  const route = useRoute()
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

        return createAvailableLanguages(validCodes)
      }).catch((error) => {
        availableLanguageRequest = null
        throw error
      })
    }

    // The request cache is shared on the server; the state belongs to this
    // rendering request. Populate it even when another page filled the cache.
    availableLanguages.value = await availableLanguageRequest
    return availableLanguages.value
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

  const loadConfig = async () => {
    if (cvConfig.value) {
      return cvConfig.value
    }

    try {
      cvConfig.value = await loadCvConfig()
    } catch {
      // Resilient: a missing/broken config must not blank the site.
      cvConfig.value = DEFAULT_CV_CONFIG
    }

    return cvConfig.value
  }

  const loadCvData = async (options: { language?: string } = {}) => {
    try {
      isCvDataLoading.value = true
      cvDataError.value = null

      await Promise.all([loadAvailableLanguages(), loadConfig()])

      const pathLanguage = route.path.replace(/^\/+|\/+$/g, '')
      const requestedLanguage = options.language ?? pathLanguage
      const explicitLanguage = requestedLanguage ? normalizeLanguageCode(requestedLanguage) : null
      if (explicitLanguage && !availableLanguages.value.some((language) => language.code === explicitLanguage)) {
        throw new Error(`No valid CV data for language: ${explicitLanguage}`)
      }
      if (cvData.value && (!explicitLanguage || activeLanguage.value === explicitLanguage)) {
        return cvData.value
      }

      // Never consult browser preferences during hydration: the first client
      // render must use precisely the language serialized in the server HTML.
      const preferredLanguages = import.meta.client && !nuxtApp.isHydrating
        ? resolveBrowserLanguagePreferences(window.navigator)
        : [DEFAULT_LANGUAGE_CODE]
      const availableCodes = availableLanguages.value.map((language) => language.code)
      const resolvedSelection = resolvePreferredLanguage(preferredLanguages, availableCodes, DEFAULT_LANGUAGE_CODE)
      const data = await applyLanguageSelection(
        explicitLanguage ?? (languageSelection.value.source === 'manual' ? activeLanguage.value : resolvedSelection.code),
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

  const refreshMountedCvData = async () => {
    if (!import.meta.client) {
      return
    }

    // Static HTML provides the initial content. Once hydration is complete,
    // read the mounted JSON files afresh (including the language catalogue).
    // Keep the rendered resume if a runtime mount is temporarily unavailable.
    languageFileRequests.clear()
    availableLanguageRequest = null
    configRequest = null
    try {
      const publishedCodes = getPublishedLanguageCodes(runtimeConfig.public.cvDataLanguages)
      const [results, config] = await Promise.all([
        Promise.allSettled(publishedCodes.map(async (code) => {
          const data = await loadLanguageDataset(code)
          return { code, data }
        })),
        loadCvConfig().catch(() => cvConfig.value ?? DEFAULT_CV_CONFIG),
      ])
      const datasets = results.flatMap((result) => result.status === 'fulfilled' ? [result.value] : [])
      const codes = datasets.map(({ code }) => code)
      if (!codes.includes(DEFAULT_LANGUAGE_CODE)) {
        throw new Error('English CV data is required and must remain valid.')
      }
      // Read manual state *after* fetching, so a choice made during the request
      // wins. An explicit crawlable language URL also outranks browser settings.
      const pathLanguage = route.path.replace(/^\/+|\/+$/g, '')
      const preferences = languageSelection.value.source === 'manual'
        ? [activeLanguage.value]
        : pathLanguage ? [pathLanguage] : resolveBrowserLanguagePreferences(window.navigator)
      const selection = resolvePreferredLanguage(preferences, codes)
      const data = datasets.find(({ code }) => code === selection.code)!.data
      cvConfig.value = config
      availableLanguages.value = createAvailableLanguages(codes)
      cvData.value = data
      activeLanguage.value = selection.code
      referenceDateIso.value = new Date().toISOString()
      languageSelection.value = {
        ...selection,
        source: languageSelection.value.source === 'manual' ? 'manual' : selection.source,
      }
      cvDataError.value = null
      if (!hasTrackedInitialLanguage.value && languageSelection.value.source !== 'manual') {
        hasTrackedInitialLanguage.value = trackEvent('language_auto_resolved', {
          resolved_language: selection.code,
          requested_language: selection.requestedLanguage,
          selection_source: selection.source,
          fallback_reason: selection.fallbackReason,
        })
      }
    } catch (error) {
      cvDataError.value = error instanceof Error ? error.message : 'Unable to refresh CV data.'
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
    // Exposed as a plain ref so components can pass typed slices (Experience,
    // Project, …) straight into child props; the composable's methods remain
    // the single writer of this state.
    cvData,
    cvConfig: readonly(cvConfig),
    cvLink: readonly(cvLink),
    cvDataError: readonly(cvDataError),
    isCvDataLoading: readonly(isCvDataLoading),
    availableLanguages: readonly(availableLanguages),
    activeLanguage: readonly(activeLanguage),
    referenceDate: readonly(referenceDate),
    languageSelection: readonly(languageSelection),
    uiCopy: readonly(uiCopy),
    loadAvailableLanguages,
    loadConfig,
    loadCvData,
    refreshMountedCvData,
    setActiveLanguage,
  }
}
