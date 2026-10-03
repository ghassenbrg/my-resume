import type { CVData, Experience, Project } from '../types/cv'

export interface PdfRole { position: string; startDate: string; endDate: string | null }
export interface PdfExperience {
  company: string
  assignment: string | null
  location: string
  roles: PdfRole[]
  description: string
  achievements: string[]
  projects: { title: string; period: string | null; outcomes: string[] }[]
  otherProjects: { title: string; period: string | null }[]
}
export interface PdfProject {
  title: string
  role: string
  status: string | null
  period: string | null
  summary: string
  outcomes: string[]
  technologies: string[]
  link: string | null
  repo: string | null
}

export function selectExperience(entry: Experience): PdfExperience
export function selectProject(project: Project): PdfProject
export function selectPdfContent(data: CVData): {
  profile: string
  experience: PdfExperience[]
  featuredProjects: PdfProject[]
  otherProjects: PdfProject[]
  skills: { category: string; names: string[] }[]
}
export function displayUrl(url: string): string
