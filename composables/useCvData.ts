import type { CVData, CVStats, RuntimeCVData, RuntimeSkill } from '~/types/cv'

const cvDataUrl = '/cv-data.json'

let cvDataRequest: Promise<RuntimeCVData> | null = null

const extractYearsExperience = (paragraphs: string[]) => {
  const yearsMatch = paragraphs.join(' ').match(/(\d+)\+?\s+years/i)

  return yearsMatch ? Number(yearsMatch[1]) : 0
}

const normalizeSkills = (skills: CVData['skills']) => {
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

const normalizeStats = (data: CVData): CVStats => {
  return {
    yearsExperience: data.about.stats?.yearsExperience ?? extractYearsExperience(data.about.paragraphs),
    companiesWorked: data.about.stats?.companiesWorked ?? data.experience.length,
    certificationsCount: data.about.stats?.certificationsCount ?? data.certifications.length,
  }
}

const normalizeCvData = (data: CVData): RuntimeCVData => {
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
