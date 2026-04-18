export interface CVData {
  hero: {
    name: string
    title: string
    location: string
    phone: string
    email: string
    github: string
    linkedin: string
    cvLink: string
    availabilityStatus?: string
  }
  about: {
    paragraphs: string[]
    stats: {
      yearsExperience: number
      companiesWorked: number
      certificationsCount: number
    }
  }
  skills: Record<string, Skill[]>
  experience: Experience[]
  projects: Project[]
  education: Education[]
  certifications: Certification[]
  languages: Language[]
}

export interface Skill {
  name: string
  icon: string
  highlight: boolean
  proficiency?: number
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
