// Evidence selection for the downloadable CVs. Pure functions over one
// cv-data-{lang}.json document, kept separate from the Playwright exporter so
// the selection can be unit-tested.
//
// The PDF prints exactly what each entry's `pdf` selection names, in that
// order; nothing is picked by array position. Entries without a selection
// print in full, so a new bullet is never dropped silently.

const pick = (list = [], indexes) => (Array.isArray(indexes) ? indexes.map((index) => list[index]) : [...list])

export const selectExperience = (entry) => {
  const projects = entry.projects ?? []
  const selections = entry.pdf?.projects ?? []
  const selected = new Set(selections.map(({ index }) => index))

  return {
    company: entry.company,
    assignment: entry.assignment ?? null,
    location: entry.location,
    // Each official title keeps its own dates; single-title entries use the tenure.
    roles: entry.roles?.length
      ? entry.roles.map(({ position, startDate, endDate }) => ({ position, startDate, endDate: endDate ?? null }))
      : [{ position: entry.position, startDate: entry.startDate, endDate: entry.endDate ?? null }],
    description: entry.description,
    achievements: pick(entry.achievements, entry.pdf?.achievements),
    projects: selections.map(({ index, outcomes }) => ({
      title: projects[index].title,
      period: projects[index].period ?? null,
      outcomes: pick(projects[index].outcomes, outcomes),
    })),
    // Remaining company projects are named only where the selection lists
    // projects at all; otherwise the job description already covers them.
    otherProjects: entry.pdf?.projects
      ? projects.filter((_, index) => !selected.has(index)).map(({ title, period }) => ({ title, period: period ?? null }))
      : [],
  }
}

export const selectProject = (project) => ({
  title: project.title,
  role: project.role,
  status: project.status ?? null,
  period: project.period ?? null,
  summary: project.summary ?? '',
  outcomes: project.featured ? pick(project.outcomes, project.pdf?.outcomes) : [],
  technologies: project.featured ? project.technologies : [],
  link: project.link ?? null,
  repo: project.repo ?? null,
})

export const selectPdfContent = (data) => ({
  profile: data.about.profile ?? data.about.paragraphs[0],
  experience: data.experience.map(selectExperience),
  featuredProjects: data.projects.filter((project) => project.featured).map(selectProject),
  otherProjects: data.projects.filter((project) => !project.featured).map(selectProject),
  // One reading line per category, in source order (no columns).
  skills: Object.entries(data.skills).map(([category, items]) => ({ category, names: items.map(({ name }) => name) })),
})

/* Printed form of a link: the destination itself, without scheme or "www.". */
export const displayUrl = (url) => url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')
