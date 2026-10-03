export interface CVData {
  hero: Hero
  about: About
  skills: Record<string, Skill[]>
  experience: Experience[]
  projects: Project[]
  education: Education[]
  certifications: Certification[]
  languages: Language[]
}

export type CVDataInput = Partial<CVData>

export interface RuntimeCVData extends Omit<CVData, 'about' | 'skills'> {
  about: About & {
    stats: CVStats
  }
  skills: Record<string, RuntimeSkill[]>
}

export interface AvailableLanguage {
  code: string
  label: string
  path: string
  isDefault: boolean
}

export type LanguageSelectionSource = 'auto' | 'fallback' | 'manual'

export interface LanguageSelectionMeta {
  code: string
  source: LanguageSelectionSource
  requestedLanguage: string | null
  fallbackReason: string | null
}

export interface Hero {
  name: string
  title: string
  location: string
  tagline?: string
  phone?: string
  availabilityStatus?: string
}

/**
 * Shared, non-translatable configuration. Lives in a single `cv-config.json`
 * (mountable/overridable like the per-language `cv-data-*.json` files) so these
 * values are defined once instead of duplicated across every language file.
 */
export interface CVConfig {
  /** Drives the hero availability pill. */
  openToOpportunities: boolean
  contact: {
    email: string
    phone?: string
  }
  social: {
    github: string
    linkedin: string
  }
  /** Path/URL to the downloadable CV. */
  cvLink: string
  cvLinks?: Record<string, string>
  meta: {
    siteUrl: string
    ogImage: string
  }
  theme: {
    default: 'dark' | 'light'
  }
  display: {
    /** Show the numeric proficiency value (e.g. "85%") in the Languages section. */
    languagePercentage: boolean
  }
}

export interface AboutHighlight {
  value: string
  label: string
}

export interface About {
  paragraphs: string[]
  highlights?: AboutHighlight[]
  stats?: CVStats
}

export interface CVStats {
  yearsExperience: number
  companiesWorked: number
  certificationsCount: number
}

export interface Skill {
  name: string
  icon: string
  highlight?: boolean
  proficiency?: number
}

export interface RuntimeSkill extends Skill {
  highlight: boolean
}

export interface Experience {
  company: string
  position: string
  location: string
  startDate: string
  endDate?: string
  logo?: string
  description: string
  achievements: string[]
  accentColor?: string
  projects?: Project[]
}

/**
 * `personal` = side projects / open source built on my own time;
 * `professional` = client or employer work. Entries without a kind are
 * treated as professional.
 */
export type ProjectKind = 'personal' | 'professional'

export interface Project {
  title: string
  role: string
  kind?: ProjectKind
  /** Employer/client the project was delivered for (professional projects). */
  company?: string
  /** Free-form, already-localized period label, e.g. "2023 – 2024". */
  period?: string
  /** One-line pitch shown under the title. */
  summary?: string
  /** Short status badge, e.g. "v1.0 on npm" or "Live". */
  status?: string
  link?: string
  linkLabel?: string
  /** Source repository URL. */
  repo?: string
  outcomes: string[]
  technologies: string[]
  featured?: boolean
}

export interface Education {
  degree: string
  institution: string
  location: string
  period: string
}

export interface Certification {
  name: string
  issuer: string
  date: string
  link?: string
  image?: string
}

export interface Language {
  language: string
  code?: string
  level: string
  percentage: number
  flag?: string
}

export interface NormalizationIssue {
  path: string
  message: string
}
