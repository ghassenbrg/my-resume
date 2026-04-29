import type { CVData, CVStats, NormalizationIssue, RuntimeCVData, RuntimeSkill } from '~/types/cv'

const cvDataUrl = '/cv-data.json'

let cvDataRequest: Promise<RuntimeCVData> | null = null

export const extractYearsExperience = (paragraphs: string[]) => {
  const yearsMatch = paragraphs.join(' ').match(/(\d+)\+?\s+years/i)

  return yearsMatch ? Number(yearsMatch[1]) : 0
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

      for (const field of ['company', 'position', 'location', 'period', 'description']) {
        assertRequiredString(entry, `experience.${index}`, field, issues)
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
  return {
    yearsExperience: data.about.stats?.yearsExperience ?? extractYearsExperience(data.about.paragraphs),
    companiesWorked: data.about.stats?.companiesWorked ?? data.experience.length,
    certificationsCount: data.about.stats?.certificationsCount ?? data.certifications.length,
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

export const useCvData = () => {
  const cvData = useState<RuntimeCVData | null>('cv-data', () => null)
  const cvDataError = useState<string | null>('cv-data-error', () => null)
  const isCvDataLoading = useState('cv-data-loading', () => false)

  const loadCvData = async () => {
    if (cvData.value) {
      return cvData.value
    }

    if (!cvDataRequest) {
      isCvDataLoading.value = true
      cvDataError.value = null
      cvDataRequest = $fetch<CVData>(cvDataUrl, {
        query: import.meta.client ? { v: Date.now() } : undefined,
      }).then(normalizeCvData)
    }

    try {
      cvData.value = await cvDataRequest
      return cvData.value
    } catch (error) {
      cvDataRequest = null
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
    loadCvData,
  }
}
