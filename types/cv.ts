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

export interface Hero {
  name: string
  title: string
  location: string
  phone?: string
  email: string
  github: string
  linkedin: string
  cvLink: string
  availabilityStatus?: string
}

export interface About {
  paragraphs: string[]
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
  period: string
  description: string
  achievements: string[]
  accentColor?: string
}

export interface Project {
  title: string
  role: string
  link?: string
  linkLabel?: string
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
  level: string
  percentage: number
  flag?: string
}

export interface NormalizationIssue {
  path: string
  message: string
}
